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

        private readonly IMediaService _mediaService;

        public VoiceToTextController(ISttService sttService, ApplicationDbContext dbContext, CreditManagerService creditManager, IMediaService mediaService)
        {
            _sttService = sttService;
            _dbContext = dbContext;
            _creditManager = creditManager;
            _mediaService = mediaService;
        }

        public class TranscribeRequest
        {
            public string FileId { get; set; }
            public bool Translate { get; set; } = false;
            public string TargetLanguage { get; set; } = "en";
        }

        [HttpPost("transcribe")]
        public async Task<IActionResult> TranscribeAudio([FromBody] TranscribeRequest request)
        {
            if (string.IsNullOrEmpty(request.FileId))
                return BadRequest(new { error = "No fileId provided" });

            byte[] audioData;
            try
            {
                audioData = await _mediaService.DownloadFileAsync(request.FileId);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Could not retrieve file from storage", details = ex.Message });
            }

            if (audioData.Length > MaxFileSize)
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
            decimal amount = (decimal)audioData.Length / 102400m;
            var cost = _creditManager.CalculateCost("voice-to-text", amount);
            
            if (!await _creditManager.HasEnoughCredits(userId, "voice-to-text", cost))
                return BadRequest(new { error = $"Insufficient credits. Transcribing this audio requires {cost:F2} credits." });

            try
            {
                var result = await _sttService.TranscribeAudioAsync(audioData, request.FileId, "audio/mpeg", request.Translate, request.TargetLanguage);

                if (!result.Success)
                {
                    return StatusCode(500, new { error = result.ErrorMessage });
                }

                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "voice-to-text",
                    Title = request.FileId.Split('/').LastOrDefault() ?? "Audio File",
                    FileUrl = request.FileId,
                    Status = "completed",
                    Lang = request.TargetLanguage,
                    ResultText = request.Translate ? result.TranslatedText : result.OriginalText,
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
