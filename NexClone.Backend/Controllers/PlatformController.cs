using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Threading.Tasks;

namespace NexClone.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlatformController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PlatformController(ApplicationDbContext context)
        {
            _context = context;
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
    }
}
