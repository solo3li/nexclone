using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Application.Services;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Core.Messages;
using NexClone.Backend.Infrastructure.Consumers;
using NexClone.Backend.Infrastructure.Data;
using NexClone.Backend.Infrastructure.ExternalServices;

namespace NexClone.Backend.API.Controllers.AI
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowAllMcp")]
    public class McpController : ControllerBase
    {
        private static readonly ConcurrentDictionary<string, McpSession> _sessions = new();

        private readonly ApplicationDbContext _dbContext;
        private readonly UsagePolicyService _usagePolicy;
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly IMediaService _mediaService;
        private readonly ITtsCatalogService _ttsCatalog;

        public McpController(
            ApplicationDbContext dbContext,
            UsagePolicyService usagePolicy,
            IBackgroundJobClient backgroundJobClient,
            IMediaService mediaService,
            ITtsCatalogService ttsCatalog)
        {
            _dbContext = dbContext;
            _usagePolicy = usagePolicy;
            _backgroundJobClient = backgroundJobClient;
            _mediaService = mediaService;
            _ttsCatalog = ttsCatalog;
        }

        private static string HashKey(string key)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(key));
            return Convert.ToHexString(bytes).ToLowerInvariant();
        }

        private async Task<Guid?> AuthenticateApiKeyAsync()
        {
            string? apiKey = null;

            // 1. Check Authorization: Bearer <key>
            if (Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                var val = authHeader.ToString();
                if (val.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    apiKey = val.Substring(7).Trim();
                }
            }

            // 2. Check x-api-key header
            if (string.IsNullOrEmpty(apiKey) && Request.Headers.TryGetValue("x-api-key", out var xApiKey))
            {
                apiKey = xApiKey.ToString().Trim();
            }

            // 3. Check query param ?apiKey=...
            if (string.IsNullOrEmpty(apiKey) && Request.Query.TryGetValue("apiKey", out var qApiKey))
            {
                apiKey = qApiKey.ToString().Trim();
            }

            if (string.IsNullOrWhiteSpace(apiKey)) return null;

            string hash = HashKey(apiKey);
            var keyRecord = await _dbContext.UserApiKeys
                .Include(k => k.User)
                .FirstOrDefaultAsync(k => k.KeyHash == hash && k.IsActive);

            if (keyRecord == null) return null;

            keyRecord.LastUsedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();

            return keyRecord.UserId;
        }

        private async Task<(byte[] Bytes, string ContentType, string Url, string Error)> ResolveMediaAsync(
            string? url,
            string? base64Data,
            string defaultExt,
            string defaultContentType)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(base64Data))
                {
                    string raw = base64Data.Trim();
                    string detectedContentType = defaultContentType;
                    if (raw.StartsWith("data:", StringComparison.OrdinalIgnoreCase) && raw.Contains(";base64,"))
                    {
                        var parts = raw.Split(new[] { ";base64," }, StringSplitOptions.None);
                        detectedContentType = parts[0].Substring(5);
                        raw = parts[1];
                    }
                    byte[] bytes = Convert.FromBase64String(raw);
                    using var stream = new MemoryStream(bytes);
                    string key = await _mediaService.UploadFileAsync(stream, $"ai/mcp/{Guid.NewGuid()}{defaultExt}", detectedContentType);
                    string mediaUrl = await _mediaService.GetFileUrlAsync(key);
                    return (bytes, detectedContentType, mediaUrl, string.Empty);
                }

                if (!string.IsNullOrWhiteSpace(url) && (url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || url.StartsWith("https://", StringComparison.OrdinalIgnoreCase)))
                {
                    using var http = new HttpClient();
                    http.Timeout = TimeSpan.FromSeconds(45);
                    byte[] bytes = await http.GetByteArrayAsync(url);
                    using var stream = new MemoryStream(bytes);
                    string key = await _mediaService.UploadFileAsync(stream, $"ai/mcp/{Guid.NewGuid()}{defaultExt}", defaultContentType);
                    string mediaUrl = await _mediaService.GetFileUrlAsync(key);
                    return (bytes, defaultContentType, mediaUrl, string.Empty);
                }

                return (Array.Empty<byte>(), defaultContentType, string.Empty, "No URL or Base64 media data provided.");
            }
            catch (Exception ex)
            {
                return (Array.Empty<byte>(), defaultContentType, string.Empty, $"Failed to process media: {ex.Message}");
            }
        }

        private static double EstimateDurationSeconds(byte[] bytes, string ext)
        {
            try
            {
                string tempFile = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ext);
                System.IO.File.WriteAllBytes(tempFile, bytes);
                try
                {
                    using var tfile = TagLib.File.Create(tempFile);
                    double dur = tfile.Properties.Duration.TotalSeconds;
                    if (dur > 0) return dur;
                }
                finally
                {
                    if (System.IO.File.Exists(tempFile)) System.IO.File.Delete(tempFile);
                }
            }
            catch { }
            return 5.0;
        }

        [HttpGet("sse")]
        public async Task GetSse()
        {
            var userId = await AuthenticateApiKeyAsync();
            if (!userId.HasValue)
            {
                Response.StatusCode = 401;
                Response.ContentType = "application/json";
                await Response.WriteAsync("{\"error\": \"Unauthorized: Invalid or missing API Key\"}");
                return;
            }

            Response.StatusCode = 200;
            Response.ContentType = "text/event-stream";
            Response.Headers["Cache-Control"] = "no-cache, no-transform";
            Response.Headers["Connection"] = "keep-alive";
            Response.Headers["X-Accel-Buffering"] = "no";

            string sessionId = Guid.NewGuid().ToString("N");
            var session = new McpSession
            {
                SessionId = sessionId,
                UserId = userId.Value,
                Response = Response,
                CancellationToken = HttpContext.RequestAborted
            };

            _sessions[sessionId] = session;

            try
            {
                // Send endpoint event as per MCP SSE specification
                string endpointUrl = $"/api/mcp/messages?sessionId={sessionId}";
                await session.SendEventAsync("endpoint", endpointUrl);

                // Keep connection open
                while (!HttpContext.RequestAborted.IsCancellationRequested)
                {
                    await Task.Delay(15000, HttpContext.RequestAborted);
                    // Heartbeat ping
                    await session.SendEventAsync("ping", "{}");
                }
            }
            catch (TaskCanceledException) { }
            catch (Exception) { }
            finally
            {
                _sessions.TryRemove(sessionId, out _);
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadMedia([FromForm] IFormFile? file)
        {
            var userId = await AuthenticateApiKeyAsync();
            if (!userId.HasValue)
            {
                return Unauthorized(new { error = "Unauthorized: Invalid or missing API Key" });
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = "No file provided for upload" });
            }

            string ext = Path.GetExtension(file.FileName);
            if (string.IsNullOrEmpty(ext)) ext = ".dat";
            string contentType = file.ContentType ?? "application/octet-stream";

            using var stream = file.OpenReadStream();
            string key = await _mediaService.UploadFileAsync(stream, $"ai/mcp/uploads/{Guid.NewGuid()}{ext}", contentType);
            string mediaUrl = await _mediaService.GetFileUrlAsync(key);

            return Ok(new
            {
                mediaUrl = mediaUrl,
                fileName = file.FileName,
                fileSizeBytes = file.Length,
                contentType = contentType,
                message = "File uploaded successfully to NexMedia AI storage."
            });
        }

        [HttpPost("messages")]
        public async Task<IActionResult> HandleMessage([FromQuery] string sessionId)
        {
            if (string.IsNullOrEmpty(sessionId) || !_sessions.TryGetValue(sessionId, out var session))
            {
                return NotFound(new { error = "Session not found or expired" });
            }

            using var reader = new StreamReader(Request.Body);
            string requestBody = await reader.ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(requestBody)) return BadRequest();

            using var doc = JsonDocument.Parse(requestBody);
            var root = doc.RootElement;

            string? id = null;
            if (root.TryGetProperty("id", out var idProp))
            {
                id = idProp.ToString();
            }

            string method = root.TryGetProperty("method", out var mProp) ? mProp.GetString() ?? "" : "";
            JsonElement paramsElem = root.TryGetProperty("params", out var pElem) ? pElem : default;

            object? responseResult = null;
            object? responseError = null;

            switch (method)
            {
                case "initialize":
                    responseResult = new
                    {
                        protocolVersion = "2024-11-05",
                        capabilities = new
                        {
                            tools = new { listChanged = false }
                        },
                        serverInfo = new
                        {
                            name = "NexMedia AI MCP Server",
                            version = "2.0.0"
                        }
                    };
                    break;

                case "notifications/initialized":
                    return Accepted();

                case "ping":
                    responseResult = new { };
                    break;

                case "tools/list":
                    responseResult = new
                    {
                        tools = new object[]
                        {
                            new
                            {
                                name = "get_user_credits",
                                description = "Check the user's available credits balance (Standard & Premium) and active subscription plan details on NexMedia AI.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new { }
                                }
                            },
                            new
                            {
                                name = "estimate_cost",
                                description = "Estimate credits required for an AI generation before executing it.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        tool_name = new { type = "string", description = "Tool type: text-to-video, image-to-video, reference-to-video, text-to-image, text-to-voice, voice-to-text, avatar-to-video, lip-sync, motion-control" },
                                        model = new { type = "string", description = "AI Model name (veo, seedance, grok, flux, etc.)" },
                                        duration = new { type = "number", description = "Duration in seconds (e.g. 5, 8, 10)" },
                                        resolution = new { type = "string", description = "Resolution: 720p, 1080p, 4k" }
                                    },
                                    required = new[] { "tool_name" }
                                }
                            },
                            new
                            {
                                name = "upload_media",
                                description = "Upload any image, audio, or video file to NexMedia AI storage using Base64, returning a reusable public media_url.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        file_base64 = new { type = "string", description = "Base64 encoded string of the file content" },
                                        file_name = new { type = "string", description = "File name with extension (e.g. photo.jpg, audio.mp3, video.mp4)", @default = "file.dat" },
                                        mime_type = new { type = "string", description = "MIME type (e.g. image/jpeg, audio/mpeg, video/mp4)", @default = "application/octet-stream" }
                                    },
                                    required = new[] { "file_base64" }
                                }
                            },
                            new
                            {
                                name = "generate_video",
                                description = "Generate cinematic AI video from text using Google Veo, ByteDance Seedance, or xAI Grok. Pre-checks credits safely before running.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        prompt = new { type = "string", description = "Detailed scene description (up to 5000 characters)" },
                                        model = new { type = "string", description = "veo, seedance, or grok", @default = "veo" },
                                        resolution = new { type = "string", description = "720p, 1080p, or 4k", @default = "1080p" },
                                        aspect_ratio = new { type = "string", description = "16:9, 9:16, or 1:1", @default = "16:9" },
                                        duration = new { type = "number", description = "Duration in seconds (e.g. 5, 8, 10)", @default = 5 },
                                        audio = new { type = "boolean", description = "Enable synchronized AI audio/sound effects", @default = true }
                                    },
                                    required = new[] { "prompt" }
                                }
                            },
                            new
                            {
                                name = "image_to_video",
                                description = "Animate an image into an AI video. Accepts either image_url or image_base64. Pre-checks credits safely.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        image_url = new { type = "string", description = "Public URL of the source image" },
                                        image_base64 = new { type = "string", description = "Base64 encoded source image (alternative to image_url)" },
                                        prompt = new { type = "string", description = "Motion and animation description (up to 5000 characters)" },
                                        model = new { type = "string", description = "veo, seedance, or grok", @default = "veo" },
                                        resolution = new { type = "string", description = "720p, 1080p, or 4k", @default = "1080p" },
                                        aspect_ratio = new { type = "string", description = "16:9, 9:16, or 1:1", @default = "16:9" },
                                        duration = new { type = "number", description = "Duration in seconds (e.g. 5, 8, 10)", @default = 5 },
                                        audio = new { type = "boolean", description = "Enable synchronized audio", @default = true }
                                    }
                                }
                            },
                            new
                            {
                                name = "reference_to_video",
                                description = "Generate video conditioned on one or more reference images. Accepts reference_image_urls or reference_image_base64.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        reference_image_urls = new { type = "array", items = new { type = "string" }, description = "List of reference image URLs" },
                                        reference_image_base64 = new { type = "string", description = "Base64 encoded reference image (if not using URLs)" },
                                        prompt = new { type = "string", description = "Scene and story description (up to 5000 characters)" },
                                        model = new { type = "string", description = "veo, seedance, or grok", @default = "veo" },
                                        resolution = new { type = "string", description = "720p, 1080p, or 4k", @default = "1080p" },
                                        aspect_ratio = new { type = "string", description = "16:9, 9:16, or 1:1", @default = "16:9" },
                                        duration = new { type = "number", description = "Duration in seconds", @default = 5 }
                                    },
                                    required = new[] { "prompt" }
                                }
                            },
                            new
                            {
                                name = "generate_image",
                                description = "Generate ultra high-resolution AI images using Grok Imagine or Flux Pro/Dev. Pre-checks credits safely before running.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        prompt = new { type = "string", description = "Detailed image prompt (up to 5000 characters)" },
                                        model = new { type = "string", description = "grok-imagine, flux-pro, flux-schnell", @default = "grok-imagine" },
                                        aspect_ratio = new { type = "string", description = "1:1, 16:9, 9:16, 4:3, 3:4", @default = "1:1" }
                                    },
                                    required = new[] { "prompt" }
                                }
                            },
                            new
                            {
                                name = "generate_voice",
                                description = "Convert text to natural human speech (TTS) using AI voices with emotion and style control. Pre-checks credits safely.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        text = new { type = "string", description = "Text to speak (up to 5000 characters)" },
                                        voice_name = new { type = "string", description = "Voice persona name (call get_available_voices to list options)", @default = "Alloy" },
                                        language = new { type = "string", description = "Language code (e.g. ar, en, fr, de)", @default = "ar" },
                                        quality = new { type = "string", description = "Standard or Premium", @default = "Standard" },
                                        custom_instructions = new { type = "string", description = "Optional emotion/tone instructions (e.g. energetic, whispering, professional)" }
                                    },
                                    required = new[] { "text" }
                                }
                            },
                            new
                            {
                                name = "get_available_voices",
                                description = "List all available AI text-to-speech voices with gender, accent, language, and demo sample links.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new { }
                                }
                            },
                            new
                            {
                                name = "transcribe_audio",
                                description = "Transcribe spoken audio or speech to text (STT) with optional translation. Accepts audio_url or audio_base64.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        audio_url = new { type = "string", description = "Public URL of audio file" },
                                        audio_base64 = new { type = "string", description = "Base64 encoded audio file (alternative to audio_url)" },
                                        translate = new { type = "boolean", description = "Translate speech to target language", @default = false },
                                        target_language = new { type = "string", description = "Target language code (e.g. en, ar)", @default = "en" }
                                    }
                                }
                            },
                            new
                            {
                                name = "avatar_to_video",
                                description = "Generate realistic speaking avatar video from a portrait image and optional audio/text using Kling Avatar. Accepts avatar_image_url or avatar_image_base64.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        avatar_image_url = new { type = "string", description = "Public URL of the portrait avatar image" },
                                        avatar_image_base64 = new { type = "string", description = "Base64 encoded portrait avatar image" },
                                        audio_url = new { type = "string", description = "Optional public URL of audio track" },
                                        audio_base64 = new { type = "string", description = "Optional Base64 encoded audio track" },
                                        prompt = new { type = "string", description = "Optional speech or movement prompt" },
                                        rendering_speed = new { type = "string", description = "fast or quality", @default = "quality" }
                                    }
                                }
                            },
                            new
                            {
                                name = "lip_sync",
                                description = "Synchronize video lips with an audio track using Vidu Advanced LipSync. Accepts video_url/video_base64 and audio_url/audio_base64.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        video_url = new { type = "string", description = "Public URL of the video file" },
                                        video_base64 = new { type = "string", description = "Base64 encoded video file" },
                                        audio_url = new { type = "string", description = "Public URL of the audio file" },
                                        audio_base64 = new { type = "string", description = "Base64 encoded audio file" },
                                        rendering_speed = new { type = "string", description = "fast or quality", @default = "quality" }
                                    }
                                }
                            },
                            new
                            {
                                name = "motion_control",
                                description = "Transfer movement from a source video to a character image using Kling Motion Control. Accepts character_image_url/base64 and motion_video_url/base64.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        character_image_url = new { type = "string", description = "Public URL of character image" },
                                        character_image_base64 = new { type = "string", description = "Base64 encoded character image" },
                                        motion_video_url = new { type = "string", description = "Public URL of motion source video" },
                                        motion_video_base64 = new { type = "string", description = "Base64 encoded motion source video" },
                                        prompt = new { type = "string", description = "Optional motion control guidance prompt" },
                                        resolution = new { type = "string", description = "720p or 1080p", @default = "720p" },
                                        orientation = new { type = "string", description = "video or image", @default = "video" },
                                        keep_original_sound = new { type = "boolean", description = "Keep sound from source video", @default = true },
                                        rendering_speed = new { type = "string", description = "fast or quality", @default = "quality" }
                                    }
                                }
                            },
                            new
                            {
                                name = "check_task_status",
                                description = "Check the real-time processing status and get the download URL of any generated task on NexMedia AI.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        task_id = new { type = "string", description = "UUID taskId returned from any generation tool" }
                                    },
                                    required = new[] { "task_id" }
                                }
                            }
                        }
                    };
                    break;

                case "tools/call":
                    var (res, err) = await HandleToolCallAsync(session.UserId, paramsElem);
                    responseResult = res;
                    responseError = err;
                    break;

                default:
                    responseError = new { code = -32601, message = $"Method '{method}' not found" };
                    break;
            }

            var rpcResponse = new
            {
                jsonrpc = "2.0",
                id = id,
                result = responseResult,
                error = responseError
            };

            string responseJson = JsonSerializer.Serialize(rpcResponse, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

            // Send via SSE
            await session.SendEventAsync("message", responseJson);

            // Also return in HTTP POST body
            return Content(responseJson, "application/json");
        }

        private async Task<(object? Result, object? Error)> HandleToolCallAsync(Guid userId, JsonElement paramsElem)
        {
            string toolName = paramsElem.TryGetProperty("name", out var nProp) ? nProp.GetString() ?? "" : "";
            JsonElement args = paramsElem.TryGetProperty("arguments", out var aProp) ? aProp : default;

            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return (null, new { code = -32000, message = "User not found" });
            }

            switch (toolName)
            {
                case "get_user_credits":
                {
                    var sub = await _dbContext.Subscriptions
                        .Include(s => s.Plan)
                        .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == "active");

                    string planName = sub?.Plan?.NameAr ?? sub?.Plan?.Name ?? "باقة مجانية / Free Tier";

                    string info = $"📊 رصيد الحساب:\n" +
                                  $"- الرصيد القياسي (Standard Credits): {user.StandardCredits:N0}\n" +
                                  $"- الرصيد المميز (Premium Credits): {user.PremiumCredits:N0}\n" +
                                  $"- خطة الاشتراك الحالية: {planName}\n" +
                                  $"- حالة الحساب: نشط (Active)";

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = info }
                        }
                    }, null);
                }

                case "estimate_cost":
                {
                    string targetTool = args.TryGetProperty("tool_name", out var tProp) ? tProp.GetString() ?? "text-to-video" : "text-to-video";
                    string model = args.TryGetProperty("model", out var mProp) ? mProp.GetString() ?? "veo" : "veo";
                    string res = args.TryGetProperty("resolution", out var rProp) ? rProp.GetString() ?? "1080p" : "1080p";
                    int dur = args.TryGetProperty("duration", out var dProp) && dProp.TryGetInt32(out var d) ? d : 5;

                    string qualityFormat = $"{model}|{res}";
                    decimal usageUnits = 1;
                    if (model.ToLower().Contains("grok") && dur > 0) usageUnits = dur;
                    else if (model.ToLower().Contains("seedance")) usageUnits = dur > 0 ? dur : 5;

                    var estimate = await _usagePolicy.EstimateCostAsync(userId, targetTool, usageUnits, usageUnits, qualityFormat, null, enforceWallet: false);

                    string estText = $"💰 تقدير تكلفة العملية ({targetTool} - {model}):\n" +
                                     $"- التكلفة التقديرية: {estimate.TotalCost} كريدت\n" +
                                     $"- رصيدك الحالي: {user.StandardCredits + user.PremiumCredits} كريدت\n" +
                                     $"- هل الرصيد كافٍ: {(estimate.IsAllowed ? "نعم ✅" : "لا ❌ (يلزم الشحن)")}";

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = estText }
                        }
                    }, null);
                }

                case "upload_media":
                {
                    string base64 = args.TryGetProperty("file_base64", out var fbProp) ? fbProp.GetString() ?? "" : "";
                    string fileName = args.TryGetProperty("file_name", out var fnProp) ? fnProp.GetString() ?? "upload.dat" : "upload.dat";
                    string mime = args.TryGetProperty("mime_type", out var mtProp) ? mtProp.GetString() ?? "application/octet-stream" : "application/octet-stream";

                    if (string.IsNullOrWhiteSpace(base64))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "يرجى تقديم بيانات الملف بصيغة Base64 في حقل file_base64." } }
                        }, null);
                    }

                    string ext = Path.GetExtension(fileName);
                    if (string.IsNullOrEmpty(ext)) ext = ".dat";

                    var (bytes, ct, mediaUrl, err) = await ResolveMediaAsync(null, base64, ext, mime);
                    if (!string.IsNullOrEmpty(err) || string.IsNullOrEmpty(mediaUrl))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = $"فشل رفع الملف: {err}" } }
                        }, null);
                    }

                    string uploadResult = $"✅ تم رفع الملف بنجاح إلى منصة NexMedia AI!\n" +
                                         $"- رابط الملف (Media URL): {mediaUrl}\n" +
                                         $"- اسم الملف: {fileName}\n" +
                                         $"- الحجم: {bytes.Length:N0} بايت\n" +
                                         $"- نوع المحتوى: {ct}\n\n" +
                                         $"💡 يمكنك الآن استخدام هذا الرابط مباشرة في أي أداة (توليد الفيديو، تحريك الصور، مزامنة الشفاه، إلخ).";

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = uploadResult }
                        }
                    }, null);
                }

                case "generate_video":
                {
                    string prompt = args.TryGetProperty("prompt", out var pProp) ? pProp.GetString() ?? "" : "";
                    if (string.IsNullOrWhiteSpace(prompt))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "يرجى إدخال وصف المشهد (Prompt)." } }
                        }, null);
                    }

                    string model = args.TryGetProperty("model", out var mProp) ? mProp.GetString() ?? "veo" : "veo";
                    string resolution = args.TryGetProperty("resolution", out var rProp) ? rProp.GetString() ?? "1080p" : "1080p";
                    string aspectRatio = args.TryGetProperty("aspect_ratio", out var arProp) ? arProp.GetString() ?? "16:9" : "16:9";
                    int duration = args.TryGetProperty("duration", out var dProp) && dProp.TryGetInt32(out var d) ? d : 5;
                    bool audio = !args.TryGetProperty("audio", out var aBoolProp) || aBoolProp.GetBoolean();

                    string qualityFormat = $"{model}|{resolution}";
                    decimal usageUnits = 1;
                    if (model.ToLower().Contains("grok") && duration > 0) usageUnits = duration;
                    else if (model.ToLower().Contains("seedance")) usageUnits = duration > 0 ? duration : 5;

                    // 1. CREDIT VALIDATION & CHARGE
                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "text-to-video", usageUnits, usageUnits, qualityFormat, null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لإتمام عملية توليد الفيديو.\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits} (Standard) / {user.PremiumCredits} (Premium)\n" +
                                            $"• السبب: {policyResult.ErrorMessage}\n\n" +
                                            $"🔗 يمكنك ترقية باقتك أو شحن الرصيد مباشرة عبر: https://nexmediaai.com/pricing";

                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = deficitMsg } }
                        }, null);
                    }

                    string cleanTitle = prompt.Trim().Length > 80 ? prompt.Trim().Substring(0, 77) + "..." : prompt.Trim();

                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "text-to-video",
                        Title = cleanTitle,
                        InputText = prompt,
                        Status = "processing",
                        ResultText = "initializing",
                        CreatedAt = DateTime.UtcNow,
                        CreditsUsed = policyResult.TotalCost,
                        MetadataJson = JsonSerializer.Serialize(new
                        {
                            model = model,
                            resolution = resolution,
                            aspectRatio = aspectRatio,
                            duration = duration,
                            audioEnabled = audio
                        })
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    var message = new VideoToolMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        ToolType = "text-to-video",
                        Prompt = prompt,
                        Model = model,
                        Resolution = resolution,
                        Duration = duration,
                        AspectRatio = aspectRatio,
                        AudioEnabled = audio
                    };

                    _backgroundJobClient.Enqueue<VideoToolConsumer>(c => c.Consume(message));

                    string successMsg = $"🎬 تم بدء مهمة توليد الفيديو بنجاح عبر ({model.ToUpper()})!\n" +
                                        $"- رقم المهمة (Task ID): {history.Id}\n" +
                                        $"- الدقة: {resolution} | الأبعاد: {aspectRatio}\n" +
                                        $"- تم خصم: {policyResult.TotalCost} كريدت\n\n" +
                                        $"💡 لمتابعة حالة الفيديو وجلب رابط التحميل، استخدم أداة check_task_status مع الـ Task ID.";

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = successMsg }
                        }
                    }, null);
                }

                case "image_to_video":
                {
                    string imgUrl = args.TryGetProperty("image_url", out var iuProp) ? iuProp.GetString() ?? "" : "";
                    string imgBase64 = args.TryGetProperty("image_base64", out var ibProp) ? ibProp.GetString() ?? "" : "";
                    string prompt = args.TryGetProperty("prompt", out var pProp) ? pProp.GetString() ?? "" : "";
                    string model = args.TryGetProperty("model", out var mProp) ? mProp.GetString() ?? "veo" : "veo";
                    string resolution = args.TryGetProperty("resolution", out var rProp) ? rProp.GetString() ?? "1080p" : "1080p";
                    string aspectRatio = args.TryGetProperty("aspect_ratio", out var arProp) ? arProp.GetString() ?? "16:9" : "16:9";
                    int duration = args.TryGetProperty("duration", out var dProp) && dProp.TryGetInt32(out var d) ? d : 5;
                    bool audio = !args.TryGetProperty("audio", out var aBoolProp) || aBoolProp.GetBoolean();

                    if (string.IsNullOrWhiteSpace(imgUrl) && string.IsNullOrWhiteSpace(imgBase64))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "يرجى تقديم رابط الصورة (image_url) أو بيانات الصورة بصيغة Base64 (image_base64)." } }
                        }, null);
                    }

                    var (imgBytes, _, resolvedUrl, imgErr) = await ResolveMediaAsync(imgUrl, imgBase64, ".jpg", "image/jpeg");
                    if (!string.IsNullOrEmpty(imgErr) || string.IsNullOrEmpty(resolvedUrl))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = $"فشل معالجة صورة الإدخال: {imgErr}" } }
                        }, null);
                    }

                    string qualityFormat = $"{model}|{resolution}";
                    decimal usageUnits = 1;
                    if (model.ToLower().Contains("grok") && duration > 0) usageUnits = duration;
                    else if (model.ToLower().Contains("seedance")) usageUnits = duration > 0 ? duration : 5;

                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "image-to-video", usageUnits, usageUnits, qualityFormat, null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لإتمام عملية تحريك الصورة إلى فيديو.\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits} (Standard) / {user.PremiumCredits} (Premium)\n\n" +
                                            $"🔗 يمكنك ترقية باقتك أو شحن الرصيد مباشرة عبر: https://nexmediaai.com/pricing";

                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = deficitMsg } }
                        }, null);
                    }

                    string cleanTitle = !string.IsNullOrWhiteSpace(prompt)
                        ? (prompt.Trim().Length > 80 ? prompt.Trim().Substring(0, 77) + "..." : prompt.Trim())
                        : "تحريك صورة إلى فيديو";

                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "image-to-video",
                        Title = cleanTitle,
                        InputText = prompt,
                        Status = "processing",
                        ResultText = "initializing",
                        CreatedAt = DateTime.UtcNow,
                        CreditsUsed = policyResult.TotalCost,
                        MetadataJson = JsonSerializer.Serialize(new
                        {
                            model = model,
                            resolution = resolution,
                            aspectRatio = aspectRatio,
                            duration = duration,
                            audioEnabled = audio,
                            imageUrl = resolvedUrl
                        })
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    var message = new VideoToolMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        ToolType = "image-to-video",
                        Prompt = prompt,
                        Model = model,
                        Resolution = resolution,
                        Duration = duration,
                        AspectRatio = aspectRatio,
                        AudioEnabled = audio
                    };
                    message.ImageUrls.Add(resolvedUrl);

                    _backgroundJobClient.Enqueue<VideoToolConsumer>(c => c.Consume(message));

                    string successMsg = $"🎥 تم بدء مهمة تحريك الصورة إلى فيديو بنجاح عبر ({model.ToUpper()})!\n" +
                                        $"- رقم المهمة (Task ID): {history.Id}\n" +
                                        $"- الصورة المصدرية: {resolvedUrl}\n" +
                                        $"- تم خصم: {policyResult.TotalCost} كريدت\n\n" +
                                        $"💡 استخدم أداة check_task_status مع الـ Task ID لمتابعة النتيجة فور اكتمالها.";

                    return (new
                    {
                        content = new object[] { new { type = "text", text = successMsg } }
                    }, null);
                }

                case "reference_to_video":
                {
                    var imageUrls = new List<string>();
                    if (args.TryGetProperty("reference_image_urls", out var rUrlsProp) && rUrlsProp.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var item in rUrlsProp.EnumerateArray())
                        {
                            string s = item.GetString() ?? "";
                            if (!string.IsNullOrWhiteSpace(s)) imageUrls.Add(s);
                        }
                    }

                    string refBase64 = args.TryGetProperty("reference_image_base64", out var rbProp) ? rbProp.GetString() ?? "" : "";
                    if (imageUrls.Count == 0 && !string.IsNullOrWhiteSpace(refBase64))
                    {
                        var (_, _, resUrl, err) = await ResolveMediaAsync(null, refBase64, ".jpg", "image/jpeg");
                        if (!string.IsNullOrEmpty(resUrl)) imageUrls.Add(resUrl);
                    }

                    if (imageUrls.Count == 0)
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "يرجى تقديم صورة مرجعية واحدة على الأقل في reference_image_urls أو reference_image_base64." } }
                        }, null);
                    }

                    string prompt = args.TryGetProperty("prompt", out var pProp) ? pProp.GetString() ?? "" : "";
                    string model = args.TryGetProperty("model", out var mProp) ? mProp.GetString() ?? "veo" : "veo";
                    string resolution = args.TryGetProperty("resolution", out var rProp) ? rProp.GetString() ?? "1080p" : "1080p";
                    string aspectRatio = args.TryGetProperty("aspect_ratio", out var arProp) ? arProp.GetString() ?? "16:9" : "16:9";
                    int duration = args.TryGetProperty("duration", out var dProp) && dProp.TryGetInt32(out var d) ? d : 5;

                    string qualityFormat = $"{model}|{resolution}";
                    decimal usageUnits = 1;
                    if (model.ToLower().Contains("grok") && duration > 0) usageUnits = duration;
                    else if (model.ToLower().Contains("seedance")) usageUnits = duration > 0 ? duration : 5;

                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "reference-to-video", usageUnits, usageUnits, qualityFormat, null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لتوليد الفيديو المرجعي.\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits + user.PremiumCredits}\n\n" +
                                            $"🔗 شحن الرصيد: https://nexmediaai.com/pricing";

                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = deficitMsg } }
                        }, null);
                    }

                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "reference-to-video",
                        Title = prompt.Length > 80 ? prompt.Substring(0, 77) + "..." : prompt,
                        InputText = prompt,
                        Status = "processing",
                        ResultText = "initializing",
                        CreatedAt = DateTime.UtcNow,
                        CreditsUsed = policyResult.TotalCost,
                        MetadataJson = JsonSerializer.Serialize(new { model, resolution, duration, aspectRatio, imageUrls })
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    var message = new VideoToolMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        ToolType = "reference-to-video",
                        Prompt = prompt,
                        Model = model,
                        Resolution = resolution,
                        Duration = duration,
                        AspectRatio = aspectRatio,
                        ImageUrls = imageUrls
                    };

                    _backgroundJobClient.Enqueue<VideoToolConsumer>(c => c.Consume(message));

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = $"🎬 تم بدء مهمة الفيديو المرجعي بنجاح!\n- رقم المهمة (Task ID): {history.Id}\n- عدد الصور المرجعية: {imageUrls.Count}\n- تم خصم: {policyResult.TotalCost} كريدت." }
                        }
                    }, null);
                }

                case "generate_image":
                {
                    string prompt = args.TryGetProperty("prompt", out var pProp) ? pProp.GetString() ?? "" : "";
                    if (string.IsNullOrWhiteSpace(prompt))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "يرجى إدخال وصف الصورة (Prompt)." } }
                        }, null);
                    }

                    string model = args.TryGetProperty("model", out var mProp) ? mProp.GetString() ?? "grok-imagine" : "grok-imagine";
                    string aspectRatio = args.TryGetProperty("aspect_ratio", out var arProp) ? arProp.GetString() ?? "1:1" : "1:1";

                    string qualityFormat = $"{model}|Standard";
                    decimal usageUnits = 1;

                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "text-to-image", usageUnits, usageUnits, qualityFormat, null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لإتمام عملية توليد الصورة.\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits} (Standard) / {user.PremiumCredits} (Premium)\n\n" +
                                            $"🔗 يمكنك ترقية باقتك أو شحن الرصيد مباشرة عبر: https://nexmediaai.com/pricing";

                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = deficitMsg } }
                        }, null);
                    }

                    string cleanTitle = prompt.Trim().Length > 60 ? prompt.Trim().Substring(0, 57) + "..." : prompt.Trim();

                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "text-to-image",
                        Title = cleanTitle,
                        InputText = prompt,
                        Status = "processing",
                        ResultText = "initializing",
                        CreatedAt = DateTime.UtcNow,
                        CreditsUsed = policyResult.TotalCost,
                        MetadataJson = JsonSerializer.Serialize(new
                        {
                            model = model,
                            aspectRatio = aspectRatio
                        })
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    var message = new ImageToolMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        Prompt = prompt,
                        Model = model,
                        AspectRatio = aspectRatio
                    };

                    _backgroundJobClient.Enqueue<ImageToolConsumer>(c => c.Consume(message));

                    string successMsg = $"🎨 تم بدء مهمة توليد الصورة بنجاح عبر ({model.ToUpper()})!\n" +
                                        $"- رقم المهمة (Task ID): {history.Id}\n" +
                                        $"- الأبعاد: {aspectRatio}\n" +
                                        $"- تم خصم: {policyResult.TotalCost} كريدت\n\n" +
                                        $"💡 استخدم أداة check_task_status مع الـ Task ID لمتابعة الرابط فور انتهائها.";

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = successMsg }
                        }
                    }, null);
                }

                case "generate_voice":
                {
                    string text = args.TryGetProperty("text", out var tProp) ? tProp.GetString() ?? "" : "";
                    if (string.IsNullOrWhiteSpace(text))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "يرجى كتابة النص المراد تحويله إلى صوت." } }
                        }, null);
                    }

                    if (text.Length > 5000)
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = $"طول النص ({text.Length}) يتجاوز الحد الأقصى المسموح (5000 حرف)." } }
                        }, null);
                    }

                    string voiceName = args.TryGetProperty("voice_name", out var vnProp) ? vnProp.GetString() ?? "Alloy" : "Alloy";
                    string language = args.TryGetProperty("language", out var lProp) ? lProp.GetString() ?? "ar" : "ar";
                    string quality = args.TryGetProperty("quality", out var qProp) ? qProp.GetString() ?? "Standard" : "Standard";
                    string instructions = args.TryGetProperty("custom_instructions", out var ciProp) ? ciProp.GetString() ?? "" : "";

                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "text-to-voice", text.Length, null, quality, null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لتحويل النص إلى صوت.\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits + user.PremiumCredits} كريدت\n\n" +
                                            $"🔗 شحن الرصيد: https://nexmediaai.com/pricing";

                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = deficitMsg } }
                        }, null);
                    }

                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "text-to-voice",
                        Title = text.Length > 40 ? text.Substring(0, 37) + "..." : text,
                        InputText = text,
                        Status = "processing",
                        Lang = language,
                        Voice = voiceName,
                        CreditsUsed = policyResult.TotalCost
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    _backgroundJobClient.Enqueue<TtsConsumer>(c => c.Consume(new TextToVoiceMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        Text = text,
                        Language = language,
                        VoiceName = voiceName,
                        Quality = quality,
                        StyleInstruction = instructions,
                        StandardCost = policyResult.StandardCreditsCharged,
                        PremiumCost = policyResult.PremiumCreditsCharged
                    }));

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = $"🎙️ تم بدء مهمة توليد الصوت بنجاح!\n- رقم المهمة (Task ID): {history.Id}\n- الصوت: {voiceName} | اللغة: {language}\n- تم خصم: {policyResult.TotalCost} كريدت." }
                        }
                    }, null);
                }

                case "get_available_voices":
                {
                    var voices = _ttsCatalog.GetAllVoices(includeInactive: false)
                        .OrderBy(v => v.Order)
                        .Select(v => new
                        {
                            voiceName = v.VoiceName,
                            displayName = v.Name,
                            accent = v.Accent,
                            gender = v.Gender,
                            isPremium = v.IsPremium
                        })
                        .ToList();

                    var sb = new StringBuilder("🎙️ قائمة الأصوات المتوفرة في المنصة:\n\n");
                    foreach (var v in voices)
                    {
                        sb.AppendLine($"• {v.displayName} ({v.voiceName}) - {v.gender} - لهجة: {v.accent} {(v.isPremium ? "⭐ [مميز]" : "")}");
                    }

                    return (new
                    {
                        content = new object[] { new { type = "text", text = sb.ToString() } }
                    }, null);
                }

                case "transcribe_audio":
                {
                    string aUrl = args.TryGetProperty("audio_url", out var auProp) ? auProp.GetString() ?? "" : "";
                    string aBase64 = args.TryGetProperty("audio_base64", out var abProp) ? abProp.GetString() ?? "" : "";
                    bool translate = args.TryGetProperty("translate", out var trProp) && trProp.GetBoolean();
                    string targetLang = args.TryGetProperty("target_language", out var tlProp) ? tlProp.GetString() ?? "en" : "en";

                    if (string.IsNullOrWhiteSpace(aUrl) && string.IsNullOrWhiteSpace(aBase64))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "يرجى تقديم رابط الملف الصوتي (audio_url) أو Base64 (audio_base64)." } }
                        }, null);
                    }

                    var (audioBytes, _, resolvedUrl, aErr) = await ResolveMediaAsync(aUrl, aBase64, ".mp3", "audio/mpeg");
                    if (!string.IsNullOrEmpty(aErr) || string.IsNullOrEmpty(resolvedUrl))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = $"فشل جلب الملف الصوتي: {aErr}" } }
                        }, null);
                    }

                    double durSeconds = EstimateDurationSeconds(audioBytes, ".mp3");
                    double durMinutes = Math.Ceiling(durSeconds / 60.0);
                    if (durMinutes < 1) durMinutes = 1;

                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "voice-to-text", audioBytes.Length, (decimal)durMinutes, "Standard", null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لتفريغ الصوت.\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits + user.PremiumCredits}\n\n" +
                                            $"🔗 شحن الرصيد: https://nexmediaai.com/pricing";

                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = deficitMsg } }
                        }, null);
                    }

                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "voice-to-text",
                        Title = resolvedUrl.Split('/').LastOrDefault() ?? "Audio Transcription",
                        FileUrl = resolvedUrl,
                        Status = "processing",
                        Lang = targetLang,
                        CreditsUsed = policyResult.TotalCost
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    _backgroundJobClient.Enqueue<VttConsumer>(c => c.Consume(new VoiceToTextMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        FileId = resolvedUrl,
                        Translate = translate,
                        TargetLanguage = targetLang,
                        StandardCost = policyResult.StandardCreditsCharged,
                        PremiumCost = policyResult.PremiumCreditsCharged
                    }));

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = $"📝 تم بدء مهمة تفريغ الصوت بنجاح!\n- رقم المهمة (Task ID): {history.Id}\n- المدة التقديرية: {durMinutes} دقيقة\n- تم خصم: {policyResult.TotalCost} كريدت." }
                        }
                    }, null);
                }

                case "avatar_to_video":
                {
                    string avUrl = args.TryGetProperty("avatar_image_url", out var avuProp) ? avuProp.GetString() ?? "" : "";
                    string avBase64 = args.TryGetProperty("avatar_image_base64", out var avbProp) ? avbProp.GetString() ?? "" : "";
                    string prompt = args.TryGetProperty("prompt", out var pProp) ? pProp.GetString() ?? "" : "";
                    string audUrl = args.TryGetProperty("audio_url", out var auProp) ? auProp.GetString() ?? "" : "";
                    string audBase64 = args.TryGetProperty("audio_base64", out var abProp) ? abProp.GetString() ?? "" : "";
                    string speed = args.TryGetProperty("rendering_speed", out var sProp) ? sProp.GetString() ?? "quality" : "quality";

                    if (string.IsNullOrWhiteSpace(avUrl) && string.IsNullOrWhiteSpace(avBase64))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "صورة الأفاتار مطلوبة (avatar_image_url أو avatar_image_base64)." } }
                        }, null);
                    }

                    var (imgBytes, imgCt, _, imgErr) = await ResolveMediaAsync(avUrl, avBase64, ".jpg", "image/jpeg");
                    if (!string.IsNullOrEmpty(imgErr) || imgBytes.Length == 0)
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = $"خطأ في صورة الأفاتار: {imgErr}" } }
                        }, null);
                    }

                    byte[] audBytes = Array.Empty<byte>();
                    string audCt = "audio/mpeg";
                    if (!string.IsNullOrWhiteSpace(audUrl) || !string.IsNullOrWhiteSpace(audBase64))
                    {
                        var (ab, act, _, _) = await ResolveMediaAsync(audUrl, audBase64, ".mp3", "audio/mpeg");
                        audBytes = ab;
                        audCt = act;
                    }

                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "kling_avatar_image2video", 0, 1, speed, null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لتوليد فيديو الأفاتار.\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits + user.PremiumCredits}\n\n" +
                                            $"🔗 شحن الرصيد: https://nexmediaai.com/pricing";

                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = deficitMsg } }
                        }, null);
                    }

                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "image-to-video",
                        Title = "Avatar Video Generation",
                        InputText = string.IsNullOrWhiteSpace(prompt) ? "Avatar Generation" : prompt,
                        Status = "processing",
                        ResultText = "initializing",
                        CreatedAt = DateTime.UtcNow,
                        CreditsUsed = policyResult.TotalCost
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    _backgroundJobClient.Enqueue<AvatarVideoConsumer>(c => c.Consume(new AvatarVideoMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        ImageBytes = imgBytes,
                        ImageContentType = imgCt,
                        AudioBytes = audBytes,
                        AudioContentType = audCt,
                        Prompt = prompt,
                        RenderingSpeed = speed
                    }));

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = $"👤 تم بدء مهمة توليد الأفاتار المتكلم بنجاح!\n- رقم المهمة (Task ID): {history.Id}\n- السرعة: {speed}\n- تم خصم: {policyResult.TotalCost} كريدت." }
                        }
                    }, null);
                }

                case "lip_sync":
                {
                    string vUrl = args.TryGetProperty("video_url", out var vuProp) ? vuProp.GetString() ?? "" : "";
                    string vBase64 = args.TryGetProperty("video_base64", out var vbProp) ? vbProp.GetString() ?? "" : "";
                    string aUrl = args.TryGetProperty("audio_url", out var auProp) ? auProp.GetString() ?? "" : "";
                    string aBase64 = args.TryGetProperty("audio_base64", out var abProp) ? abProp.GetString() ?? "" : "";

                    if ((string.IsNullOrWhiteSpace(vUrl) && string.IsNullOrWhiteSpace(vBase64)) ||
                        (string.IsNullOrWhiteSpace(aUrl) && string.IsNullOrWhiteSpace(aBase64)))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "مطلوب كِلا ملف الفيديو والصوت (video_url/video_base64 و audio_url/audio_base64)." } }
                        }, null);
                    }

                    var (vidBytes, vidCt, _, vidErr) = await ResolveMediaAsync(vUrl, vBase64, ".mp4", "video/mp4");
                    var (audBytes, audCt, _, audErr) = await ResolveMediaAsync(aUrl, aBase64, ".mp3", "audio/mpeg");

                    if (!string.IsNullOrEmpty(vidErr) || vidBytes.Length == 0 || !string.IsNullOrEmpty(audErr) || audBytes.Length == 0)
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = $"فشل جلب ملفات المزامنة: {vidErr} {audErr}" } }
                        }, null);
                    }

                    double durSec = EstimateDurationSeconds(vidBytes, ".mp4");
                    decimal durUnits = (decimal)durSec;

                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "advanced-lip-sync", 0, durUnits, "vidu-lipsync-std", null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لمزامنة الشفاه (LipSync).\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits + user.PremiumCredits}\n\n" +
                                            $"🔗 شحن الرصيد: https://nexmediaai.com/pricing";

                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = deficitMsg } }
                        }, null);
                    }

                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "lip-sync",
                        Title = "مزامنة الشفاه الصوتية",
                        InputText = "Video & Audio LipSync",
                        Status = "processing",
                        ResultText = "initializing",
                        CreatedAt = DateTime.UtcNow,
                        CreditsUsed = policyResult.TotalCost
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    _backgroundJobClient.Enqueue<LipSyncConsumer>(c => c.Consume(new LipSyncMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        VideoBytes = vidBytes,
                        VideoFileName = "video.mp4",
                        VideoContentType = vidCt,
                        AudioBytes = audBytes,
                        AudioFileName = "audio.mp3",
                        AudioContentType = audCt,
                        Model = "vidu-lipsync-std"
                    }));

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = $"👄 تم بدء مهمة مزامنة الشفاه بنجاح!\n- رقم المهمة (Task ID): {history.Id}\n- مدة الفيديو التقديرية: {durSec:F1} ثانية\n- تم خصم: {policyResult.TotalCost} كريدت." }
                        }
                    }, null);
                }

                case "motion_control":
                {
                    string cUrl = args.TryGetProperty("character_image_url", out var cuProp) ? cuProp.GetString() ?? "" : "";
                    string cBase64 = args.TryGetProperty("character_image_base64", out var cbProp) ? cbProp.GetString() ?? "" : "";
                    string mUrl = args.TryGetProperty("motion_video_url", out var muProp) ? muProp.GetString() ?? "" : "";
                    string mBase64 = args.TryGetProperty("motion_video_base64", out var mbProp) ? mbProp.GetString() ?? "" : "";
                    string prompt = args.TryGetProperty("prompt", out var pProp) ? pProp.GetString() ?? "" : "";
                    string res = args.TryGetProperty("resolution", out var rProp) ? rProp.GetString() ?? "720p" : "720p";
                    string orientation = args.TryGetProperty("orientation", out var oProp) ? oProp.GetString() ?? "video" : "video";
                    string speed = args.TryGetProperty("rendering_speed", out var sProp) ? sProp.GetString() ?? "quality" : "quality";
                    bool sound = !args.TryGetProperty("keep_original_sound", out var sndProp) || sndProp.GetBoolean();

                    if ((string.IsNullOrWhiteSpace(cUrl) && string.IsNullOrWhiteSpace(cBase64)) ||
                        (string.IsNullOrWhiteSpace(mUrl) && string.IsNullOrWhiteSpace(mBase64)))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "مطلوب كِلا صورة الشخصية (character_image_url/base64) وفيديو الحركة (motion_video_url/base64)." } }
                        }, null);
                    }

                    var (charBytes, charCt, _, charErr) = await ResolveMediaAsync(cUrl, cBase64, ".jpg", "image/jpeg");
                    var (motBytes, motCt, _, motErr) = await ResolveMediaAsync(mUrl, mBase64, ".mp4", "video/mp4");

                    if (!string.IsNullOrEmpty(charErr) || charBytes.Length == 0 || !string.IsNullOrEmpty(motErr) || motBytes.Length == 0)
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = $"خطأ في ملفات الحركة: {charErr} {motErr}" } }
                        }, null);
                    }

                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "kling_motion_control", 0, 1, speed, null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لنقل الحركة (Motion Control).\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits + user.PremiumCredits}\n\n" +
                                            $"🔗 شحن الرصيد: https://nexmediaai.com/pricing";

                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = deficitMsg } }
                        }, null);
                    }

                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "motion-control",
                        Title = string.IsNullOrWhiteSpace(prompt) ? "نقل ومحاكاة الحركة" : prompt,
                        InputText = string.IsNullOrWhiteSpace(prompt) ? "Motion Control" : prompt,
                        Status = "processing",
                        ResultText = "initializing",
                        CreatedAt = DateTime.UtcNow,
                        CreditsUsed = policyResult.TotalCost,
                        MetadataJson = JsonSerializer.Serialize(new { resolution = res, renderingSpeed = speed, orientation = orientation, keepOriginalSound = sound })
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    _backgroundJobClient.Enqueue<MotionControlConsumer>(c => c.Consume(new MotionControlMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        ImageBytes = charBytes,
                        ImageContentType = charCt,
                        VideoBytes = motBytes,
                        VideoContentType = motCt,
                        Prompt = prompt,
                        Resolution = res,
                        RenderingSpeed = speed,
                        Orientation = orientation,
                        KeepOriginalSound = sound
                    }));

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = $"🕺 تم بدء مهمة نقل ومحاكاة الحركة بنجاح!\n- رقم المهمة (Task ID): {history.Id}\n- الدقة: {res} | الاتجاه: {orientation}\n- تم خصم: {policyResult.TotalCost} كريدت." }
                        }
                    }, null);
                }

                case "check_task_status":
                {
                    string taskIdStr = args.TryGetProperty("task_id", out var tProp) ? tProp.GetString() ?? "" : "";
                    if (!Guid.TryParse(taskIdStr, out var taskId))
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "صيغة Task ID غير صالحة. يرجى تقديم UUID صحيح." } }
                        }, null);
                    }

                    var item = await _dbContext.GenerationHistories
                        .FirstOrDefaultAsync(h => h.Id == taskId && h.UserId == userId);

                    if (item == null)
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = $"لم يتم العثور على مهمة بهذا المعرف ({taskId})." } }
                        }, null);
                    }

                    string statusIcon = item.Status switch
                    {
                        "completed" => "✅ مكتملة (Completed)",
                        "failed" => "❌ فشلت (Failed)",
                        "processing" => "⏳ قيد المعالجة (Processing)",
                        _ => "🕒 في قائمة الانتظار (Queued)"
                    };

                    string responseText = $"📌 تفاصيل حالة المهمة:\n" +
                                         $"- رقم المهمة: {item.Id}\n" +
                                         $"- النوع: {item.Type}\n" +
                                         $"- الحالة: {statusIcon}\n" +
                                         $"- وقت الإنشاء: {item.CreatedAt:yyyy-MM-dd HH:mm:ss} UTC\n";

                    if (!string.IsNullOrEmpty(item.FileUrl))
                    {
                        responseText += $"- رابط التحميل المباشر: {item.FileUrl}\n";
                    }

                    if (!string.IsNullOrEmpty(item.ErrorMessage))
                    {
                        responseText += $"- سبب الخطأ: {item.ErrorMessage}\n";
                    }

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = responseText }
                        }
                    }, null);
                }

                default:
                    return (null, new { code = -32601, message = $"Tool '{toolName}' not found" });
            }
        }
    }

    public class McpSession
    {
        public string SessionId { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public HttpResponse Response { get; set; } = null!;
        public CancellationToken CancellationToken { get; set; }

        public async Task SendEventAsync(string eventName, string data)
        {
            try
            {
                if (CancellationToken.IsCancellationRequested) return;

                string sseMessage = $"event: {eventName}\ndata: {data}\n\n";
                byte[] bytes = Encoding.UTF8.GetBytes(sseMessage);
                await Response.Body.WriteAsync(bytes, 0, bytes.Length, CancellationToken);
                await Response.Body.FlushAsync(CancellationToken);
            }
            catch { }
        }
    }
}
