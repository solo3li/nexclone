using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models.Legacy;

namespace NexClone.Backend.Controllers
{
    public class PlansController : Controller
    {
        private readonly LegacyDbContext _context;

        public PlansController(LegacyDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var plans = await _context.SubscriptionsPlans.OrderBy(p => p.Id).ToListAsync();
            return View(plans);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(long id)
        {
            var plan = await _context.SubscriptionsPlans.FindAsync(id);
            if (plan != null)
            {
                _context.SubscriptionsPlans.Remove(plan);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
