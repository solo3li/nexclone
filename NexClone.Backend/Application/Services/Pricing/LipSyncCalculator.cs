using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.Application.Services.Pricing
{
    public class LipSyncCalculator : IToolCostCalculator
    {
        private readonly ApplicationDbContext _context;
        public string[] ToolIds => new[] { "advanced-lip-sync", "vidu_advanced_lip_sync", "lipsync" };

        public LipSyncCalculator(ApplicationDbContext context) => _context = context;

        public async Task<PricingResult> CalculateAsync(PricingRequest request)
        {
            var setting = await _context.LipSyncSettings.FirstOrDefaultAsync();
            if (setting != null && !setting.IsActive)
                return new PricingResult { IsAllowed = false, ErrorMessage = "Lip-Sync is currently disabled." };

            var normModel = UsagePolicyService.NormalizeModelKey(request.ModelName);
            var allPricings = await _context.LipSyncModelPricings.Where(p => p.IsActive).ToListAsync();
            var pricing = allPricings.FirstOrDefault(p => UsagePolicyService.NormalizeModelKey(p.ModelName) == normModel
                || UsagePolicyService.NormalizeModelKey(p.ModelName).Contains(normModel) || normModel.Contains(UsagePolicyService.NormalizeModelKey(p.ModelName)));
            pricing ??= allPricings.FirstOrDefault();
            if (pricing == null) return new PricingResult { TotalCost = 12m };

            double dur = (double)request.UsageAmountForCost;
            decimal totalCost;
            if (pricing.BillingType != null && pricing.BillingType.Equals("PerSecond", StringComparison.OrdinalIgnoreCase))
            {
                if (dur <= 0) dur = 1.0;
                totalCost = (decimal)Math.Ceiling(dur) * pricing.CostPerSecond;
            }
            else
            {
                if (dur <= 0) dur = 5.0;
                int blocks = (int)Math.Ceiling(dur / 5.0);
                decimal costPerBlock = pricing.BaseCost > 0 ? pricing.BaseCost : (pricing.CostPerSecond * 5.0m > 0 ? pricing.CostPerSecond * 5.0m : 12.0m);
                totalCost = blocks * costPerBlock;
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