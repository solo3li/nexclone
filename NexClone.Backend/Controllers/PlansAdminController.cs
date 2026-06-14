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

        public async Task<IActionResult> Create()
        {
            ViewData["Title"] = "Create Plan";
            ViewBag.Tools = await _legacyContext.ToolsTools.OrderBy(t => t.Name).ToListAsync();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Plan plan, string[] SelectedTools)
        {
            if (ModelState.IsValid)
            {
                plan.AllowedTools = System.Text.Json.JsonSerializer.Serialize(SelectedTools ?? new string[0]);
                _context.Add(plan);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.Tools = await _legacyContext.ToolsTools.OrderBy(t => t.Name).ToListAsync();
            return View(plan);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var plan = await _context.Plans.FindAsync(id);
            if (plan == null) return NotFound();

            ViewData["Title"] = $"Edit Plan - {plan.Name}";
            ViewBag.Tools = await _legacyContext.ToolsTools.OrderBy(t => t.Name).ToListAsync();
            return View(plan);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Plan plan, string[] SelectedTools)
        {
            if (id != plan.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    plan.AllowedTools = System.Text.Json.JsonSerializer.Serialize(SelectedTools ?? new string[0]);
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
            ViewBag.Tools = await _legacyContext.ToolsTools.OrderBy(t => t.Name).ToListAsync();
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
