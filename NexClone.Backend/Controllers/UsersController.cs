using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Threading.Tasks;
using System.Linq;

namespace NexClone.Backend.Controllers
{
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Take(50)
                .ToListAsync();

            // If it's an HTMX request, we only return the table rows partial
            if (Request.Headers.ContainsKey("HX-Request"))
            {
                // For simplicity right now, returning full view which HTMX extracts body from
                // But typically you'd return PartialView("_UserTablePartial", users);
            }

            return View(users);
        }
    }
}
