using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
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
            
            var toolConfigs = await _context.ToolConfigurations.ToListAsync();
            var defaultTools = new[] { "text-to-voice", "voice-to-text", "image-to-video", "advanced-lip-sync", "motion-control" };
            bool changesMade = false;
            foreach (var defaultTool in defaultTools)
            {
                if (!toolConfigs.Any(t => t.ToolName == defaultTool))
                {
                    var newConfig = new ToolConfiguration { ToolName = defaultTool, IsActive = true, IsMaintenanceMode = false };
                    _context.ToolConfigurations.Add(newConfig);
                    toolConfigs.Add(newConfig);
                    changesMade = true;
                }
            }
            if (changesMade)
            {
                await _context.SaveChangesAsync();
            }

            ViewBag.ToolConfigurations = toolConfigs;
            return View(settings);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveSettings(Dictionary<string, string> settings)
        {
            if (settings == null) return RedirectToAction(nameof(Index));

            var existingSettings = await _context.AppSettings.ToListAsync();

            foreach (var kvp in settings)
            {
                var setting = existingSettings.FirstOrDefault(s => s.Key == kvp.Key);
                var val = kvp.Value ?? "";
                if (val.Contains(",")) 
                {
                    val = val.Split(',')[0];
                }

                if (setting != null)
                {
                    if (setting.Value != val)
                    {
                        setting.Value = val;
                        setting.UpdatedAt = System.DateTime.UtcNow;
                        _context.Update(setting);
                    }
                }
                else
                {
                    _context.AppSettings.Add(new AppSetting
                    {
                        Key = kvp.Key,
                        Value = val,
                        Description = "Dynamically added setting",
                        UpdatedAt = System.DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveToolsMaintenance(Microsoft.AspNetCore.Http.IFormCollection form)
        {
            var toolConfigs = await _context.ToolConfigurations.ToListAsync();
            foreach (var tool in toolConfigs)
            {
                bool isMaintenance = form.ContainsKey($"toolMaintenance_{tool.Id}");
                bool isComingSoon = form.ContainsKey($"toolComingSoon_{tool.Id}");
                
                if (tool.IsMaintenanceMode != isMaintenance || tool.IsComingSoon != isComingSoon)
                {
                    tool.IsMaintenanceMode = isMaintenance;
                    tool.IsComingSoon = isComingSoon;
                    tool.UpdatedAt = System.DateTime.UtcNow;
                    _context.Update(tool);
                }
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
