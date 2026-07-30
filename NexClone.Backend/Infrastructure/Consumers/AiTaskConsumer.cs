using MassTransit;
using Microsoft.EntityFrameworkCore;
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
    public class AiTaskConsumer : 
        IConsumer<AvatarVideoMessage>,
        IConsumer<LipSyncMessage>
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IMediaService _mediaService;
        private readonly NexClone.Backend.Application.Services.UsagePolicyService _usagePolicy;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ILogger<AiTaskConsumer> _logger;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateService _emailTemplateService;

        public AiTaskConsumer(
            ApplicationDbContext dbContext,
            IHttpClientFactory httpClientFactory,
            IMediaService mediaService,
            NexClone.Backend.Application.Services.UsagePolicyService usagePolicy,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            ILogger<AiTaskConsumer> logger)
        {
            _dbContext = dbContext;
            _httpClientFactory = httpClientFactory;
            _mediaService = mediaService;
            _usagePolicy = usagePolicy;
            _hubContext = hubContext;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
            _logger = logger;
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
                    model = "kling_advanced_lip_sync",
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

        private async Task<string> PollCometApiTask(HttpClient client, string taskId)
        {
            string outputUrl = "";
            for (int i = 0; i < 60; i++)
            {
                await Task.Delay(10000); // Poll every 10 seconds (max 10 mins)
                var pollResponse = await client.GetAsync($"https://api.cometapi.com/v1/images/generations/{taskId}");
                var pollString = await pollResponse.Content.ReadAsStringAsync();

                using var pollDoc = JsonDocument.Parse(pollString);
                var pollRoot = pollDoc.RootElement;
                var pollData = pollRoot.TryGetProperty("data", out var pData) ? pData : pollRoot;

                if (pollData.TryGetProperty("task_status", out var statusEl))
                {
                    var status = statusEl.GetString()?.ToLower();
                    if (status == "succeed" || status == "succeeded")
                    {
                        if (pollData.TryGetProperty("task_result", out var resultEl) && resultEl.TryGetProperty("videos", out var videosEl) && videosEl.GetArrayLength() > 0)
                        {
                            outputUrl = videosEl[0].GetProperty("url").GetString();
                            break;
                        }
                    }
                    else if (status == "failed" || status == "error")
                    {
                        string errMsg = pollData.TryGetProperty("task_status_msg", out var msgEl) ? msgEl.GetString() : pollString;
                        throw new Exception($"Task failed: {errMsg}");
                    }
                }
            }

            if (string.IsNullOrEmpty(outputUrl))
                throw new Exception("Timed out waiting for task to complete.");

            return outputUrl;
        }

        private async Task<(string ApiKey, string ModelName)> GetToolConfigAsync(string toolName)
        {
            var toolConfig = await _dbContext.ToolConfigurations
                .Include(t => t.RoutingRules)
                .FirstOrDefaultAsync(t => t.ToolName == toolName && t.IsActive);

            if (toolConfig == null) throw new Exception($"Tool '{toolName}' is not active or not configured.");

            var rule = toolConfig.RoutingRules.FirstOrDefault() ?? throw new Exception($"No routing rules configured for '{toolName}'.");

            var apiConfig = await _dbContext.ApiConfigurations
                .FirstOrDefaultAsync(c => c.ProviderName == rule.ProviderName && c.IsActive);

            if (apiConfig == null || string.IsNullOrWhiteSpace(apiConfig.ApiKey))
                throw new Exception($"API configuration for '{rule.ProviderName}' is missing.");

            return (apiConfig.ApiKey, rule.ModelName ?? toolName);
        }

        private async Task NotifyUserSuccess(Guid userId, GenerationHistory history)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user != null)
            {
                // SignalR
                await _hubContext.Clients.User(userId.ToString()).SendAsync(
                    "ReceiveNotification", 
                    "العملية مكتملة", 
                    $"تم الانتهاء من {history.Title} بنجاح.", 
                    "success", 
                    "/ar/history");

                // Email
                try {
                    await _emailService.SendEmailAsync(user.Email, $"عملية {history.Title} مكتملة", $"مرحباً {user.FullName}،\n\nلقد انتهينا من معالجة طلبك بنجاح. يمكنك مشاهدة أو تحميل النتيجة من الرابط أدناه:\n\n{history.FileUrl}\n\nأو يمكنك زيارة سجل العمليات في لوحة التحكم.", "");
                } catch { /* Ignore email fail */ }
            }
        }

        private async Task NotifyUserFailed(Guid userId, GenerationHistory history, string error)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user != null)
            {
                // SignalR
                await _hubContext.Clients.User(userId.ToString()).SendAsync(
                    "ReceiveNotification", 
                    "فشل العملية", 
                    $"حدث خطأ أثناء معالجة {history.Title}: {error}", 
                    "error", 
                    "/ar/history");
            }
        }
    }
}
