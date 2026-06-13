using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace NexClone.Backend.Areas.AI.Controllers
{
    [Area("AI")]
    [ApiController]
    [Authorize] // Requires JWT
    public class MockToolsController : ControllerBase
    {
        [HttpPost]
        [Route("api/ai/remove-bg")]
        public IActionResult RemoveBackground(IFormFile image)
        {
            if (image == null) return BadRequest("No image provided");
            // Return the same image back as a mock
            return File(image.OpenReadStream(), image.ContentType, image.FileName);
        }

        [HttpPost]
        [Route("api/ai/img_to_txt")]
        public IActionResult ExtractText(IFormFile image)
        {
            if (image == null) return BadRequest("No image provided");
            return Ok(new { text = "[MOCK] This is extracted text from the image. The Python service is disabled to save resources." });
        }

        [HttpPost]
        [Route("api/ai/voice_to_text")]
        public IActionResult Transcribe(IFormFile audio)
        {
            if (audio == null) return BadRequest("No audio provided");
            return Ok(new { original_text = "[MOCK] Transcribed audio text. The Python service is disabled." });
        }
    }
}
