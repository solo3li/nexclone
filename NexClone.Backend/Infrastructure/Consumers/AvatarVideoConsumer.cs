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
    [Queue("avatar_video_queue")]
    public class AvatarVideoConsumer : BaseAiTaskConsumer
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

        public async Task Consume(AvatarVideoMessage message)
        {
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
                    string key = await _mediaService.UploadFileAsync(ms, $"avatar-video/{message.UserId:N}/{DateTime.UtcNow:yyyy-MM}/{Guid.NewGuid()}.png", message.ImageContentType);
                    imageUrl = await _mediaService.GetFileUrlAsync(key);
                }

                string audioUrl = "";
                if (message.AudioBytes != null)
                {
                    using var ms = new MemoryStream(message.AudioBytes);
                    string key = await _mediaService.UploadFileAsync(ms, $"avatar-video/{message.UserId:N}/{DateTime.UtcNow:yyyy-MM}/{Guid.NewGuid()}.mp3", message.AudioContentType);
                    audioUrl = await _mediaService.GetFileUrlAsync(key);
                }

                var (apiKey, modelName) = await GetToolConfigAsync("kling_avatar_image2video");
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromMinutes(5);
                client.DefaultRequestHeaders.Add("X-Picsart-API-Key", apiKey);

                using var formData = new MultipartFormDataContent();
                formData.Add(new StringContent("1024"), "width");
                formData.Add(new StringContent("1024"), "height");
                formData.Add(new StringContent("480p"), "quality");
                formData.Add(new StringContent("false"), "audio");
                formData.Add(new StringContent("3"), "length");
                formData.Add(new StringContent("urn:air:kling:model:kling:kling-v3-image-to-video@1"), "model");
                
                string prompt = string.IsNullOrWhiteSpace(message.Prompt) ? "The speaker talks naturally to camera" : message.Prompt;
                formData.Add(new StringContent(prompt), "prompt");

                if (!string.IsNullOrEmpty(imageUrl))
                {
                    formData.Add(new StringContent(imageUrl), "image_url");
                }

                var response = await client.PostAsync("https://genai-api.picsart.io/v1/image2video", formData);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    throw new Exception($"Picsart API Error: {responseString}");

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;
                string taskId = "";

                // Picsart new genai-api format: { "status": "processing", "inference_id": "abc123" }
                if (root.TryGetProperty("inference_id", out var idEl))
                {
                    taskId = idEl.GetString();
                }
                else if (root.TryGetProperty("response", out var respEl) && respEl.TryGetProperty("id", out var oldIdEl))
                {
                    taskId = oldIdEl.GetString();
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
