using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models.Legacy;

namespace NexClone.Backend.Controllers
{
    public class VoicesController : Controller
    {
        private readonly LegacyDbContext _context;

        public VoicesController(LegacyDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var voices = await _context.TextToVoiceDarijatvoices.OrderBy(v => v.Id).ToListAsync();
            return View(voices);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(long id)
        {
            var voice = await _context.TextToVoiceDarijatvoices.FindAsync(id);
            if (voice != null)
            {
                _context.TextToVoiceDarijatvoices.Remove(voice);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
