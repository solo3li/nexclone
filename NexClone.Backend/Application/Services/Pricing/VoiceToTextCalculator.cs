using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.Application.Services.Pricing
{
    public class VoiceToTextCalculator : IToolCostCalculator
    {
        private readonly ApplicationDbContext _context;
        public string[] ToolIds => new[] { "voice-to-text", "vtt", "stt" };

        public VoiceToTextCalculator(ApplicationDbContext context) => _context = context;

        public async Task<PricingResult> CalculateAsync(PricingRequest request)
        {
            var setting = await _context.VoiceToTextSettings.FirstOrDefaultAsync();
            if (setting != null && !setting.IsActive)
                return new PricingResult { IsAllowed = false, ErrorMessage = "Voice to Text is currently disabled." };

            var pricing = await _context.VoiceToTextModelPricings.FirstOrDefaultAsync(p => p.IsActive);
            if (pricing == null) return new PricingResult { TotalCost = 1m };

            double val = (double)(request.UsageAmountForCost > 0 ? request.UsageAmountForCost : request.UsageAmountForLimits / 102400m);
            if (val <= 0) val = 1.0;
            double minutes = val > 30 ? Math.Ceiling(val / 60.0) : Math.Ceiling(val);
            var totalCost = pricing.BaseCost + ((decimal)minutes * pricing.CostPerMinute);
            if (totalCost < 0.1m) totalCost = 0.1m;

            return new PricingResult
            {
                TotalCost = totalCost,
                AllowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase),
                AllowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase)
            };
        }
    }
}