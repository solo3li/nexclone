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

            if (id == "text-to-video")
            {
                var t2vSetting = await _context.TextToVideoSettings.FirstOrDefaultAsync();
                if (t2vSetting == null)
                {
                    t2vSetting = new Core.Entities.TextToVideoSetting { Id = 1, MaxPromptLength = 5000, MaxDurationSeconds = 20, DefaultResolution = "720p", MaxConcurrentOperations = 10, IsActive = true };
                    _context.TextToVideoSettings.Add(t2vSetting);
                    await _context.SaveChangesAsync();
                }
                ViewBag.TextToVideoSetting = t2vSetting;

                var t2vPricings = await _context.TextToVideoModelPricings.ToListAsync();
                if (t2vPricings.Count == 0)
                {
                    t2vPricings = new List<Core.Entities.TextToVideoModelPricing>
                    {
                        new Core.Entities.TextToVideoModelPricing { ModelName = "veo 3.1 Fast", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 30.0m, FixedCost_1080p = 37.5m, FixedCost_4k = 90.0m, AllowedWallet = "Standard", IsActive = true },
                        new Core.Entities.TextToVideoModelPricing { ModelName = "veo 3.1 Lite", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 15.0m, FixedCost_1080p = 22.5m, FixedCost_4k = 75.0m, AllowedWallet = "Standard", IsActive = true },
                        new Core.Entities.TextToVideoModelPricing { ModelName = "veo 3.1 Quality", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 225.0m, FixedCost_1080p = 232.5m, FixedCost_4k = 285.0m, AllowedWallet = "Standard", IsActive = true },
                        new Core.Entities.TextToVideoModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI", BillingType = "PerSecond", CostPerSecond_480p = 2.4m, CostPerSecond_720p = 4.5m, CostPerSecond_1080p = 8.0m, AllowedWallet = "Standard", IsActive = true }
                    };
                    _context.TextToVideoModelPricings.AddRange(t2vPricings);
                    await _context.SaveChangesAsync();
                }
                ViewBag.TextToVideoPricings = t2vPricings;
            }

            if (id == "image-to-video" || id == "reference-to-video")
            {
                var i2vSetting = await _context.ImageToVideoSettings.FirstOrDefaultAsync();
                if (i2vSetting == null)
                {
                    i2vSetting = new Core.Entities.ImageToVideoSetting { Id = 1, MaxPromptLength = 5000, MaxImageFileSizeMb = 25, MaxDurationSeconds = 20, MaxConcurrentOperations = 10, IsActive = true };
                    _context.ImageToVideoSettings.Add(i2vSetting);
                    await _context.SaveChangesAsync();
                }
                ViewBag.ImageToVideoSetting = i2vSetting;

                var i2vPricings = await _context.ImageToVideoModelPricings.ToListAsync();
                if (i2vPricings.Count == 0)
                {
                    i2vPricings = new List<Core.Entities.ImageToVideoModelPricing>
                    {
                        new Core.Entities.ImageToVideoModelPricing { ModelName = "veo 3.1 Fast", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 30.0m, FixedCost_1080p = 37.5m, FixedCost_4k = 90.0m, AllowedWallet = "Standard", IsActive = true },
                        new Core.Entities.ImageToVideoModelPricing { ModelName = "veo 3.1 Lite", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 15.0m, FixedCost_1080p = 22.5m, FixedCost_4k = 75.0m, AllowedWallet = "Standard", IsActive = true },
                        new Core.Entities.ImageToVideoModelPricing { ModelName = "veo 3.1 Quality", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 225.0m, FixedCost_1080p = 232.5m, FixedCost_4k = 285.0m, AllowedWallet = "Standard", IsActive = true },
                        new Core.Entities.ImageToVideoModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI", BillingType = "PerSecond", CostPerSecond_480p = 2.4m, CostPerSecond_720p = 4.5m, CostPerSecond_1080p = 8.0m, AllowedWallet = "Standard", IsActive = true }
                    };
                    _context.ImageToVideoModelPricings.AddRange(i2vPricings);
                    await _context.SaveChangesAsync();
                }
                else if (id == "image-to-video" && !i2vPricings.Any(p => p.ModelName.ToLower().Contains("grok")))
                {
                    var grokPricing = new Core.Entities.ImageToVideoModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI", BillingType = "PerSecond", CostPerSecond_480p = 2.4m, CostPerSecond_720p = 4.5m, CostPerSecond_1080p = 8.0m, AllowedWallet = "Standard", IsActive = true };
                    _context.ImageToVideoModelPricings.Add(grokPricing);
                    await _context.SaveChangesAsync();
                    i2vPricings.Add(grokPricing);
                }
                ViewBag.ImageToVideoPricings = i2vPricings;
            }

            if (id == "text-to-image")
            {
                var t2iSetting = await _context.TextToImageSettings.FirstOrDefaultAsync();
                if (t2iSetting == null)
                {
                    t2iSetting = new Core.Entities.TextToImageSetting { Id = 1, MaxPromptLength = 5000, MaxConcurrentOperations = 10, IsActive = true };
                    _context.TextToImageSettings.Add(t2iSetting);
                    await _context.SaveChangesAsync();
                }
                ViewBag.TextToImageSetting = t2iSetting;

                var t2iPricing = await _context.TextToImageModelPricings.FirstOrDefaultAsync();
                if (t2iPricing == null)
                {
                    t2iPricing = new Core.Entities.TextToImageModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI", CostPerImage = 4.0m, AllowedWallet = "Standard", IsActive = true };
                    _context.TextToImageModelPricings.Add(t2iPricing);
                    await _context.SaveChangesAsync();
                }
                ViewBag.TextToImageModelPricing = t2iPricing;
            }

            if (id == "advanced-lip-sync" || id == "vidu_advanced_lip_sync" || id == "lipsync")
            {
                var lipSetting = await _context.LipSyncSettings.FirstOrDefaultAsync();
                if (lipSetting == null)
                {
                    lipSetting = new Core.Entities.LipSyncSetting { Id = 1, MaxVideoFileSizeMb = 100, MaxAudioFileSizeMb = 25, MaxAudioDurationSeconds = 120, MaxConcurrentOperations = 10, IsActive = true };
                    _context.LipSyncSettings.Add(lipSetting);
                    await _context.SaveChangesAsync();
                }
                ViewBag.LipSyncSetting = lipSetting;

                var lipPricings = await _context.LipSyncModelPricings.ToListAsync();
                if (lipPricings.Count == 0)
                {
                    lipPricings = new List<Core.Entities.LipSyncModelPricing>
                    {
                        new Core.Entities.LipSyncModelPricing { ModelName = "vidu-lipsync-tts", ProviderName = "CrunAI", BillingType = "Per5Seconds", BaseCost = 18.0m, CostPerSecond = 3.6m, AllowedWallet = "Standard", IsActive = true },
                        new Core.Entities.LipSyncModelPricing { ModelName = "vidu-lipsync-audio", ProviderName = "CrunAI", BillingType = "Per5Seconds", BaseCost = 12.0m, CostPerSecond = 2.4m, AllowedWallet = "Standard", IsActive = true }
                    };
                    _context.LipSyncModelPricings.AddRange(lipPricings);
                    await _context.SaveChangesAsync();
                }
                else if (lipPricings.Count == 1)
                {
                    var existing = lipPricings[0];
                    existing.ModelName = "vidu-lipsync-tts";
                    if (existing.BaseCost <= 0) existing.BaseCost = 18.0m;
                    existing.CostPerSecond = Math.Round(existing.BaseCost / 5.0m, 2);
                    existing.BillingType = "Per5Seconds";

                    var audioPricing = new Core.Entities.LipSyncModelPricing { ModelName = "vidu-lipsync-audio", ProviderName = "CrunAI", BillingType = "Per5Seconds", BaseCost = 12.0m, CostPerSecond = 2.4m, AllowedWallet = "Standard", IsActive = true };
                    _context.LipSyncModelPricings.Add(audioPricing);
                    await _context.SaveChangesAsync();
                    lipPricings.Add(audioPricing);
                }
                ViewBag.LipSyncPricings = lipPricings;
            }

            return View(config);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveConfig(ToolConfiguration config, int? MaxConcurrentOperations)
        {
            var ModelCosts = new Dictionary<string, decimal>();
            var ModelIsPerSecond = new Dictionary<string, bool>();

            foreach (var key in Request.Form.Keys)
            {
                if (key.StartsWith("ModelCosts["))
                {
                    var mKey = key.Substring(11, key.Length - 12);
                    if (decimal.TryParse(Request.Form[key].ToString(), out decimal val))
                    {
                        ModelCosts[mKey] = val;
                    }
                }
                else if (key.StartsWith("ModelIsPerSecond["))
                {
                    var mKey = key.Substring(17, key.Length - 18);
                    var valStr = Request.Form[key].ToString();
                    ModelIsPerSecond[mKey] = valStr.Contains("true", StringComparison.OrdinalIgnoreCase);
                }
            }

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
                if (ModelCosts != null && ModelCosts.Any())
                {
                    bool isVideo = config.ToolName != "text-to-image";
                    var settingsDict = new System.Collections.Generic.Dictionary<string, NexClone.Backend.Application.Services.ModelPricingConfig>();
                    foreach (var kvp in ModelCosts)
                    {
                        var rawKey = kvp.Key;
                        var cost = kvp.Value;

                        var parts = rawKey.Split('|');
                        var modelName = parts[0];
                        var res = parts.Length > 1 ? parts[1].ToLower() : "default";

                        bool isPerSec = isVideo; // Default behavior
                        if (ModelIsPerSecond != null && ModelIsPerSecond.ContainsKey(rawKey))
                        {
                            isPerSec = ModelIsPerSecond[rawKey];
                        }

                        if (!settingsDict.TryGetValue(modelName, out var mConfig))
                        {
                            mConfig = new NexClone.Backend.Application.Services.ModelPricingConfig
                            {
                                IsPerSecond = isPerSec,
                                BaseCost = 0m
                            };
                            settingsDict[modelName] = mConfig;
                        }

                        if (isPerSec)
                        {
                            mConfig.CostPerSecond[res] = cost;
                        }
                        else
                        {
                            mConfig.FixedCost[res] = cost;
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

                    if (ModelCosts != null && ModelCosts.Any())
                    {
                        existing.AdditionalSettings = config.AdditionalSettings;
                    }

                    _context.ToolRoutingRules.RemoveRange(existing.RoutingRules);
                    
                    if (config.ToolName == "text-to-video" || config.ToolName == "image-to-video" || 
                        config.ToolName == "reference-to-video" || config.ToolName == "text-to-image" || config.ToolName == "advanced-lip-sync")
                    {
                        // Add a default routing rule for these tools since we hid the UI
                        config.RoutingRules = new List<ToolRoutingRule>
                        {
                            new ToolRoutingRule
                            {
                                ProviderName = "Crun AI",
                                ModelName = "Default",
                                ToolConfigurationId = existing.Id
                            }
                        };
                    }

                    if (config.RoutingRules != null)
                    {
                        foreach (var rule in config.RoutingRules)
                        {
                            if (string.IsNullOrWhiteSpace(rule.ModelName) && string.IsNullOrWhiteSpace(rule.ProviderName)) continue;
                            if (string.IsNullOrWhiteSpace(rule.ModelName)) rule.ModelName = "Default";
                            
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
                        config.ToolName == "reference-to-video" || config.ToolName == "text-to-image" || config.ToolName == "advanced-lip-sync")
                    {
                        config.RoutingRules = new List<ToolRoutingRule>
                        {
                            new ToolRoutingRule
                            {
                                ProviderName = "Crun AI",
                                ModelName = "Default",
                                ToolConfigurationId = config.Id
                            }
                        };
                    }

                    if (config.RoutingRules != null)
                    {
                        config.RoutingRules = config.RoutingRules
                            .Where(r => !string.IsNullOrWhiteSpace(r.ModelName) || !string.IsNullOrWhiteSpace(r.ProviderName))
                            .ToList();
                            
                        foreach (var rule in config.RoutingRules)
                        {
                            if (string.IsNullOrWhiteSpace(rule.ModelName)) rule.ModelName = "Default";
                            
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

                // Synchronize Dedicated Tool Tables
                if (config.ToolName == "kling_avatar_image2video" || config.ToolName == "avatar-to-video")
                {
                    var avatarSetting = await _context.AvatarToVideoSettings.FirstOrDefaultAsync();
                    if (avatarSetting == null)
                    {
                        avatarSetting = new Core.Entities.AvatarToVideoSetting { Id = 1 };
                        _context.AvatarToVideoSettings.Add(avatarSetting);
                    }
                    avatarSetting.IsActive = config.IsActive;
                    avatarSetting.MaxConcurrentOperations = MaxConcurrentOperations ?? 10;
                    avatarSetting.UpdatedAt = DateTime.UtcNow;

                    var avatarPricing = await _context.AvatarToVideoModelPricings.FirstOrDefaultAsync();
                    if (avatarPricing != null)
                    {
                        avatarPricing.IsActive = config.IsActive;
                        avatarPricing.AllowedWallet = config.AllowPremiumCredits && !config.AllowStandardCredits ? "Premium" : (config.AllowStandardCredits && !config.AllowPremiumCredits ? "Standard" : "Both");
                        if (ModelCosts.ContainsKey("default")) avatarPricing.UnitCost = ModelCosts["default"];
                    }
                }
                else if (config.ToolName == "text-to-video")
                {
                    var t2vSetting = await _context.TextToVideoSettings.FirstOrDefaultAsync();
                    if (t2vSetting == null)
                    {
                        t2vSetting = new Core.Entities.TextToVideoSetting { Id = 1 };
                        _context.TextToVideoSettings.Add(t2vSetting);
                    }
                    t2vSetting.IsActive = config.IsActive;
                    t2vSetting.MaxConcurrentOperations = MaxConcurrentOperations ?? 10;
                    if (int.TryParse(Request.Form["MaxPromptLength"].ToString(), out int maxPrompt) && maxPrompt > 0)
                        t2vSetting.MaxPromptLength = maxPrompt;
                    if (int.TryParse(Request.Form["MaxDurationSeconds"].ToString(), out int maxDur) && maxDur > 0)
                        t2vSetting.MaxDurationSeconds = maxDur;
                    t2vSetting.UpdatedAt = DateTime.UtcNow;

                    string defaultWallet = config.AllowPremiumCredits && !config.AllowStandardCredits ? "Premium" : (config.AllowStandardCredits && !config.AllowPremiumCredits ? "Standard" : "Both");

                    // Veo Fast
                    var veoFast = await _context.TextToVideoModelPricings.FirstOrDefaultAsync(p => p.ModelName == "veo 3.1 Fast");
                    if (veoFast == null) { veoFast = new Core.Entities.TextToVideoModelPricing { ModelName = "veo 3.1 Fast", ProviderName = "CrunAI", BillingType = "PerRequest" }; _context.TextToVideoModelPricings.Add(veoFast); }
                    veoFast.IsActive = config.IsActive;
                    veoFast.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("veo 3.1 Fast|720p")) veoFast.FixedCost_720p = ModelCosts["veo 3.1 Fast|720p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Fast|1080p")) veoFast.FixedCost_1080p = ModelCosts["veo 3.1 Fast|1080p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Fast|4k")) veoFast.FixedCost_4k = ModelCosts["veo 3.1 Fast|4k"];

                    // Veo Lite
                    var veoLite = await _context.TextToVideoModelPricings.FirstOrDefaultAsync(p => p.ModelName == "veo 3.1 Lite");
                    if (veoLite == null) { veoLite = new Core.Entities.TextToVideoModelPricing { ModelName = "veo 3.1 Lite", ProviderName = "CrunAI", BillingType = "PerRequest" }; _context.TextToVideoModelPricings.Add(veoLite); }
                    veoLite.IsActive = config.IsActive;
                    veoLite.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("veo 3.1 Lite|720p")) veoLite.FixedCost_720p = ModelCosts["veo 3.1 Lite|720p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Lite|1080p")) veoLite.FixedCost_1080p = ModelCosts["veo 3.1 Lite|1080p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Lite|4k")) veoLite.FixedCost_4k = ModelCosts["veo 3.1 Lite|4k"];

                    // Veo Quality
                    var veoQuality = await _context.TextToVideoModelPricings.FirstOrDefaultAsync(p => p.ModelName == "veo 3.1 Quality");
                    if (veoQuality == null) { veoQuality = new Core.Entities.TextToVideoModelPricing { ModelName = "veo 3.1 Quality", ProviderName = "CrunAI", BillingType = "PerRequest" }; _context.TextToVideoModelPricings.Add(veoQuality); }
                    veoQuality.IsActive = config.IsActive;
                    veoQuality.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("veo 3.1 Quality|720p")) veoQuality.FixedCost_720p = ModelCosts["veo 3.1 Quality|720p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Quality|1080p")) veoQuality.FixedCost_1080p = ModelCosts["veo 3.1 Quality|1080p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Quality|4k")) veoQuality.FixedCost_4k = ModelCosts["veo 3.1 Quality|4k"];

                    // Grok Imagine Video
                    var grokPricing = await _context.TextToVideoModelPricings.FirstOrDefaultAsync(p => p.ModelName.ToLower().Contains("grok"));
                    if (grokPricing == null) { grokPricing = new Core.Entities.TextToVideoModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI", BillingType = "PerSecond" }; _context.TextToVideoModelPricings.Add(grokPricing); }
                    grokPricing.IsActive = config.IsActive;
                    grokPricing.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("grok-imagine|480p")) grokPricing.CostPerSecond_480p = ModelCosts["grok-imagine|480p"];
                    if (ModelCosts.ContainsKey("grok-imagine|720p")) grokPricing.CostPerSecond_720p = ModelCosts["grok-imagine|720p"];
                    if (ModelCosts.ContainsKey("grok-imagine|1080p")) grokPricing.CostPerSecond_1080p = ModelCosts["grok-imagine|1080p"];
                }
                else if (config.ToolName == "image-to-video" || config.ToolName == "reference-to-video")
                {
                    var i2vSetting = await _context.ImageToVideoSettings.FirstOrDefaultAsync();
                    if (i2vSetting == null)
                    {
                        i2vSetting = new Core.Entities.ImageToVideoSetting { Id = 1 };
                        _context.ImageToVideoSettings.Add(i2vSetting);
                    }
                    i2vSetting.IsActive = config.IsActive;
                    i2vSetting.MaxConcurrentOperations = MaxConcurrentOperations ?? 10;
                    if (int.TryParse(Request.Form["MaxPromptLength"].ToString(), out int maxPrompt) && maxPrompt > 0)
                        i2vSetting.MaxPromptLength = maxPrompt;
                    if (long.TryParse(Request.Form["MaxImageFileSizeMb"].ToString(), out long maxFileSize) && maxFileSize > 0)
                        i2vSetting.MaxImageFileSizeMb = maxFileSize;
                    if (int.TryParse(Request.Form["MaxDurationSeconds"].ToString(), out int maxDur) && maxDur > 0)
                        i2vSetting.MaxDurationSeconds = maxDur;
                    i2vSetting.UpdatedAt = DateTime.UtcNow;

                    string defaultWallet = config.AllowPremiumCredits && !config.AllowStandardCredits ? "Premium" : (config.AllowStandardCredits && !config.AllowPremiumCredits ? "Standard" : "Both");

                    // Veo Fast
                    var veoFast = await _context.ImageToVideoModelPricings.FirstOrDefaultAsync(p => p.ModelName == "veo 3.1 Fast");
                    if (veoFast == null) { veoFast = new Core.Entities.ImageToVideoModelPricing { ModelName = "veo 3.1 Fast", ProviderName = "CrunAI", BillingType = "PerRequest" }; _context.ImageToVideoModelPricings.Add(veoFast); }
                    veoFast.IsActive = config.IsActive;
                    veoFast.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("veo 3.1 Fast|720p")) veoFast.FixedCost_720p = ModelCosts["veo 3.1 Fast|720p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Fast|1080p")) veoFast.FixedCost_1080p = ModelCosts["veo 3.1 Fast|1080p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Fast|4k")) veoFast.FixedCost_4k = ModelCosts["veo 3.1 Fast|4k"];

                    // Veo Lite
                    var veoLite = await _context.ImageToVideoModelPricings.FirstOrDefaultAsync(p => p.ModelName == "veo 3.1 Lite");
                    if (veoLite == null) { veoLite = new Core.Entities.ImageToVideoModelPricing { ModelName = "veo 3.1 Lite", ProviderName = "CrunAI", BillingType = "PerRequest" }; _context.ImageToVideoModelPricings.Add(veoLite); }
                    veoLite.IsActive = config.IsActive;
                    veoLite.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("veo 3.1 Lite|720p")) veoLite.FixedCost_720p = ModelCosts["veo 3.1 Lite|720p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Lite|1080p")) veoLite.FixedCost_1080p = ModelCosts["veo 3.1 Lite|1080p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Lite|4k")) veoLite.FixedCost_4k = ModelCosts["veo 3.1 Lite|4k"];

                    // Veo Quality
                    var veoQuality = await _context.ImageToVideoModelPricings.FirstOrDefaultAsync(p => p.ModelName == "veo 3.1 Quality");
                    if (veoQuality == null) { veoQuality = new Core.Entities.ImageToVideoModelPricing { ModelName = "veo 3.1 Quality", ProviderName = "CrunAI", BillingType = "PerRequest" }; _context.ImageToVideoModelPricings.Add(veoQuality); }
                    veoQuality.IsActive = config.IsActive;
                    veoQuality.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("veo 3.1 Quality|720p")) veoQuality.FixedCost_720p = ModelCosts["veo 3.1 Quality|720p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Quality|1080p")) veoQuality.FixedCost_1080p = ModelCosts["veo 3.1 Quality|1080p"];
                    if (ModelCosts.ContainsKey("veo 3.1 Quality|4k")) veoQuality.FixedCost_4k = ModelCosts["veo 3.1 Quality|4k"];

                    // Grok Imagine Video
                    var grokPricing = await _context.ImageToVideoModelPricings.FirstOrDefaultAsync(p => p.ModelName.ToLower().Contains("grok"));
                    if (grokPricing == null) { grokPricing = new Core.Entities.ImageToVideoModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI", BillingType = "PerSecond" }; _context.ImageToVideoModelPricings.Add(grokPricing); }
                    grokPricing.IsActive = config.IsActive;
                    grokPricing.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("grok-imagine|480p")) grokPricing.CostPerSecond_480p = ModelCosts["grok-imagine|480p"];
                    if (ModelCosts.ContainsKey("grok-imagine|720p")) grokPricing.CostPerSecond_720p = ModelCosts["grok-imagine|720p"];
                    if (ModelCosts.ContainsKey("grok-imagine|1080p")) grokPricing.CostPerSecond_1080p = ModelCosts["grok-imagine|1080p"];
                }
                else if (config.ToolName == "advanced-lip-sync" || config.ToolName == "vidu_advanced_lip_sync" || config.ToolName == "lipsync")
                {
                    var lipSetting = await _context.LipSyncSettings.FirstOrDefaultAsync();
                    if (lipSetting == null)
                    {
                        lipSetting = new Core.Entities.LipSyncSetting { Id = 1 };
                        _context.LipSyncSettings.Add(lipSetting);
                    }
                    lipSetting.IsActive = config.IsActive;
                    lipSetting.MaxConcurrentOperations = MaxConcurrentOperations ?? 10;
                    if (long.TryParse(Request.Form["MaxVideoFileSizeMb"].ToString(), out long maxVidSize) && maxVidSize > 0)
                        lipSetting.MaxVideoFileSizeMb = maxVidSize;
                    if (long.TryParse(Request.Form["MaxAudioFileSizeMb"].ToString(), out long maxAudSize) && maxAudSize > 0)
                        lipSetting.MaxAudioFileSizeMb = maxAudSize;
                    if (int.TryParse(Request.Form["MaxAudioDurationSeconds"].ToString(), out int maxDur) && maxDur > 0)
                        lipSetting.MaxAudioDurationSeconds = maxDur;
                    lipSetting.UpdatedAt = DateTime.UtcNow;

                    string defaultWallet = config.AllowPremiumCredits && !config.AllowStandardCredits ? "Premium" : (config.AllowStandardCredits && !config.AllowPremiumCredits ? "Standard" : "Both");

                    // TTS LipSync
                    var ttsPricing = await _context.LipSyncModelPricings.FirstOrDefaultAsync(p => p.ModelName == "vidu-lipsync-tts" || p.ModelName == "tts");
                    if (ttsPricing == null) { ttsPricing = new Core.Entities.LipSyncModelPricing { ModelName = "vidu-lipsync-tts", ProviderName = "CrunAI", BillingType = "Per5Seconds" }; _context.LipSyncModelPricings.Add(ttsPricing); }
                    ttsPricing.IsActive = config.IsActive;
                    ttsPricing.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("vidu-lipsync-tts"))
                    {
                        ttsPricing.BaseCost = ModelCosts["vidu-lipsync-tts"];
                        ttsPricing.CostPerSecond = Math.Round(ttsPricing.BaseCost / 5.0m, 2);
                    }

                    // Audio LipSync
                    var audioPricing = await _context.LipSyncModelPricings.FirstOrDefaultAsync(p => p.ModelName == "vidu-lipsync-audio" || p.ModelName == "audio" || p.ModelName == "vidu_advanced_lip_sync" || p.ModelName == "vidu-lipsync-std");
                    if (audioPricing == null) { audioPricing = new Core.Entities.LipSyncModelPricing { ModelName = "vidu-lipsync-audio", ProviderName = "CrunAI", BillingType = "Per5Seconds" }; _context.LipSyncModelPricings.Add(audioPricing); }
                    audioPricing.IsActive = config.IsActive;
                    audioPricing.AllowedWallet = defaultWallet;
                    if (ModelCosts.ContainsKey("vidu-lipsync-audio"))
                    {
                        audioPricing.BaseCost = ModelCosts["vidu-lipsync-audio"];
                        audioPricing.CostPerSecond = Math.Round(audioPricing.BaseCost / 5.0m, 2);
                    }
                }
                else if (config.ToolName == "text-to-image")
                {
                    var imgSetting = await _context.TextToImageSettings.FirstOrDefaultAsync();
                    if (imgSetting == null)
                    {
                        imgSetting = new Core.Entities.TextToImageSetting { Id = 1 };
                        _context.TextToImageSettings.Add(imgSetting);
                    }
                    imgSetting.IsActive = config.IsActive;
                    imgSetting.MaxConcurrentOperations = MaxConcurrentOperations ?? 10;
                    if (int.TryParse(Request.Form["MaxPromptLength"].ToString(), out int maxPrompt) && maxPrompt > 0)
                    {
                        imgSetting.MaxPromptLength = maxPrompt;
                    }
                    imgSetting.UpdatedAt = DateTime.UtcNow;

                    var imgPricing = await _context.TextToImageModelPricings.FirstOrDefaultAsync();
                    if (imgPricing == null)
                    {
                        imgPricing = new Core.Entities.TextToImageModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI" };
                        _context.TextToImageModelPricings.Add(imgPricing);
                    }
                    imgPricing.IsActive = config.IsActive;
                    imgPricing.AllowedWallet = config.AllowPremiumCredits && !config.AllowStandardCredits ? "Premium" : (config.AllowStandardCredits && !config.AllowPremiumCredits ? "Standard" : "Both");
                    
                    if (ModelCosts.ContainsKey("grok-imagine")) imgPricing.CostPerImage = ModelCosts["grok-imagine"];
                    else if (ModelCosts.ContainsKey("grok-imagine|t2i")) imgPricing.CostPerImage = ModelCosts["grok-imagine|t2i"];
                    else if (ModelCosts.ContainsKey("default")) imgPricing.CostPerImage = ModelCosts["default"];
                }
                else if (config.ToolName == "motion-control" || config.ToolName == "kling_motion_control")
                {
                    var mcSetting = await _context.MotionControlSettings.FirstOrDefaultAsync();
                    if (mcSetting == null)
                    {
                        mcSetting = new Core.Entities.MotionControlSetting { Id = 1 };
                        _context.MotionControlSettings.Add(mcSetting);
                    }
                    mcSetting.IsActive = config.IsActive;
                    mcSetting.MaxConcurrentOperations = MaxConcurrentOperations ?? 10;
                    mcSetting.UpdatedAt = DateTime.UtcNow;

                    var mcPricing = await _context.MotionControlModelPricings.FirstOrDefaultAsync();
                    if (mcPricing != null)
                    {
                        mcPricing.IsActive = config.IsActive;
                        mcPricing.AllowedWallet = config.AllowPremiumCredits && !config.AllowStandardCredits ? "Premium" : "Standard";
                        if (ModelCosts.ContainsKey("default")) mcPricing.CostPerSecond = ModelCosts["default"];
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
