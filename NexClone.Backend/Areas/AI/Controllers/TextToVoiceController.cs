using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Services.AI;
using System;
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

        public TextToVoiceController(ITtsService ttsService)
        {
            _ttsService = ttsService;
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

                // Option 1: Stream directly to user (Best performance, no disk I/O)
                return File(audioStream, contentType, $"tts_output.{fileExtension}");

                // Option 2: Save to disk and return URL (If you need history/downloads later)
                // string fileName = $"{Guid.NewGuid()}.{fileExtension}";
                // string filePath = Path.Combine(_env.WebRootPath, "audio_files", fileName);
                // using (var fileStream = new FileStream(filePath, FileMode.Create))
                //     await audioStream.CopyToAsync(fileStream);
                // return Ok(new { url = $"/audio_files/{fileName}" });
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
