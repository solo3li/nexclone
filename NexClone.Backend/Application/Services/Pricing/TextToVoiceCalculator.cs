using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.Application.Services.Pricing
{
    public class TextToVoiceCalculator : IToolCostCalculator
    {
        private readonly ApplicationDbContext _context;
        public string[] ToolIds => new[] { "text-to-voice", "tts" };

        public TextToVoiceCalculator(ApplicationDbContext context) => _context = context;

        public async Task<PricingResult> CalculateAsync(PricingRequest request)
        {
            var setting = await _context.TextToVoiceSettings.FirstOrDefaultAsync();
            if (setting != null && !setting.IsActive)
                return new PricingResult { IsAllowed = false, ErrorMessage = "Text to Voice is currently disabled." };

            var qTier = string.IsNullOrEmpty(request.ModelName) || request.ModelName.Equals("default", StringComparison.OrdinalIgnoreCase)
                ? (string.IsNullOrEmpty(request.Resolution) || request.Resolution.Equals("default", StringComparison.OrdinalIgnoreCase) ? "Standard" : request.Resolution)
                : request.ModelName;

            var pricing = await _context.TextToVoiceModelPricings
                .FirstOrDefaultAsync(p => p.QualityLevel.ToLower() == qTier.ToLower() && p.IsActive)
                ?? await _context.TextToVoiceModelPricings.FirstOrDefaultAsync(p => p.IsActive);
            if (pricing == null) return new PricingResult { TotalCost = 0.001m };

            var charCount = request.UsageAmountForCost > 0 ? request.UsageAmountForCost : request.UsageAmountForLimits;
            if (charCount <= 0) charCount = 100;
            var totalCost = pricing.BaseCost + (charCount * pricing.CostPerChar);
            if (totalCost < 0.001m) totalCost = 0.001m;

            return new PricingResult
            {
                TotalCost = totalCost,
                AllowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase),
                AllowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase)
            };
        }
    }
}