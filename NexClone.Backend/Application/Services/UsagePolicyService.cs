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

        public UsagePolicyService(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<ToolPolicy> GetToolPolicyForUserAsync(Guid userId, string toolId, string quality = "Standard")
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return new ToolPolicy();

            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (activeSubscription == null) return new ToolPolicy();

            return GetToolPolicy(activeSubscription.Plan, toolId, quality);
        }

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
                    
                    if (_hubContext != null) {
                        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveWalletUpdate");
                    }
                    
                    saved = true;
                }
                catch (DbUpdateConcurrencyException)
                {
                    retries--;
                    if (retries == 0)
                    {
                        return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "A system error occurred while processing your request. Please try again." };
                    }
                    
                    await _context.Entry(user).ReloadAsync();
                    
                    decimal remainingCost = estimate.TotalCost;
                    decimal standardToCharge = 0;
                    decimal premiumToCharge = 0;

                    var toolConfig = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolId);
                    bool allowStandard = toolConfig?.AllowStandardCredits ?? true;
                    bool allowPremium = toolConfig?.AllowPremiumCredits ?? false;

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
                        return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Insufficient credits after state refresh. Please top up your wallet." };
                    }
                    
                    estimate.StandardCreditsCharged = standardToCharge;
                    estimate.PremiumCreditsCharged = premiumToCharge;
                }
            }

            return estimate;
        }

        public ToolPolicy GetToolPolicy(Plan plan, string toolId, string quality = "Standard")
        {
            var policy = new ToolPolicy();
            if (plan == null) return policy;

            if (toolId == "text-to-voice")
            {
                policy.Enabled = plan.TtsEnabled;
                policy.MaxCharsPerRequest = plan.TtsMaxCharsPerRequest;
                
                if (quality == "High")
                    policy.CostPerUnit = plan.TtsCostPerCharHigh;
                else
                    policy.CostPerUnit = plan.TtsCostPerChar;
                    
                policy.BlockSize = plan.TtsCharactersBlock;
            }
            else if (toolId == "voice-to-text")
            {
                policy.Enabled = plan.SttEnabled;
                policy.MaxFileSizeMb = plan.SttMaxFileSizeMb;
                policy.CostPerUnit = plan.SttCostPerMinute;
            }
            else if (toolId == "kling_avatar_image2video")
            {
                policy.Enabled = plan.AvatarVideoEnabled;
                if (quality == "pro")
                    policy.CostPerUnit = plan.AvatarVideoProCost;
                else
                    policy.CostPerUnit = plan.AvatarVideoCostPerGeneration;
                
                policy.MaxImageFileSizeMb = plan.AvatarVideoMaxFileSizeMb;
                policy.MaxAudioFileSizeMb = plan.AvatarVideoMaxAudioFileSizeMb;
                policy.MaxCharsPerRequest = plan.AvatarVideoMaxCharsPerRequest;
            }
            else if (toolId == "kling_advanced_lip_sync" || toolId == "lipsync")
            {
                policy.Enabled = plan.LipSyncEnabled;
                policy.BaseCost = plan.LipSyncCostPerGeneration;
                policy.CostPerUnit = plan.LipSyncCostPerSecond;
                policy.MaxVideoFileSizeMb = plan.LipSyncMaxVideoFileSizeMb;
                policy.MaxAudioFileSizeMb = plan.LipSyncMaxAudioFileSizeMb;
                policy.MaxDurationSeconds = plan.LipSyncMaxDurationSeconds;
            }
            else if (toolId == "kling_motion_control" || toolId == "motion-control")
            {
                policy.Enabled = plan.MotionControlEnabled;
                if (quality == "pro")
                    policy.CostPerUnit = plan.MotionControlProCost;
                else
                    policy.CostPerUnit = plan.MotionControlCostPerGeneration;
                
                policy.MaxVideoFileSizeMb = plan.MotionControlMaxVideoFileSizeMb;
                policy.MaxImageFileSizeMb = plan.MotionControlMaxImageFileSizeMb;
            }

            return policy;
        }

        private decimal GetLegacyCostPerUnit(string toolId)
        {
            return 1m;
        }

        public async Task<PolicyValidationResult> EstimateCostAsync(Guid userId, string toolId, decimal usageAmountForLimits, decimal? usageAmountForCost = null, string quality = "Standard", int? subscriptionId = null)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions.Where(s => s.Status.ToLower() == "active" || s.Status.ToLower() == "freeze"))
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

            var hasFrozenSubscription = user.Subscriptions.Any(s => s.Status.ToLower() == "freeze");
            var hasActiveSubscription = user.Subscriptions.Any(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (hasFrozenSubscription && !hasActiveSubscription)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your account is currently in the freeze period. Please renew your subscription to continue using the services." };
            }

            var activeSubscription = user.Subscriptions
                .Where(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow)
                .OrderByDescending(s => s.Plan.IsDefaultRegistrationPlan || s.Plan.IsFreeTrial)
                .ThenBy(s => s.EndDate)
                .FirstOrDefault();

            var toolPolicy = activeSubscription != null ? GetToolPolicy(activeSubscription.Plan, toolId, quality) : new ToolPolicy { Enabled = true };
            if (activeSubscription == null) toolPolicy.Enabled = true;

            if (toolId == "text-to-voice" && toolPolicy.MaxCharsPerRequest != -1 && usageAmountForLimits > toolPolicy.MaxCharsPerRequest)
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Your current plan allows a maximum of {toolPolicy.MaxCharsPerRequest} characters per request." };
            
            if (toolId == "voice-to-text" && toolPolicy.MaxFileSizeMb != -1 && usageAmountForLimits > (toolPolicy.MaxFileSizeMb * 1024 * 1024))
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"File too large. Maximum allowed size is {toolPolicy.MaxFileSizeMb}MB." };

            decimal costPerUnit = toolPolicy.CostPerUnit ?? GetLegacyCostPerUnit(toolId);
            decimal amountForCost = usageAmountForCost ?? usageAmountForLimits;
            
            if (toolId == "voice-to-text" && usageAmountForCost == null)
            {
                amountForCost = usageAmountForLimits / 102400m; 
            }

            if (toolPolicy.BlockSize > 1)
            {
                amountForCost = amountForCost / toolPolicy.BlockSize;
            }

            decimal totalCost = (toolPolicy.BaseCost ?? 0) + (amountForCost * costPerUnit);

            // Dynamic JSON Pricing for new tools
            if (toolId == "text-to-video" || toolId == "image-to-video" || toolId == "reference-to-video" || toolId == "text-to-image")
            {
                if (toolConfig != null && !string.IsNullOrEmpty(toolConfig.AdditionalSettings))
                {
                    try
                    {
                        var settings = JsonSerializer.Deserialize<System.Collections.Generic.Dictionary<string, ModelPricingConfig>>(toolConfig.AdditionalSettings, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (settings != null)
                        {
                            var parts = quality.Split('|');
                            var modelName = parts[0].ToLower();
                            var res = parts.Length > 1 ? parts[1].ToLower() : "default";

                            if (settings.TryGetValue(modelName, out var mConfig))
                            {
                                if (mConfig.IsPerSecond)
                                {
                                    decimal cps = mConfig.CostPerSecond.ContainsKey(res) ? mConfig.CostPerSecond[res] : 0;
                                    totalCost = mConfig.BaseCost + (amountForCost * cps);
                                }
                                else
                                {
                                    decimal fc = mConfig.FixedCost.ContainsKey(res) ? mConfig.FixedCost[res] : 0;
                                    totalCost = fc;
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error parsing JSON config for {toolId}: {ex.Message}");
                    }
                }
            }

            bool allowStandard = toolConfig?.AllowStandardCredits ?? true;
            bool allowPremium = toolConfig?.AllowPremiumCredits ?? false;

            decimal remainingCost = totalCost;
            decimal standardToCharge = 0;
            decimal premiumToCharge = 0;

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
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient credits. Requires {totalCost:F4} total credits." };
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
