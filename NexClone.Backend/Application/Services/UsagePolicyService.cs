using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Text.Json;

using Microsoft.AspNetCore.SignalR;
using NexClone.Backend.Hubs;

namespace NexClone.Backend.Application.Services
{
    public class ToolPolicy
    {
        public bool Enabled { get; set; } = false;
        // -1 means unlimited
        public int MaxCharsPerRequest { get; set; } = 150; 
        public long MaxFileSizeMb { get; set; } = 25;
        
        // Extended media limits
        public long MaxImageFileSizeMb { get; set; } = 15;
        public long MaxAudioFileSizeMb { get; set; } = 15;
        public long MaxVideoFileSizeMb { get; set; } = 50;
        
        // Limits for specific tools
        public int MaxDurationSeconds { get; set; } = 60;

        // Cost per unit. If not set, we will fallback to LegacyDbContext
        public decimal? CostPerUnit { get; set; }
        public decimal? BaseCost { get; set; }
        public int BlockSize { get; set; } = 1;
        public int RoundUpToNearest { get; set; } = 1;
    }

    public class PolicyValidationResult
    {
        public bool IsAllowed { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public decimal TotalCost { get; set; }
        public decimal StandardCreditsCharged { get; set; }
        public decimal PremiumCreditsCharged { get; set; }
    }

    public class ModelPricingConfig
    {
        public bool IsPerSecond { get; set; }
        public decimal BaseCost { get; set; }
        public System.Collections.Generic.Dictionary<string, decimal> CostPerSecond { get; set; } = new System.Collections.Generic.Dictionary<string, decimal>();
        public System.Collections.Generic.Dictionary<string, decimal> FixedCost { get; set; } = new System.Collections.Generic.Dictionary<string, decimal>();
    }

    public class UsagePolicyService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly NexClone.Backend.Core.Interfaces.ISubscriptionPermissionService _permissionService;
        private readonly Pricing.ToolCostCalculatorFactory _calculatorFactory;

        public UsagePolicyService(ApplicationDbContext context, IHubContext<NotificationHub> hubContext, NexClone.Backend.Core.Interfaces.ISubscriptionPermissionService permissionService, Pricing.ToolCostCalculatorFactory calculatorFactory)
        {
            _context = context;
            _hubContext = hubContext;
            _permissionService = permissionService;
            _calculatorFactory = calculatorFactory;
        }

        public async Task<ToolPolicy> GetToolPolicyForUserAsync(Guid userId, string toolId, string quality = "Standard")
        {
            // Use centralized permission service to support stacked subscriptions
            var perms = await _permissionService.GetEffectivePermissionsAsync(userId);
            if (!perms.HasActiveSubscription) return new ToolPolicy { Enabled = true };

            return GetToolPolicyFromPermissions(perms, toolId);
        }

        private ToolPolicy GetToolPolicyFromPermissions(NexClone.Backend.Core.Interfaces.PlanPermissions perms, string toolId)
        {
            var policy = new ToolPolicy { Enabled = true };
            var toolType = AiToolTypeHelper.FromString(toolId);
            if (toolType == null) return policy;
            policy.Enabled = GetPermBool(perms, toolType.Value);
            return policy;
        }

        public ToolPolicy GetToolPolicy(Plan plan, string toolId, string quality = "Standard")
        {
            var policy = new ToolPolicy();
            if (plan == null) return policy;
            var toolType = AiToolTypeHelper.FromString(toolId);
            if (toolType == null) return policy;
            policy.Enabled = GetPlanBool(plan, toolType.Value);
            return policy;
        }

        private static bool GetPermBool(NexClone.Backend.Core.Interfaces.PlanPermissions p, AiToolType t) => t switch
        {
            AiToolType.TextToVoice => p.TtsEnabled,
            AiToolType.VoiceToText => p.SttEnabled,
            AiToolType.AvatarToVideo => p.AvatarVideoEnabled,
            AiToolType.LipSync => p.LipSyncEnabled,
            AiToolType.MotionControl => p.MotionControlEnabled,
            AiToolType.TextToVideo => p.TextToVideoEnabled,
            AiToolType.ImageToVideo => p.ImageToVideoEnabled,
            AiToolType.ReferenceToVideo => p.ReferenceToVideoEnabled,
            AiToolType.TextToImage => p.TextToImageEnabled,
            _ => true
        };

