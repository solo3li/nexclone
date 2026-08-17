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
                client.DefaultRequestHeaders.Add("x-api-key", apiKey);

                object payload = null;
                string endpoint = "https://api.crun.ai/api/v1/client/job/CreateTask";

                string crunModel = ResolveModelId(message.Model, message.ToolType);

                if (message.ToolType == "text-to-video")
                {
                    string normalizedAspect = message.AspectRatio switch {
                        "9:16" => "9:16",
                        "16:9" => "16:9",
                        _ => "16:9"
                    };

                    if (crunModel.Contains("grok"))
                    {
                        string grokMode = (message.Mode?.ToLower()) switch {
                            "fun" => "fun",
                            "spicy" => "spicy",
                            _ => "normal"
                        };

                        payload = new {
                            model = crunModel,
                            input = new {
                                prompt = message.Prompt,
                                resolution = message.Resolution,
                                aspect_ratio = normalizedAspect,
                                mode = grokMode,
                                duration = message.Duration > 0 ? message.Duration : (int?)null
                            }
                        };
                    }
                    else
                    {
                        payload = new {
                            model = crunModel,
                            input = new {
                                prompt = message.Prompt,
                                resolution = message.Resolution,
                                aspect_ratio = normalizedAspect,
                                duration = message.Duration > 0 ? message.Duration : (int?)null
                            }
                        };
                    }
                }
                else if (message.ToolType == "image-to-video")
                {
                    string imageUrl = "";
                    string endFrameUrl = null;
                    if (message.Image1Bytes != null)
                    {
                        using var ms = new System.IO.MemoryStream(message.Image1Bytes);
                        string key = await _mediaService.UploadFileAsync(ms, $"image2video_{Guid.NewGuid()}.jpg", message.Image1ContentType);
                        imageUrl = await _mediaService.GetFileUrlAsync(key);
                    }
                    if (message.Image2Bytes != null)
                    {
                        using var ms = new System.IO.MemoryStream(message.Image2Bytes);
                        string key = await _mediaService.UploadFileAsync(ms, $"image2video_end_{Guid.NewGuid()}.jpg", message.Image2ContentType);
                        endFrameUrl = await _mediaService.GetFileUrlAsync(key);
                    }

                    var imgUrlsList = new System.Collections.Generic.List<string> { imageUrl };
                    if (!string.IsNullOrEmpty(endFrameUrl)) imgUrlsList.Add(endFrameUrl);

                    string normalizedAspect = message.AspectRatio switch {
                        "9:16" => "9:16",
                        "16:9" => "16:9",
                        "Auto" => "Auto",
                        "auto" => "Auto",
                        _ => "Auto"
                    };

                    string promptText = !string.IsNullOrWhiteSpace(message.Prompt) ? message.Prompt : "Cinematic fluid camera motion, photorealistic animation";

                    if (crunModel.Contains("grok"))
                    {
                        string grokMode = (message.Mode?.ToLower()) switch {
                            "fun" => "fun",
                            "spicy" => "spicy",
                            _ => "normal"
                        };

                        payload = new {
                            model = crunModel,
                            input = new {
                                img_urls = imgUrlsList,
                                image_urls = imgUrlsList,
                                duration = message.Duration > 0 ? message.Duration : 6,
                                resolution = message.Resolution,
                                aspect_ratio = normalizedAspect,
                                prompt = promptText,
                                mode = grokMode
                            }
                        };
                    }
                    else
                    {
                        payload = new {
                            model = crunModel,
                            input = new {
                                img_urls = imgUrlsList,
                                prompt = promptText,
                                resolution = message.Resolution,
                                aspect_ratio = normalizedAspect,
                                duration = message.Duration > 0 ? message.Duration : (int?)null
                            }
                        };
                    }
                }
                else if (message.ToolType == "reference-to-video")
                {
                    var images = new System.Collections.Generic.List<string>();
                    if (message.Image1Bytes != null) 
                    { 
                        using var ms = new System.IO.MemoryStream(message.Image1Bytes); 
                        string key = await _mediaService.UploadFileAsync(ms, $"ref_{Guid.NewGuid()}.jpg", message.Image1ContentType); 
                        images.Add(await _mediaService.GetFileUrlAsync(key)); 
                    }
                    if (message.Image2Bytes != null) 
                    { 
                        using var ms = new System.IO.MemoryStream(message.Image2Bytes); 
                        string key = await _mediaService.UploadFileAsync(ms, $"ref_{Guid.NewGuid()}.jpg", message.Image2ContentType); 
                        images.Add(await _mediaService.GetFileUrlAsync(key)); 
                    }
                    if (message.Image3Bytes != null) 
                    { 
                        using var ms = new System.IO.MemoryStream(message.Image3Bytes); 
                        string key = await _mediaService.UploadFileAsync(ms, $"ref_{Guid.NewGuid()}.jpg", message.Image3ContentType); 
                        images.Add(await _mediaService.GetFileUrlAsync(key)); 
                    }
                    
                    string normalizedAspect = message.AspectRatio switch {
                        "9:16" => "9:16",
                        "16:9" => "16:9",
                        "Auto" => "Auto",
                        "auto" => "Auto",
                        _ => "Auto"
                    };

                    string promptText = !string.IsNullOrWhiteSpace(message.Prompt) ? message.Prompt : "Cinematic smooth transition and character continuity";

                    payload = new {
                        model = crunModel,
                        input = new {
                            img_urls = images,
                            prompt = promptText,
                            resolution = message.Resolution,
                            aspect_ratio = normalizedAspect
                        }
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

        private string ResolveModelId(string model, string toolType)
        {
            var m = (model ?? "").Trim().ToLower();
            m = m.Replace(" ", "-"); // convert "veo 3.1 fast" to "veo-3.1-fast"

            if (toolType == "reference-to-video")
            {
                if (m == "veo-3.1-fast" || m == "veo-fast" || m == "google/veo3-1-fast-t2v" || m == "google/veo3-1-fast-r2v")
                    return "google/veo3-1-fast-r2v";
                if (m == "veo-3.1-lite" || m == "veo-lite" || m == "google/veo3-1-lite-t2v" || m == "google/veo3-1-lite-r2v")
                    return "google/veo3-1-lite-r2v";
                if (m == "veo-3.1-quality" || m == "veo-3.1" || m == "veo" || m == "veo-quality" || m == "google/veo3-1-t2v" || m == "google/veo3-1-r2v")
                    return "google/veo3-1-r2v";
            }
            if (m == "veo-3.1-fast" || m == "veo-fast" || m == "google/veo3-1-fast-t2v")
                return toolType == "image-to-video" ? "google/veo3-1-fast-i2v" : "google/veo3-1-fast-t2v";
            if (m == "veo-3.1-lite" || m == "veo-lite" || m == "google/veo3-1-lite-t2v")
                return toolType == "image-to-video" ? "google/veo3-1-lite-i2v" : "google/veo3-1-lite-t2v";
            if (m == "veo-3.1-quality" || m == "veo-3.1" || m == "veo" || m == "veo-quality" || m == "google/veo3-1-t2v")
                return toolType == "image-to-video" ? "google/veo3-1-i2v" : "google/veo3-1-t2v";
            if (m == "grok" || m == "grok-imagine" || m == "grok-imagine/t2v")
                return toolType == "image-to-video" ? "grok-imagine/i2v" : "grok-imagine/t2v";
            return model;
        }
    }
}
