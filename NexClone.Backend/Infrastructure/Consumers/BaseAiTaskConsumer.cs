using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using Hangfire;

namespace NexClone.Backend.Infrastructure.Consumers
{
    public abstract class BaseAiTaskConsumer
    {
        protected readonly ApplicationDbContext _dbContext;
        protected readonly IHttpClientFactory _httpClientFactory;
        protected readonly IMediaService _mediaService;
        protected readonly NexClone.Backend.Application.Services.UsagePolicyService _usagePolicy;
        protected readonly IHubContext<NotificationHub> _hubContext;
        protected readonly ILogger _logger;
        protected readonly IEmailService _emailService;
        protected readonly IEmailTemplateService _emailTemplateService;
        protected readonly ITtsService _ttsService;
        protected readonly ISttService _sttService;

        protected BaseAiTaskConsumer(
            ApplicationDbContext dbContext,
            IHttpClientFactory httpClientFactory,
            IMediaService mediaService,
            NexClone.Backend.Application.Services.UsagePolicyService usagePolicy,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IEmailTemplateService emailTemplateService,
            ITtsService ttsService,
            ISttService sttService,
            ILogger logger)
        {
            _dbContext = dbContext;
            _httpClientFactory = httpClientFactory;
            _mediaService = mediaService;
            _usagePolicy = usagePolicy;
            _hubContext = hubContext;
            _emailService = emailService;
            _emailTemplateService = emailTemplateService;
            _ttsService = ttsService;
            _sttService = sttService;
            _logger = logger;
        }

