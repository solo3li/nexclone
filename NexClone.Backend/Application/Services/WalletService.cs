using System;
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

        public async Task DistributePlanCreditsAsync(Guid userId, int planId, bool resetToZero = false, int? subscriptionId = null)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return;

            var plan = await _context.Plans.FindAsync(planId);
            if (plan == null) return;

            if (resetToZero)
            {
                user.StandardCredits = plan.StandardCredits;
                user.PremiumCredits = plan.PremiumCredits;
            }
            else
            {
                user.StandardCredits += plan.StandardCredits;
                user.PremiumCredits += plan.PremiumCredits;
            }

            // Fallback for legacy plans that still use MonthlyCredits
            if (plan.MonthlyCredits > 0 && plan.StandardCredits == 0)
            {
                if (resetToZero) user.StandardCredits = plan.MonthlyCredits;
                else user.StandardCredits += plan.MonthlyCredits;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            if (_hubContext != null) {
                await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveWalletUpdate");
            }
        }

        public async Task ResetAllWalletsAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return;

            user.StandardCredits = 0;
            user.PremiumCredits = 0;
            
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            if (_hubContext != null) {
                await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveWalletUpdate");
            }
        }
    }
}
