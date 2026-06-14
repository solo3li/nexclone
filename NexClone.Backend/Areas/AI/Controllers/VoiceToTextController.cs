using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Models;
using NexClone.Backend.Services;
using NexClone.Backend.Services.AI;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NexClone.Backend.Areas.AI.Controllers
{
    [Area("AI")]
    [Route("api/ai/voice-to-text")]
    [ApiController]
    [Authorize] // Requires JWT
    public class VoiceToTextController : ControllerBase
    {
        private readonly ISttService _sttService;
        private readonly ApplicationDbContext _dbContext;
        private readonly CreditManagerService _creditManager;
        private const long MaxFileSize = 25 * 1024 * 1024; // 25 MB

        public VoiceToTextController(ISttService sttService, ApplicationDbContext dbContext, CreditManagerService creditManager)
        {
            _sttService = sttService;
            _dbContext = dbContext;
            _creditManager = creditManager;
        }

        [HttpPost("transcribe")]
        public async Task<IActionResult> TranscribeAudio(
            [FromForm] IFormFile audio, 
            [FromForm] bool translate = false, 
            [FromForm] string targetLanguage = "en")
        {
            if (audio == null || audio.Length == 0)
                return BadRequest(new { error = "No audio file provided" });

            if (audio.Length > MaxFileSize)
            {
                return BadRequest(new { 
                    error = $"File too large. Maximum allowed size is {MaxFileSize / (1024 * 1024)}MB. Please compress your file or upload a smaller one." 
                });
            }

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (!await _creditManager.IsToolAllowedForUser(userId, "voice-to-text"))
                return StatusCode(403, new { error = "Your current plan does not have access to this tool." });

            // Charge 1 credit per 100KB of audio
            decimal amount = (decimal)audio.Length / 102400m;
            var cost = _creditManager.CalculateCost("voice-to-text", amount);
            
            if (!await _creditManager.HasEnoughCredits(userId, "voice-to-text", cost))
                return BadRequest(new { error = $"Insufficient credits. Transcribing this audio requires {cost:F2} credits." });

            try
            {
                var result = await _sttService.TranscribeAudioAsync(audio, translate, targetLanguage);

                if (!result.Success)
                {
                    return StatusCode(500, new { error = result.ErrorMessage });
                }

                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "voice-to-text",
                    Title = audio.FileName,
                    Status = "completed",
                    Lang = targetLanguage,
                    ResultText = translate ? result.TranslatedText : result.OriginalText,
                    CreditsUsed = cost
                };
                _dbContext.GenerationHistories.Add(history);
                await _creditManager.DeductCreditsAsync(userId, cost);
                await _dbContext.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    original_text = result.OriginalText,
                    translated_text = result.TranslatedText,
                    target_language = result.TargetLanguage
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error during transcription.", details = ex.Message });
            }
        }
    }
}
