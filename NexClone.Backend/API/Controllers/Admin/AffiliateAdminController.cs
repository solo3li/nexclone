using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme)]
    public class AffiliateAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AffiliateAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var affiliates = await _context.Users
                .Where(u => u.IsCashAffiliate)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.AffiliateCashBalance,
                    TotalReferrals = _context.AffiliateReferrals.Count(r => r.ReferrerId == u.Id)
                })
                .ToListAsync();

            ViewBag.AllUsers = await _context.Users.Select(u => new { u.Id, u.Email, u.IsCashAffiliate }).ToListAsync();

            return View(affiliates);
        }

        [HttpPost]
        public async Task<IActionResult> SetCashAffiliate(Guid userId, bool status)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.IsCashAffiliate = status;
                _context.Update(user);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Payouts()
        {
            var payouts = await _context.AffiliateTransactions
                .Include(t => t.Affiliate)
                .Where(t => t.Type == "Payout")
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return View(payouts);
        }

        [HttpPost]
        public async Task<IActionResult> UpdatePayoutStatus(Guid id, string status)
        {
            var transaction = await _context.AffiliateTransactions
                .Include(t => t.Affiliate)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction != null)
            {
                if (status == "Rejected" && transaction.Status != "Rejected")
                {
                    // Refund balance
                    transaction.Affiliate.AffiliateCashBalance += transaction.Amount;
                    _context.Update(transaction.Affiliate);
                }
                else if (transaction.Status == "Rejected" && status != "Rejected")
                {
                    // Re-deduct balance
                    transaction.Affiliate.AffiliateCashBalance -= transaction.Amount;
                    _context.Update(transaction.Affiliate);
                }

                transaction.Status = status;
                _context.Update(transaction);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Payouts));
        }
    }
}
