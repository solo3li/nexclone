using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Models;
using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NexClone.Backend.Areas.AI.Controllers
{
    [Area("AI")]
    [ApiController]
    [Authorize] // Requires JWT
    public class MockToolsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IWebHostEnvironment _env;

        public MockToolsController(ApplicationDbContext dbContext, IWebHostEnvironment env)
        {
            _dbContext = dbContext;
            _env = env;
        }

        [HttpPost]
        [Route("api/ai/remove-bg")]
        public async Task<IActionResult> RemoveBackground(IFormFile image)
        {
            if (image == null) return BadRequest("No image provided");
            
            string fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
            string directoryPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "generations");
            if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);
            
            string filePath = Path.Combine(directoryPath, fileName);
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userIdStr, out var userId))
            {
                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "bg-remover",
                    Title = image.FileName,
                    Status = "completed",
                    FileUrl = $"/generations/{fileName}"
                };
                _dbContext.GenerationHistories.Add(history);
                await _dbContext.SaveChangesAsync();
            }

            return PhysicalFile(filePath, image.ContentType, image.FileName);
        }

        [HttpPost]
        [Route("api/ai/img_to_txt")]
        public async Task<IActionResult> ExtractText(IFormFile image)
        {
            if (image == null) return BadRequest("No image provided");

            var resultText = "[MOCK] This is extracted text from the image. The Python service is disabled to save resources.";

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userIdStr, out var userId))
            {
                var history = new GenerationHistory
                {
                    UserId = userId,
                    Type = "img-to-txt",
                    Title = image.FileName,
                    Status = "completed",
                    ResultText = resultText
                };
                _dbContext.GenerationHistories.Add(history);
                await _dbContext.SaveChangesAsync();
            }

            return Ok(new { text = resultText });
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
