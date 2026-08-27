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
            
            var defaultKeys = new Dictionary<string, (string DefaultValue, string Description)>
            {
                { "Site.MaintenanceMode", ("false", "Global maintenance mode toggle") },
                { "Site.MaintenanceEndDate", ("", "Expected maintenance end date/time") },
                { "Origin.AllowedOrigins", ("http://localhost:3000,https://nexmediaai.com", "Comma-separated allowed CORS origins") },
                { "Security.MaxLoginAttempts", ("20", "Max failed login attempts before lockout") },
                { "Security.LockoutMinutes", ("15", "Lockout duration in minutes") },
                { "OAuth.GoogleClientId", ("", "Google OAuth Client ID") },
                { "OAuth.GoogleClientSecret", ("", "Google OAuth Client Secret") },
                { "Company.Name", ("NexMedia AI", "Official company name for invoices") },
                { "Company.SupportEmail", ("support@nexmediaai.com", "Support email for invoices and footer") },
                { "Company.Address", ("Cairo, Egypt", "Business address for invoices") },
                { "Social.Facebook", ("", "Facebook page URL") },
                { "Social.Twitter", ("", "Twitter/X profile URL") },
                { "Social.LinkedIn", ("", "LinkedIn company page URL") },
                { "Social.Instagram", ("", "Instagram profile URL") },
                { "Social.YouTube", ("", "YouTube channel URL") },
                { "Concurrency_tts", ("10", "TTS concurrent processing limit") },
                { "Concurrency_vtt", ("10", "STT concurrent processing limit") },
                { "Concurrency_avatar2video", ("10", "Avatar image-to-video concurrent processing limit") },
                { "Concurrency_lipsync", ("10", "LipSync concurrent processing limit") },
                { "Concurrency_motion_control", ("10", "Motion transfer concurrent processing limit") },
                { "Concurrency_email", ("10", "System emails concurrent processing limit") },
                { "FreePlan.FingerprintCheck", ("true", "Enable fingerprint check for free trial") },
                { "FreePlan.MaxUsesPerDevice", ("1", "Max free trial claims per device") },
                // S3 / Storage provider — managed from Admin Panel
                { "S3.Provider",        ("", "Storage provider label (e.g. MinIO, Railway, AWS S3)") },
                { "S3.Endpoint",        ("", "S3-compatible endpoint without protocol (e.g. bucket.railway.app or s3.amazonaws.com)") },
                { "S3.AccessKey",       ("", "S3 Access Key ID") },
                { "S3.SecretKey",       ("", "S3 Secret Access Key") },
                { "S3.BucketName",      ("", "Bucket name to store uploaded files") },
                { "S3.Region",          ("", "Bucket region (e.g. us-east-1, eu-north-1)") },
                { "S3.UseSSL",          ("true", "Use HTTPS/SSL when connecting to S3 endpoint (true/false)") },
                { "S3.PublicEndpoint",  ("", "Public-facing URL base for generating download links (leave blank to use main endpoint)") },
                { "S3.PublicUseSSL",    ("true", "Use HTTPS for public presigned URLs (true/false)") }
            };

            bool changesMade = false;
            foreach (var kvp in defaultKeys)
            {
                if (!settings.Any(s => s.Key == kvp.Key))
                {
                    var newSetting = new AppSetting 
                    { 
                        Key = kvp.Key, 
                        Value = kvp.Value.DefaultValue, 
                        Description = kvp.Value.Description, 
                        UpdatedAt = System.DateTime.UtcNow 
                    };
                    _context.AppSettings.Add(newSetting);
                    settings.Add(newSetting);
                    changesMade = true;
                }
            }

            if (changesMade)
            {
                await _context.SaveChangesAsync();
            }

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
            TempData["SuccessMessage"] = "Settings saved successfully.";
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
                string additionalSettings = form.ContainsKey($"toolSettings_{tool.Id}") ? form[$"toolSettings_{tool.Id}"].ToString() : tool.AdditionalSettings;
                
                if (tool.IsMaintenanceMode != isMaintenance || tool.IsComingSoon != isComingSoon || tool.AdditionalSettings != additionalSettings)
                {
                    tool.IsMaintenanceMode = isMaintenance;
                    tool.IsComingSoon = isComingSoon;
                    tool.AdditionalSettings = additionalSettings;
                    tool.UpdatedAt = System.DateTime.UtcNow;
                    _context.Update(tool);
                }
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
