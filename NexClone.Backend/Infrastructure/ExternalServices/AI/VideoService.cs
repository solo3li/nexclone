using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace NexClone.Backend.Infrastructure.ExternalServices.AI
{
    public class VideoService : IVideoService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ApplicationDbContext _dbContext;
        private readonly IMediaService _mediaService;
        private readonly ILogger<VideoService> _logger;

        public VideoService(
            IHttpClientFactory httpClientFactory,
            ApplicationDbContext dbContext,
            IMediaService mediaService,
            ILogger<VideoService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _dbContext = dbContext;
            _mediaService = mediaService;
            _logger = logger;
        }

        private async Task<(string ApiKey, string ModelName)> GetToolConfigAsync(string toolName)
        {
            var toolConfig = await _dbContext.ToolConfigurations
                .Include(t => t.RoutingRules)
                .FirstOrDefaultAsync(t => t.ToolName == toolName && t.IsActive);

            if (toolConfig == null)
                throw new Exception($"Tool '{toolName}' is not active or not configured.");

            var rule = toolConfig.RoutingRules.FirstOrDefault() 
                ?? throw new Exception($"No routing rules configured for '{toolName}'.");

            var apiConfig = await _dbContext.ApiConfigurations
                .FirstOrDefaultAsync(c => c.ProviderName == rule.ProviderName && c.IsActive);

            if (apiConfig == null || string.IsNullOrWhiteSpace(apiConfig.ApiKey))
                throw new Exception($"API configuration for '{rule.ProviderName}' is missing or inactive.");

            return (apiConfig.ApiKey, rule.ModelName ?? toolName);
        }

        public async Task<(bool Success, string TaskId, string ErrorMessage)> StartAvatarImageToVideoAsync(IFormFile imageFile, IFormFile? audioFile = null, string prompt = "The speaker talks naturally to camera")
        {
            try
            {
                var (apiKey, modelName) = await GetToolConfigAsync("kling_avatar_image2video");
                
                // Upload image to our media service to get a public URL
                string imageUrl = await _mediaService.UploadFileAsync(imageFile);
                if (!imageUrl.StartsWith("http")) imageUrl = await _mediaService.GetFileUrlAsync(imageUrl);

                string? audioUrl = null;
                if (audioFile != null)
                {
                    audioUrl = await _mediaService.UploadFileAsync(audioFile);
                    if (!audioUrl.StartsWith("http")) audioUrl = await _mediaService.GetFileUrlAsync(audioUrl);
                }

                var payload = new
                {
                    model = modelName,
                    prompt = prompt,
                    image = imageUrl,
                    sound_file = audioUrl,
                    mode = "std"
                };

                return await SubmitTaskAsync(payload, apiKey, "https://api.cometapi.com/kling/v1/videos/avatar/image2video");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting avatar image to video task");
                return (false, null, ex.Message);
            }
        }

        public async Task<(bool Success, string TaskId, string ErrorMessage)> StartLipSyncAsync(IFormFile videoFile, IFormFile audioFile)
        {
            try
            {
                var (apiKey, modelName) = await GetToolConfigAsync("kling_advanced_lip_sync");
                
                string videoUrl = await _mediaService.UploadFileAsync(videoFile);
                if (!videoUrl.StartsWith("http")) videoUrl = await _mediaService.GetFileUrlAsync(videoUrl);

                string audioUrl = await _mediaService.UploadFileAsync(audioFile);
                if (!audioUrl.StartsWith("http")) audioUrl = await _mediaService.GetFileUrlAsync(audioUrl);

                var payload = new
                {
                    model = modelName,
                    prompt = "speak naturally",
                    video_url = videoUrl,
                    video = videoUrl,
                    audio = audioUrl,
                    sound_file = audioUrl
                };

                return await SubmitTaskAsync(payload, apiKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting lip sync task");
                return (false, null, ex.Message);
            }
        }

        private async Task<(bool Success, string TaskId, string ErrorMessage)> SubmitTaskAsync(object payload, string apiKey, string endpoint = "https://api.cometapi.com/v1/images/generations")
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            
            var response = await client.PostAsync(endpoint, jsonContent);
            var responseString = await response.Content.ReadAsStringAsync();

            _logger.LogInformation($"CometAPI submit response ({response.StatusCode}): {responseString}");

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"CometAPI returned {response.StatusCode}: {responseString}");
                return (false, null, $"API Error: {responseString}");
            }

            // Response format: { "code": 0, "message": "SUCCEED", "data": { "task_id": "...", "task_status": "submitted" } }
            using var doc = JsonDocument.Parse(responseString);
            var root = doc.RootElement;
            
            // Try CometAPI format: data.task_id
            if (root.TryGetProperty("data", out var dataEl) && dataEl.TryGetProperty("task_id", out var taskIdEl))
            {
                return (true, taskIdEl.GetString(), null);
            }
            // Fallback: direct id field
            if (root.TryGetProperty("id", out var idElement))
            {
                return (true, idElement.GetString(), null);
            }

            return (false, null, $"Failed to parse task ID from response: {responseString}");
        }

        public async Task<(string Status, string OutputUrl, string ErrorMessage)> CheckTaskStatusAsync(string taskId)
        {
            try
            {
                // We just need the API key for status check, model name doesn't matter here
                var (apiKey, _) = await GetToolConfigAsync("kling_avatar_image2video");
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                // CometAPI: query task status by submitting GET to /v1/images/generations/{taskId}
                var statusResponse = await client.GetAsync($"https://api.cometapi.com/v1/images/generations/{taskId}");
                var responseString = await statusResponse.Content.ReadAsStringAsync();
                
                _logger.LogInformation($"CometAPI status response for {taskId} ({statusResponse.StatusCode}): {responseString}");

                if (!statusResponse.IsSuccessStatusCode)
                {
                    return ("failed", null, $"API Error: {responseString}");
                }

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;
                
                // CometAPI format: { "data": { "task_status": "succeed", "task_result": { "videos": [{"url": "..."}] } } }
                JsonElement dataEl = root;
                if (root.TryGetProperty("data", out var dataElInner))
                    dataEl = dataElInner;

                string rawStatus = "processing";
                if (dataEl.TryGetProperty("task_status", out var statusEl))
                    rawStatus = statusEl.GetString()?.ToLower() ?? "processing";
                else if (root.TryGetProperty("status", out var statusEl2))
                    rawStatus = statusEl2.GetString()?.ToLower() ?? "processing";

                _logger.LogInformation($"Task {taskId} status: {rawStatus}");

                if (rawStatus == "succeed" || rawStatus == "succeeded" || rawStatus == "completed")
                {
                    string outputUrl = null;
                    
                    // Try data.task_result.videos[0].url
                    if (dataEl.TryGetProperty("task_result", out var taskResult))
                    {
                        if (taskResult.TryGetProperty("videos", out var videosEl) && videosEl.ValueKind == JsonValueKind.Array)
                        {
                            var firstVideo = videosEl.EnumerateArray().FirstOrDefault();
                            if (firstVideo.ValueKind != JsonValueKind.Undefined && firstVideo.TryGetProperty("url", out var urlEl))
                                outputUrl = urlEl.GetString();
                        }
                        else if (taskResult.TryGetProperty("url", out var urlEl2))
                            outputUrl = urlEl2.GetString();
                    }
                    // Try data.url or output directly
                    if (outputUrl == null && dataEl.TryGetProperty("url", out var urlEl3))
                        outputUrl = urlEl3.GetString();
                    
                    return ("succeeded", outputUrl, null);
                }
                else if (rawStatus == "failed" || rawStatus == "error")
                {
                    string errorMsg = "Unknown error";
                    if (dataEl.TryGetProperty("task_status_msg", out var msgEl))
                        errorMsg = msgEl.GetString();
                    return ("failed", null, errorMsg);
                }

                // submitted, processing, queued, etc.
                return ("processing", null, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error checking task status for {taskId}");
                return ("failed", null, ex.Message);
            }
        }
    }
}
