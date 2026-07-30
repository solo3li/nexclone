using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MassTransit;
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
        private readonly IPublishEndpoint _publishEndpoint;

        public VideoController(
            IVideoService videoService,
            ApplicationDbContext dbContext,
            UsagePolicyService usagePolicy,
            IMediaService mediaService,
            IPublishEndpoint publishEndpoint)
        {
            _videoService = videoService;
            _dbContext = dbContext;
            _usagePolicy = usagePolicy;
            _mediaService = mediaService;
            _publishEndpoint = publishEndpoint;
        }

        [HttpPost("start-avatar")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> StartAvatar(IFormFile image, [FromForm] IFormFile? audio = null, [FromForm] string prompt = "The speaker talks naturally to camera")
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { error = "Image is required." });
                
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Fetch policy for limits validation
            var policy = await _usagePolicy.GetToolPolicyForUserAsync(userId, "kling_avatar_image2video");
            
            if (!policy.Enabled)
                return BadRequest(new { error = "Your current plan does not have access to this tool." });

            // Validate Dynamic Limits from Plan
            if (image.Length > policy.MaxImageFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Image file is too large. Maximum size is {policy.MaxImageFileSizeMb}MB." });
                
            if (audio != null && audio.Length > policy.MaxAudioFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Audio file is too large. Maximum size is {policy.MaxAudioFileSizeMb}MB." });
                
            if (!string.IsNullOrWhiteSpace(prompt) && prompt.Length > policy.MaxCharsPerRequest)
                return BadRequest(new { error = $"Prompt too long. Maximum allowed is {policy.MaxCharsPerRequest} characters." });

            // Just charge (validation is done above)
            decimal usageAmountForLimits = 0; // Handled explicitly above
            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "kling_avatar_image2video", usageAmountForLimits, 1, "Standard");
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

                // Publish to RabbitMQ
                await _publishEndpoint.Publish(new AvatarVideoMessage
                {
                    HistoryId = history.Id,
                    UserId = userId,
                    ImageBytes = imageBytes,
                    ImageContentType = imageContentType,
                    AudioBytes = audioBytes,
                    AudioContentType = audioContentType,
                    Prompt = prompt
                });

                // Return OK immediately so frontend can show the Wait/Leave UI
                return Ok(new { taskId = history.Id.ToString(), status = "processing", message = "Task has been added to the queue." });
            }
            catch (Exception ex)
            {
                await _usagePolicy.RefundAsync(userId, policyResult.ChargedWalletTypeId, policyResult.TotalCost);
                return StatusCode(500, new { error = "An error occurred while queuing the video task: " + ex.Message });
            }
        }

        [HttpPost("start-lipsync")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> StartLipSync(IFormFile video, IFormFile audio)
        {
            if (video == null || video.Length == 0 || audio == null || audio.Length == 0)
                return BadRequest(new { error = "Video and Audio are required." });

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Fetch policy for limits validation
            var policy = await _usagePolicy.GetToolPolicyForUserAsync(userId, "lipsync");
            
            if (!policy.Enabled)
                return BadRequest(new { error = "Your current plan does not have access to this tool." });

            // Validate Dynamic Limits from Plan
            if (video.Length > policy.MaxVideoFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Video file is too large. Maximum size is {policy.MaxVideoFileSizeMb}MB." });
                
            if (audio.Length > policy.MaxAudioFileSizeMb * 1024 * 1024)
                return BadRequest(new { error = $"Audio file is too large. Maximum size is {policy.MaxAudioFileSizeMb}MB." });

            // Just charge (validation is done above)
            decimal usageAmountForLimits = 0; // Handled explicitly above
            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "lipsync", usageAmountForLimits, 1, "Standard");
            
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });
            
            try
            {
                // Read files into memory so background task can use them after the request ends
                byte[] videoBytes;
                byte[] audioBytes;
                using (var ms = new MemoryStream()) { await video.CopyToAsync(ms); videoBytes = ms.ToArray(); }
                using (var ms = new MemoryStream()) { await audio.CopyToAsync(ms); audioBytes = ms.ToArray(); }

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

                // Publish to RabbitMQ instead of direct fire-and-forget
                await _publishEndpoint.Publish(new LipSyncMessage
                {
                    HistoryId = history.Id,
                    UserId = userId,
                    VideoBytes = videoBytes,
                    VideoFileName = videoFileName,
                    VideoContentType = videoContentType,
                    AudioBytes = audioBytes,
                    AudioFileName = audioFileName,
                    AudioContentType = audioContentType
                });

                return Ok(new { taskId = history.Id.ToString(), status = "processing", message = "Task has been added to the queue." });
            }
            catch (Exception ex)
            {
                await _usagePolicy.RefundAsync(userId, policyResult.ChargedWalletTypeId, policyResult.TotalCost);
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
                "amazonaws.com"
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
