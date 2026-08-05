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
                    params_ = new // C# doesn't let us use 'params', so we serialize with options or use a dict
                    {
                        prompt = message.Prompt ?? "The speaker talks naturally to camera",
                        imageUrls = new[] { imageUrl },
                        audioUrl = audioUrl,
                        renderingSpeed = message.RenderingSpeed ?? "std"
                    }
                };

                // Create a dict to bypass 'params' reserved keyword issue
                var jsonPayload = new System.Collections.Generic.Dictionary<string, object>
                {
                    ["params"] = new 
                    {
                        prompt = message.Prompt ?? "The speaker talks naturally to camera",
                        imageUrls = new[] { imageUrl },
                        audioUrl = audioUrl,
                        renderingSpeed = message.RenderingSpeed ?? "std"
                    }
                };

                var jsonContent = new StringContent(JsonSerializer.Serialize(jsonPayload), System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync("https://api.picsart.com/gw-v2/workflows/kling-avatar/submit", jsonContent);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    throw new Exception($"Picsart API Error: {responseString}");

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;
                string taskId = "";

                // Picsart format: { "status": "success", "response": { "id": "wf_abc123" } }
                if (root.TryGetProperty("response", out var respEl) && respEl.TryGetProperty("id", out var idEl))
                {
                    taskId = idEl.GetString();
                }

                if (string.IsNullOrEmpty(taskId))
                    throw new Exception($"Failed to get task_id from Picsart. Response: {responseString}");

                history.ResultText = taskId;
                await _dbContext.SaveChangesAsync();

                // Polling logic for Picsart
                string outputUrl = await PollPicsartApiTask(client, taskId);

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
