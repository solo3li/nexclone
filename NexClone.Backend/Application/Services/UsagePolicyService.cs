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
        public int BlockSize { get; set; } = 1;
    }

    public class PolicyValidationResult
    {
        public bool IsAllowed { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public decimal TotalCost { get; set; }
        public int ChargedWalletTypeId { get; set; }
        public string ChargedWalletName { get; set; } = string.Empty;
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

            var activeSubscriptionsQuery = user.Subscriptions
                .Where(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (subscriptionId.HasValue)
            {
                activeSubscriptionsQuery = activeSubscriptionsQuery.Where(s => s.Id == subscriptionId.Value);
            }

            var activeSubscriptions = activeSubscriptionsQuery
                .OrderByDescending(s => s.Plan.IsDefaultRegistrationPlan || s.Plan.IsFreeTrial) // Free first
                .ThenBy(s => s.EndDate) // Then closest to expire
                .ToList();

            if (!activeSubscriptions.Any())
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "No active subscription found." };
            }

            Plan targetPlan = null;
            ToolPolicy toolPolicy = null;
            
            foreach (var sub in activeSubscriptions)
            {
                var policy = GetToolPolicy(sub.Plan, toolId, quality);
                if (policy.Enabled)
                {
                    targetPlan = sub.Plan;
                    toolPolicy = policy;
                    break;
                }
            }

            if (targetPlan == null)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your current plans do not have access to this tool." };
            }

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

            decimal totalCost = amountForCost * costPerUnit;
            decimal remainingCost = totalCost;

            var generalWalletType = await _context.WalletTypes.FirstOrDefaultAsync(w => w.Code == "GENERAL");
            var walletsToDeduct = new List<(UserWallet wallet, decimal amount)>();

            foreach (var sub in activeSubscriptions)
            {
                if (remainingCost <= 0) break;
                
                var policy = GetToolPolicy(sub.Plan, toolId, quality);
                if (!policy.Enabled) continue;

                var walletTypeId = await GetWalletTypeIdForTool(toolId, sub.PlanId);
                var userWallet = user.Wallets?.FirstOrDefault(w => w.WalletTypeId == walletTypeId && w.SubscriptionId == sub.Id);
                
                if ((userWallet == null || userWallet.Balance <= 0) && generalWalletType != null)
                {
                    userWallet = user.Wallets?.FirstOrDefault(w => w.WalletTypeId == generalWalletType.Id && w.SubscriptionId == sub.Id);
                }

                if (userWallet != null && userWallet.Balance > 0)
                {
                    decimal amountToDeduct = Math.Min(userWallet.Balance, remainingCost);
                    walletsToDeduct.Add((userWallet, amountToDeduct));
                    remainingCost -= amountToDeduct;
                }
            }

            if (remainingCost > 0)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient credits. Requires {totalCost:F4}." };
            }

            int retries = 3;
            bool saved = false;
            while (retries > 0 && !saved)
            {
                try
                {
                    foreach (var deduct in walletsToDeduct)
                    {
                        deduct.wallet.Balance -= deduct.amount;
                        deduct.wallet.UpdatedAt = DateTime.UtcNow;
                    }
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
                    
                    foreach (var deduct in walletsToDeduct)
                    {
                        await _context.Entry(deduct.wallet).ReloadAsync();
                    }
                    
                    decimal checkRemaining = totalCost;
                    foreach (var deduct in walletsToDeduct)
                    {
                        checkRemaining -= Math.Min(deduct.wallet.Balance, checkRemaining);
                    }

                    if (checkRemaining > 0)
                    {
                        return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Insufficient credits after state refresh. Please top up your wallet." };
                    }
                }
            }

            var primaryWallet = walletsToDeduct.FirstOrDefault().wallet;
            return new PolicyValidationResult { 
                IsAllowed = true, 
                TotalCost = totalCost, 
                ChargedWalletTypeId = primaryWallet?.WalletTypeId ?? generalWalletType?.Id ?? 0,
                ChargedWalletName = primaryWallet?.WalletType?.Name ?? "General Wallet"
            };
        }

        private async Task<int> GetWalletTypeIdForTool(string toolName, int planId)
        {
            var tool = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolName);
            if (tool != null)
            {
                var packageOverride = await _context.PackageToolWallets
                    .FirstOrDefaultAsync(p => p.PlanId == planId && p.ToolConfigurationId == tool.Id);
                if (packageOverride != null)
                {
                    return packageOverride.WalletTypeId;
                }
            }

            var generalWallet = await _context.WalletTypes.FirstOrDefaultAsync(w => w.Code == "GENERAL");
            if (generalWallet == null)
            {
                generalWallet = new WalletType { Name = "General Wallet", Code = "GENERAL" };
                _context.WalletTypes.Add(generalWallet);
                await _context.SaveChangesAsync();
            }
            return generalWallet.Id;
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
                policy.CostPerUnit = plan.LipSyncCostPerSecond * 5; // Cost per 5-second block
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

            if (subscriptionId.HasValue)
            {
                activeSubscriptionsQuery = activeSubscriptionsQuery.Where(s => s.Id == subscriptionId.Value);
            }

            var activeSubscriptions = activeSubscriptionsQuery
                .OrderByDescending(s => s.Plan.IsDefaultRegistrationPlan || s.Plan.IsFreeTrial)
                .ThenBy(s => s.EndDate)
                .ToList();

            if (!activeSubscriptions.Any())
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "No active subscription found." };
            }

            Plan targetPlan = null;
            ToolPolicy toolPolicy = null;
            
            foreach (var sub in activeSubscriptions)
            {
                var policy = GetToolPolicy(sub.Plan, toolId, quality);
                if (policy.Enabled)
                {
                    targetPlan = sub.Plan;
                    toolPolicy = policy;
                    break;
                }
            }

            if (targetPlan == null)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your current plans do not have access to this tool." };
            }

            if (toolId == "text-to-voice" && toolPolicy.MaxCharsPerRequest != -1 && usageAmountForLimits > toolPolicy.MaxCharsPerRequest)
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Your current plan allows a maximum of {toolPolicy.MaxCharsPerRequest} characters per request." };
            
            if (toolId == "voice-to-text" && toolPolicy.MaxFileSizeMb != -1 && usageAmountForLimits > (toolPolicy.MaxFileSizeMb * 1024 * 1024))
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"File too large. Maximum allowed size is {toolPolicy.MaxFileSizeMb}MB." };

            decimal costPerUnit = toolPolicy.CostPerUnit ?? GetLegacyCostPerUnit(toolId);
            decimal amountForCost = usageAmountForCost ?? usageAmountForLimits;
            
            if (toolId == "voice-to-text" && usageAmountForCost == null)
                amountForCost = usageAmountForLimits / 102400m; 

            if (toolPolicy.BlockSize > 1)
                amountForCost = amountForCost / toolPolicy.BlockSize;

            decimal totalCost = amountForCost * costPerUnit;
            decimal remainingCost = totalCost;

            var generalWalletType = await _context.WalletTypes.FirstOrDefaultAsync(w => w.Code == "GENERAL");
            var walletsToDeduct = new List<(UserWallet wallet, decimal amount)>();

            foreach (var sub in activeSubscriptions)
            {
                if (remainingCost <= 0) break;
                
                var policy = GetToolPolicy(sub.Plan, toolId, quality);
                if (!policy.Enabled) continue;

                var walletTypeId = await GetWalletTypeIdForTool(toolId, sub.PlanId);
                var userWallet = user.Wallets?.FirstOrDefault(w => w.WalletTypeId == walletTypeId && w.SubscriptionId == sub.Id);
                
                if ((userWallet == null || userWallet.Balance <= 0) && generalWalletType != null)
                {
                    userWallet = user.Wallets?.FirstOrDefault(w => w.WalletTypeId == generalWalletType.Id && w.SubscriptionId == sub.Id);
                }

                if (userWallet != null && userWallet.Balance > 0)
                {
                    decimal amountToDeduct = Math.Min(userWallet.Balance, remainingCost);
                    walletsToDeduct.Add((userWallet, amountToDeduct));
                    remainingCost -= amountToDeduct;
                }
            }

            if (remainingCost > 0)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient credits. Requires {totalCost:F4}." };
            }

            var primaryWallet = walletsToDeduct.FirstOrDefault().wallet;
            return new PolicyValidationResult { 
                IsAllowed = true, 
                TotalCost = totalCost, 
                ChargedWalletTypeId = primaryWallet?.WalletTypeId ?? generalWalletType?.Id ?? 0,
                ChargedWalletName = primaryWallet?.WalletType?.Name ?? "General Wallet"
            };
        }

        public async Task RefundAsync(Guid userId, int walletTypeId, decimal amount)
        {
            if (amount <= 0) return;

            int retries = 3;
            bool saved = false;
            while (retries > 0 && !saved)
            {
                try
                {
                    var userWallet = await _context.UserWallets
                        .Include(w => w.Subscription)
                        .Where(w => w.UserId == userId && w.WalletTypeId == walletTypeId)
                        .OrderByDescending(w => w.Subscription != null && w.Subscription.Status == "active" ? 1 : 0)
                        .ThenByDescending(w => w.Subscription != null ? w.Subscription.EndDate : DateTime.MinValue)
                        .FirstOrDefaultAsync();

                    if (userWallet != null)
                    {
                        userWallet.Balance += amount;
                        userWallet.UpdatedAt = DateTime.UtcNow;
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
                    // For refund, we just retry by looping again, which fetches the latest row state
                }
            }
        }

        public async Task RefundByToolAsync(Guid userId, string toolId, decimal amount)
        {
            if (amount <= 0) return;

            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .Include(u => u.Wallets)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return;

            var activeSub = user.Subscriptions
                .OrderByDescending(s => s.Plan.IsDefaultRegistrationPlan || s.Plan.IsFreeTrial)
                .ThenBy(s => s.EndDate)
                .FirstOrDefault(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (activeSub == null) return;

            var walletTypeId = await GetWalletTypeIdForTool(toolId, activeSub.PlanId);
            await RefundAsync(userId, walletTypeId, amount);
        }
    }
}
