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

        protected async Task<string> PollPicsartApiTask(HttpClient client, string taskId)
        {
            string outputUrl = "";
            for (int i = 0; i < 60; i++)
            {
                await Task.Delay(10000); // Poll every 10 seconds (max 10 mins)
                var pollResponse = await client.GetAsync($"https://api.picsart.com/gw-v2/workflows/kling-avatar/{taskId}/result");
                var pollString = await pollResponse.Content.ReadAsStringAsync();

                using var pollDoc = JsonDocument.Parse(pollString);
                var pollRoot = pollDoc.RootElement;
                
                // Picsart format: { "status": "success", "response": { "status": "COMPLETED", "result": { "url": "..." } } }
                if (pollRoot.TryGetProperty("response", out var respEl))
                {
                    if (respEl.TryGetProperty("status", out var statusEl))
                    {
                        var status = statusEl.GetString()?.ToUpper();
                        if (status == "COMPLETED")
                        {
                            if (respEl.TryGetProperty("result", out var resultEl) && resultEl.TryGetProperty("url", out var urlEl))
                            {
                                outputUrl = urlEl.GetString();
                                break;
                            }
                        }
                        else if (status == "FAILED" || status == "ERROR")
                        {
                            throw new Exception($"Picsart Task failed: {pollString}");
                        }
                    }
                }
            }

            if (string.IsNullOrEmpty(outputUrl))
                throw new Exception("Timed out waiting for Picsart task to complete.");

            return outputUrl;
        }

        protected async Task<string> PollCrunApiTask(HttpClient client, string taskId)
        {
            string outputUrl = "";
            for (int i = 0; i < 60; i++)
            {
                await Task.Delay(10000); // Poll every 10 seconds (max 10 mins)
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
                                if (resultEl.TryGetProperty("url", out var urlEl))
                                {
                                    outputUrl = urlEl.GetString();
                                    break;
                                }
                                else if (resultEl.TryGetProperty("video_url", out var videoUrlEl))
                                {
                                    outputUrl = videoUrlEl.GetString();
                                    break;
                                }
                                else if (resultEl.TryGetProperty("media_urls", out var mediaUrlsEl) && mediaUrlsEl.ValueKind == JsonValueKind.Array && mediaUrlsEl.GetArrayLength() > 0)
                                {
                                    outputUrl = mediaUrlsEl[0].GetString();
                                    break;
                                }
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
            }

            if (string.IsNullOrEmpty(outputUrl))
                throw new Exception("Timed out waiting for Crun AI task to complete.");

            return outputUrl;
        }

        protected async Task<(string ApiKey, string ModelName)> GetToolConfigAsync(string toolName)
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

                if (history.Type != "text-to-voice" && history.Type != "voice-to-text")
                {
                    try {
                        var htmlBody = $@"<div dir=""rtl"" style=""font-family:Arial,sans-serif;direction:rtl;text-align:right;"">
<p>مرحباً {System.Web.HttpUtility.HtmlEncode(user.FullName)}،</p>
<p>لقد انتهينا من معالجة طلبك <strong>{System.Web.HttpUtility.HtmlEncode(history.Title)}</strong> بنجاح.</p>
<p>يمكنك مشاهدة أو تحميل النتيجة من الرابط أدناه:</p>
<p><a href=""{history.FileUrl}"">{history.FileUrl}</a></p>
<p>أو يمكنك زيارة <a href=""https://nexmedia.com/history"">سجل العمليات</a> في لوحة التحكم.</p>
</div>";
                        await _emailService.SendEmailAsync(user.Email, user.FullName, $"عملية {history.Title} مكتملة", htmlBody);
                    } catch { /* Ignore email fail */ }
                }
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
