using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace NexClone.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class SocialLinksAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SocialLinksAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Communication Links";
            var settings = await _context.AppSettings
                .Where(s => s.Key.StartsWith("Social."))
                .ToListAsync();
                
            var predefinedKeys = new[] { "Social.Facebook", "Social.Twitter", "Social.LinkedIn", "Social.Instagram", "Social.YouTube", "Social.Email" };
            foreach (var key in predefinedKeys)
            {
                if (!settings.Any(s => s.Key == key))
                {
                    var newSetting = new AppSetting { Key = key, Value = "", Description = "Social Link", UpdatedAt = System.DateTime.UtcNow };
                    _context.AppSettings.Add(newSetting);
                    settings.Add(newSetting);
                }
            }
            await _context.SaveChangesAsync();

            return View(settings);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Save(Dictionary<string, string> settings)
        {
            if (settings == null) return RedirectToAction(nameof(Index));

            var existingSettings = await _context.AppSettings.Where(s => s.Key.StartsWith("Social.")).ToListAsync();

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
                        Description = "Social Link",
                        UpdatedAt = System.DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
