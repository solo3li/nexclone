using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.Application.Services.Pricing
{
    public class TextToImageCalculator : IToolCostCalculator
    {
        private readonly ApplicationDbContext _context;
        public string[] ToolIds => new[] { "text-to-image" };

        public TextToImageCalculator(ApplicationDbContext context) => _context = context;

        public async Task<PricingResult> CalculateAsync(PricingRequest request)
        {
            var setting = await _context.TextToImageSettings.FirstOrDefaultAsync();
            if (setting != null && !setting.IsActive)
                return new PricingResult { IsAllowed = false, ErrorMessage = "Text to Image is currently disabled." };

            var normModel = UsagePolicyService.NormalizeModelKey(request.ModelName);
            var allPricings = await _context.TextToImageModelPricings.Where(p => p.IsActive).ToListAsync();
            var pricing = allPricings.FirstOrDefault(p => UsagePolicyService.NormalizeModelKey(p.ModelName) == normModel
                || UsagePolicyService.NormalizeModelKey(p.ModelName).Contains(normModel) || normModel.Contains(UsagePolicyService.NormalizeModelKey(p.ModelName)));
            pricing ??= allPricings.FirstOrDefault();
            if (pricing == null) return new PricingResult { TotalCost = 4m };

            return new PricingResult
            {
                TotalCost = pricing.BaseCost + (request.UsageAmountForCost * pricing.CostPerImage),
                AllowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase),
                AllowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase)
            };
        }
    }
}