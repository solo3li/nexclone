using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMediaService _mediaService;

        public HistoryController(ApplicationDbContext context, IMediaService mediaService)
        {
            _context = context;
            _mediaService = mediaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHistory()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var historyList = await _context.GenerationHistories
                .AsNoTracking()
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.CreatedAt)
                .ToListAsync();

            // Resolve file URLs securely if needed
            foreach (var history in historyList)
            {
                if (!string.IsNullOrEmpty(history.FileUrl) && !history.FileUrl.StartsWith("http"))
                {
                    history.FileUrl = await _mediaService.GetFileUrlAsync(history.FileUrl);
                }

                // Hide sensitive data from the client
                history.ErrorMessage = null;
                
                if (history.Type == "text-to-voice" || history.Type == "image-to-video" || history.Type == "lip-sync")
                {
                    history.ResultText = string.Empty;
                }
            }

            return Ok(historyList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHistoryById(Guid id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var history = await _context.GenerationHistories
                .AsNoTracking()
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

            if (history == null) return NotFound(new { Message = "History record not found" });

            if (!string.IsNullOrEmpty(history.FileUrl) && !history.FileUrl.StartsWith("http"))
            {
                history.FileUrl = await _mediaService.GetFileUrlAsync(history.FileUrl);
            }

            // Hide sensitive data from the client
            history.ErrorMessage = null;
            
            if (history.Type == "text-to-voice" || history.Type == "image-to-video" || history.Type == "lip-sync")
            {
                history.ResultText = string.Empty;
            }

            return Ok(history);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHistory(Guid id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var history = await _context.GenerationHistories
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

            if (history == null) return NotFound(new { Message = "History record not found" });

            _context.GenerationHistories.Remove(history);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Record deleted successfully" });
        }
    }
}
