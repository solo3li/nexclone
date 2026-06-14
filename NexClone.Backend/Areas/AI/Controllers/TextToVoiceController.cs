using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Models;
using NexClone.Backend.Services.AI;
using System;
using System.IO;
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

        public TextToVoiceController(ITtsService ttsService, ApplicationDbContext dbContext, IWebHostEnvironment env)
        {
            _ttsService = ttsService;
            _dbContext = dbContext;
            _env = env;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateAudio([FromBody] TtsRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var (audioStream, contentType, fileExtension) = await _ttsService.GenerateAudioAsync(
                    request.Text,
                    request.Language,
                    request.VoiceName,
                    request.StyleInstruction
                );

                // Option 2: Save to disk and return URL (If you need history/downloads later)
                string fileName = $"{Guid.NewGuid()}.{fileExtension}";
                string directoryPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "generations");
                if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);
                
                string filePath = Path.Combine(directoryPath, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await audioStream.CopyToAsync(fileStream);
                }

                // Get User ID
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (Guid.TryParse(userIdStr, out var userId))
                {
                    var history = new GenerationHistory
                    {
                        UserId = userId,
                        Type = "text-to-voice",
                        Title = request.Text.Length > 30 ? request.Text.Substring(0, 30) + "..." : request.Text,
                        Status = "completed",
                        Lang = request.Language,
                        Voice = request.VoiceName,
                        FileUrl = $"/generations/{fileName}"
                    };
                    _dbContext.GenerationHistories.Add(history);
                    await _dbContext.SaveChangesAsync();
                }

                // Return the saved file so the frontend blob logic still works perfectly without modifications
                return PhysicalFile(filePath, contentType, $"tts_output.{fileExtension}");
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
