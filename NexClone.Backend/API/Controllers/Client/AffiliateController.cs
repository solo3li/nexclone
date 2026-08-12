using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Application.Services;
using NexClone.Backend.Core.Entities;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NexClone.Backend.API.Controllers.Client
{
    /// <summary>
    /// Authenticated affiliate dashboard API for end users.
    /// Users can only access their own affiliate data.
    /// </summary>
    [Route("api/affiliate")]
    [ApiController]
    [Authorize]
    [EnableRateLimiting("ApiPolicy")]
    public class AffiliateController : ControllerBase
    {
        private readonly AffiliateService _affiliateService;
        private readonly ApplicationDbContext _db;

        public AffiliateController(AffiliateService affiliateService, ApplicationDbContext db)
        {
            _affiliateService = affiliateService;
            _db = db;
        }

        private Guid GetCurrentUserId()
        {
            Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id);
            return id;
        }

        // ─────────────────────────────────────────────
        //  GET /api/affiliate/profile
        // ─────────────────────────────────────────────

        /// <summary>
        /// Returns (or creates) the affiliate profile for the current user.
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await _affiliateService.GetOrCreateProfileAsync(userId);

            var siteUrl = Environment.GetEnvironmentVariable("NEXT_PUBLIC_SITE_URL") ?? "https://nexmediaai.com";

            return Ok(new
            {
                id = profile.Id,
                affiliateDisplayId = profile.AffiliateDisplayId,
                referralCode = profile.ReferralCode,
                referralLink = $"{siteUrl}/register?ref={profile.ReferralCode}",
                isActive = profile.IsActive,
                totalClicks = profile.TotalClicks,
                createdAt = profile.CreatedAt
            });
        }

        // ─────────────────────────────────────────────
        //  GET /api/affiliate/balances
        // ─────────────────────────────────────────────

        [HttpGet("balances")]
        public async Task<IActionResult> GetBalances()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await _db.AffiliateProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return Ok(new object[] { });

            var balances = await _affiliateService.GetBalancesAsync(profile.Id);
            return Ok(balances);
        }

        // ─────────────────────────────────────────────
        //  GET /api/affiliate/stats
        // ─────────────────────────────────────────────

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await _db.AffiliateProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return Ok(new AffiliateStatsDto());

            var stats = await _affiliateService.GetAffiliateStatsAsync(profile.Id);
            return Ok(stats);
        }

        // ─────────────────────────────────────────────
        //  GET /api/affiliate/referrals
        // ─────────────────────────────────────────────

        [HttpGet("referrals")]
        public async Task<IActionResult> GetReferrals([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await _db.AffiliateProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return Ok(new object[] { });

            var referrals = await _db.AffiliateReferrals
                .Where(r => r.AffiliateProfileId == profile.Id && r.ReferredUserId.HasValue)
                .Include(r => r.ReferredUser)
                .OrderByDescending(r => r.ClickedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new
                {
                    referralId = r.Id,
                    referredUser = r.ReferredUser != null ? new { name = r.ReferredUser.FullName, email = r.ReferredUser.Email } : null,
                    clickedAt = r.ClickedAt,
                    hasConverted = r.HasConverted,
                    // Get their active subscription
                    activeSubscription = _db.Subscriptions
                        .Where(s => s.UserId == r.ReferredUserId && s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow)
                        .Select(s => new { planName = s.Plan.Name, status = s.Status })
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(referrals);
        }

        // ─────────────────────────────────────────────
        //  GET /api/affiliate/commissions
        // ─────────────────────────────────────────────

        [HttpGet("commissions")]
        public async Task<IActionResult> GetCommissions([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await _db.AffiliateProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return Ok(new object[] { });

            var commissions = await _db.AffiliateCommissions
                .Where(c => c.AffiliateProfileId == profile.Id)
                .Include(c => c.Customer)
                .Include(c => c.Plan)
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new
                {
                    id = c.Id,
                    type = c.Type,
                    amount = c.Amount,
                    currency = c.Currency,
                    rate = c.Rate,
                    status = c.Status,
                    createdAt = c.CreatedAt,
                    availableAt = c.AvailableAt,
                    paidAt = c.PaidAt,
                    plan = new { name = c.Plan.Name, nameAr = c.Plan.NameAr },
                    customerName = c.Customer.FullName ?? c.Customer.Email
                })
                .ToListAsync();

            return Ok(commissions);
        }

        // ─────────────────────────────────────────────
        //  POST /api/affiliate/payouts
        // ─────────────────────────────────────────────

        public class PayoutRequest
        {
            public decimal Amount { get; set; }
            public string Currency { get; set; } = string.Empty;
            public string PayoutMethod { get; set; } = string.Empty;
            public string PayoutAccount { get; set; } = string.Empty;
        }

        [HttpPost("payouts")]
        public async Task<IActionResult> RequestPayout([FromBody] PayoutRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            if (request == null || request.Amount <= 0)
                return BadRequest(new { error = "Invalid amount." });

            if (string.IsNullOrWhiteSpace(request.Currency))
                return BadRequest(new { error = "Currency is required." });

            var method = string.IsNullOrWhiteSpace(request.PayoutMethod) ? "Manual" : request.PayoutMethod;
            var account = string.IsNullOrWhiteSpace(request.PayoutAccount) ? "Manual Request" : request.PayoutAccount;

            var profile = await _affiliateService.GetOrCreateProfileAsync(userId);

            var (success, error) = await _affiliateService.RequestPayoutAsync(
                profile.Id,
                request.Amount,
                request.Currency.ToUpperInvariant(),
                method,
                account);

            if (!success)
                return BadRequest(new { error });

            return Ok(new { message = "Payout request submitted successfully." });
        }

        // ─────────────────────────────────────────────
        //  GET /api/affiliate/payouts
        // ─────────────────────────────────────────────

        [HttpGet("payouts")]
        public async Task<IActionResult> GetPayouts()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await _db.AffiliateProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return Ok(new object[] { });

            var payouts = await _db.AffiliatePayouts
                .Where(p => p.AffiliateProfileId == profile.Id)
                .OrderByDescending(p => p.RequestedAt)
                .Select(p => new
                {
                    id = p.Id,
                    amount = p.Amount,
                    currency = p.Currency,
                    payoutMethod = p.PayoutMethod,
                    payoutAccount = p.PayoutAccount,
                    status = p.Status,
                    rejectionReason = p.RejectionReason,
                    requestedAt = p.RequestedAt,
                    processedAt = p.ProcessedAt
                })
                .ToListAsync();

            return Ok(payouts);
        }
    }
}
