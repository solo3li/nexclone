using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.Controllers
{
    public class HistoryAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HistoryAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var history = await _context.GenerationHistories
                .Include(h => h.User)
                .OrderByDescending(h => h.CreatedAt)
                .Take(500)
                .ToListAsync();
            return View(history);
        }
    }
}