        private static bool GetPlanBool(Plan p, AiToolType t) => t switch
        {
            AiToolType.TextToVoice => p.TtsEnabled,
            AiToolType.VoiceToText => p.SttEnabled,
            AiToolType.AvatarToVideo => p.AvatarVideoEnabled,
            AiToolType.LipSync => p.LipSyncEnabled,
            AiToolType.MotionControl => p.MotionControlEnabled,
            AiToolType.TextToVideo => p.TextToVideoEnabled,
            AiToolType.ImageToVideo => p.ImageToVideoEnabled,
            AiToolType.ReferenceToVideo => p.ReferenceToVideoEnabled,
            AiToolType.TextToImage => p.TextToImageEnabled,
            _ => false
        };

        public async Task<PolicyValidationResult> ValidateAndChargeAsync(Guid userId, string toolId, decimal usageAmountForLimits, decimal? usageAmountForCost = null, string quality = "Standard", int? subscriptionId = null)
        {
            var estimate = await EstimateCostAsync(userId, toolId, usageAmountForLimits, usageAmountForCost, quality, subscriptionId);
            if (!estimate.IsAllowed) return estimate;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "User not found." };

            int retries = 3;
            bool saved = false;
            while (retries > 0 && !saved)
            {
                try
                {
                    user.StandardCredits -= estimate.StandardCreditsCharged;
                    user.PremiumCredits -= estimate.PremiumCreditsCharged;
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    if (_hubContext != null)
                        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveWalletUpdate");
                    saved = true;
                }
                catch (DbUpdateConcurrencyException)
                {
                    retries--;
                    if (retries == 0)
                        return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "A system error occurred while processing your request. Please try again." };
                    await _context.Entry(user).ReloadAsync();
                    decimal remainingCost = estimate.TotalCost;
                    decimal standardToCharge = 0;
                    decimal premiumToCharge = 0;
                    var toolConfig = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolId);
                    bool allowStandard = toolConfig?.AllowStandardCredits ?? true;
                    bool allowPremium = toolConfig?.AllowPremiumCredits ?? false;
                    if (allowStandard) { standardToCharge = Math.Min(user.StandardCredits, remainingCost); remainingCost -= standardToCharge; }
                    if (allowPremium && remainingCost > 0) { premiumToCharge = Math.Min(user.PremiumCredits, remainingCost); remainingCost -= premiumToCharge; }
                    if (remainingCost > 0)
                        return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Insufficient credits after state refresh. Please top up your wallet." };
                    estimate.StandardCreditsCharged = standardToCharge;
                    estimate.PremiumCreditsCharged = premiumToCharge;
                }
            }
            return estimate;
        }

        public static string NormalizeModelKey(string? name)
        {
            if (string.IsNullOrWhiteSpace(name)) return string.Empty;
            return name.ToLowerInvariant()
                .Replace("-", "")
                .Replace("_", "")
                .Replace(" ", "")
                .Replace(".", "");
        }

        private decimal GetLegacyCostPerUnit(string toolId)
        {
            return 1m;
        }

        public async Task<PolicyValidationResult> EstimateCostAsync(Guid userId, string toolId, decimal usageAmountForLimits, decimal? usageAmountForCost = null, string quality = "Standard", int? subscriptionId = null)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions.Where(s => s.Status == "active" || s.Status == "freeze"))
                    .ThenInclude(s => s.Plan)
                .AsSplitQuery()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) 
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "User not found." };

            var toolConfig = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolId);
            if (toolConfig != null && !toolConfig.IsActive)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "This tool is currently disabled." };
            }

            var hasFrozenSubscription = user.Subscriptions.Any(s => s.Status == "freeze");
            var hasActiveSubscription = user.Subscriptions.Any(s => s.Status == "active" && s.EndDate > DateTime.UtcNow);

            if (hasFrozenSubscription && !hasActiveSubscription)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your account is currently in the freeze period. Please renew your subscription to continue using the services." };
            }

            // Use centralized permission service to correctly resolve permissions across stacked subscriptions.
            // A user is only frozen on the Free plan if ALL their active subscriptions are Free/Trial.
            // If at least one Paid subscription is active, they are unlocked.
            var perms = await _permissionService.GetEffectivePermissionsAsync(userId);

            if (perms.HasActiveSubscription && perms.IsFrozenDueToFreePlanOnly)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your credits are frozen while on the Free plan. Please upgrade your plan to continue using the services." };
            }

            var toolPolicy = perms.HasActiveSubscription ? GetToolPolicyFromPermissions(perms, toolId) : new ToolPolicy { Enabled = true };


            if (!toolPolicy.Enabled)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your current plan does not include access to this tool. Please upgrade your plan." };
            }

            decimal costPerUnit = toolPolicy.CostPerUnit ?? GetLegacyCostPerUnit(toolId);
            decimal amountForCost = usageAmountForCost ?? usageAmountForLimits;
            
            if (toolPolicy.RoundUpToNearest > 1)
            {
                amountForCost = Math.Ceiling(amountForCost / toolPolicy.RoundUpToNearest) * toolPolicy.RoundUpToNearest;
            }

            if (toolId == "voice-to-text" && usageAmountForCost == null)
            {
                amountForCost = usageAmountForLimits / 102400m; 
            }

            if (toolPolicy.BlockSize > 1)
            {
                amountForCost = amountForCost / toolPolicy.BlockSize;
            }

            var parts = quality.Split('|');
            var modelName = parts[0];
            var resolution = parts.Length > 1 ? parts[1] : "default";

            var pricingRequest = new NexClone.Backend.Core.Interfaces.PricingRequest
            {
                ToolId = toolId,
                UsageAmountForCost = amountForCost,
                UsageAmountForLimits = usageAmountForLimits,
                ModelName = modelName,
                Resolution = resolution
            };

            decimal totalCost;
            bool allowStandard = toolConfig?.AllowStandardCredits ?? true;
            bool allowPremium = toolConfig?.AllowPremiumCredits ?? false;

            var calculator = _calculatorFactory.GetCalculator(toolId);
            if (calculator != null)
            {
                var result = await calculator.CalculateAsync(pricingRequest);
                if (!result.IsAllowed)
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = result.ErrorMessage };
                totalCost = result.TotalCost;
                allowStandard = result.AllowStandard;
                allowPremium = result.AllowPremium;
            }
            else
            {
                // Fallback for unknown tools
                totalCost = (toolPolicy.BaseCost ?? 0) + (amountForCost * costPerUnit);
            }

            decimal remainingCost = totalCost;
            decimal standardToCharge = 0;
            decimal premiumToCharge = 0;

            if (allowStandard && !allowPremium)
            {
                // Must charge only Standard
                standardToCharge = totalCost;
                if (user.StandardCredits < standardToCharge)
                {
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient Standard credits. Requires {totalCost:F2} Standard credits." };
                }
            }
            else if (allowPremium && !allowStandard)
            {
                // Must charge only Premium
                premiumToCharge = totalCost;
                if (user.PremiumCredits < premiumToCharge)
                {
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient Premium credits. Requires {totalCost:F2} Premium credits." };
                }
            }
            else
            {
                // Both allowed: charge Standard first, then remainder from Premium
                if (allowStandard)
                {
                    standardToCharge = Math.Min(user.StandardCredits, remainingCost);
                    remainingCost -= standardToCharge;
                }

                if (allowPremium && remainingCost > 0)
                {
                    premiumToCharge = Math.Min(user.PremiumCredits, remainingCost);
                    remainingCost -= premiumToCharge;
                }

                if (remainingCost > 0)
                {
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient credits. Requires {totalCost:F2} total credits." };
                }
            }

            return new PolicyValidationResult { 
                IsAllowed = true, 
                TotalCost = totalCost, 
                StandardCreditsCharged = standardToCharge,
                PremiumCreditsCharged = premiumToCharge
            };
        }

        public async Task RefundAsync(Guid userId, decimal standardAmount, decimal premiumAmount)
        {
            if (standardAmount <= 0 && premiumAmount <= 0) return;

            int retries = 3;
            bool saved = false;
            while (retries > 0 && !saved)
            {
                try
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user != null)
                    {
                        user.StandardCredits += standardAmount;
                        user.PremiumCredits += premiumAmount;
                        
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();
                        
                        if (_hubContext != null) {
                            await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveWalletUpdate");
                        }
                    }
                    saved = true;
                }
                catch (DbUpdateConcurrencyException)
                {
                    retries--;
                    if (retries == 0) throw;
                }
            }
        }

        public async Task RefundByToolAsync(Guid userId, string toolId, decimal amount)
        {
            if (amount <= 0) return;
            var toolConfig = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolId);
            bool allowPremium = toolConfig?.AllowPremiumCredits ?? false;
            
            if (allowPremium) 
            {
                await RefundAsync(userId, 0, amount);
            }
            else 
            {
                await RefundAsync(userId, amount, 0);
            }
        }
    }
}
