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
    [Queue("motion_control_queue")]
    public class MotionControlConsumer : BaseAiTaskConsumer
    {
        public MotionControlConsumer(
            ApplicationDbContext dbContext,
            IHttpClientFactory httpClientFactory,
            IMediaService mediaService,
            NexClone.Backend.Application.Services.UsagePolicyService usagePolicy,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            ITtsService ttsService,
            ISttService sttService,
            ILogger<MotionControlConsumer> logger) 
            : base(dbContext, httpClientFactory, mediaService, usagePolicy, hubContext, emailService, emailTemplateService, ttsService, sttService, logger)
        {
        }

        public async Task Consume(MotionControlMessage message)
        {
            _logger.LogInformation($"[MotionControl Task {message.HistoryId}] Started consumer.");
            
            var history = await _dbContext.GenerationHistories.FindAsync(message.HistoryId);
            if (history == null) return;

            try
            {
                // Upload image and video to MinIO for Picsart API to access
                string imageUrl = "";
                if (message.ImageBytes != null)
                {
                    using var ms = new MemoryStream(message.ImageBytes);
                    string key = await _mediaService.UploadFileAsync(ms, $"{Guid.NewGuid()}.png", message.ImageContentType);
                    imageUrl = $"http://167.71.66.188:9001/nexmedia/{key}";
                }

                string videoUrl = "";
                if (message.VideoBytes != null)
                {
                    using var ms = new MemoryStream(message.VideoBytes);
                    string key = await _mediaService.UploadFileAsync(ms, $"{Guid.NewGuid()}.mp4", message.VideoContentType);
                    videoUrl = $"http://167.71.66.188:9001/nexmedia/{key}";
                }

                var (apiKey, modelName) = await GetToolConfigAsync("kling_motion_control");
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromMinutes(5);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                // Create payload dictionary for Picsart API
                var jsonPayload = new System.Collections.Generic.Dictionary<string, object>
                {
                    ["params"] = new 
                    {
                        prompt = string.IsNullOrEmpty(message.Prompt) ? "" : message.Prompt,
                        imageUrls = new[] { imageUrl },
                        videoUrl = videoUrl,
                        resolution = message.Resolution ?? "720p",
                        renderingSpeed = message.RenderingSpeed ?? "std",
                        orientation = message.Orientation ?? "front",
                        keepOriginalSound = message.KeepOriginalSound
                    }
                };

                var jsonContent = new StringContent(JsonSerializer.Serialize(jsonPayload), System.Text.Encoding.UTF8, "application/json");
                
                // Try /submit endpoint first, fallback to /execute if requested
                var response = await client.PostAsync("https://api.picsart.com/gw-v2/workflows/kling-motion-control/submit", jsonContent);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.StatusCode == System.Net.HttpStatusCode.NotFound || response.StatusCode == System.Net.HttpStatusCode.MethodNotAllowed)
                {
                    response = await client.PostAsync("https://api.picsart.com/gw-v2/workflows/kling-motion-control/execute", jsonContent);
                    responseString = await response.Content.ReadAsStringAsync();
                }

                if (!response.IsSuccessStatusCode)
                    throw new Exception($"Picsart API Error: {responseString}");

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;
                string taskId = "";

                if (root.TryGetProperty("response", out var respEl) && respEl.TryGetProperty("id", out var idEl))
                {
                    taskId = idEl.GetString();
                }
                else if (root.TryGetProperty("data", out var dataEl) && dataEl.TryGetProperty("task_id", out var tidEl))
                {
                    taskId = tidEl.GetString();
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
                _logger.LogError(ex, $"[MotionControl Task {message.HistoryId}] Failed");
                history.Status = "failed";
                history.ErrorMessage = ex.Message;
                await _dbContext.SaveChangesAsync();
                
                if (history.CreditsUsed > 0)
                    await _usagePolicy.RefundByToolAsync(message.UserId, "kling_motion_control", history.CreditsUsed);

                await NotifyUserFailed(message.UserId, history, ex.Message);
            }
        }
    }
}
