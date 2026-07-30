using MassTransit;
using Microsoft.Extensions.Logging;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Core.Messages;
using NexClone.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.Consumers
{
    public class AvatarVideoConsumer : BaseAiTaskConsumer, IConsumer<AvatarVideoMessage>
    {
        public AvatarVideoConsumer(
            ApplicationDbContext dbContext,
            IHttpClientFactory httpClientFactory,
            IMediaService mediaService,
            NexClone.Backend.Application.Services.UsagePolicyService usagePolicy,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            ITtsService ttsService,
            ISttService sttService,
            ILogger<AvatarVideoConsumer> logger) 
            : base(dbContext, httpClientFactory, mediaService, usagePolicy, hubContext, emailService, emailTemplateService, ttsService, sttService, logger)
        {
        }

        public async Task Consume(ConsumeContext<AvatarVideoMessage> context)
        {
            var message = context.Message;
            _logger.LogInformation($"[AvatarVideo Task {message.HistoryId}] Started consumer.");
            
            var history = await _dbContext.GenerationHistories.FindAsync(message.HistoryId);
            if (history == null) return;

            try
            {
                // Upload image and audio to MinIO for CometAPI to access
                string imageUrl = "";
                if (message.ImageBytes != null)
                {
                    using var ms = new MemoryStream(message.ImageBytes);
                    string key = await _mediaService.UploadFileAsync(ms, $"{Guid.NewGuid()}.png", message.ImageContentType);
                    imageUrl = $"http://167.71.66.188:9001/nexmedia/{key}";
                }

                string audioUrl = "";
                if (message.AudioBytes != null)
                {
                    using var ms = new MemoryStream(message.AudioBytes);
                    string key = await _mediaService.UploadFileAsync(ms, $"{Guid.NewGuid()}.mp3", message.AudioContentType);
                    audioUrl = $"http://167.71.66.188:9001/nexmedia/{key}";
                }

                var (apiKey, modelName) = await GetToolConfigAsync("kling_avatar_image2video");
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromMinutes(5);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                var payload = new
                {
                    model = "kling-v1",
                    prompt = message.Prompt ?? "lip sync",
                    image = imageUrl,
                    image_url = imageUrl,
                    sound_file = audioUrl,
                    audio = audioUrl,
                    mode = "std"
                };

                var jsonContent = new StringContent(JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync("https://api.cometapi.com/v1/images/generations", jsonContent);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    throw new Exception($"API Error: {responseString}");

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;
                string taskId = "";

                if (root.TryGetProperty("data", out var dataEl) && dataEl.TryGetProperty("task_id", out var taskIdEl))
                    taskId = taskIdEl.GetString();
                else if (root.TryGetProperty("id", out var idElement))
                    taskId = idElement.GetString();

                if (string.IsNullOrEmpty(taskId))
                    throw new Exception($"Failed to get task_id. Response: {responseString}");

                history.ResultText = taskId;
                await _dbContext.SaveChangesAsync();

                // Polling
                string outputUrl = await PollCometApiTask(client, taskId);

                history.Status = "completed";
                history.FileUrl = outputUrl;
                await _dbContext.SaveChangesAsync();

                await NotifyUserSuccess(message.UserId, history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[AvatarVideo Task {message.HistoryId}] Failed");
                history.Status = "failed";
                history.ErrorMessage = ex.Message;
                await _dbContext.SaveChangesAsync();
                
                if (history.CreditsUsed > 0)
                    await _usagePolicy.RefundByToolAsync(message.UserId, "kling_avatar_image2video", history.CreditsUsed);

                await NotifyUserFailed(message.UserId, history, ex.Message);
            }
        }
    }
}
