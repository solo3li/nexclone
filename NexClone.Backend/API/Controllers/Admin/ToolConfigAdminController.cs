using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Admin
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
            
            var allConfigs = await _context.ToolConfigurations.Include(c => c.RoutingRules).ToListAsync();
            var providers = await _context.ApiConfigurations.Where(a => a.IsActive).Select(a => a.ProviderName).ToListAsync();
            
            ViewBag.Providers = new SelectList(providers);
            ViewBag.WalletTypes = new SelectList(await _context.WalletTypes.ToListAsync(), "Id", "Name");

            var tools = new[] { "text-to-voice", "voice-to-text", "image-to-video", "advanced-lip-sync", "motion-control" };
            
            var toolConfigs = new Dictionary<string, ToolConfiguration>();
            var concurrencyLimits = new Dictionary<string, int>();

            foreach (var t in tools)
            {
                var config = allConfigs.FirstOrDefault(c => c.ToolName == t);
                if (config == null)
                {
                    config = new ToolConfiguration { ToolName = t, Id = Guid.NewGuid() };
                }
                toolConfigs[t] = config;

                var settingKey = $"Concurrency_{t}";
                var setting = await _context.AppSettings.FirstOrDefaultAsync(s => s.Key == settingKey);
                if (setting != null && int.TryParse(setting.Value, out int limit))
                {
                    concurrencyLimits[t] = limit;
                }
                else
                {
                    concurrencyLimits[t] = 10; // Default limit
                }
            }

            ViewBag.ConcurrencyLimits = concurrencyLimits;
            return View(toolConfigs);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveConfig(ToolConfiguration config, [FromForm] int? MaxConcurrentOperations)
        {
            if (ModelState.IsValid)
            {
                var existing = await _context.ToolConfigurations
                    .Include(c => c.RoutingRules)
                    .FirstOrDefaultAsync(c => c.ToolName == config.ToolName);

                if (existing != null)
                {
                    existing.IsActive = config.IsActive;
                    existing.IsMaintenanceMode = config.IsMaintenanceMode;
                    existing.IsComingSoon = config.IsComingSoon;
                    existing.AllowedWalletTypeIds = config.AllowedWalletTypeIds ?? new List<int>();
                    existing.UpdatedAt = DateTime.UtcNow;

                    _context.ToolRoutingRules.RemoveRange(existing.RoutingRules);
                    
                    if (config.RoutingRules != null)
                    {
                        foreach (var rule in config.RoutingRules)
                        {
                            rule.ToolConfigurationId = existing.Id;
                            _context.ToolRoutingRules.Add(rule);
                        }
                    }

                    _context.Update(existing);
                }
                else
                {
                    config.Id = Guid.NewGuid();
                    config.UpdatedAt = DateTime.UtcNow;
                    if (config.RoutingRules != null)
                    {
                        foreach (var rule in config.RoutingRules)
                        {
                            rule.ToolConfigurationId = config.Id;
                        }
                    }
                    _context.Add(config);
                }
                if (MaxConcurrentOperations.HasValue)
                {
                    string settingKey = $"Concurrency_{config.ToolName}";
                    var setting = await _context.AppSettings.FirstOrDefaultAsync(s => s.Key == settingKey);
                    if (setting != null)
                    {
                        setting.Value = MaxConcurrentOperations.Value.ToString();
                        setting.UpdatedAt = DateTime.UtcNow;
                        _context.Update(setting);
                    }
                    else
                    {
                        _context.AppSettings.Add(new AppSetting
                        {
                            Key = settingKey,
                            Value = MaxConcurrentOperations.Value.ToString(),
                            Description = $"Max concurrent operations for {config.ToolName}",
                            UpdatedAt = DateTime.UtcNow
                        });
                    }
                }

                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = HttpContext.RequestServices.GetRequiredService<Microsoft.Extensions.Localization.IStringLocalizer<NexClone.Backend.Localization.SharedResource>>()["Settings saved successfully."];
            }
            else
            {
                TempData["ErrorMessage"] = HttpContext.RequestServices.GetRequiredService<Microsoft.Extensions.Localization.IStringLocalizer<NexClone.Backend.Localization.SharedResource>>()["Failed to save settings."];
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
