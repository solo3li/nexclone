using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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

        public VideoController(
            IVideoService videoService,
            ApplicationDbContext dbContext,
            UsagePolicyService usagePolicy,
            IMediaService mediaService)
        {
            _videoService = videoService;
            _dbContext = dbContext;
            _usagePolicy = usagePolicy;
            _mediaService = mediaService;
        }

        [HttpPost("start-avatar")]
        public async Task<IActionResult> StartAvatar(IFormFile image, [FromForm] IFormFile? audio = null, [FromForm] string prompt = "The speaker talks naturally to camera")
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { error = "Image is required." });

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Validate policy and deduct cost (1 generation flat cost)
            decimal usageAmountForLimits = audio != null && audio.Length > 0 ? audio.Length : (string.IsNullOrWhiteSpace(prompt) ? 0 : -prompt.Length);
            
            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, "kling_avatar_image2video", usageAmountForLimits, 1, "Standard");
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });

            try
            {
                var result = await _videoService.StartAvatarImageToVideoAsync(image, audio, prompt);

                if (result.Success)
                {
                    // Save history
                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "image-to-video",
                        Title = "Avatar Video Generation",
                        InputText = "Image Upload",
                        Status = "processing",
                        ResultText = result.TaskId,
                        CreditsUsed = policyResult.TotalCost
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();

                    return Ok(new { taskId = result.TaskId });
                }

                // Refund if failed to start (but no exception)
                await _usagePolicy.RefundAsync(userId, policyResult.ChargedWalletTypeId, policyResult.TotalCost);
                return StatusCode(500, new { error = result.ErrorMessage });
            }
            catch (Exception ex)
            {
                await _usagePolicy.RefundAsync(userId, policyResult.ChargedWalletTypeId, policyResult.TotalCost);
                return StatusCode(500, new { error = "An error occurred while communicating with the video service: " + ex.Message });
            }
        }

        [HttpPost("start-lipsync")]
        public async Task<IActionResult> StartLipSync(IFormFile video, IFormFile audio)
        {
            if (video == null || video.Length == 0 || audio == null || audio.Length == 0)
                return BadRequest(new { error = "Video and Audio are required." });

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var policyResult = new NexClone.Backend.Application.Services.PolicyValidationResult { IsAllowed = true, TotalCost = 0 };
            
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

                // Fire and forget background job - pass raw bytes directly
                _videoService.ProcessLipSyncBackgroundAsync(history.Id, videoBytes, videoFileName, videoContentType, audioBytes, audioFileName, audioContentType, userId);

                return Ok(new { taskId = history.Id.ToString() });
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
                                          history.Type == "lip-sync" ? "kling_advanced_lip_sync" : "UNKNOWN";
                        
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
        [AllowAnonymous]
        public async Task<IActionResult> DownloadProxy([FromQuery] string url, [FromQuery] string type = "video")
        {
            if (string.IsNullOrEmpty(url)) return BadRequest("URL is required");
            try
            {
                var client = new HttpClient();
                var stream = await client.GetStreamAsync(url);
                
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
