using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace NexClone.Backend.Controllers
{
    public class SettingsAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SettingsAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Global Settings";
            var settings = await _context.AppSettings.ToListAsync();
            return View(settings);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveAll(Dictionary<string, string> settings)
        {
            if (settings == null) return RedirectToAction(nameof(Index));

            var existingSettings = await _context.AppSettings.ToListAsync();

            foreach (var kvp in settings)
            {
                var setting = existingSettings.FirstOrDefault(s => s.Key == kvp.Key);
                if (setting != null)
                {
                    if (setting.Value != kvp.Value)
                    {
                        setting.Value = kvp.Value ?? "";
                        setting.UpdatedAt = System.DateTime.UtcNow;
                        _context.Update(setting);
                    }
                }
                else
                {
                    _context.AppSettings.Add(new AppSetting
                    {
                        Key = kvp.Key,
                        Value = kvp.Value ?? "",
                        Description = "Dynamically added setting",
                        UpdatedAt = System.DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
