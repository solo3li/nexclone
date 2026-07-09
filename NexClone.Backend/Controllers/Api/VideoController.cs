using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Services;
using NexClone.Backend.Services.AI;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using NexClone.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace NexClone.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly IVideoService _videoService;
        private readonly UsagePolicyService _usagePolicyService;
        private readonly ApplicationDbContext _dbContext;

        public VideoController(IVideoService videoService, UsagePolicyService usagePolicyService, ApplicationDbContext dbContext)
        {
            _videoService = videoService;
            _usagePolicyService = usagePolicyService;
            _dbContext = dbContext;
        }

        [HttpPost("start-avatar")]
        public async Task<IActionResult> StartAvatar([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0) return BadRequest(new { error = "Image is required" });

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized(new { error = "Not authenticated" });

            if (!Guid.TryParse(userIdString, out Guid userIdGuid)) return BadRequest(new { error = "Invalid user ID" });

            // We charge credits up front. If it fails later, we should ideally refund, but for simplicity we charge now.
            var policyResult = await _usagePolicyService.ValidateAndChargeAsync(userIdGuid, "kling-avatar-image2video", 1);
            if (!policyResult.IsAllowed)
            {
                return BadRequest(new { error = policyResult.ErrorMessage });
            }

            var result = await _videoService.StartAvatarImageToVideoAsync(image);
            if (!result.Success)
            {
                // Refund
                var user = await _dbContext.Users.FindAsync(userIdString);
                if (user != null) {
                    var generalWallet = await _dbContext.UserWallets.FirstOrDefaultAsync(w => w.UserId == user.Id && w.WalletType.Code == "GENERAL");
                    if (generalWallet != null) { generalWallet.Balance += 1; await _dbContext.SaveChangesAsync(); }
                }
                return StatusCode(500, new { error = result.ErrorMessage });
            }

            return Ok(new { taskId = result.TaskId });
        }

        [HttpPost("start-lipsync")]
        public async Task<IActionResult> StartLipSync([FromForm] IFormFile image, [FromForm] IFormFile audio)
        {
            if (image == null || image.Length == 0) return BadRequest(new { error = "Image is required" });
            if (audio == null || audio.Length == 0) return BadRequest(new { error = "Audio is required" });

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized(new { error = "Not authenticated" });

            if (!Guid.TryParse(userIdString, out Guid userIdGuid)) return BadRequest(new { error = "Invalid user ID" });

            var policyResult = await _usagePolicyService.ValidateAndChargeAsync(userIdGuid, "kling-advanced-lip-syn", 1);
            if (!policyResult.IsAllowed)
            {
                return BadRequest(new { error = policyResult.ErrorMessage });
            }

            var result = await _videoService.StartLipSyncAsync(image, audio);
            if (!result.Success)
            {
                var user = await _dbContext.Users.FindAsync(userIdString);
                if (user != null) {
                    var generalWallet = await _dbContext.UserWallets.FirstOrDefaultAsync(w => w.UserId == user.Id && w.WalletType.Code == "GENERAL");
                    if (generalWallet != null) { generalWallet.Balance += 1; await _dbContext.SaveChangesAsync(); }
                }
                return StatusCode(500, new { error = result.ErrorMessage });
            }

            return Ok(new { taskId = result.TaskId });
        }

        [HttpGet("status/{taskId}")]
        public async Task<IActionResult> CheckStatus(string taskId)
        {
            var result = await _videoService.CheckTaskStatusAsync(taskId);
            
            return Ok(new
            {
                status = result.Status,
                url = result.OutputUrl,
                error = result.ErrorMessage
            });
        }
    }
}