        protected async Task<string> PollCometApiTask(HttpClient client, string taskId)
        {
            return await PollWithBackoffAsync(async () =>
            {
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
                            return (true, videosEl[0].GetProperty("url").GetString());
                        }
                    }
                    else if (status == "failed" || status == "error")
                    {
                        string errMsg = pollData.TryGetProperty("task_status_msg", out var msgEl) ? msgEl.GetString() : pollString;
                        throw new Exception($"Task failed: {errMsg}");
                    }
                }
                return (false, "");
            }, "CometAPI");
        }

        protected async Task<string> PollPicsartApiTask(HttpClient client, string taskId)
        {
            return await PollWithBackoffAsync(async () =>
            {
                var pollResponse = await client.GetAsync($"https://genai-api.picsart.io/v1/video/{taskId}");
                var pollString = await pollResponse.Content.ReadAsStringAsync();

                using var pollDoc = JsonDocument.Parse(pollString);
                var pollRoot = pollDoc.RootElement;
                
                if (pollRoot.TryGetProperty("status", out var statusEl))
                {
                    var status = statusEl.GetString()?.ToUpper();
                    if (status == "DONE" || status == "SUCCESS" || status == "COMPLETED")
                    {
                        if (pollRoot.TryGetProperty("data", out var dataEl) && dataEl.TryGetProperty("url", out var urlEl))
                        {
                            return (true, urlEl.GetString());
                        }
                    }
                    else if (status == "FAILED" || status == "ERROR")
                    {
                        string errorMsg = pollRoot.TryGetProperty("message", out var msgEl) ? msgEl.GetString() : pollString;
                        throw new Exception($"Picsart Task failed: {errorMsg}");
                    }
                }
                return (false, "");
            }, "Picsart");
        }

        protected async Task<string> PollCrunApiTask(HttpClient client, string taskId)
        {
            return await PollWithBackoffAsync(async () =>
            {
                var pollResponse = await client.GetAsync($"https://api.crun.ai/api/v1/client/job/TaskInfo?task_id={taskId}");
                var pollString = await pollResponse.Content.ReadAsStringAsync();

                using var pollDoc = JsonDocument.Parse(pollString);
                var pollRoot = pollDoc.RootElement;
                
                if (pollRoot.TryGetProperty("data", out var dataEl))
                {
                    if (dataEl.TryGetProperty("status", out var statusEl))
                    {
                        var status = statusEl.GetString()?.ToLower();
                        if (status == "success" || status == "completed")
                        {
                            if (dataEl.TryGetProperty("result", out var resultEl))
                            {
                                var url = resultEl.TryGetProperty("url", out var urlEl) ? urlEl.GetString()
                                    : resultEl.TryGetProperty("image_url", out var imgUrlEl) ? imgUrlEl.GetString()
                                    : resultEl.TryGetProperty("video_url", out var videoUrlEl) ? videoUrlEl.GetString()
                                    : resultEl.TryGetProperty("images", out var imagesEl) && imagesEl.ValueKind == JsonValueKind.Array && imagesEl.GetArrayLength() > 0 ? imagesEl[0].GetString()
                                    : resultEl.TryGetProperty("media_urls", out var mediaUrlsEl) && mediaUrlsEl.ValueKind == JsonValueKind.Array && mediaUrlsEl.GetArrayLength() > 0 ? mediaUrlsEl[0].GetString()
                                    : null;
                                if (url != null) return (true, url);
                            }
                        }
                        else if (status == "failed" || status == "error")
                        {
                            string errMsg = dataEl.TryGetProperty("result", out var resultEl) && resultEl.TryGetProperty("message", out var msgEl) 
                                            ? msgEl.GetString() : pollString;
                            throw new Exception($"Crun AI Task failed: {errMsg}");
                        }
                    }
                }
                return (false, "");
            }, "CrunAI");
        }

        private async Task<string> PollWithBackoffAsync(Func<Task<(bool IsComplete, string Result)>> pollFunc, string providerName)
        {
            int maxAttempts = 45;
            int baseDelayMs = 5000;
            int maxDelayMs = 30000;

            for (int attempt = 0; attempt < maxAttempts; attempt++)
            {
                try
                {
                    var (isComplete, result) = await pollFunc();
                    if (isComplete)
                    {
                        if (string.IsNullOrEmpty(result))
                            throw new Exception($"Task completed but {providerName} returned empty result.");
                        return result;
                    }
                }
                catch (Exception ex) when (ex is not Exception || !ex.Message.Contains("Task failed") && !ex.Message.Contains("failed:"))
                {
                    _logger.LogWarning(ex, "[{Provider}] Poll attempt {Attempt} failed, retrying...", providerName, attempt + 1);
                }

                int delay = Math.Min(baseDelayMs * (int)Math.Pow(2, Math.Min(attempt, 4)), maxDelayMs);
                await Task.Delay(delay);
            }

            throw new Exception($"Timed out waiting for {providerName} task to complete after {maxAttempts * 5 / 60} minutes.");
        }

        protected async Task<(string ApiKey, string ModelName)> GetToolConfigAsync(string toolName)
        {
            var aliases = new System.Collections.Generic.List<string> { toolName };
            if (toolName.Contains("lip-sync") || toolName.Contains("lipsync"))
            {
                aliases.AddRange(new[] { "vidu_advanced_lip_sync", "advanced-lip-sync", "lip-sync", "lipsync", "kling_advanced_lip_sync" });
            }
            else if (toolName.Contains("image") && !toolName.Contains("video"))
            {
                aliases.AddRange(new[] { "text-to-image", "image" });
            }
            else if (toolName.Contains("video"))
            {
                aliases.AddRange(new[] { toolName, "text-to-video", "image-to-video", "reference-to-video", "kling_avatar_image2video" });
            }

            ToolConfiguration toolConfig = null;
            foreach (var alias in aliases)
            {
                toolConfig = await _dbContext.ToolConfigurations
                    .Include(t => t.RoutingRules)
                    .FirstOrDefaultAsync(t => t.ToolName == alias && t.IsActive && t.RoutingRules.Any());
                if (toolConfig != null) break;
            }

            if (toolConfig != null)
            {
                var rule = toolConfig.RoutingRules.FirstOrDefault();
                if (rule != null)
                {
                    var apiConfig = await _dbContext.ApiConfigurations
                        .FirstOrDefaultAsync(c => c.ProviderName == rule.ProviderName && c.IsActive);

                    if (apiConfig != null && !string.IsNullOrWhiteSpace(apiConfig.ApiKey))
                    {
                        return (apiConfig.ApiKey, rule.ModelName ?? toolName);
                    }
                }
            }

            // Fallback: Check if CrunAI or any active provider is available in ApiConfigurations
            var fallbackCrun = await _dbContext.ApiConfigurations
                .FirstOrDefaultAsync(c => (c.ProviderName == "CrunAI" || c.ProviderName == "Crun") && c.IsActive && !string.IsNullOrWhiteSpace(c.ApiKey));

            if (fallbackCrun != null)
            {
                string fallbackModel = (toolName.Contains("lip-sync") || toolName.Contains("lipsync")) 
                    ? "vidu/lip-sync" 
                    : (toolName.Contains("image") ? "grok" : "default");
                return (fallbackCrun.ApiKey, fallbackModel);
            }

            throw new Exception($"API configuration for tool '{toolName}' is missing. Please configure CrunAI API key in admin panel.");
        }

        protected async Task NotifyUserSuccess(Guid userId, GenerationHistory history)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user != null)
            {
                await _hubContext.Clients.User(userId.ToString()).SendAsync(
                    "ReceiveNotification", 
                    "العملية مكتملة", 
                    $"تم الانتهاء من {history.Title} بنجاح.", 
                    "success", 
                    "/history");

                // Email notification removed as requested

            }
        }


        protected async Task NotifyUserFailed(Guid userId, GenerationHistory history, string error)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user != null)
            {
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
