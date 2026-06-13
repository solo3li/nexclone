using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models.Legacy;
using System.Threading.Tasks;
using System.Linq;

namespace NexClone.Backend.Controllers
{
    public class UsersController : Controller
    {
        private readonly LegacyDbContext _context;

        public UsersController(LegacyDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var users = await _context.UserAuthUsers
                .OrderByDescending(u => u.CreatedAt)
                .Take(100)
                .ToListAsync();

            if (Request.Headers.ContainsKey("HX-Request"))
            {
                // HTMX Support
            }

            return View(users);
        }
    }
}
