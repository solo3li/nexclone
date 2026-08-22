using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.Application.Services.Pricing
{
    public class AvatarToVideoCalculator : IToolCostCalculator
    {
        private readonly ApplicationDbContext _context;
        public string[] ToolIds => new[] { "kling_avatar_image2video", "avatar-to-video" };

        public AvatarToVideoCalculator(ApplicationDbContext context) => _context = context;

        public async Task<PricingResult> CalculateAsync(PricingRequest request)
        {
            var setting = await _context.AvatarToVideoSettings.FirstOrDefaultAsync();
            if (setting != null && !setting.IsActive)
                return new PricingResult { IsAllowed = false, ErrorMessage = "Avatar to Video is currently disabled." };

            var allPricings = await _context.AvatarToVideoModelPricings.Where(p => p.IsActive).ToListAsync();
            var normModel = UsagePolicyService.NormalizeModelKey(request.ModelName);
            var pricing = allPricings.FirstOrDefault(p => UsagePolicyService.NormalizeModelKey(p.ModelName) == normModel
                || UsagePolicyService.NormalizeModelKey(p.ModelName).Contains(normModel) || normModel.Contains(UsagePolicyService.NormalizeModelKey(p.ModelName)));
            if (pricing == null) pricing = allPricings.FirstOrDefault();
            if (pricing == null) return new PricingResult { TotalCost = 10m };

            var totalCost = pricing.BaseCost + (pricing.BillingType == "PerSecond" ? (request.UsageAmountForCost * pricing.UnitCost) : pricing.UnitCost);
            return new PricingResult
            {
                TotalCost = totalCost,
                AllowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase),
                AllowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase)
            };
        }
    }
}