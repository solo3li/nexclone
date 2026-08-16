using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Hangfire;
using NexClone.Backend.Core.Messages;
using System.IO;

namespace NexClone.Backend.API.Controllers.AI
{
    [Area("AI")]
    [Route("api/video")]
    [ApiController]
    [Authorize] // Requires JWT
    [EnableRateLimiting("ApiPolicy")]
    public class VideoController : ControllerBase
    {
        private readonly IVideoService _videoService;
        private readonly ApplicationDbContext _dbContext;
        private readonly UsagePolicyService _usagePolicy;
        private readonly IMediaService _mediaService;
        private readonly IBackgroundJobClient _backgroundJobClient;

        public VideoController(
            IVideoService videoService,
            ApplicationDbContext dbContext,
            UsagePolicyService usagePolicy,
            IMediaService mediaService,
            IBackgroundJobClient backgroundJobClient)
        {
            _videoService = videoService;
            _dbContext = dbContext;
            _usagePolicy = usagePolicy;
            _mediaService = mediaService;
            _backgroundJobClient = backgroundJobClient;
        }

        [HttpGet("estimate-avatar")]
        public async Task<IActionResult> EstimateAvatar([FromQuery] string renderingSpeed = "std", [FromQuery] int? subscriptionId = null)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var policyResult = await _usagePolicy.EstimateCostAsync(userId, "kling_avatar_image2video", 1, null, renderingSpeed, subscriptionId);
            if (!policyResult.IsAllowed) return BadRequest(new { error = policyResult.ErrorMessage });

            return Ok(new { 
                estimatedCost = policyResult.TotalCost, 

            });
        }

        [HttpGet("estimate-lipsync")]
        public async Task<IActionResult> EstimateLipSync([FromQuery] int? subscriptionId = null, [FromQuery] double? durationSeconds = null)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            // If duration provided, compute cost by exact seconds
            decimal usageUnits = 0;
            if (durationSeconds.HasValue && durationSeconds.Value > 0)
            {
                usageUnits = (decimal)durationSeconds.Value;
            }

            var policyResult = await _usagePolicy.EstimateCostAsync(userId, "advanced-lip-sync", usageUnits, usageUnits, "vidu-lipsync-std", subscriptionId);
            if (!policyResult.IsAllowed) return BadRequest(new { error = policyResult.ErrorMessage });

