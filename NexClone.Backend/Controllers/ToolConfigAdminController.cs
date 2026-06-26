using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class ToolConfigAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ToolConfigAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Tool Settings";
            
            var allConfigs = await _context.ToolConfigurations.ToListAsync();
            var providers = await _context.ApiConfigurations.Where(a => a.IsActive).Select(a => a.ProviderName).ToListAsync();
            
            ViewBag.Providers = new SelectList(providers);

            var tools = new[] { "text-to-voice", "voice-to-text" };
            
            var toolConfigs = new Dictionary<string, ToolConfiguration>();
            foreach (var t in tools)
            {
                var config = allConfigs.FirstOrDefault(c => c.ToolName == t);
                if (config == null)
                {
                    config = new ToolConfiguration { ToolName = t, Id = Guid.NewGuid() };
                }
                toolConfigs[t] = config;
            }

            return View(toolConfigs);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveConfig(ToolConfiguration config)
        {
            if (ModelState.IsValid)
            {
                var existing = await _context.ToolConfigurations.FirstOrDefaultAsync(c => c.ToolName == config.ToolName);
                if (existing != null)
                {
                    existing.ProviderName = config.ProviderName;
                    existing.ModelName = config.ModelName;
                    existing.IsActive = config.IsActive;
                    existing.IsMaintenanceMode = config.IsMaintenanceMode;
                    existing.FallbackProviderName = config.FallbackProviderName;
                    existing.FallbackModelName = config.FallbackModelName;
                    existing.ActiveFromTime = config.ActiveFromTime;
                    existing.ActiveToTime = config.ActiveToTime;
                    existing.MaxDailyRequests = config.MaxDailyRequests;
                    existing.UpdatedAt = DateTime.UtcNow;
                    _context.Update(existing);
                }
                else
                {
                    config.Id = Guid.NewGuid();
                    config.UpdatedAt = DateTime.UtcNow;
                    _context.Add(config);
                }
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = $"{config.ToolName} settings saved successfully.";
            }
            else
            {
                TempData["ErrorMessage"] = $"Failed to save {config.ToolName} settings.";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
