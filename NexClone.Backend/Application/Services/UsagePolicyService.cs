using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;

namespace NexClone.Backend.Application.Services
{
    public class ToolPolicy
    {
        public bool Enabled { get; set; } = false;
        // -1 means unlimited
        public int MaxCharsPerRequest { get; set; } = 150; 
        public long MaxFileSizeMb { get; set; } = 25;
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
    }

    public class UsagePolicyService
    {
        private readonly ApplicationDbContext _context;

        public UsagePolicyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PolicyValidationResult> ValidateAndChargeAsync(Guid userId, string toolId, decimal usageAmountForLimits, decimal? usageAmountForCost = null, string quality = "Standard")
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .Include(u => u.Wallets)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) 
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "User not found." };

            Plan targetPlan = null;
            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (activeSubscription != null)
            {
                targetPlan = activeSubscription.Plan;
            }
            else
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "No active subscription found." };
            }

            var toolPolicy = GetToolPolicy(targetPlan, toolId, quality);

            if (!toolPolicy.Enabled)
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your current plan does not have access to this tool." };

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

            // Multi-Wallet Check
            var walletTypeId = await GetWalletTypeIdForTool(toolId, targetPlan.Id);
            var userWallet = user.Wallets?.FirstOrDefault(w => w.WalletTypeId == walletTypeId);

            if (userWallet == null || userWallet.Balance < totalCost)
            {
                string debugInfo = $"Debug: ToolId={toolId}, RequiredWalletId={walletTypeId}, UserWalletsCount={user.Wallets?.Count ?? 0}, ";
                if (user.Wallets != null) {
                    foreach (var w in user.Wallets) {
                        debugInfo += $"[W:{w.WalletTypeId}, Bal:{w.Balance}] ";
                    }
                }
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient credits. {debugInfo} Requires {totalCost:F4}." };
            }

            // Retry loop for optimistic concurrency
            int retries = 3;
            bool saved = false;
            while (retries > 0 && !saved)
            {
                try
                {
                    userWallet.Balance -= totalCost;
                    userWallet.UpdatedAt = DateTime.UtcNow;
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    saved = true;
                }
                catch (DbUpdateConcurrencyException)
                {
                    retries--;
                    if (retries == 0)
                    {
                        return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "A system error occurred while processing your request. Please try again." };
                    }
                    
                    // Reload the wallet from database
                    await _context.Entry(userWallet).ReloadAsync();
                    
                    if (userWallet.Balance < totalCost)
                    {
                        return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Insufficient credits. Please top up your wallet." };
                    }
                }
            }

            return new PolicyValidationResult { IsAllowed = true, TotalCost = totalCost, ChargedWalletTypeId = walletTypeId };
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
                policy.CostPerUnit = plan.AvatarVideoCostPerGeneration;
            }
            else if (toolId == "kling_advanced_lip_sync")
            {
                policy.Enabled = plan.LipSyncEnabled;
                policy.CostPerUnit = plan.LipSyncCostPerGeneration;
            }

            return policy;
        }

        private decimal GetLegacyCostPerUnit(string toolId)
        {
            return 1m;
        }

        public async Task<PolicyValidationResult> EstimateCostAsync(Guid userId, string toolId, decimal usageAmountForLimits, decimal? usageAmountForCost = null, string quality = "Standard")
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .Include(u => u.Wallets)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) 
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "User not found." };

            Plan targetPlan = null;
            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (activeSubscription != null)
            {
                targetPlan = activeSubscription.Plan;
            }
            else
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "No active subscription found." };
            }

            var toolPolicy = GetToolPolicy(targetPlan, toolId, quality);

            if (!toolPolicy.Enabled)
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your current plan does not have access to this tool." };

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

            // Multi-Wallet Check
            var walletTypeId = await GetWalletTypeIdForTool(toolId, targetPlan.Id);
            var userWallet = user.Wallets?.FirstOrDefault(w => w.WalletTypeId == walletTypeId);

            if (userWallet == null || userWallet.Balance < totalCost)
            {
                string debugInfo = $"Debug: ToolId={toolId}, RequiredWalletId={walletTypeId}, UserWalletsCount={user.Wallets?.Count ?? 0}, ";
                if (user.Wallets != null) {
                    foreach (var w in user.Wallets) {
                        debugInfo += $"[W:{w.WalletTypeId}, Bal:{w.Balance}] ";
                    }
                }
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient credits. {debugInfo} Requires {totalCost:F4}." };
            }

            return new PolicyValidationResult { IsAllowed = true, TotalCost = totalCost, ChargedWalletTypeId = walletTypeId };
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
                    var userWallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == userId && w.WalletTypeId == walletTypeId);
                    if (userWallet != null)
                    {
                        userWallet.Balance += amount;
                        userWallet.UpdatedAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
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
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return;

            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (activeSubscription == null) return;

            var walletTypeId = await GetWalletTypeIdForTool(toolId, activeSubscription.Plan.Id);
            
            await RefundAsync(userId, walletTypeId, amount);
        }
    }
}