            return Ok(new { 
                estimatedCost = policyResult.TotalCost, 

                durationSeconds = durationSeconds,
                blocks = durationSeconds.HasValue ? (int)Math.Ceiling(durationSeconds.Value / 5.0) : (int?)null
            });
        }

        [HttpPost("start-avatar")]
        public async Task<IActionResult> StartAvatar([FromForm] IFormFile image, [FromForm] IFormFile? audio = null, [FromForm] string prompt = "The speaker talks naturally to camera", [FromForm] int? subscriptionId = null, [FromForm] string renderingSpeed = "std")
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { error = "Image is required." });
                
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Fetch policy for limits validation
            var policy = await _usagePolicy.GetToolPolicyForUserAsync(userId, "kling_avatar_image2video", renderingSpeed);
            
            if (!policy.Enabled)
                return BadRequest(new { error = "Your current plan does not have access to this tool." });

            // Validate Dynamic Limits from Plan
            if (image.Length > policy.MaxImageFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Image file is too large. Maximum size is {policy.MaxImageFileSizeMb}MB." });
                
            if (audio != null && audio.Length > policy.MaxAudioFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Audio file is too large. Maximum size is {policy.MaxAudioFileSizeMb}MB." });
                
            if (!string.IsNullOrWhiteSpace(prompt) && policy.MaxCharsPerRequest != -1 && prompt.Length > policy.MaxCharsPerRequest)
                return BadRequest(new { error = $"Prompt too long. Maximum allowed is {policy.MaxCharsPerRequest} characters." });

            // Just charge (validation is done above)
            decimal usageAmountForLimits = 0; // Handled explicitly above
            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "kling_avatar_image2video", usageAmountForLimits, 1, renderingSpeed, subscriptionId);
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });

            try
            {
                // Read files into memory so background task can use them
                byte[] imageBytes;
                using (var ms = new MemoryStream()) { await image.CopyToAsync(ms); imageBytes = ms.ToArray(); }
                string imageContentType = image.ContentType;

                byte[] audioBytes = null;
                string audioContentType = null;
                if (audio != null)
                {
                    using (var ms = new MemoryStream()) { await audio.CopyToAsync(ms); audioBytes = ms.ToArray(); }
                    audioContentType = audio.ContentType;
                }

                // Save history as processing
                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "image-to-video",
                    Title = "Avatar Video Generation",
                    InputText = "Image Upload",
                    Status = "processing",
                    ResultText = "initializing",
                    CreatedAt = DateTime.UtcNow,
                    CreditsUsed = policyResult.TotalCost
                };
                _dbContext.GenerationHistories.Add(history);
                await _dbContext.SaveChangesAsync();

                // Publish to Hangfire
                _backgroundJobClient.Enqueue<NexClone.Backend.Infrastructure.Consumers.AvatarVideoConsumer>(
                    c => c.Consume(new AvatarVideoMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        ImageBytes = imageBytes,
                        ImageContentType = imageContentType,
                        AudioBytes = audioBytes,
                        AudioContentType = audioContentType,
                        Prompt = prompt,
                        RenderingSpeed = renderingSpeed
                    })
                );
                return Ok(new { taskId = history.Id.ToString(), status = "processing", message = "Task has been added to the queue.", standardCredits = (await _dbContext.Users.FindAsync(userId))?.StandardCredits ?? 0, premiumCredits = (await _dbContext.Users.FindAsync(userId))?.PremiumCredits ?? 0 });
            }
            catch (Exception ex)
            {
                await _usagePolicy.RefundAsync(userId, policyResult.StandardCreditsCharged, policyResult.PremiumCreditsCharged);
                return StatusCode(500, new { error = "An error occurred while queuing the video task: " + ex.Message });
            }
        }

        [HttpPost("start-lipsync")]
        public async Task<IActionResult> StartLipSync(
            [FromForm] IFormFile video, 
            [FromForm] IFormFile audio, 
            [FromForm] string model = "default", 
            [FromForm] string accuracy = "high", 
            [FromForm] string resolution = "1080p", 
            [FromForm] string expression = "natural", 
            [FromForm] int? subscriptionId = null)
        {
            if (video == null || video.Length == 0 || audio == null || audio.Length == 0)
                return BadRequest(new { error = "Video and Audio are required." });

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Fetch policy for limits validation
            var policy = await _usagePolicy.GetToolPolicyForUserAsync(userId, "advanced-lip-sync");
            
            if (!policy.Enabled)
                return BadRequest(new { error = "Your current plan does not have access to this tool." });

            // Validate Dynamic Limits from Plan
            if (video.Length > policy.MaxVideoFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Video file is too large. Maximum size is {policy.MaxVideoFileSizeMb}MB." });
                
            if (audio.Length > policy.MaxAudioFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Audio file is too large. Maximum size is {policy.MaxAudioFileSizeMb}MB." });

            // Read files into memory
            byte[] videoBytes;
            byte[] audioBytes;
            using (var ms = new MemoryStream()) { await video.CopyToAsync(ms); videoBytes = ms.ToArray(); }
            using (var ms = new MemoryStream()) { await audio.CopyToAsync(ms); audioBytes = ms.ToArray(); }

            // Calculate duration
            double durationSeconds = 5.0;
            try
            {
                var extension = System.IO.Path.GetExtension(video.FileName);
                if (string.IsNullOrEmpty(extension)) extension = ".mp4";
                var tempFile = System.IO.Path.Combine(System.IO.Path.GetTempPath(), Guid.NewGuid().ToString() + extension);
                try
                {
                    System.IO.File.WriteAllBytes(tempFile, videoBytes);
                    using (var tfile = TagLib.File.Create(tempFile))
                    {
                        durationSeconds = tfile.Properties.Duration.TotalSeconds;
                    }
                }
                finally
                {
                    if (System.IO.File.Exists(tempFile)) System.IO.File.Delete(tempFile);
                }
                if (durationSeconds <= 0) durationSeconds = 5.0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WARNING] TagLib failed for LipSync duration. Fallback to 5s. Error: {ex.Message}");
            }

            // Use exact duration in seconds for cost calculation
            decimal durationUnits = (decimal)durationSeconds;
            if (durationUnits < 0) durationUnits = 0;

            if (durationSeconds > policy.MaxDurationSeconds)
            {
                return BadRequest(new { error = $"Video duration ({durationSeconds:F1}s) exceeds your plan's maximum limit of {policy.MaxDurationSeconds}s." });
            }

            // Just charge
            decimal usageAmountForLimits = 0; // Handled explicitly above
            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "advanced-lip-sync", usageAmountForLimits, durationUnits, "vidu-lipsync-std", subscriptionId);
            
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });
            
            try
            {
                string videoFileName = video.FileName;
                string videoContentType = video.ContentType;
                string audioFileName = audio.FileName;
                string audioContentType = audio.ContentType;

                // Save history
                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "lip-sync",
                    Title = "Lip Sync Generation",
                    InputText = "Video and Audio Upload",
                    Status = "processing",
                    ResultText = "initializing",
                    CreatedAt = DateTime.UtcNow,
                    CreditsUsed = policyResult.TotalCost
                };
                _dbContext.GenerationHistories.Add(history);
                await _dbContext.SaveChangesAsync();

                // Publish to Hangfire
                _backgroundJobClient.Enqueue<NexClone.Backend.Infrastructure.Consumers.LipSyncConsumer>(
                    c => c.Consume(new LipSyncMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        VideoBytes = videoBytes,
                        VideoFileName = videoFileName,
                        VideoContentType = videoContentType,
                        AudioBytes = audioBytes,
                        AudioFileName = audioFileName,
                        AudioContentType = audioContentType,
                        Model = model,
                        Accuracy = accuracy,
                        Resolution = resolution,
                        Expression = expression
                    })
                );

                var updatedUserLipsync = await _dbContext.Users.FindAsync(userId);
                return Ok(new { taskId = history.Id.ToString(), status = "processing", message = "Task has been added to the queue.", standardCredits = updatedUserLipsync?.StandardCredits ?? 0, premiumCredits = updatedUserLipsync?.PremiumCredits ?? 0 });
            }
            catch (Exception ex)
            {
                await _usagePolicy.RefundAsync(userId, policyResult.StandardCreditsCharged, policyResult.PremiumCreditsCharged);
                return StatusCode(500, new { error = "An error occurred while uploading files: " + ex.Message });
            }
        }


        [HttpGet("status/{taskId}")]
        public async Task<IActionResult> CheckStatus(string taskId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (Guid.TryParse(taskId, out var historyId))
            {
                var history = await _dbContext.GenerationHistories
                    .FirstOrDefaultAsync(h => h.Id == historyId && h.UserId == userId);
                
                if (history != null)
                {
                    return Ok(new { status = history.Status, url = history.FileUrl, error = history.ErrorMessage });
                }
            }

            // Fallback for older image-to-video tasks that might use CometAPI task id directly
            var result = await _videoService.CheckTaskStatusAsync(taskId);

            if (result.Status == "succeeded" || result.Status == "failed")
            {
                var history = await _dbContext.GenerationHistories
                    .FirstOrDefaultAsync(h => h.UserId == userId && h.ResultText == taskId && h.Status == "processing");

                if (history != null)
                {
                    history.Status = result.Status;
                    if (result.Status == "succeeded")
                    {
                        history.FileUrl = result.OutputUrl;
                    }
                    else
                    {
                        history.ErrorMessage = result.ErrorMessage;
                        
                        string toolName = history.Type == "image-to-video" ? "kling_avatar_image2video" : 
                                          history.Type == "lip-sync" ? "lipsync" : "UNKNOWN";
                        
                        if (toolName != "UNKNOWN" && history.CreditsUsed > 0)
                        {
                            await _usagePolicy.RefundByToolAsync(userId, toolName, history.CreditsUsed);
                        }
                    }
                    await _dbContext.SaveChangesAsync();
                }
            }

            return Ok(new { status = result.Status, url = result.OutputUrl, error = result.ErrorMessage });
        }


        [HttpGet("estimate-motion-control")]
        public async Task<IActionResult> EstimateMotionControl([FromQuery] string resolution = "720p", [FromQuery] string renderingSpeed = "std", [FromQuery] int? subscriptionId = null)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var policyResult = await _usagePolicy.EstimateCostAsync(userId, "kling_motion_control", 1, null, renderingSpeed, subscriptionId);
            if (!policyResult.IsAllowed) return BadRequest(new { error = policyResult.ErrorMessage });

            return Ok(new { 
                estimatedCost = policyResult.TotalCost, 

            });
        }

        [HttpGet("estimate-tool/{toolType}")]
        public async Task<IActionResult> EstimateTool(string toolType, [FromQuery] string model = "veo", [FromQuery] string resolution = "1080p", [FromQuery] int duration = 0, [FromQuery] int? subscriptionId = null)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (toolType != "text-to-video" && toolType != "image-to-video" && toolType != "reference-to-video")
                return BadRequest(new { error = "Invalid tool type." });

            string qualityFormat = $"{model}|{resolution}";
            decimal usageUnits = model == "grok" && duration > 0 ? duration : 1;

            var policyResult = await _usagePolicy.EstimateCostAsync(userId, toolType, usageUnits, usageUnits, qualityFormat, subscriptionId);
            if (!policyResult.IsAllowed) return BadRequest(new { error = policyResult.ErrorMessage });

            return Ok(new { estimatedCost = policyResult.TotalCost });
        }

        [HttpPost("start-motion-control")]
        public async Task<IActionResult> StartMotionControl(
            [FromForm] IFormFile image, 
            [FromForm] IFormFile video, 
            [FromForm] string prompt = "", 
            [FromForm] string resolution = "720p", 
            [FromForm] string renderingSpeed = "std",
            [FromForm] string orientation = "front",
            [FromForm] bool keepOriginalSound = false,
            [FromForm] int? subscriptionId = null)
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { error = "Image is required." });
            if (video == null || video.Length == 0)
                return BadRequest(new { error = "Video is required." });

            var mcSetting = await _dbContext.MotionControlSettings.FirstOrDefaultAsync();
            if (mcSetting != null && !mcSetting.IsActive)
                return BadRequest(new { error = "Motion Control is currently disabled." });

            long maxImgMb = mcSetting?.MaxImageFileSizeMb ?? 25;
            if (image.Length > maxImgMb * 1024 * 1024)
                return BadRequest(new { error = $"Image file exceeds the maximum allowed limit of {maxImgMb}MB." });

            long maxVidMb = mcSetting?.MaxVideoFileSizeMb ?? 100;
            if (video.Length > maxVidMb * 1024 * 1024)
                return BadRequest(new { error = $"Video file exceeds the maximum allowed limit of {maxVidMb}MB." });
                
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Fetch policy for limits validation
            var policy = await _usagePolicy.GetToolPolicyForUserAsync(userId, "kling_motion_control", renderingSpeed);
            
            if (!policy.Enabled)
                return BadRequest(new { error = "Your current plan does not have access to this tool." });

            // Validate Dynamic Limits from Plan
            if (image.Length > policy.MaxImageFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Image file is too large. Maximum size is {policy.MaxImageFileSizeMb}MB." });
                
            if (video.Length > policy.MaxVideoFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Video file is too large. Maximum size is {policy.MaxVideoFileSizeMb}MB." });
                
            if (!string.IsNullOrWhiteSpace(prompt) && policy.MaxCharsPerRequest != -1 && prompt.Length > policy.MaxCharsPerRequest)
                return BadRequest(new { error = $"Prompt too long. Maximum allowed is {policy.MaxCharsPerRequest} characters." });

            decimal usageAmountForLimits = 0; 
            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "kling_motion_control", usageAmountForLimits, 1, renderingSpeed, subscriptionId);
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });

            try
            {
                byte[] imageBytes;
                using (var ms = new MemoryStream()) { await image.CopyToAsync(ms); imageBytes = ms.ToArray(); }
                string imageContentType = image.ContentType;

                byte[] videoBytes;
                using (var ms = new MemoryStream()) { await video.CopyToAsync(ms); videoBytes = ms.ToArray(); }
                string videoContentType = video.ContentType;

                // Save history as processing
                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "motion-control",
                    Title = "Motion Control Video Generation",
                    InputText = "Image & Video Upload",
                    Status = "processing",
                    ResultText = "initializing",
                    CreatedAt = DateTime.UtcNow,
                    CreditsUsed = policyResult.TotalCost
                };
                _dbContext.GenerationHistories.Add(history);
                await _dbContext.SaveChangesAsync();

                // Publish to Hangfire
                _backgroundJobClient.Enqueue<NexClone.Backend.Infrastructure.Consumers.MotionControlConsumer>(
                    c => c.Consume(new MotionControlMessage
                    {
                        HistoryId = history.Id,
                        UserId = userId,
                        ImageBytes = imageBytes,
                        ImageContentType = imageContentType,
                        VideoBytes = videoBytes,
                        VideoContentType = videoContentType,
                        Prompt = prompt,
                        Resolution = resolution,
                        RenderingSpeed = renderingSpeed,
                        Orientation = orientation,
                        KeepOriginalSound = keepOriginalSound
                    })
                );

                var updatedUserMotion = await _dbContext.Users.FindAsync(userId);
                // Return OK immediately so frontend can show the Wait/Leave UI
                return Ok(new { taskId = history.Id.ToString(), status = "processing", message = "Task has been added to the queue.", standardCredits = updatedUserMotion?.StandardCredits ?? 0, premiumCredits = updatedUserMotion?.PremiumCredits ?? 0 });
            }
            catch (Exception ex)
            {
                await _usagePolicy.RefundAsync(userId, policyResult.StandardCreditsCharged, policyResult.PremiumCreditsCharged);
                return StatusCode(500, new { error = "An error occurred while queuing the video task: " + ex.Message });
            }
        }


        [HttpPost("start-tool/{toolType}")]
        public async Task<IActionResult> StartVideoTool(
            string toolType,
            [FromForm] System.Collections.Generic.List<IFormFile> images,
            [FromForm] string prompt = "",
            [FromForm] string model = "veo",
            [FromForm] string resolution = "1080p",
            [FromForm] string mode = "",
            [FromForm] int duration = 0,
            [FromForm] string aspectRatio = "16:9",
            [FromForm] int? subscriptionId = null)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Here we assume "toolType" is one of: text-to-video, image-to-video, reference-to-video
            if (toolType != "text-to-video" && toolType != "image-to-video" && toolType != "reference-to-video")
                return BadRequest(new { error = "Invalid tool type." });

            if (toolType == "image-to-video" && (images == null || images.Count == 0))
                return BadRequest(new { error = "An image is required for this tool." });

            if (toolType == "reference-to-video" && (images == null || images.Count == 0))
                return BadRequest(new { error = "At least one reference image is required." });

            string qualityFormat = $"{model}|{resolution}";
            decimal usageUnits = model == "grok" && duration > 0 ? duration : 1;

            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, toolType, usageUnits, usageUnits, qualityFormat, subscriptionId);
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });

            try
            {
                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = toolType,
                    Title = $"{toolType} Generation",
                    InputText = prompt,
                    Status = "processing",
                    ResultText = "initializing",
                    CreatedAt = DateTime.UtcNow,
                    CreditsUsed = policyResult.TotalCost
                };
                _dbContext.GenerationHistories.Add(history);
                await _dbContext.SaveChangesAsync();

                var message = new NexClone.Backend.Core.Messages.VideoToolMessage
                {
                    HistoryId = history.Id,
                    UserId = userId,
                    ToolType = toolType,
                    Prompt = prompt,
                    Model = model,
                    Resolution = resolution,
                    Mode = mode,
                    Duration = duration,
                    AspectRatio = aspectRatio
                };

                if (images != null && images.Count > 0)
                {
                    using (var ms = new MemoryStream()) { await images[0].CopyToAsync(ms); message.Image1Bytes = ms.ToArray(); message.Image1ContentType = images[0].ContentType; }
                    if (images.Count > 1) { using (var ms = new MemoryStream()) { await images[1].CopyToAsync(ms); message.Image2Bytes = ms.ToArray(); message.Image2ContentType = images[1].ContentType; } }
                    if (images.Count > 2) { using (var ms = new MemoryStream()) { await images[2].CopyToAsync(ms); message.Image3Bytes = ms.ToArray(); message.Image3ContentType = images[2].ContentType; } }
                }

                _backgroundJobClient.Enqueue<NexClone.Backend.Infrastructure.Consumers.VideoToolConsumer>(
                    c => c.Consume(message)
                );

                var updatedUser = await _dbContext.Users.FindAsync(userId);
                return Ok(new { taskId = history.Id.ToString(), status = "processing", message = "Task queued.", standardCredits = updatedUser?.StandardCredits ?? 0, premiumCredits = updatedUser?.PremiumCredits ?? 0 });
            }
            catch (Exception ex)
            {
                await _usagePolicy.RefundAsync(userId, policyResult.StandardCreditsCharged, policyResult.PremiumCreditsCharged);
                return StatusCode(500, new { error = "An error occurred: " + ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet("download-proxy")]
        public async Task<IActionResult> DownloadProxy([FromQuery] string url, [FromQuery] string type = "video")
        {
            if (string.IsNullOrEmpty(url)) return BadRequest("URL is required");

            // SSRF Protection: only allow URLs from trusted external AI/storage providers
            var allowedHosts = new[]
            {
                "cdn.kling.ai",
                "klingai.com",
                "p16-klingai.com",
                "p16-klingai.isgoodcdn.com",
                "klingai-tos.bytedance.net",
                "object.ksyun.com",
                "storage.googleapis.com",
                "amazonaws.com",
                "188.166.65.112",
                "localhost",
                "127.0.0.1"
            };

            if (!Uri.TryCreate(url, UriKind.Absolute, out var parsedUri)
                || (parsedUri.Scheme != "https" && parsedUri.Scheme != "http")
                || !allowedHosts.Any(h => parsedUri.Host.EndsWith(h, StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest(new { error = "URL not allowed." });
            }

            try
            {
                var client = new HttpClient();
                var stream = await client.GetStreamAsync(parsedUri);
                
                string contentType = type == "audio" ? "audio/mpeg" : "video/mp4";
                string filename = type == "audio" ? "generated_audio.mp3" : "generated_video.mp4";
                
                return File(stream, contentType, filename);
            }
            catch
            {
                return BadRequest("Failed to download file");
            }
        }

    }
}
