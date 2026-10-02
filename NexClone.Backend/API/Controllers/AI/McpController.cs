using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public McpController(
            ApplicationDbContext dbContext,
            UsagePolicyService usagePolicy,
            IBackgroundJobClient backgroundJobClient,
            IMediaService mediaService)
        {
            _dbContext = dbContext;
            _usagePolicy = usagePolicy;
            _backgroundJobClient = backgroundJobClient;
            _mediaService = mediaService;
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
                            version = "1.0.0"
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
                                        tool_name = new { type = "string", description = "Tool type: text-to-video, image-to-video, text-to-image, lipsync, etc." },
                                        model = new { type = "string", description = "AI Model: veo-3.1, seedance-2.0, grok, etc." },
                                        duration = new { type = "number", description = "Duration in seconds (e.g. 5, 8, 10)" },
                                        resolution = new { type = "string", description = "Resolution: 720p, 1080p, 4k" }
                                    },
                                    required = new[] { "tool_name" }
                                }
                            },
                            new
                            {
                                name = "generate_video",
                                description = "Generate an AI cinematic video using Google Veo 3.1, ByteDance Seedance 2.0, or xAI Grok. Checks user credits beforehand and fails safely if balance is insufficient.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        prompt = new { type = "string", description = "Detailed scene description (up to 5000 characters)" },
                                        model = new { type = "string", description = "veo-3.1, veo-3.0, seedance-2.0, seedance-1.5, or grok", @default = "veo" },
                                        resolution = new { type = "string", description = "720p, 1080p, or 4k", @default = "1080p" },
                                        aspect_ratio = new { type = "string", description = "16:9, 9:16, or 1:1", @default = "16:9" },
                                        duration = new { type = "number", description = "Duration in seconds (e.g. 5, 8, 10)", @default = 5 },
                                        audio = new { type = "boolean", description = "Enable AI sound effects/audio", @default = true }
                                    },
                                    required = new[] { "prompt" }
                                }
                            },
                            new
                            {
                                name = "generate_image",
                                description = "Generate high-resolution AI images using Grok Imagine or Flux. Pre-checks credits safely before running.",
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
                                name = "check_task_status",
                                description = "Check the real-time processing status and get the download URL of any generated video or image.",
                                inputSchema = new
                                {
                                    type = "object",
                                    properties = new
                                    {
                                        task_id = new { type = "string", description = "UUID taskId returned from generate_video or generate_image" }
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
                    string aspectRatio = args.TryGetProperty("aspect_ratio", out var aProp2) ? aProp2.GetString() ?? "16:9" : "16:9";
                    int duration = args.TryGetProperty("duration", out var dProp) && dProp.TryGetInt32(out var d) ? d : 5;
                    bool audio = !args.TryGetProperty("audio", out var auProp) || auProp.GetBoolean();

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
                            audioEnabled = audio,
                            source = "MCP"
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

                    string successMsg = $"🎬 تم بدء توليد الفيديو بنجاح!\n" +
                                        $"- المعرف (Task ID): `{history.Id}`\n" +
                                        $"- النموذج: {model.ToUpper()}\n" +
                                        $"- الدقة والأبعاد: {resolution} • {aspectRatio}\n" +
                                        $"- المدة: {duration}s\n" +
                                        $"- الكريدت المخصوم: {policyResult.TotalCost} كريدت\n\n" +
                                        $"💡 يمكنك التحقق من النتيجة في أي وقت باستخدام أداة `check_task_status` وتمرير `task_id: \"{history.Id}\"`.";

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = successMsg }
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
                    string aspectRatio = args.TryGetProperty("aspect_ratio", out var aspectElem) ? aspectElem.GetString() ?? "1:1" : "1:1";

                    string qualityFormat = $"{model}|{aspectRatio}";
                    decimal usageUnits = 1;

                    var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "text-to-image", usageUnits, usageUnits, qualityFormat, null);
                    if (!policyResult.IsAllowed)
                    {
                        string deficitMsg = $"❌ عذراً، رصيدك غير كافٍ لإتمام عملية توليد الصورة.\n" +
                                            $"• التكلفة المطلوبة: {policyResult.TotalCost} كريدت\n" +
                                            $"• رصيدك الحالي: {user.StandardCredits} (Standard) / {user.PremiumCredits} (Premium)\n" +
                                            $"• السبب: {policyResult.ErrorMessage}\n\n" +
                                            $"🔗 يمكنك شحن الرصيد من: https://nexmediaai.com/pricing";

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
                            aspectRatio = aspectRatio,
                            source = "MCP"
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

                    string successMsg = $"🎨 تم بدء توليد الصورة بنجاح!\n" +
                                        $"- المعرف (Task ID): `{history.Id}`\n" +
                                        $"- النموذج: {model}\n" +
                                        $"- الأبعاد: {aspectRatio}\n" +
                                        $"- الكريدت المخصوم: {policyResult.TotalCost} كريدت\n\n" +
                                        $"💡 استخدم أداة `check_task_status` مع `task_id: \"{history.Id}\"` لجلب رابط الصورة فور جاهزيتها.";

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = successMsg }
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
                            content = new object[] { new { type = "text", text = "معرف المهمة (task_id) غير صالح." } }
                        }, null);
                    }

                    var history = await _dbContext.GenerationHistories
                        .AsNoTracking()
                        .FirstOrDefaultAsync(h => h.Id == taskId && h.UserId == userId);

                    if (history == null)
                    {
                        return (new
                        {
                            isError = true,
                            content = new object[] { new { type = "text", text = "المهمة غير موجودة في حسابك." } }
                        }, null);
                    }

                    string fileUrl = history.FileUrl ?? "";
                    if (!string.IsNullOrEmpty(fileUrl) && !fileUrl.StartsWith("http"))
                    {
                        fileUrl = await _mediaService.GetFileUrlAsync(fileUrl);
                    }

                    string statusMsg;
                    if (history.Status == "completed" || history.Status == "succeeded")
                    {
                        statusMsg = $"✅ اكتملت المهمة بنجاح!\n" +
                                    $"- الحالة: مكتملة (Completed)\n" +
                                    $"- رابط الملف الناتج: {fileUrl}\n" +
                                    $"- تم الإنشاء: {history.CreatedAt:yyyy-MM-dd HH:mm:ss} UTC";
                    }
                    else if (history.Status == "failed" || history.Status == "error")
                    {
                        statusMsg = $"❌ تعذرت معالجة المهمة.\n" +
                                    $"- الحالة: فشل (Failed)\n" +
                                    $"- تفاصيل: {history.ErrorMessage ?? "حدث خطأ أثناء المعالجة."}";
                    }
                    else
                    {
                        statusMsg = $"⏳ المهمة قيد المعالجة حالياً (Processing)...\n" +
                                    $"- المعرف: `{history.Id}`\n" +
                                    $"- تم إدراجها في طابور المعالجة وبانتظار الانتهاء.";
                    }

                    return (new
                    {
                        content = new object[]
                        {
                            new { type = "text", text = statusMsg }
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
        public string SessionId { get; set; } = "";
        public Guid UserId { get; set; }
        public HttpResponse Response { get; set; } = null!;
        public CancellationToken CancellationToken { get; set; }
        public SemaphoreSlim WriteLock { get; } = new SemaphoreSlim(1, 1);

        public async Task SendEventAsync(string eventName, string data)
        {
            if (CancellationToken.IsCancellationRequested) return;

            await WriteLock.WaitAsync(CancellationToken);
            try
            {
                var sb = new StringBuilder();
                if (!string.IsNullOrEmpty(eventName))
                {
                    sb.Append("event: ").Append(eventName).Append('\n');
                }
                sb.Append("data: ").Append(data).Append("\n\n");

                byte[] bytes = Encoding.UTF8.GetBytes(sb.ToString());
                await Response.Body.WriteAsync(bytes, CancellationToken);
                await Response.Body.FlushAsync(CancellationToken);
            }
            catch { }
            finally
            {
                WriteLock.Release();
            }
        }
    }
}
