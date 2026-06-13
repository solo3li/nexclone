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
