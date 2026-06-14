using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models.Legacy;

namespace NexClone.Backend.Controllers
{
    public class ToolsController : Controller
    {
        private readonly LegacyDbContext _context;

        public ToolsController(LegacyDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var tools = await _context.ToolsTools.OrderBy(t => t.Id).ToListAsync();
            return View(tools);
        }

        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null) return NotFound();

            var tool = await _context.ToolsTools.FindAsync(id);
            if (tool == null) return NotFound();

            return View(tool);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, ToolsTool tool)
        {
            if (id != tool.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(tool);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ToolExists(tool.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(tool);
        }

        private bool ToolExists(long id)
        {
            return _context.ToolsTools.Any(e => e.Id == id);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(long id)
        {
            var tool = await _context.ToolsTools.FindAsync(id);
            if (tool != null)
            {
                _context.ToolsTools.Remove(tool);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
