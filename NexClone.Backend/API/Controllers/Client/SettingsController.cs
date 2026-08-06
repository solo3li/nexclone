using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("public")]
        public async Task<IActionResult> GetPublicSettings()
        {
            var isMaintenanceModeStr = await _context.AppSettings
                .FirstOrDefaultAsync(s => s.Key == "Site.MaintenanceMode");
                
            var maintenanceEndDateStr = await _context.AppSettings
                .FirstOrDefaultAsync(s => s.Key == "Site.MaintenanceEndDate");
                
            var googleClientIdStr = await _context.AppSettings
                .FirstOrDefaultAsync(s => s.Key == "Auth.Google.ClientId");

            bool isMaintenanceMode = bool.TryParse(isMaintenanceModeStr?.Value, out var m) && m;
            
            // Fetch Payment statuses
            var paymentSettings = await _context.AppSettings
                .Where(s => s.Key.StartsWith("Payment."))
                .ToListAsync();
            
            var paymentStatuses = new Dictionary<string, object>();
            var paymentMethods = new[] { "Paymob", "PayPal", "Manual" };
            foreach (var pm in paymentMethods)
            {
                paymentStatuses[pm.ToLower()] = new {
                    suspended = paymentSettings.FirstOrDefault(s => s.Key == $"Payment.{pm}.Suspended")?.Value == "true",
                    maintenance = paymentSettings.FirstOrDefault(s => s.Key == $"Payment.{pm}.Maintenance")?.Value == "true",
                    comingSoon = paymentSettings.FirstOrDefault(s => s.Key == $"Payment.{pm}.ComingSoon")?.Value == "true"
                };
            }

            return Ok(new
            {
                isMaintenanceMode = isMaintenanceMode,
                maintenanceEndDate = maintenanceEndDateStr?.Value,
                googleClientId = googleClientIdStr?.Value,
                paymentStatuses = paymentStatuses
            });
        }
    }
}
