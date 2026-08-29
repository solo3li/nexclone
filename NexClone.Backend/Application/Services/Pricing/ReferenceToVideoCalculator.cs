using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.Application.Services.Pricing
{
    public class ReferenceToVideoCalculator : IToolCostCalculator
    {
        private readonly ApplicationDbContext _context;
        public string[] ToolIds => new[] { "reference-to-video" };

        public ReferenceToVideoCalculator(ApplicationDbContext context) => _context = context;

        public async Task<PricingResult> CalculateAsync(PricingRequest request)
        {
            var setting = await _context.ReferenceToVideoSettings.FirstOrDefaultAsync();
            if (setting != null && !setting.IsActive)
                return new PricingResult { IsAllowed = false, ErrorMessage = "Reference to Video is currently disabled." };

            var normModel = UsagePolicyService.NormalizeModelKey(request.ModelName);
            var allPricings = await _context.ReferenceToVideoModelPricings.Where(p => p.IsActive).ToListAsync();
            var pricing = allPricings.FirstOrDefault(p => UsagePolicyService.NormalizeModelKey(p.ModelName) == normModel);
            pricing ??= allPricings.FirstOrDefault(p => UsagePolicyService.NormalizeModelKey(p.ModelName).Contains(normModel) || normModel.Contains(UsagePolicyService.NormalizeModelKey(p.ModelName)));
            pricing ??= allPricings.FirstOrDefault();
            if (pricing == null) return new PricingResult { TotalCost = 30m };

            var res = request.Resolution.ToLower();
            
            var amount = request.UsageAmountForCost;
            
            decimal totalCost;
            if (pricing.BillingType == "PerSecond")
            {
                decimal cps = res switch
                {
                    "480p" => pricing.CostPerSecond_480p,
                    "720p" => pricing.CostPerSecond_720p,
                    "1080p" => pricing.CostPerSecond_1080p,
                    "4k" => pricing.CostPerSecond_4k,
                    _ => pricing.CostPerSecond_720p
                };
                totalCost = pricing.BaseCost + (amount * cps);
            }
            else
            {
                var fc = res switch { "480p" => pricing.FixedCost_480p, "720p" => pricing.FixedCost_720p, "1080p" => pricing.FixedCost_1080p, "4k" => pricing.FixedCost_4k, _ => pricing.FixedCost_720p };
                totalCost = pricing.BaseCost + fc;
            }

            return new PricingResult
            {
                TotalCost = totalCost,
                AllowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase),
                AllowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase)
            };
        }
    }
}
