using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Hangfire;
using NexClone.Backend.Core.Messages;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Application.Services;

namespace NexClone.Backend.API.Controllers.AI
{
    [Area("AI")]
    [Route("api/image")]
    [ApiController]
    [Authorize]
    [EnableRateLimiting("ApiPolicy")]
    public class ImageController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UsagePolicyService _usagePolicy;
        private readonly IBackgroundJobClient _backgroundJobClient;

        public ImageController(
            ApplicationDbContext dbContext,
            UsagePolicyService usagePolicy,
            IBackgroundJobClient backgroundJobClient)
        {
            _dbContext = dbContext;
            _usagePolicy = usagePolicy;
            _backgroundJobClient = backgroundJobClient;
        }

        [HttpPost("start-tool/{toolType}")]
        public async Task<IActionResult> StartImageTool(
            string toolType,
            [FromForm] string prompt = "",
            [FromForm] string model = "grok",
            [FromForm] string aspectRatio = "16:9",
            [FromForm] int? subscriptionId = null)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (toolType != "text-to-image")
                return BadRequest(new { error = "Invalid tool type." });

            string qualityFormat = $"{model}|{aspectRatio}";
            decimal usageUnits = 1;

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

                var message = new ImageToolMessage
                {
                    HistoryId = history.Id,
                    UserId = userId,
                    Prompt = prompt,
                    Model = model,
                    AspectRatio = aspectRatio
                };

                _backgroundJobClient.Enqueue<NexClone.Backend.Infrastructure.Consumers.ImageToolConsumer>(
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
    }
}
