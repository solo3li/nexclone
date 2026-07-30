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
    public class LipSyncConsumer : BaseAiTaskConsumer, IConsumer<LipSyncMessage>
    {
        public LipSyncConsumer(
            ApplicationDbContext dbContext,
            IHttpClientFactory httpClientFactory,
            IMediaService mediaService,
            NexClone.Backend.Application.Services.UsagePolicyService usagePolicy,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            ITtsService ttsService,
            ISttService sttService,
            ILogger<LipSyncConsumer> logger) 
            : base(dbContext, httpClientFactory, mediaService, usagePolicy, hubContext, emailService, emailTemplateService, ttsService, sttService, logger)
        {
        }

        public async Task Consume(ConsumeContext<LipSyncMessage> context)
        {
            var message = context.Message;
            _logger.LogInformation($"[LipSync Task {message.HistoryId}] Started consumer.");
            
            var history = await _dbContext.GenerationHistories.FindAsync(message.HistoryId);
            if (history == null) return;

            try
            {
                var (apiKey, modelName) = await GetToolConfigAsync("kling_advanced_lip_sync");
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromMinutes(5);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                using var videoStream = new MemoryStream(message.VideoBytes);
                string videoKey = await _mediaService.UploadFileAsync(videoStream, $"{Guid.NewGuid()}_{message.VideoFileName}", message.VideoContentType);
                string videoUrl = $"http://167.71.66.188:9001/nexmedia/{videoKey}";

                using var audioStream = new MemoryStream(message.AudioBytes);
                string audioKey = await _mediaService.UploadFileAsync(audioStream, $"{Guid.NewGuid()}_{message.AudioFileName}", message.AudioContentType);
                string audioUrl = $"http://167.71.66.188:9001/nexmedia/{audioKey}";

                var payload = new
                {
                    model = modelName,
                    prompt = "lip sync",
                    video_url = videoUrl,
                    audio_url = audioUrl,
                    video = videoUrl,
                    audio = audioUrl
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
                else if (root.TryGetProperty("task_id", out var taskIdEl2))
                    taskId = taskIdEl2.GetString();

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
                _logger.LogError(ex, $"[LipSync Task {message.HistoryId}] Failed");
                history.Status = "failed";
                history.ErrorMessage = ex.Message;
                await _dbContext.SaveChangesAsync();
                
                if (history.CreditsUsed > 0)
                    await _usagePolicy.RefundByToolAsync(message.UserId, "lipsync", history.CreditsUsed);

                await NotifyUserFailed(message.UserId, history, ex.Message);
            }
        }
    }
}
