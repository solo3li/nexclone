using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.Application.Services.Pricing
{
    public class MotionControlCalculator : IToolCostCalculator
    {
        private readonly ApplicationDbContext _context;
        public string[] ToolIds => new[] { "motion-control", "kling_motion_control" };

        public MotionControlCalculator(ApplicationDbContext context) => _context = context;

        public async Task<PricingResult> CalculateAsync(PricingRequest request)
        {
            var setting = await _context.MotionControlSettings.FirstOrDefaultAsync();
            if (setting != null && !setting.IsActive)
                return new PricingResult { IsAllowed = false, ErrorMessage = "Motion Control is currently disabled." };

            var pricing = await _context.MotionControlModelPricings.FirstOrDefaultAsync(p => p.IsActive);
            if (pricing == null) return new PricingResult { TotalCost = 20m };

            decimal totalCost;
            if (pricing.BillingType == "PerSecond")
            {
                var sec = request.UsageAmountForCost > 0 ? request.UsageAmountForCost : 5.0m;
                totalCost = pricing.BaseCost + (sec * pricing.CostPerSecond);
            }
            else
            {
                totalCost = pricing.BaseCost + pricing.CostPerGeneration;
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