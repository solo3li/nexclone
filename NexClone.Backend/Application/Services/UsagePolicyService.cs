using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;

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
        public int ChargedWalletTypeId { get; set; }
        public string ChargedWalletName { get; set; } = string.Empty;
        public string? ChargedWalletIcon { get; set; }
        public decimal StandardCreditsCharged { get; set; }
        public decimal PremiumCreditsCharged { get; set; }
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
            var rabbitMqSetting = await _context.AppSettings.FirstOrDefaultAsync(s => s.Key == "Site.RabbitMqEnabled");
            if (rabbitMqSetting != null && rabbitMqSetting.Value == "false")
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Background operations are temporarily paused by the administrator." };
            }

            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .Include(u => u.Wallets)
                    .ThenInclude(w => w.WalletType)
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

            // For limits, if the user doesn't have an active plan, we will fallback to a default or skip limits entirely.
            var activeSubscription = user.Subscriptions
                .Where(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow)
                .OrderByDescending(s => s.Plan.IsDefaultRegistrationPlan || s.Plan.IsFreeTrial)
                .ThenBy(s => s.EndDate)
                .FirstOrDefault();

            // We only use the plan for Limits now, not for Wallet selection
            var toolPolicy = activeSubscription != null ? GetToolPolicy(activeSubscription.Plan, toolId, quality) : new ToolPolicy { Enabled = true };
            
            // If the plan doesn't enable it but they have no plan, we still let them try to use their wallet balance.
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

            int retries = 3;
            bool saved = false;
            while (retries > 0 && !saved)
            {
                try
                {
                    user.StandardCredits -= standardToCharge;
                    user.PremiumCredits -= premiumToCharge;
                        
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
                    
                    remainingCost = totalCost;
                    standardToCharge = 0;
                    premiumToCharge = 0;

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
                }
            }

            string chargedName = "";
            int chargedId = 1;
            if (standardToCharge > 0 && premiumToCharge > 0) { chargedName = "Standard & Premium Credits"; chargedId = 3; }
            else if (premiumToCharge > 0) { chargedName = "Premium Credits"; chargedId = 2; }
            else { chargedName = "Standard Credits"; chargedId = 1; }

            return new PolicyValidationResult { 
                IsAllowed = true, 
                TotalCost = totalCost, 
                ChargedWalletTypeId = chargedId, 
                ChargedWalletName = chargedName,
                ChargedWalletIcon = "bx bx-coin",
                StandardCreditsCharged = standardToCharge,
                PremiumCreditsCharged = premiumToCharge
            };
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
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .Include(u => u.Wallets)
                    .ThenInclude(w => w.WalletType)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) 
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "User not found." };

            var activeSubscriptionsQuery = user.Subscriptions
                .Where(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            var toolConfig = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolId);
            if (toolConfig != null && !toolConfig.IsActive)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "This tool is currently disabled." };
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

            string chargedName = "";
            int chargedId = 1;
            if (standardToCharge > 0 && premiumToCharge > 0) { chargedName = "Standard & Premium Credits"; chargedId = 3; }
            else if (premiumToCharge > 0) { chargedName = "Premium Credits"; chargedId = 2; }
            else { chargedName = "Standard Credits"; chargedId = 1; }

            return new PolicyValidationResult { 
                IsAllowed = true, 
                TotalCost = totalCost, 
                ChargedWalletTypeId = chargedId, 
                ChargedWalletName = chargedName,
                ChargedWalletIcon = "bx bx-coin",
                StandardCreditsCharged = standardToCharge,
                PremiumCreditsCharged = premiumToCharge
            };
        }

        public async Task RefundAsync(Guid userId, int walletTypeId, decimal amount)
        {
            if (amount <= 0) return;

            // Map legacy walletTypeId to creditType: 2 = Premium, others = Standard
            string creditType = walletTypeId == 2 ? "Premium" : "Standard";

            int retries = 3;
            bool saved = false;
            while (retries > 0 && !saved)
            {
                try
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user != null)
                    {
                        if (creditType == "Premium") user.PremiumCredits += amount;
                        else user.StandardCredits += amount;
                        
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
            bool allowStandard = toolConfig?.AllowStandardCredits ?? true;
            bool allowPremium = toolConfig?.AllowPremiumCredits ?? false;
            
            // 1 = Standard, 2 = Premium, 3 = Both
            int walletTypeId = 1;
            if (allowStandard && allowPremium) walletTypeId = 3;
            else if (allowPremium) walletTypeId = 2;
            else walletTypeId = 1;

            await RefundAsync(userId, walletTypeId, amount);
        }
    }
}
