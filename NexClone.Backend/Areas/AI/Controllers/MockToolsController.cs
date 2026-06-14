using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NexClone.Backend.Models;
using NexClone.Backend.Services;
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
        private readonly CreditManagerService _creditManager;

        public MockToolsController(ApplicationDbContext dbContext, IWebHostEnvironment env, CreditManagerService creditManager)
        {
            _dbContext = dbContext;
            _env = env;
            _creditManager = creditManager;
        }

        [HttpPost]
        [Route("api/ai/remove-bg")]
        public async Task<IActionResult> RemoveBackground(IFormFile image)
        {
            if (image == null) return BadRequest("No image provided");

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (!await _creditManager.IsToolAllowedForUser(userId, "bg-remover"))
                return StatusCode(403, new { error = "Your current plan does not have access to this tool." });

            var cost = _creditManager.CalculateCost("bg-remover", 1m);
            if (!await _creditManager.HasEnoughCredits(userId, "bg-remover", cost))
                return BadRequest($"Insufficient credits. Removing background requires {cost} credits.");
            
            string fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
            string directoryPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "generations");
            if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);
            
            string filePath = Path.Combine(directoryPath, fileName);
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            var history = new GenerationHistory
            {
                UserId = userId,
                Type = "bg-remover",
                Title = image.FileName,
                Status = "completed",
                FileUrl = $"/generations/{fileName}",
                CreditsUsed = cost
            };
            _dbContext.GenerationHistories.Add(history);
            await _creditManager.DeductCreditsAsync(userId, cost);
            await _dbContext.SaveChangesAsync();

            return PhysicalFile(filePath, image.ContentType, image.FileName);
        }

        [HttpPost]
        [Route("api/ai/img_to_txt")]
        public async Task<IActionResult> ExtractText(IFormFile image)
        {
            if (image == null) return BadRequest("No image provided");

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            if (!await _creditManager.IsToolAllowedForUser(userId, "img-to-txt"))
                return StatusCode(403, new { error = "Your current plan does not have access to this tool." });

            var cost = _creditManager.CalculateCost("img-to-txt", 1m);
            if (!await _creditManager.HasEnoughCredits(userId, "img-to-txt", cost))
                return BadRequest($"Insufficient credits. Extracting text requires {cost} credits.");

            var resultText = "[MOCK] This is extracted text from the image. The Python service is disabled to save resources.";

            var history = new GenerationHistory
            {
                UserId = userId,
                Type = "img-to-txt",
                Title = image.FileName,
                Status = "completed",
                ResultText = resultText,
                CreditsUsed = cost
            };
            _dbContext.GenerationHistories.Add(history);
            await _creditManager.DeductCreditsAsync(userId, cost);
            await _dbContext.SaveChangesAsync();

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
