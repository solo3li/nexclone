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
                    else if (crunModel.Contains("seedance"))
                    {
                        payload = new {
                            model = crunModel,
                            input = new {
                                prompt = message.Prompt,
                                resolution = message.Resolution,
                                aspect_ratio = normalizedAspect,
                                duration = message.Duration > 0 ? message.Duration : 5,
                                audio = message.Mode?.Contains("audio_on") == true
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
                    var imgUrlsList = new System.Collections.Generic.List<string>();

                    if (message.ImageUrls != null && message.ImageUrls.Count > 0)
                    {
                        imgUrlsList.AddRange(message.ImageUrls);
                    }
                    else
                    {
                        if (message.Image1Bytes != null)
                        {
                            using var ms = new System.IO.MemoryStream(message.Image1Bytes);
                            string key = await _mediaService.UploadFileAsync(ms, $"image2video_{Guid.NewGuid()}.jpg", message.Image1ContentType);
                            imgUrlsList.Add(await _mediaService.GetFileUrlAsync(key));
                        }
                        if (message.Image2Bytes != null)
                        {
                            using var ms = new System.IO.MemoryStream(message.Image2Bytes);
                            string key = await _mediaService.UploadFileAsync(ms, $"image2video_end_{Guid.NewGuid()}.jpg", message.Image2ContentType);
                            imgUrlsList.Add(await _mediaService.GetFileUrlAsync(key));
                        }
                    }

                    string normalizedAspect = message.AspectRatio switch {
                        "9:16" => "9:16",
                        "16:9" => "16:9",
                        "1:1" => "1:1",
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

                        string grokAspect = message.AspectRatio switch {
                            "1:1" => "1:1",
                            "2:3" => "2:3",
                            "3:2" => "3:2",
                            "16:9" => "16:9",
                            "9:16" => "9:16",
                            _ => null
                        };

                        payload = new {
                            model = crunModel,
                            input = new {
                                img_urls = imgUrlsList.Take(7).ToList(),
                                image_urls = imgUrlsList.Take(7).ToList(),
                                duration = message.Duration > 0 ? message.Duration : 6,
                                resolution = message.Resolution,
                                aspect_ratio = grokAspect,
                                prompt = promptText,
                                mode = grokMode
                            }
                        };
                    }
                    else if (crunModel.Contains("seedance"))
                    {
                        bool isAudioOn = message.AudioEnabled ?? (message.Mode?.Contains("audio_on") == true);
                        payload = new {
                            model = crunModel,
                            input = new {
                                img_urls = imgUrlsList.Take(2).ToList(),
                                prompt = promptText,
                                resolution = message.Resolution,
                                aspect_ratio = normalizedAspect,
                                duration = message.Duration >= 4 ? message.Duration : 5,
                                audio = isAudioOn
                            }
                        };
                    }
                    else
                    {
                        // Veo: strictly supports 4, 6, 8 (default 8), 1-2 images, and aspect ratios: 16:9, 9:16, Auto (no 1:1)
                        string veoAspect = (normalizedAspect == "1:1") ? "Auto" : normalizedAspect;
                        int veoDuration = (message.Duration == 4 || message.Duration == 6 || message.Duration == 8) ? message.Duration : 8;

                        payload = new {
                            model = crunModel,
                            input = new {
                                img_urls = imgUrlsList.Take(2).ToList(),
                                prompt = promptText,
                                resolution = message.Resolution,
                                aspect_ratio = veoAspect,
                                duration = veoDuration
                            }
                        };
                    }
                }
                else if (message.ToolType == "reference-to-video")
                {
                    var imgUrls = new System.Collections.Generic.List<string>();
                    var videoUrls = new System.Collections.Generic.List<string>();
                    var audioUrls = new System.Collections.Generic.List<string>();

                    if (message.ImageUrls != null && message.ImageUrls.Count > 0)
                        imgUrls.AddRange(message.ImageUrls);
                    if (message.VideoUrls != null && message.VideoUrls.Count > 0)
                        videoUrls.AddRange(message.VideoUrls);
                    if (message.AudioUrls != null && message.AudioUrls.Count > 0)
                        audioUrls.AddRange(message.AudioUrls);

                    // Legacy fallback
                    if (imgUrls.Count == 0 && videoUrls.Count == 0 && audioUrls.Count == 0)
                    {
                        async Task ProcessMedia(byte[] bytes, string contentType)
                        {
                            if (bytes == null) return;
                            using var ms = new System.IO.MemoryStream(bytes);
                            string ext = contentType.StartsWith("video/") ? ".mp4" : contentType.StartsWith("audio/") ? ".mp3" : ".jpg";
                            string key = await _mediaService.UploadFileAsync(ms, $"ref_{Guid.NewGuid()}{ext}", contentType);
                            string url = await _mediaService.GetFileUrlAsync(key);
                            
                            if (contentType.StartsWith("video/")) videoUrls.Add(url);
                            else if (contentType.StartsWith("audio/")) audioUrls.Add(url);
                            else imgUrls.Add(url);
                        }

                        await ProcessMedia(message.Image1Bytes, message.Image1ContentType);
                        await ProcessMedia(message.Image2Bytes, message.Image2ContentType);
                        await ProcessMedia(message.Image3Bytes, message.Image3ContentType);
                    }
                    
                    string normalizedAspect = message.AspectRatio switch {
                        "9:16" => "9:16",
                        "16:9" => "16:9",
                        "1:1" => "1:1",
                        "Auto" => "Auto",
                        "auto" => "Auto",
                        _ => "Auto"
                    };

                    string promptText = !string.IsNullOrWhiteSpace(message.Prompt) ? message.Prompt : "Cinematic smooth transition and character continuity";

                    if (crunModel.Contains("seedance"))
                    {
                        bool isAudioOn = message.AudioEnabled ?? (message.Mode?.Contains("audio_on") == true);
                        payload = new {
                            model = crunModel,
                            input = new {
                                reference_images = imgUrls.Count > 0 ? imgUrls.Take(9).ToList() : null,
                                reference_videos = videoUrls.Count > 0 ? videoUrls.Take(3).ToList() : null,
                                reference_audios = audioUrls.Count > 0 ? audioUrls.Take(3).ToList() : null,
                                audio = isAudioOn,
                                prompt = promptText,
                                resolution = message.Resolution,
                                aspect_ratio = normalizedAspect,
                                duration = message.Duration >= 4 ? message.Duration : 6
                            }
                        };
                    }
                    else
                    {
                        // Google Veo: strictly supports 1-3 images only (no videos, no audios), duration strictly 8
                        string veoAspect = (normalizedAspect == "1:1") ? "Auto" : normalizedAspect;
                        payload = new {
                            model = crunModel,
                            input = new {
                                img_urls = imgUrls.Take(3).ToList(),
                                prompt = promptText,
                                resolution = message.Resolution,
                                aspect_ratio = veoAspect,
                                duration = 8
                            }
                        };
                    }
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
                // "Veo 3.1 Quality" was removed; generic "veo" aliases now resolve to Fast.
                if (m == "veo-3.1-fast" || m == "veo-fast" || m == "veo-3.1" || m == "veo" || m == "google/veo3-1-fast-t2v" || m == "google/veo3-1-fast-r2v")
                    return "google/veo3-1-fast-r2v";
                if (m == "veo-3.1-lite" || m == "veo-lite" || m == "google/veo3-1-lite-t2v" || m == "google/veo3-1-lite-r2v")
                    return "google/veo3-1-lite-r2v";
            }
            if (m == "veo-3.1-fast" || m == "veo-fast" || m == "veo-3.1" || m == "veo" || m == "google/veo3-1-fast-t2v")
                return toolType == "image-to-video" ? "google/veo3-1-fast-i2v" : "google/veo3-1-fast-t2v";
            if (m == "veo-3.1-lite" || m == "veo-lite" || m == "google/veo3-1-lite-t2v")
                return toolType == "image-to-video" ? "google/veo3-1-lite-i2v" : "google/veo3-1-lite-t2v";
            if (m == "grok" || m == "grok-imagine" || m == "grok-imagine/t2v")
                return toolType == "image-to-video" ? "grok-imagine/i2v" : "grok-imagine/t2v";
            if (m.Contains("seedance") || m.Contains("bytedance"))
            {
                if (toolType == "reference-to-video") return "bytedance/seedance2-0-mini-r2v";
                if (toolType == "image-to-video") return "bytedance/seedance2-0-mini-i2v";
                return "bytedance/seedance2-0-mini-t2v";
            }
            return model;
        }
    }
}
