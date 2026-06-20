using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.Controllers
{
    public class PlansAdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly NexClone.Backend.Models.Legacy.LegacyDbContext _legacyContext;

        public PlansAdminController(ApplicationDbContext context, NexClone.Backend.Models.Legacy.LegacyDbContext legacyContext)
        {
            _context = context;
            _legacyContext = legacyContext;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Subscription Plans Management";
            var plans = await _context.Plans.OrderBy(p => p.Id).ToListAsync();
            return View(plans);
        }

        public IActionResult Create()
        {
            ViewData["Title"] = "Create Plan";
            return View(new Plan());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Plan plan)
        {
            if (ModelState.IsValid)
            {
                _context.Add(plan);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(plan);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var plan = await _context.Plans.FindAsync(id);
            if (plan == null) return NotFound();

            ViewData["Title"] = $"Edit Plan - {plan.Name}";
            return View(plan);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Plan plan)
        {
            if (id != plan.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(plan);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PlanExists(plan.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(plan);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var plan = await _context.Plans.FindAsync(id);
            if (plan != null)
            {
                _context.Plans.Remove(plan);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool PlanExists(int id)
        {
            return _context.Plans.Any(e => e.Id == id);
        }
    }
}
