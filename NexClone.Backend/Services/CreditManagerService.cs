using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;


namespace NexClone.Backend.Services
{
    public class CreditManagerService
    {
        private readonly ApplicationDbContext _context;

        public CreditManagerService(ApplicationDbContext context)
        {
            _context = context;
        }
        // "text-to-voice": per character
        // "voice-to-text": per second
        // "bg-remover": per image
        // "img-to-txt": per image
        public decimal CalculateCost(string toolId, decimal amount)
        {
            // Default legacy cost, since it's now driven by Plan policies.
            return 1m * amount; 
        }

        public async Task<bool> IsToolAllowedForUser(Guid userId, string toolId)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return false;

            // Admin always has access, even for testing maintenance tools
            if (user.IsStaff) return true;

            // Check if tool is active globally
            var tool = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolId);
            if (tool != null && !tool.IsActive) return false;

            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status == "active" && s.EndDate > DateTime.UtcNow);

            if (activeSubscription == null) return false;

            if (toolId == "text-to-voice") return activeSubscription.Plan.TtsEnabled;
            if (toolId == "voice-to-text") return activeSubscription.Plan.SttEnabled;
            return false;
        }

        public async Task<bool> HasEnoughCredits(Guid userId, string toolId, decimal cost)
        {
            var user = await _context.Users.Include(u => u.Wallets).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;

            if (user.IsStaff) return true; // Admins have unlimited credits

            var activeSubscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == "active" && s.EndDate > DateTime.UtcNow);

            var walletTypeId = await GetWalletTypeIdForTool(toolId, activeSubscription?.PlanId);

            var userWallet = user.Wallets.FirstOrDefault(w => w.WalletTypeId == walletTypeId);
            if (userWallet == null) return false;

            return userWallet.Balance >= cost;
        }

        public async Task<bool> DeductCreditsAsync(Guid userId, string toolId, decimal cost)
        {
            var user = await _context.Users.Include(u => u.Wallets).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;

            if (user.IsStaff) return true;

            var activeSubscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == "active" && s.EndDate > DateTime.UtcNow);

            var walletTypeId = await GetWalletTypeIdForTool(toolId, activeSubscription?.PlanId);

            var userWallet = user.Wallets.FirstOrDefault(w => w.WalletTypeId == walletTypeId);
            if (userWallet == null || userWallet.Balance < cost) return false;

            userWallet.Balance -= cost;
            userWallet.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<int> GetWalletTypeIdForTool(string toolName, int? planId)
        {
            var tool = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolName);
            if (tool != null && planId.HasValue)
            {
                var packageOverride = await _context.PackageToolWallets
                    .FirstOrDefaultAsync(p => p.PlanId == planId.Value && p.ToolConfigurationId == tool.Id);
                if (packageOverride != null)
                {
                    return packageOverride.WalletTypeId;
                }
            }

            // Fallback to "GENERAL" wallet
            var generalWallet = await _context.WalletTypes.FirstOrDefaultAsync(w => w.Code == "GENERAL");
            if (generalWallet == null)
            {
                generalWallet = new WalletType { Name = "General Wallet", Code = "GENERAL" };
                _context.WalletTypes.Add(generalWallet);
                await _context.SaveChangesAsync();
            }
            return generalWallet.Id;
        }
    }
}
