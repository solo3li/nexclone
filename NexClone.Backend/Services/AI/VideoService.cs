using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using Microsoft.Extensions.Logging;

namespace NexClone.Backend.Services.AI
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

        public async Task<(bool Success, string TaskId, string ErrorMessage)> StartAvatarImageToVideoAsync(IFormFile imageFile)
        {
            try
            {
                var (apiKey, modelName) = await GetToolConfigAsync("kling-avatar-image2video");
                
                // Upload image to our media service to get a public URL
                string imageUrl = await _mediaService.UploadFileAsync(imageFile);
                if (!imageUrl.StartsWith("http"))
                {
                    // If it's just an object name, get the URL
                    imageUrl = await _mediaService.GetFileUrlAsync(imageUrl);
                }

                var payload = new
                {
                    model = modelName,
                    input = new
                    {
                        image = imageUrl
                    }
                };

                return await SubmitTaskAsync(payload, apiKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting avatar image to video task");
                return (false, null, ex.Message);
            }
        }

        public async Task<(bool Success, string TaskId, string ErrorMessage)> StartLipSyncAsync(IFormFile imageFile, IFormFile audioFile)
        {
            try
            {
                var (apiKey, modelName) = await GetToolConfigAsync("kling-advanced-lip-syn");
                
                string imageUrl = await _mediaService.UploadFileAsync(imageFile);
                if (!imageUrl.StartsWith("http")) imageUrl = await _mediaService.GetFileUrlAsync(imageUrl);

                string audioUrl = await _mediaService.UploadFileAsync(audioFile);
                if (!audioUrl.StartsWith("http")) audioUrl = await _mediaService.GetFileUrlAsync(audioUrl);

                var payload = new
                {
                    model = modelName,
                    input = new
                    {
                        image = imageUrl,
                        audio = audioUrl
                    }
                };

                return await SubmitTaskAsync(payload, apiKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting lip sync task");
                return (false, null, ex.Message);
            }
        }

        private async Task<(bool Success, string TaskId, string ErrorMessage)> SubmitTaskAsync(object payload, string apiKey)
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            
            var response = await client.PostAsync("https://api.cometapi.com/v1/tasks", jsonContent);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"CometAPI returned {response.StatusCode}: {responseString}");
                return (false, null, $"API Error: {responseString}");
            }

            using var doc = JsonDocument.Parse(responseString);
            if (doc.RootElement.TryGetProperty("id", out var idElement))
            {
                return (true, idElement.GetString(), null);
            }

            return (false, null, "Failed to parse task ID from response.");
        }

        public async Task<(string Status, string OutputUrl, string ErrorMessage)> CheckTaskStatusAsync(string taskId)
        {
            try
            {
                // We just need the API key for status check, model name doesn't matter here
                var (apiKey, _) = await GetToolConfigAsync("kling-avatar-image2video");
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                var response = await client.GetAsync($"https://api.cometapi.com/v1/tasks/{taskId}");
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return ("failed", null, $"API Error: {responseString}");
                }

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;
                
                string status = root.TryGetProperty("status", out var statusEl) ? statusEl.GetString()?.ToLower() : "processing";
                
                if (status == "succeeded" || status == "completed")
                {
                    string outputUrl = null;
                    if (root.TryGetProperty("output", out var outputEl))
                    {
                        if (outputEl.ValueKind == JsonValueKind.Object && outputEl.TryGetProperty("video", out var videoEl))
                        {
                            outputUrl = videoEl.GetString();
                        }
                        else if (outputEl.ValueKind == JsonValueKind.Object && outputEl.TryGetProperty("url", out var urlEl))
                        {
                            outputUrl = urlEl.GetString();
                        }
                        else if (outputEl.ValueKind == JsonValueKind.String)
                        {
                            outputUrl = outputEl.GetString();
                        }
                    }
                    
                    return ("succeeded", outputUrl, null);
                }
                else if (status == "failed" || status == "error")
                {
                    string errorMsg = root.TryGetProperty("error", out var errorEl) ? errorEl.GetString() : "Unknown error";
                    return ("failed", null, errorMsg);
                }

                // processing, starting, queued, etc.
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
