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
            try
            {
                ViewData["Title"] = "Tool Settings Dashboard";
                
                var allConfigs = await _context.ToolConfigurations.ToListAsync();
                var tools = new[] { "text-to-voice", "voice-to-text", "image-to-video", "advanced-lip-sync", "motion-control", "text-to-video", "text-to-image", "reference-to-video" };
                
                var toolConfigs = new Dictionary<string, ToolConfiguration>();

                foreach (var t in tools)
                {
                    var config = allConfigs.FirstOrDefault(c => c.ToolName == t);
                    if (config == null)
                    {
                        config = new ToolConfiguration { ToolName = t, IsActive = false, Id = Guid.NewGuid() };
                    }
                    toolConfigs[t] = config;
                }

                return View(toolConfigs);
            }
            catch (Exception ex)
            {
                return Content($"ERROR: {ex.Message}\n{ex.StackTrace}\n{ex.InnerException?.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> Edit(string id)
        {
            if (string.IsNullOrEmpty(id)) return RedirectToAction(nameof(Index));

            ViewData["Title"] = $"Manage {id.ToUpper().Replace("-", " ")}";
            
            var config = await _context.ToolConfigurations.Include(c => c.RoutingRules).FirstOrDefaultAsync(c => c.ToolName == id);
            if (config == null)
            {
                config = new ToolConfiguration { ToolName = id, Id = Guid.NewGuid() };
            }

            var providers = await _context.ApiConfigurations.Where(a => a.IsActive).Select(a => a.ProviderName).ToListAsync();
            ViewBag.Providers = new SelectList(providers);

            var settingKey = $"Concurrency_{id}";
            var setting = await _context.AppSettings.FirstOrDefaultAsync(s => s.Key == settingKey);
            if (setting != null && int.TryParse(setting.Value, out int limit))
            {
                ViewBag.MaxConcurrentOperations = limit;
            }
            else
            {
                ViewBag.MaxConcurrentOperations = 10;
            }

            return View(config);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveConfig(ToolConfiguration config, int? MaxConcurrentOperations, Dictionary<string, decimal> ModelCosts, Dictionary<string, bool> ModelIsPerSecond)
        {
            // Clear validation errors for implicitly required navigation properties or optional strings
            var keysToRemove = ModelState.Keys.Where(k => 
                k.Contains("ToolConfiguration") || 
                k.Contains("ModelName") || 
                k == "Id").ToList();

            foreach (var key in keysToRemove)
            {
                ModelState.Remove(key);
            }

            if (!ModelState.IsValid)
            {
                var errors = string.Join(" | ", ModelState.Where(ms => ms.Value.Errors.Any()).Select(ms => ms.Key + ": " + string.Join(", ", ms.Value.Errors.Select(e => e.ErrorMessage))));
                TempData["ErrorMessage"] = "Validation failed: " + errors;
                return RedirectToAction(nameof(Edit), new { id = config.ToolName });
            }

            if (ModelState.IsValid)
            {
                if (ModelCosts != null && ModelCosts.Count > 0 && 
                    (config.ToolName == "text-to-video" || config.ToolName == "image-to-video" || config.ToolName == "reference-to-video" || config.ToolName == "text-to-image" || config.ToolName == "advanced-lip-sync"))
                {
                    bool isVideo = config.ToolName != "text-to-image";
                    var settingsDict = new System.Collections.Generic.Dictionary<string, object>();
                    foreach (var kvp in ModelCosts)
                    {
                        var modelName = kvp.Key;
                        var cost = kvp.Value;
                        
                        bool isPerSec = isVideo; // Default behavior
                        if (ModelIsPerSecond != null && ModelIsPerSecond.ContainsKey(modelName))
                        {
                            isPerSec = ModelIsPerSecond[modelName];
                        }

                        if (isPerSec)
                        {
                            settingsDict[modelName] = new
                            {
                                IsPerSecond = true,
                                BaseCost = 0m,
                                CostPerSecond = new System.Collections.Generic.Dictionary<string, decimal> { { "default", cost } },
                                FixedCost = new System.Collections.Generic.Dictionary<string, decimal>()
                            };
                        }
                        else
                        {
                            settingsDict[modelName] = new
                            {
                                IsPerSecond = false,
                                BaseCost = 0m,
                                CostPerSecond = new System.Collections.Generic.Dictionary<string, decimal>(),
                                FixedCost = new System.Collections.Generic.Dictionary<string, decimal> { { "default", cost } }
                            };
                        }
                    }
                    config.AdditionalSettings = System.Text.Json.JsonSerializer.Serialize(settingsDict);
                }

                var existing = await _context.ToolConfigurations
                    .Include(c => c.RoutingRules)
                    .FirstOrDefaultAsync(c => c.ToolName == config.ToolName);

                if (existing != null)
                {
                    existing.IsActive = config.IsActive;
                    existing.IsMaintenanceMode = config.IsMaintenanceMode;
                    existing.IsComingSoon = config.IsComingSoon;
                    existing.AllowStandardCredits = config.AllowStandardCredits;
                    existing.AllowPremiumCredits = config.AllowPremiumCredits;
                    existing.UpdatedAt = DateTime.UtcNow;

                    _context.ToolRoutingRules.RemoveRange(existing.RoutingRules);
                    
                    if (config.ToolName == "text-to-video" || config.ToolName == "image-to-video" || 
                        config.ToolName == "reference-to-video" || config.ToolName == "text-to-image")
                    {
                        // Add a default routing rule for these tools since we hid the UI
                        config.RoutingRules = new List<ToolRoutingRule>
                        {
                            new ToolRoutingRule
                            {
                                ProviderName = "Crun AI",
                                ToolConfigurationId = existing.Id
                            }
                        };
                    }

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

                    if (config.ToolName == "text-to-video" || config.ToolName == "image-to-video" || 
                        config.ToolName == "reference-to-video" || config.ToolName == "text-to-image")
                    {
                        config.RoutingRules = new List<ToolRoutingRule>
                        {
                            new ToolRoutingRule
                            {
                                ProviderName = "Crun AI",
                                ToolConfigurationId = config.Id
                            }
                        };
                    }

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
                        _context.Update(setting);
                    }
                    else
                    {
                        _context.AppSettings.Add(new Core.Entities.AppSetting
                        {
                            Key = settingKey,
                            Value = MaxConcurrentOperations.Value.ToString()
                        });
                    }
                }

                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Configuration saved successfully.";
                return RedirectToAction(nameof(Edit), new { id = config.ToolName });
            }
            
            TempData["ErrorMessage"] = "Failed to save configuration.";
            return RedirectToAction(nameof(Edit), new { id = config.ToolName });
        }
    }
}
