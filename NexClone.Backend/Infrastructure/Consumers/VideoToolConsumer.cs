using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Core.Messages;
using NexClone.Backend.Hubs;

namespace NexClone.Backend.Infrastructure.Consumers
{
    public class VideoToolConsumer : BaseAiTaskConsumer
    {
        public VideoToolConsumer(
            ApplicationDbContext dbContext,
            IHttpClientFactory httpClientFactory,
            IMediaService mediaService,
            NexClone.Backend.Application.Services.UsagePolicyService usagePolicy,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            ITtsService ttsService,
            ISttService sttService,
            ILogger<VideoToolConsumer> logger) 
            : base(dbContext, httpClientFactory, mediaService, usagePolicy, hubContext, emailService, emailTemplateService, ttsService, sttService, logger)
        {
        }

        public async Task Consume(VideoToolMessage message)
        {
            var history = await _dbContext.GenerationHistories.FindAsync(message.HistoryId);
            if (history == null) return;

            try
            {
                var (apiKey, defaultModel) = await GetToolConfigAsync(message.ToolType);

                var client = _httpClientFactory.CreateClient("AIGateway");
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                object payload = null;
                string endpoint = "https://api.crun.ai/api/v1/client/job/submit";

                if (message.ToolType == "text-to-video")
                {
                    payload = new {
                        model = message.Model,
                        prompt = message.Prompt,
                        resolution = message.Resolution,
                        duration = message.Duration > 0 ? message.Duration : (int?)null
                    };
                }
                else if (message.ToolType == "image-to-video")
                {
                    string imageUrl = "";
                    if (message.Image1Bytes != null)
                    {
                        using var ms = new System.IO.MemoryStream(message.Image1Bytes);
                        imageUrl = await _mediaService.UploadFileAsync(ms, $"image2video_{Guid.NewGuid()}.jpg", message.Image1ContentType);
                    }
                    payload = new {
                        model = message.Model,
                        image = imageUrl,
                        prompt = message.Prompt,
                        mode = message.Mode,
                        resolution = message.Resolution,
                        duration = message.Duration > 0 ? message.Duration : (int?)null
                    };
                }
                else if (message.ToolType == "reference-to-video")
                {
                    var images = new System.Collections.Generic.List<string>();
                    if (message.Image1Bytes != null) { using var ms = new System.IO.MemoryStream(message.Image1Bytes); images.Add(await _mediaService.UploadFileAsync(ms, $"ref_{Guid.NewGuid()}.jpg", message.Image1ContentType)); }
                    if (message.Image2Bytes != null) { using var ms = new System.IO.MemoryStream(message.Image2Bytes); images.Add(await _mediaService.UploadFileAsync(ms, $"ref_{Guid.NewGuid()}.jpg", message.Image2ContentType)); }
                    if (message.Image3Bytes != null) { using var ms = new System.IO.MemoryStream(message.Image3Bytes); images.Add(await _mediaService.UploadFileAsync(ms, $"ref_{Guid.NewGuid()}.jpg", message.Image3ContentType)); }
                    
                    payload = new {
                        model = message.Model,
                        image_urls = images,
                        prompt = message.Prompt,
                        resolution = message.Resolution,
                        aspect_ratio = message.AspectRatio
                    };
                }

                var jsonContent = new StringContent(JsonSerializer.Serialize(payload, new JsonSerializerOptions { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull }), Encoding.UTF8, "application/json");
                
                var submitResponse = await client.PostAsync(endpoint, jsonContent);
                var submitResult = await submitResponse.Content.ReadAsStringAsync();
                
                if (!submitResponse.IsSuccessStatusCode)
                    throw new Exception($"Crun AI submit failed: {submitResult}");

                using var doc = JsonDocument.Parse(submitResult);
                if (!doc.RootElement.TryGetProperty("data", out var dataEl) || !dataEl.TryGetProperty("task_id", out var taskIdEl))
                {
                    throw new Exception($"Invalid response from Crun AI: {submitResult}");
                }

                string taskId = taskIdEl.GetString();
                
                // Save task id so frontend can poll or we can use it
                history.ResultText = taskId;
                await _dbContext.SaveChangesAsync();

                string outputUrl = await PollCrunApiTask(client, taskId);

                history.Status = "succeeded";
                history.FileUrl = outputUrl;
                history.ResultText = "Complete";
                await _dbContext.SaveChangesAsync();

                await NotifyUserSuccess(message.UserId, history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing video tool task.");
                history.Status = "failed";
                history.ErrorMessage = ex.Message;
                history.ResultText = "Error";
                await _dbContext.SaveChangesAsync();
                
                await _usagePolicy.RefundByToolAsync(message.UserId, message.ToolType, history.CreditsUsed);
                await NotifyUserFailed(message.UserId, history, ex.Message);
            }
        }
    }
}
