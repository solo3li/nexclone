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
        private readonly IMediaService _mediaService;
        private readonly IBackgroundJobClient _backgroundJobClient;

        public ImageController(
            ApplicationDbContext dbContext,
            UsagePolicyService usagePolicy,
            IMediaService mediaService,
            IBackgroundJobClient backgroundJobClient)
        {
            _dbContext = dbContext;
            _usagePolicy = usagePolicy;
            _mediaService = mediaService;
            _backgroundJobClient = backgroundJobClient;
        }

        [HttpGet("estimate-tool/{toolType}")]
        public async Task<IActionResult> EstimateTool(string toolType, [FromQuery] string model = "grok", [FromQuery] string aspectRatio = "16:9", [FromQuery] int? subscriptionId = null)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (toolType != "text-to-image")
                return BadRequest(new { error = "Invalid tool type." });

            string qualityFormat = $"{model}|{aspectRatio}";
            decimal usageUnits = 1;

            var policyResult = await _usagePolicy.EstimateCostAsync(userId, toolType, usageUnits, usageUnits, qualityFormat, subscriptionId, enforceWallet: false);
            if (!policyResult.IsAllowed) return BadRequest(new { error = policyResult.ErrorMessage });

            return Ok(new { estimatedCost = policyResult.TotalCost });
        }

        [AllowAnonymous]
        [HttpGet("pricing/{toolType}")]
        public async Task<IActionResult> GetToolPricing(string toolType)
        {
            if (toolType == "text-to-image")
            {
                var setting = await _dbContext.TextToImageSettings.FirstOrDefaultAsync();
                var pricings = await _dbContext.TextToImageModelPricings.Where(p => p.IsActive).ToListAsync();
                return Ok(new { isActive = setting?.IsActive ?? true, maxPrompt = setting?.MaxPromptLength ?? 5000, pricings });
            }

            return NotFound();
        }

        [HttpPost("start-tool/{toolType}")]
        public async Task<IActionResult> StartImageTool(
            string toolType,
            [FromForm] System.Collections.Generic.List<IFormFile>? images = null,
            [FromForm] string prompt = "",
            [FromForm] string model = "grok",
            [FromForm] string aspectRatio = "16:9",
            [FromForm] string mode = "standard",
            [FromForm] int? subscriptionId = null)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (toolType != "text-to-image")
                return BadRequest(new { error = "Invalid tool type." });

            if (string.IsNullOrWhiteSpace(prompt) && Request.HasFormContentType)
            {
                if (Request.Form.TryGetValue("prompt", out var formPrompt)) prompt = formPrompt.ToString();
                if (Request.Form.TryGetValue("model", out var formModel)) model = formModel.ToString();
                if (Request.Form.TryGetValue("aspectRatio", out var formAspect)) aspectRatio = formAspect.ToString();
                if (Request.Form.TryGetValue("mode", out var formMode)) mode = formMode.ToString();
            }

            if (string.IsNullOrWhiteSpace(prompt))
                return BadRequest(new { error = "يرجى كتابة وصف الصورة (Prompt) أولاً." });

            var imageFiles = new System.Collections.Generic.List<IFormFile>();
            if (images != null) imageFiles.AddRange(images.Where(f => f != null && f.Length > 0));
            if (Request.HasFormContentType && Request.Form.Files.Count > 0)
            {
                foreach (var file in Request.Form.Files)
                {
                    if (file != null && file.Length > 0 && !imageFiles.Contains(file))
                        imageFiles.Add(file);
                }
            }

            string qualityFormat = $"{model}|{aspectRatio}";
            decimal usageUnits = 1;

            var policyResult = await _usagePolicy.ValidateAndChargeAsync(userId, toolType, usageUnits, usageUnits, qualityFormat, subscriptionId);
            if (!policyResult.IsAllowed)
                return BadRequest(new { error = policyResult.ErrorMessage });

            try
            {
                string cleanTitle = !string.IsNullOrWhiteSpace(prompt)
                    ? (prompt.Trim().Length > 80 ? prompt.Trim().Substring(0, 77) + "..." : prompt.Trim())
                    : "توليد صورة بالذكاء الاصطناعي";

                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = toolType,
                    Title = cleanTitle,
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
                    AspectRatio = aspectRatio,
                    Mode = string.IsNullOrWhiteSpace(mode) ? "standard" : mode
                };

                // Upload any reference images to MinIO (enables grok-imagine/i2i up to 5 images)
                foreach (var img in imageFiles.Take(5))
                {
                    using var stream = img.OpenReadStream();
                    string ext = System.IO.Path.GetExtension(img.FileName);
                    if (string.IsNullOrEmpty(ext)) ext = ".jpg";
                    string key = await _mediaService.UploadFileAsync(stream, $"ai/images/{Guid.NewGuid()}{ext}", img.ContentType ?? "image/jpeg");
                    string url = await _mediaService.GetFileUrlAsync(key);
                    message.ImageUrls.Add(url);
                }

                // Attach rich metadata for image history
                var imageMetadata = new
                {
                    model = model,
                    aspectRatio = aspectRatio,
                    mode = string.IsNullOrWhiteSpace(mode) ? "standard" : mode,
                    imageUrls = message.ImageUrls
                };
                history.MetadataJson = System.Text.Json.JsonSerializer.Serialize(imageMetadata);
                await _dbContext.SaveChangesAsync();

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

        [HttpGet("status/{taskId}")]
        public async Task<IActionResult> GetStatus(Guid taskId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var history = await _dbContext.GenerationHistories
                .AsNoTracking()
                .FirstOrDefaultAsync(h => h.Id == taskId && h.UserId == userId);

            if (history == null)
                return NotFound(new { error = "Task not found" });

            return Ok(new
            {
                id = history.Id.ToString(),
                status = history.Status,
                url = history.FileUrl,
                fileUrl = history.FileUrl,
                error = history.ErrorMessage,
                title = history.Title,
                prompt = history.InputText,
                creditsUsed = history.CreditsUsed,
                createdAt = history.CreatedAt,
                metadataJson = history.MetadataJson
            });
        }
    }
}
