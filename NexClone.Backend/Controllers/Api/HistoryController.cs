using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NexClone.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public HistoryController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetHistory()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var history = await _dbContext.GenerationHistories
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new
                {
                    id = h.Id,
                    type = h.Type,
                    title = h.Title,
                    date = h.CreatedAt.ToString("dd MMM yyyy"),
                    createdAt = h.CreatedAt,
                    duration = h.Duration,
                    status = h.Status,
                    lang = h.Lang,
                    voice = h.Voice,
                    fileUrl = h.FileUrl,
                    creditsUsed = h.CreditsUsed
                })
                .ToListAsync();

            return Ok(history);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var record = await _dbContext.GenerationHistories
                .Where(h => h.Id == id && h.UserId == userId)
                .Select(h => new
                {
                    id = h.Id,
                    type = h.Type,
                    title = h.Title,
                    createdAt = h.CreatedAt,
                    date = h.CreatedAt.ToString("dd MMM yyyy, HH:mm"),
                    duration = h.Duration,
                    status = h.Status,
                    lang = h.Lang,
                    voice = h.Voice,
                    fileUrl = h.FileUrl,
                    resultText = h.ResultText,
                    creditsUsed = h.CreditsUsed
                })
                .FirstOrDefaultAsync();

            if (record == null) return NotFound();
            return Ok(record);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHistory(Guid id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var record = await _dbContext.GenerationHistories
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

            if (record == null)
                return NotFound();

            _dbContext.GenerationHistories.Remove(record);
            await _dbContext.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}
