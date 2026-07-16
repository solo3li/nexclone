using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AffiliateController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AffiliateController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var referralsCount = await _context.AffiliateReferrals.CountAsync(r => r.ReferrerId == userId);
            var activeReferralsCount = await _context.AffiliateReferrals.CountAsync(r => r.ReferrerId == userId && r.Status == "Active");
            
            // For credits earned, we can estimate it based on the AppSetting at the time, 
            // or we could have stored it in AffiliateReferrals. For now, estimate based on current setting.
            var rewardStr = await _context.AppSettings.Where(s => s.Key == "Affiliate.CreditRewardReferrer").Select(s => s.Value).FirstOrDefaultAsync() ?? "50";
            decimal reward = decimal.TryParse(rewardStr, out var r1) ? r1 : 50m;
            decimal creditsEarned = activeReferralsCount * reward;

            return Ok(new
            {
                IsCashAffiliate = user.IsCashAffiliate,
                CashBalance = user.AffiliateCashBalance,
                TotalReferrals = referralsCount,
                ActiveReferrals = activeReferralsCount,
                EstimatedCreditsEarned = creditsEarned
            });
        }

        [HttpGet("referrals")]
        public async Task<IActionResult> GetReferrals()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var referrals = await _context.AffiliateReferrals
                .Include(r => r.ReferredUser)
                .Where(r => r.ReferrerId == userId)
                .OrderByDescending(r => r.JoinedAt)
                .Select(r => new
                {
                    r.ReferredUser.FullName,
                    Email = HideEmail(r.ReferredUser.Email),
                    r.JoinedAt,
                    r.Status,
                    r.Reason
                })
                .ToListAsync();

            return Ok(referrals);
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var transactions = await _context.AffiliateTransactions
                .Where(t => t.AffiliateId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(transactions);
        }

        [HttpPost("payout")]
        public async Task<IActionResult> RequestPayout([FromBody] PayoutRequest request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null || !user.IsCashAffiliate) return Forbid();

            if (request.Amount < 50)
            {
                return BadRequest(new { Message = "الحد الأدنى للسحب هو 50 دولار (أو ما يعادله)." });
            }

            if (request.Amount > user.AffiliateCashBalance)
            {
                return BadRequest(new { Message = "مبلغ السحب يتجاوز الرصيد المتاح." });
            }

            try
            {
                // Deduct balance and create pending transaction
                user.AffiliateCashBalance -= request.Amount;
                
                var transaction = new AffiliateTransaction
                {
                    AffiliateId = user.Id,
                    Amount = request.Amount,
                    Type = "Payout",
                    Status = "Pending",
                    Notes = $"Payout requested via: {request.Method} - Details: {request.Details}",
                    CreatedAt = DateTime.UtcNow
                };

                _context.AffiliateTransactions.Add(transaction);
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "تم إرسال طلب السحب بنجاح. قيد المراجعة." });
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest(new { Message = "حدث خطأ أثناء معالجة طلبك، يرجى المحاولة مرة أخرى." });
            }
        }

        private static string HideEmail(string? email)
        {
            if (string.IsNullOrEmpty(email)) return string.Empty;
            var parts = email.Split('@');
            if (parts.Length != 2) return email;
            var name = parts[0];
            if (name.Length > 2)
            {
                name = name.Substring(0, 2) + new string('*', name.Length - 2);
            }
            return name + "@" + parts[1];
        }
    }

    public class PayoutRequest
    {
        public decimal Amount { get; set; }
        public string Method { get; set; } = string.Empty; // e.g. PayPal, Bank
        public string Details { get; set; } = string.Empty; // e.g. email or account number
    }
}
