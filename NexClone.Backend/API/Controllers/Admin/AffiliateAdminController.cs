using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Application.Services;
using NexClone.Backend.Core.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using NexClone.Backend.Core.Interfaces;

namespace NexClone.Backend.API.Controllers.Admin
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin")]
    public class AffiliateAdminController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly AffiliateService _affiliateService;
        private readonly IMediaService _mediaService;

        public AffiliateAdminController(ApplicationDbContext db, AffiliateService affiliateService, IMediaService mediaService)
        {
            _db = db;
            _affiliateService = affiliateService;
            _mediaService = mediaService;
        }

        // ─── Overview ────────────────────────────────────────────────────────

        public async Task<IActionResult> Index()
        {
            ViewData["Title"] = "Affiliate Overview";

            var totalAffiliates = await _db.AffiliateProfiles.CountAsync();
            var activeAffiliates = await _db.AffiliateProfiles.CountAsync(p => p.IsActive);
            var totalReferrals = await _db.AffiliateReferrals.CountAsync(r => r.ReferredUserId.HasValue);

            var allCommissions = await _db.AffiliateCommissions.ToListAsync();

            var pendingAmount = allCommissions
                .Where(c => c.Status == CommissionStatus.Pending)
                .GroupBy(c => c.Currency)
                .Select(g => new { currency = g.Key, total = g.Sum(c => c.Amount) })
                .ToList();

            var availableAmount = allCommissions
                .Where(c => c.Status == CommissionStatus.Available)
                .GroupBy(c => c.Currency)
                .Select(g => new { currency = g.Key, total = g.Sum(c => c.Amount) })
                .ToList();

            var paidAmount = await _db.AffiliatePayouts
                .Where(p => p.Status == PayoutStatus.Paid)
                .GroupBy(p => p.Currency)
                .Select(g => new { currency = g.Key, total = g.Sum(p => p.Amount) })
                .ToListAsync();

            var activeReferredSubscriptions = await _db.AffiliateReferrals
                .Where(r => r.ReferredUserId.HasValue)
                .Join(_db.Subscriptions.Where(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow),
                    r => r.ReferredUserId,
                    s => (Guid?)s.UserId,
                    (r, s) => s.Id)
                .CountAsync();

            ViewBag.TotalAffiliates = totalAffiliates;
            ViewBag.ActiveAffiliates = activeAffiliates;
            ViewBag.TotalReferrals = totalReferrals;
            ViewBag.ActiveReferredSubscriptions = activeReferredSubscriptions;
            ViewBag.PendingAmount = pendingAmount;
            ViewBag.AvailableAmount = availableAmount;
            ViewBag.PaidAmount = paidAmount;

            return View();
        }

        // ─── Affiliates List ─────────────────────────────────────────────────

        public async Task<IActionResult> Affiliates([FromQuery] string? search = null, [FromQuery] int page = 1)
        {
            ViewData["Title"] = "Affiliates";
            int pageSize = 50;

            var query = _db.AffiliateProfiles
                .Include(p => p.User)
                .Include(p => p.Referrals)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p =>
                    p.User.FullName.Contains(search) ||
                    p.User.Email.Contains(search) ||
                    p.ReferralCode.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var profiles = await query.OrderByDescending(p => p.CreatedAt)
                                      .Skip((page - 1) * pageSize)
                                      .Take(pageSize)
                                      .ToListAsync();

            // Build summary per affiliate
            var profileIds = profiles.Select(p => p.Id).ToList();

            var commissions = await _db.AffiliateCommissions
                .Where(c => profileIds.Contains(c.AffiliateProfileId))
                .ToListAsync();

            var payouts = await _db.AffiliatePayouts
                .Where(p => profileIds.Contains(p.AffiliateProfileId) && p.Status == PayoutStatus.Paid)
                .ToListAsync();

            var referredUserIds = profiles.SelectMany(p => p.Referrals)
                                          .Where(r => r.ReferredUserId.HasValue)
                                          .Select(r => r.ReferredUserId.Value)
                                          .ToList();

            var allActiveSubs = await _db.Subscriptions
                .Where(s => referredUserIds.Contains(s.UserId) && s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow)
                .Select(s => s.UserId)
                .ToListAsync();

            var summaries = profiles.Select(p =>
            {
                var myCommissions = commissions.Where(c => c.AffiliateProfileId == p.Id).ToList();
                var myPayouts = payouts.Where(pw => pw.AffiliateProfileId == p.Id).ToList();

                var byCurrency = myCommissions.GroupBy(c => c.Currency).Select(g => new
                {
                    Currency = g.Key,
                    TotalCommission = g.Sum(c => c.Amount),
                    Pending = g.Where(c => c.Status == CommissionStatus.Pending).Sum(c => c.Amount),
                    Available = g.Where(c => c.Status == CommissionStatus.Available).Sum(c => c.Amount) -
                                myPayouts.Where(pw => pw.Currency == g.Key).Sum(pw => pw.Amount)
                }).ToList();

                var myReferredUserIds = p.Referrals.Where(r => r.ReferredUserId.HasValue).Select(r => r.ReferredUserId.Value).ToList();
                var paidCustomers = myCommissions.Where(c => c.Type == CommissionType.FirstPurchase).Select(c => c.CustomerId).Distinct().Count();
                var activeSubs = allActiveSubs.Count(uid => myReferredUserIds.Contains(uid));
                var signups = p.Referrals.Count(r => r.ReferredUserId.HasValue);
                var clicks = p.TotalClicks;
                var conversionRate = clicks > 0 ? Math.Round((decimal)paidCustomers / clicks * 100, 1) : 0;

                return new
                {
                    Profile = p,
                    TotalSignups = signups,
                    PaidCustomers = paidCustomers,
                    ActiveSubscriptions = activeSubs,
                    ConversionRate = conversionRate,
                    ByCurrency = byCurrency
                };
            }).ToList();

            ViewBag.Summaries = summaries;
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            return View(profiles);
        }

        // ─── Affiliate Details ────────────────────────────────────────────────

        public async Task<IActionResult> Details(int id)
        {
            var profile = await _db.AffiliateProfiles
                .Include(p => p.User)
                .Include(p => p.Referrals)
                    .ThenInclude(r => r.ReferredUser)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (profile == null) return NotFound();

            ViewData["Title"] = $"Affiliate: {profile.User.FullName}";

            var stats = await _affiliateService.GetAffiliateStatsAsync(id);
            var balances = await _affiliateService.GetBalancesAsync(id);

            var commissions = await _db.AffiliateCommissions
                .Where(c => c.AffiliateProfileId == id)
                .Include(c => c.Customer)
                .Include(c => c.Plan)
                .Include(c => c.Subscription)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            var siteUrl = Environment.GetEnvironmentVariable("NEXT_PUBLIC_SITE_URL") ?? "https://nexmediaai.com";
            ViewBag.ReferralLink = $"{siteUrl}/register?ref={profile.ReferralCode}";
            ViewBag.Stats = stats;
            ViewBag.Balances = balances;
            ViewBag.Commissions = commissions;

            return View(profile);
        }

        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateCommissionStatus(int commissionId, string newStatus)
        {
            var commission = await _db.AffiliateCommissions.FindAsync(commissionId);
            if (commission == null) return NotFound();

            commission.Status = newStatus.ToUpperInvariant();
            await _db.SaveChangesAsync();

            TempData["Success"] = $"Commission #{commissionId} status updated to {newStatus}.";
            return RedirectToAction(nameof(Details), new { id = commission.AffiliateProfileId });
        }

        // ─── Payout Requests ─────────────────────────────────────────────────

        public async Task<IActionResult> PayoutRequests([FromQuery] string? status = null, [FromQuery] string? currency = null)
        {
            ViewData["Title"] = "Payout Requests";

            var query = _db.AffiliatePayouts
                .Include(p => p.AffiliateProfile)
                    .ThenInclude(ap => ap.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(p => p.Status == status.ToUpperInvariant());

            if (!string.IsNullOrWhiteSpace(currency))
                query = query.Where(p => p.Currency == currency.ToUpperInvariant());

            var payouts = await query.OrderByDescending(p => p.RequestedAt).ToListAsync();
            return View(payouts);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdatePayoutStatus(int id, string newStatus, string? rejectionReason = null, IFormFile? receipt = null)
        {
            var payout = await _db.AffiliatePayouts.FindAsync(id);
            if (payout == null) return NotFound();

            var validTransitions = new Dictionary<string, string[]>
            {
                [PayoutStatus.Pending]    = new[] { PayoutStatus.Approved, PayoutStatus.Rejected },
                [PayoutStatus.Approved]   = new[] { PayoutStatus.Processing, PayoutStatus.Paid, PayoutStatus.Rejected },
                [PayoutStatus.Processing] = new[] { PayoutStatus.Paid, PayoutStatus.Failed },
            };

            if (!validTransitions.TryGetValue(payout.Status, out var allowed) || !allowed.Contains(newStatus))
            {
                TempData["Error"] = $"Cannot transition from {payout.Status} to {newStatus}.";
                return RedirectToAction(nameof(PayoutRequests));
            }

            payout.Status = newStatus;
            payout.ProcessedAt = DateTime.UtcNow;

            if (newStatus == PayoutStatus.Rejected)
            {
                payout.RejectionReason = rejectionReason;
            }
            else if (newStatus == PayoutStatus.Paid && receipt != null && receipt.Length > 0)
            {
                using var ms = new System.IO.MemoryStream();
                await receipt.CopyToAsync(ms);
                ms.Position = 0;
                
                var ext = System.IO.Path.GetExtension(receipt.FileName) ?? ".png";
                var filename = $"receipt_{payout.Id}_{Guid.NewGuid():N}{ext}";
                
                var url = await _mediaService.UploadFileAsync(ms, filename, receipt.ContentType, "payout-receipts");
                payout.TransferReceiptUrl = url;
            }

            await _db.SaveChangesAsync();

            TempData["Success"] = $"Payout #{id} updated to {newStatus}.";
            return RedirectToAction(nameof(PayoutRequests));
        }

        // ─── Affiliate Settings ───────────────────────────────────────────────

        public async Task<IActionResult> AffiliateSettings()
        {
            ViewData["Title"] = "Affiliate Settings";
            var settings = await _affiliateService.GetSettingsAsync();
            return View(settings);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AffiliateSettings(AffiliateSettingsDto dto)
        {
            await _affiliateService.SaveSettingsAsync(dto);
            TempData["Success"] = "Affiliate settings saved successfully.";
            return RedirectToAction(nameof(AffiliateSettings));
        }
    }
}
