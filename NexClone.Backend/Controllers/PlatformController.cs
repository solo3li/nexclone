using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using NexClone.Backend.Models.Legacy;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;

namespace NexClone.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlatformController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly LegacyDbContext _legacyContext;

        public PlatformController(ApplicationDbContext context, LegacyDbContext legacyContext)
        {
            _context = context;
            _legacyContext = legacyContext;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userCount = await _context.Users.CountAsync();
            var subCount = await _context.Subscriptions.CountAsync();

            return Ok(new
            {
                TotalUsers = userCount,
                ActiveSubscriptions = subCount,
                PlatformStatus = "Online",
                Version = "1.0.0"
            });
        }

        [HttpGet("plans")]
        public async Task<IActionResult> GetPlans()
        {
            var plans = await _context.Plans.OrderBy(p => p.PriceUsd).ToListAsync();
            return Ok(plans);
        }

        [HttpGet("voices")]
        public async Task<IActionResult> GetVoices()
        {
            var voices = await _legacyContext.TextToVoiceDarijatvoices
                .Where(v => v.IsActive)
                .OrderBy(v => v.Order)
                .Select(v => new {
                    v.Id,
                    v.Name,
                    v.VoiceName,
                    v.Accent,
                    v.Gender,
                    v.IsPremium,
                    v.DemoAudio
                })
                .ToListAsync();
                
            return Ok(voices);
        }

        [HttpGet("dialects")]
        public async Task<IActionResult> GetDialects()
        {
            var dialects = await _legacyContext.TextToVoiceDarijatdialects
                .Where(d => d.IsActive)
                .OrderBy(d => d.Order)
                .Select(d => new { d.Id, d.Name, d.Value, d.IsPremium })
                .ToListAsync();
            return Ok(dialects);
        }

        [HttpGet("emotions")]
        public async Task<IActionResult> GetEmotions()
        {
            var emotions = await _legacyContext.TextToVoiceDarijatemotions
                .Where(e => e.IsActive)
                .OrderBy(e => e.Order)
                .Select(e => new { e.Id, e.Name, e.Value, e.IsPremium })
                .ToListAsync();
            return Ok(emotions);
        }

        [HttpGet("styles")]
        public async Task<IActionResult> GetStyles()
        {
            var styles = await _legacyContext.TextToVoiceDarijatstyles
                .Where(s => s.IsActive)
                .OrderBy(s => s.Order)
                .Select(s => new { s.Id, s.Name, s.Value, s.IsPremium })
                .ToListAsync();
            return Ok(styles);
        }

        [HttpGet("tts-config")]
        public async Task<IActionResult> GetTtsConfig()
        {
            int maxChars = 150; // Default

            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var userIdStr = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (Guid.TryParse(userIdStr, out var userId))
                {
                    var activeSubscription = await _context.Subscriptions
                        .Include(s => s.Plan)
                        .Where(s => s.UserId == userId && s.Status == "active")
                        .OrderByDescending(s => s.EndDate)
                        .FirstOrDefaultAsync();

                    if (activeSubscription?.Plan != null)
                    {
                        maxChars = activeSubscription.Plan.TtsMaxCharsPerRequest;
                    }
                }
            }

            return Ok(new { maxChars = maxChars });
        }
    }
}
