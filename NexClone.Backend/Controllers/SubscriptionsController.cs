using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models.Legacy;

namespace NexClone.Backend.Controllers
{
    public class SubscriptionsController : Controller
    {
        private readonly LegacyDbContext _context;

        public SubscriptionsController(LegacyDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var subscriptions = await _context.SubscriptionsSubscriptions
                .Include(s => s.Plan)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
            return View(subscriptions);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(long id)
        {
            var sub = await _context.SubscriptionsSubscriptions.FindAsync(id);
            if (sub != null)
            {
                _context.SubscriptionsSubscriptions.Remove(sub);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
