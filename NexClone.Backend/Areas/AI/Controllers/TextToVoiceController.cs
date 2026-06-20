using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using NexClone.Backend.Services;
using NexClone.Backend.Services.AI;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NexClone.Backend.Areas.AI.Controllers
{
    [Area("AI")]
    [Route("api/ai/text-to-voice")]
    [ApiController]
    [Authorize] // Requires JWT
    public class TextToVoiceController : ControllerBase
    {
        private readonly ITtsService _ttsService;
        private readonly ApplicationDbContext _dbContext;
        private readonly IWebHostEnvironment _env;
        private readonly CreditManagerService _creditManager;
        private readonly IMediaService _mediaService;

        public TextToVoiceController(ITtsService ttsService, ApplicationDbContext dbContext, IWebHostEnvironment env, CreditManagerService creditManager, IMediaService mediaService)
        {
            _ttsService = ttsService;
            _dbContext = dbContext;
            _env = env;
            _creditManager = creditManager;
            _mediaService = mediaService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateAudio([FromBody] TtsRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (!await _creditManager.IsToolAllowedForUser(userId, "text-to-voice"))
                return StatusCode(403, new { error = "Your current plan does not have access to this tool." });

            var cost = _creditManager.CalculateCost("text-to-voice", request.Text.Length);
            if (!await _creditManager.HasEnoughCredits(userId, "text-to-voice", cost))
                return BadRequest(new { error = $"Insufficient credits. Generating this audio requires {cost} credits." });

            var activeSubscription = await _dbContext.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.UserId == userId && s.Status == "active")
                .OrderByDescending(s => s.EndDate)
                .FirstOrDefaultAsync();

            int maxChars = 150; // Default limit
            bool unlimited = false;

            if (activeSubscription?.Plan != null && !string.IsNullOrEmpty(activeSubscription.Plan.AllowedTools))
            {
                try
                {
                    if (activeSubscription.Plan.AllowedTools.Trim().StartsWith("{"))
                    {
                        using var doc = System.Text.Json.JsonDocument.Parse(activeSubscription.Plan.AllowedTools);
                        if (doc.RootElement.TryGetProperty("text-to-voice", out var limitElement) && limitElement.TryGetInt32(out int limit))
                        {
                            if (limit == -1) unlimited = true;
                            else if (limit > 0) maxChars = limit;
                        }
                    }
                }
                catch { }
            }

            if (!unlimited && request.Text.Length > maxChars)
            {
                return BadRequest(new { error = $"Your current plan allows a maximum of {maxChars} characters per request." });
            }

            try
            {
                var (audioStream, contentType, fileExtension) = await _ttsService.GenerateAudioAsync(
                    request.Text,
                    request.Language,
                    request.VoiceName,
                    request.StyleInstruction
                );

                // Upload to MinIO
                string fileName = $"{Guid.NewGuid()}.{fileExtension}";
                string objectKey = $"text-to-voice/{userId:N}/{DateTime.UtcNow:yyyy-MM}/{fileName}";
                
                audioStream.Position = 0; // Ensure stream is at the beginning
                string fileUrl = await _mediaService.UploadFileAsync(audioStream, objectKey, contentType);

                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "text-to-voice",
                    Title = request.Text.Length > 30 ? request.Text.Substring(0, 30) + "..." : request.Text,
                    InputText = request.Text,
                    Status = "completed",
                    Lang = request.Language,
                    Voice = request.VoiceName,
                    FileUrl = fileUrl,
                    CreditsUsed = cost
                };
                _dbContext.GenerationHistories.Add(history);
                await _creditManager.DeductCreditsAsync(userId, cost);
                await _dbContext.SaveChangesAsync();

                // Return a JSON response with the presigned URL so the frontend can play it directly
                var finalUrl = await _mediaService.GetFileUrlAsync(fileUrl);
                return Ok(new { audioUrl = finalUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating audio", details = ex.Message });
            }
        }
    }

    public class TtsRequest
    {
        public string Text { get; set; } = string.Empty;
        public string Language { get; set; } = "other"; // "arabic" or "other"
        public string VoiceName { get; set; } = string.Empty;
        public string StyleInstruction { get; set; } = string.Empty;
    }
}
