using Hangfire;
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
    [Queue("lipsync_queue")]
    public class LipSyncConsumer : BaseAiTaskConsumer
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

        public async Task Consume(LipSyncMessage message)
        {
            _logger.LogInformation($"[LipSync Task {message.HistoryId}] Started consumer.");
            
            var history = await _dbContext.GenerationHistories.FindAsync(message.HistoryId);
            if (history == null) return;

            try
            {
                string toolConfigKey = message.Model switch
                {
                    "vidu-lipsync-std" => "vidu_advanced_lip_sync",
                    _ => "vidu_advanced_lip_sync"
                };

                var (apiKey, modelName) = await GetToolConfigAsync(toolConfigKey);
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromMinutes(10);
                client.DefaultRequestHeaders.Add("x-api-key", apiKey);

                using var videoStream = new MemoryStream(message.VideoBytes);
                string videoKey = await _mediaService.UploadFileAsync(videoStream, $"lipsync/{message.UserId:N}/{DateTime.UtcNow:yyyy-MM}/{Guid.NewGuid()}_{message.VideoFileName}", message.VideoContentType);
                string videoUrl = await _mediaService.GetFileUrlAsync(videoKey);

                using var audioStream = new MemoryStream(message.AudioBytes);
                string audioKey = await _mediaService.UploadFileAsync(audioStream, $"lipsync/{message.UserId:N}/{DateTime.UtcNow:yyyy-MM}/{Guid.NewGuid()}_{message.AudioFileName}", message.AudioContentType);
                string audioUrl = await _mediaService.GetFileUrlAsync(audioKey);

                var payload = new
                {
                    model = modelName,
                    input = new 
                    {
                        video_url = videoUrl,
                        audio_url = audioUrl,
                        speed = 1,
                        volume = 5,
                        moderation = "enabled"
                    }
                };

                var jsonContent = new StringContent(JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync("https://api.crun.ai/api/v1/client/job/CreateTask", jsonContent);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    throw new Exception($"Crun AI API Error: {responseString}");

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;
                string taskId = "";

                if (root.TryGetProperty("data", out var dataEl) && dataEl.TryGetProperty("task_id", out var taskIdEl))
                    taskId = taskIdEl.GetString();

                if (string.IsNullOrEmpty(taskId))
                    throw new Exception($"Failed to get task_id from Crun AI. Response: {responseString}");

                history.ResultText = taskId;
                await _dbContext.SaveChangesAsync();

                // Polling
                string outputUrl = await PollCrunApiTask(client, taskId);

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
