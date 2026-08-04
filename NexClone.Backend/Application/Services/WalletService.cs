using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.SignalR;
using NexClone.Backend.Hubs;

namespace NexClone.Backend.Application.Services
{
    public class WalletService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public WalletService(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        /// <summary>
        /// Distributes the credits from a specific Plan to the User's wallets.
        /// If resetToZero is true, it clears the wallet before adding (useful for strict monthly cycles).
        /// If false, it rolls over the existing balance.
        /// </summary>
        public async Task DistributePlanCreditsAsync(Guid userId, int planId, bool resetToZero = false, int? subscriptionId = null)
        {
            var user = await _context.Users
                .Include(u => u.Wallets)
                .FirstOrDefaultAsync(u => u.Id == userId);
            
            if (user == null) return;

            var packageWallets = await _context.PackageWallets
                .Where(pw => pw.PlanId == planId)
                .ToListAsync();

            // If the package has no custom wallet definitions, fallback to old behavior by granting to GENERAL
            if (!packageWallets.Any())
            {
                var plan = await _context.Plans.FindAsync(planId);
                if (plan != null && plan.MonthlyCredits > 0)
                {
                    var generalWallet = await GetOrCreateWalletTypeAsync("GENERAL", "General Wallet");
                    packageWallets.Add(new PackageWallet { WalletTypeId = generalWallet.Id, CreditsAmount = plan.MonthlyCredits });
                }
            }

            foreach (var pw in packageWallets)
            {
                var userWallet = user.Wallets.FirstOrDefault(w => w.WalletTypeId == pw.WalletTypeId);
                if (userWallet == null)
                {
                    userWallet = new UserWallet
                    {
                        UserId = userId,
                        WalletTypeId = pw.WalletTypeId,
                        SubscriptionId = subscriptionId,
                        Balance = 0
                    };
                    _context.UserWallets.Add(userWallet);
                    user.Wallets.Add(userWallet);
                }

                if (resetToZero)
                {
                    userWallet.Balance = pw.CreditsAmount;
                }
                else
                {
                    userWallet.Balance += pw.CreditsAmount;
                }
                userWallet.UpdatedAt = DateTime.UtcNow;
            }

            // Optional: reset wallets that are not in the new package if resetToZero is true
            if (resetToZero)
            {
                var activeWalletIds = packageWallets.Select(pw => pw.WalletTypeId).ToList();
                foreach (var uw in user.Wallets.Where(w => !activeWalletIds.Contains(w.WalletTypeId)))
                {
                    uw.Balance = 0;
                    uw.UpdatedAt = DateTime.UtcNow;
                }
            }
            await _context.SaveChangesAsync();

            if (_hubContext != null) {
                await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveWalletUpdate");
            }
        }

        public async Task ResetAllWalletsAsync(Guid userId)
        {
            var user = await _context.Users
                .Include(u => u.Wallets)
                .FirstOrDefaultAsync(u => u.Id == userId);
            
            if (user == null) return;

            foreach (var wallet in user.Wallets)
            {
                wallet.Balance = 0;
                wallet.UpdatedAt = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();

            if (_hubContext != null) {
                await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveWalletUpdate");
            }
        }

        private async Task<WalletType> GetOrCreateWalletTypeAsync(string code, string name)
        {
            var walletType = await _context.WalletTypes.FirstOrDefaultAsync(w => w.Code == code);
            if (walletType == null)
            {
                walletType = new WalletType { Code = code, Name = name };
                _context.WalletTypes.Add(walletType);
                await _context.SaveChangesAsync();
            }
            return walletType;
        }
    }
}
