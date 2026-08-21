using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using System.Collections.Generic;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlatformController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly NexClone.Backend.Core.Interfaces.IMediaService _mediaService;
        private readonly NexClone.Backend.Core.Interfaces.ITtsCatalogService _ttsCatalog;

        public PlatformController(ApplicationDbContext context, NexClone.Backend.Core.Interfaces.IMediaService mediaService, NexClone.Backend.Core.Interfaces.ITtsCatalogService ttsCatalog)
        {
            _context = context;
            _mediaService = mediaService;
            _ttsCatalog = ttsCatalog;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userCount = await _context.Users.CountAsync();
            var subCount = await _context.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.Status == "active" && s.Plan.PriceUsd > 0 && !s.Plan.IsDefaultRegistrationPlan)
                .CountAsync();

            return Ok(new
            {
                TotalUsers = userCount,
                ActiveSubscriptions = subCount,
                PlatformStatus = "Online",
                Version = "1.0.0"
            });
        }

        [HttpGet("tools-config")]
        public async Task<IActionResult> GetToolsConfig()
        {
            var configs = await _context.ToolConfigurations.ToListAsync();
            var result = configs.ToDictionary(c => c.ToolName, c => new
            {
                isActive = c.IsActive,
                isMaintenanceMode = c.IsMaintenanceMode,
                isComingSoon = c.IsComingSoon
            });
            return Ok(result);
        }

        [HttpGet("plans")]
        public async Task<IActionResult> GetPlans()
        {
            var plans = await _context.Plans
                .Where(p => !p.IsDefaultRegistrationPlan && !p.IsDeleted)
                .OrderBy(p => p.PriceUsd)
                .ToListAsync();

            return Ok(plans);
        }

        [HttpGet("voices")]
        public async Task<IActionResult> GetVoices()
        {
            var voices = _ttsCatalog.GetAllVoices(includeInactive: false)
                .OrderBy(v => v.Order)
                .ToList();

            var mappedVoices = new List<object>();
            foreach(var v in voices)
            {
                string demoUrl = null;
                if (!string.IsNullOrWhiteSpace(v.DemoAudio))
                {
                    demoUrl = await _mediaService.GetFileUrlAsync(v.DemoAudio);
                }
                mappedVoices.Add(new {
                    Id = v.Id,
                    Name = v.Name,
                    VoiceName = v.VoiceName,
                    Accent = v.Accent,
                    Gender = v.Gender,
                    IsPremium = v.IsPremium,
                    DemoAudio = demoUrl
                });
            }
                
            return Ok(mappedVoices);
        }

        [HttpGet("dialects")]
        public IActionResult GetDialects()
        {
            var dialects = _ttsCatalog.GetAllDialects(includeInactive: false)
                .OrderBy(d => d.Order)
                .Select(d => new { Id = d.Id, Name = d.Name, Value = d.Value, IsPremium = d.IsPremium })
                .ToList();
            return Ok(dialects);
        }

        [HttpGet("emotions")]
        public IActionResult GetEmotions()
        {
            var emotions = _ttsCatalog.GetAllEmotions(includeInactive: false)
                .OrderBy(e => e.Order)
                .Select(e => new { Id = e.Id, Name = e.Name, Value = e.Value, IsPremium = e.IsPremium })
                .ToList();
            return Ok(emotions);
        }

        [HttpGet("styles")]
        public IActionResult GetStyles()
        {
            var styles = _ttsCatalog.GetAllStyles(includeInactive: false)
                .OrderBy(s => s.Order)
                .Select(s => new { Id = s.Id, Name = s.Name, Value = s.Value, IsPremium = s.IsPremium })
                .ToList();
            return Ok(styles);
        }

        [HttpGet("tts-config")]
        public async Task<IActionResult> GetTtsConfig()
        {
            var ttsSetting = await _context.TextToVoiceSettings.FirstOrDefaultAsync();
            int maxChars = ttsSetting?.MaxTextLength ?? 5000;
            bool customInstructionsEnabled = true;
            List<string> allowedVoices = null;

            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (Guid.TryParse(userIdStr, out var userId))
                {
                    var permService = HttpContext.RequestServices.GetService(typeof(NexClone.Backend.Core.Interfaces.ISubscriptionPermissionService)) as NexClone.Backend.Core.Interfaces.ISubscriptionPermissionService;
                    var perms = await permService.GetEffectivePermissionsAsync(userId);
                    if (perms.HasActiveSubscription)
                    {
                        allowedVoices = perms.AllowedVoices;
                    }
                }
            }

            var activeToolConfig = await _context.ToolConfigurations
                .FirstOrDefaultAsync(c => c.ToolName == "text-to-voice");

            bool isMaintenanceMode = activeToolConfig?.IsMaintenanceMode ?? false;
            bool isComingSoon = activeToolConfig?.IsComingSoon ?? false;
            bool isActive = activeToolConfig?.IsActive ?? true;

            var dbPricings = await _context.TextToVoiceModelPricings
                .Where(p => p.IsActive)
                .Select(p => new {
                    qualityLevel = p.QualityLevel,
                    modelName = p.ModelName,
                    costPerChar = p.CostPerChar,
                    allowedWallet = p.AllowedWallet
                })
                .ToListAsync();

            object qualitiesToReturn;
            if (dbPricings.Any())
            {
                qualitiesToReturn = dbPricings;
            }
            else
            {
                qualitiesToReturn = new[]
                {
                    new { qualityLevel = "Standard", modelName = "gemini-2.5-flash-preview-tts", costPerChar = 0.001m, allowedWallet = "Standard" },
                    new { qualityLevel = "Medium", modelName = "gemini-2.5-pro-preview-tts", costPerChar = 0.005m, allowedWallet = "Both" },
                    new { qualityLevel = "High", modelName = "gemini-3.1-flash-tts-preview", costPerChar = 0.010m, allowedWallet = "Premium" }
                };
            }

            return Ok(new { 
                maxChars = maxChars, 
                customInstructionsEnabled = customInstructionsEnabled, 
                isMaintenanceMode = isMaintenanceMode, 
                isComingSoon = isComingSoon, 
                isActive = isActive, 
                allowedVoices = allowedVoices,
                qualities = qualitiesToReturn
            });
        }

        [HttpGet("vtt-config")]
        public async Task<IActionResult> GetVttConfig()
        {
            var activeToolConfig = await _context.ToolConfigurations
                .FirstOrDefaultAsync(c => c.ToolName == "voice-to-text");

            bool isMaintenanceMode = activeToolConfig?.IsMaintenanceMode ?? false;
            bool isComingSoon = activeToolConfig?.IsComingSoon ?? false;
            bool isActive = activeToolConfig?.IsActive ?? true;

            return Ok(new { isMaintenanceMode = isMaintenanceMode, isComingSoon = isComingSoon, isActive = isActive });
        }

        [HttpGet("payment-methods")]
        public async Task<IActionResult> GetPaymentMethods()
        {
            var settings = await _context.AppSettings.ToListAsync();
            
            bool paymobMaintenance = settings.FirstOrDefault(s => s.Key == "Payment.Paymob.Maintenance")?.Value == "true";
            bool payPalMaintenance = settings.FirstOrDefault(s => s.Key == "Payment.PayPal.Maintenance")?.Value == "true";
            bool manualMaintenance = settings.FirstOrDefault(s => s.Key == "Payment.Manual.Maintenance")?.Value == "true";

            return Ok(new
            {
                PaymobMaintenance = paymobMaintenance,
                PayPalMaintenance = payPalMaintenance,
                ManualMaintenance = manualMaintenance
            });
        }

        [HttpGet("social-links")]
        public async Task<IActionResult> GetSocialLinks()
        {
            var settings = await _context.AppSettings
                .Where(s => s.Key.StartsWith("Social."))
                .ToListAsync();

            var links = settings.ToDictionary(s => s.Key.Replace("Social.", ""), s => s.Value);
            return Ok(links);
        }

        [HttpGet("custom-page/{slug}")]
        public async Task<IActionResult> GetCustomPage(string slug)
        {
            var page = await _context.CustomPages.FirstOrDefaultAsync(p => p.Slug == slug);
            if (page == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                page.Slug,
                page.TitleEn,
                page.TitleAr,
                page.ContentEn,
                page.ContentAr,
                page.UpdatedAt
            });
        }
    }
}
