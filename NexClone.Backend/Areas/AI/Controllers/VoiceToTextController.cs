using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Models;
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
        private const long MaxFileSize = 25 * 1024 * 1024; // 25 MB

        public VoiceToTextController(ISttService sttService, ApplicationDbContext dbContext)
        {
            _sttService = sttService;
            _dbContext = dbContext;
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

            try
            {
                var result = await _sttService.TranscribeAudioAsync(audio, translate, targetLanguage);

                if (!result.Success)
                {
                    return StatusCode(500, new { error = result.ErrorMessage });
                }

                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (Guid.TryParse(userIdStr, out var userId))
                {
                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "voice-to-text",
                        Title = audio.FileName,
                        Status = "completed",
                        Lang = targetLanguage,
                        ResultText = translate ? result.TranslatedText : result.OriginalText
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();
                }

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
