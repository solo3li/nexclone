using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NexClone.Backend.Core.Entities;

namespace NexClone.Backend.Application.Services
{
    // ─────────────────────────────────────────────
    //  DTOs
    // ─────────────────────────────────────────────

    public class AffiliateSettingsDto
    {
        public bool IsEnabled { get; set; }
        public int HoldPeriodDays { get; set; }
        public int AttributionPeriodDays { get; set; }
        public bool RecurringEnabled { get; set; }
        public bool StopOnCancellation { get; set; }
        public decimal MinPayoutUsd { get; set; }
        public decimal MinPayoutEgp { get; set; }
        public int MaxRecurringMonths { get; set; }
        public int MaxInactivityDays { get; set; }
    }

    public class AffiliateCurrencyBalance
    {
        public string Currency { get; set; } = string.Empty;
        public decimal Available { get; set; }
        public decimal Pending { get; set; }
    }

    public class AffiliateStatsDto
    {
        public int TotalClicks { get; set; }
        public int TotalSignups { get; set; }
        public int PaidCustomers { get; set; }
        public int ActiveSubscriptions { get; set; }
        public decimal ConversionRate { get; set; }
        public List<AffiliateCurrencyBalance> Balances { get; set; } = new();
    }

    // ─────────────────────────────────────────────
    //  Service
    // ─────────────────────────────────────────────

    public class AffiliateService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<AffiliateService> _logger;

        private const string KEY_ENABLED = "Affiliate.IsEnabled";
        private const string KEY_HOLD = "Affiliate.HoldPeriodDays";
        private const string KEY_ATTRIBUTION = "Affiliate.AttributionPeriodDays";
        private const string KEY_RECURRING = "Affiliate.RecurringEnabled";
        private const string KEY_STOP_ON_CANCEL = "Affiliate.StopOnCancellation";
        private const string KEY_MIN_USD = "Affiliate.MinPayoutUsd";
        private const string KEY_MIN_EGP = "Affiliate.MinPayoutEgp";
        private const string KEY_MAX_MONTHS = "Affiliate.MaxRecurringMonths";
        private const string KEY_MAX_INACTIVITY = "Affiliate.MaxInactivityDays";

        public AffiliateService(ApplicationDbContext db, ILogger<AffiliateService> logger)
        {
            _db = db;
            _logger = logger;
        }

        // ─── Settings ────────────────────────────────────────────────────────

        public async Task<AffiliateSettingsDto> GetSettingsAsync()
        {
            var keys = new[]
            {
                KEY_ENABLED, KEY_HOLD, KEY_ATTRIBUTION,
                KEY_RECURRING, KEY_STOP_ON_CANCEL, KEY_MIN_USD, KEY_MIN_EGP,
                KEY_MAX_MONTHS, KEY_MAX_INACTIVITY
            };
            var settings = await _db.AppSettings
                .Where(s => keys.Contains(s.Key))
                .ToDictionaryAsync(s => s.Key, s => s.Value);

            return new AffiliateSettingsDto
            {
                IsEnabled           = GetBool(settings, KEY_ENABLED, true),
                HoldPeriodDays      = GetInt(settings, KEY_HOLD, 14),
                AttributionPeriodDays = GetInt(settings, KEY_ATTRIBUTION, 30),
                RecurringEnabled    = GetBool(settings, KEY_RECURRING, true),
                StopOnCancellation  = GetBool(settings, KEY_STOP_ON_CANCEL, true),
                MinPayoutUsd        = GetDecimal(settings, KEY_MIN_USD, 50),
                MinPayoutEgp        = GetDecimal(settings, KEY_MIN_EGP, 500),
                MaxRecurringMonths  = GetInt(settings, KEY_MAX_MONTHS, 0),
                MaxInactivityDays   = GetInt(settings, KEY_MAX_INACTIVITY, 0),
            };
        }

        public async Task SaveSettingsAsync(AffiliateSettingsDto dto)
        {
            await UpsertSettingAsync(KEY_ENABLED, dto.IsEnabled.ToString().ToLower(), "Affiliate system enabled toggle");
            await UpsertSettingAsync(KEY_HOLD, dto.HoldPeriodDays.ToString(), "Days before pending commissions become available");
            await UpsertSettingAsync(KEY_ATTRIBUTION, dto.AttributionPeriodDays.ToString(), "Days referral attribution remains valid after click");
            await UpsertSettingAsync(KEY_RECURRING, dto.RecurringEnabled.ToString().ToLower(), "Enable recurring commissions on subscription renewals");
            await UpsertSettingAsync(KEY_STOP_ON_CANCEL, dto.StopOnCancellation.ToString().ToLower(), "Stop recurring commissions when subscription is cancelled");
            await UpsertSettingAsync(KEY_MIN_USD, dto.MinPayoutUsd.ToString("F2", System.Globalization.CultureInfo.InvariantCulture), "Minimum payout amount in USD");
            await UpsertSettingAsync(KEY_MIN_EGP, dto.MinPayoutEgp.ToString("F2", System.Globalization.CultureInfo.InvariantCulture), "Minimum payout amount in EGP");
            await UpsertSettingAsync(KEY_MAX_MONTHS, dto.MaxRecurringMonths.ToString(), "Max months for recurring commissions (0 for unlimited)");
            await UpsertSettingAsync(KEY_MAX_INACTIVITY, dto.MaxInactivityDays.ToString(), "Max days of inactivity before referral link drops (0 for unlimited)");
            await _db.SaveChangesAsync();
        }

        // ─── Profile ─────────────────────────────────────────────────────────

        public async Task<AffiliateProfile?> GetProfileAsync(Guid userId)
        {
            return await _db.AffiliateProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public class OnboardDto
        {
            public string? MobileNumber { get; set; }
            public string? TelegramUsername { get; set; }
            public string? WhatsappNumber { get; set; }
            public string? FacebookAccount { get; set; }
        }

        public async Task<(bool Success, string Error, AffiliateProfile? Profile)> OnboardProfileAsync(Guid userId, OnboardDto dto)
        {
            var profile = await GetProfileAsync(userId);
            if (profile != null)
                return (false, "User is already an affiliate.", profile);

            var code = await GenerateUniqueCodeAsync();
            profile = new AffiliateProfile
            {
                UserId = userId,
                AffiliateDisplayId = "PENDING", // Will be updated after inserting
                ReferralCode = code,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                MobileNumber = dto.MobileNumber,
                TelegramUsername = dto.TelegramUsername,
                WhatsappNumber = dto.WhatsappNumber,
                FacebookAccount = dto.FacebookAccount,
                PolicyAcceptedAt = DateTime.UtcNow
            };

            _db.AffiliateProfiles.Add(profile);
            await _db.SaveChangesAsync();
            
            // Assign display ID safely using the generated primary key
            profile.AffiliateDisplayId = $"AF-{profile.Id:D5}";
            await _db.SaveChangesAsync();

            _logger.LogInformation("Onboarded AffiliateProfile {Id} for user {UserId}", profile.Id, userId);
            return (true, string.Empty, profile);
        }

        // ─── Referral Tracking ────────────────────────────────────────────────

        /// <summary>
        /// Called when a visitor clicks a ?ref= link.
        /// Returns a session token to store in a cookie.
        /// </summary>
        public async Task<string?> TrackClickAsync(string referralCode)
        {
            if (string.IsNullOrWhiteSpace(referralCode)) return null;
            referralCode = referralCode.ToUpper();

            var settings = await GetSettingsAsync();
            if (!settings.IsEnabled) {
                _logger.LogInformation("[Affiliate] TrackClickAsync failed: System is disabled.");
                return null;
            }

            var profile = await _db.AffiliateProfiles
                .FirstOrDefaultAsync(p => p.ReferralCode == referralCode && p.IsActive);

            if (profile == null) {
                _logger.LogInformation("[Affiliate] TrackClickAsync failed: No active profile found for code {Code}.", referralCode);
                return null;
            }

            var sessionToken = Guid.NewGuid().ToString("N");

            var referral = new AffiliateReferral
            {
                AffiliateProfileId = profile.Id,
                SessionToken = sessionToken,
                ClickedAt = DateTime.UtcNow,
                AttributionExpiresAt = DateTime.UtcNow.AddDays(settings.AttributionPeriodDays)
            };

            profile.TotalClicks++;
            _db.AffiliateReferrals.Add(referral);
            await _db.SaveChangesAsync();

            return sessionToken;
        }

        public async Task LinkReferralToUserAsync(string sessionToken, Guid newUserId)
        {
            if (string.IsNullOrWhiteSpace(sessionToken)) return;

            var referral = await _db.AffiliateReferrals
                .FirstOrDefaultAsync(r => r.SessionToken == sessionToken && r.ReferredUserId == null);

            if (referral == null) return;

            if (referral.AttributionExpiresAt < DateTime.UtcNow)
            {
                _logger.LogInformation("Referral session {Token} expired. Attribution period ended.", sessionToken);
                return;
            }

            referral.ReferredUserId = newUserId;
            await _db.SaveChangesAsync();

            _logger.LogInformation("Linked user {UserId} to referral {ReferralId}", newUserId, referral.Id);
        }

        /// <summary>
        /// Called during registration when a user manually enters a referral code.
        /// Creates a new referral record instantly and links it.
        /// </summary>
        public async Task LinkManualReferralAsync(string referralCode, Guid newUserId)
        {
            if (string.IsNullOrWhiteSpace(referralCode)) return;
            referralCode = referralCode.ToUpper();
            
            // Prevent linking if user is already referred
            if (await _db.AffiliateReferrals.AnyAsync(r => r.ReferredUserId == newUserId)) return;

            var profile = await _db.AffiliateProfiles
                .FirstOrDefaultAsync(p => p.ReferralCode == referralCode && p.IsActive);

            if (profile == null) return;

            // Prevent referring yourself
            if (profile.UserId == newUserId) return;

            var referral = new AffiliateReferral
            {
                AffiliateProfileId = profile.Id,
                SessionToken = "MANUAL-" + Guid.NewGuid().ToString("N").Substring(0, 16),
                ClickedAt = DateTime.UtcNow,
                AttributionExpiresAt = DateTime.UtcNow.AddDays(30),
                ReferredUserId = newUserId
            };

            profile.TotalClicks++; // Count as a click/interaction
            _db.AffiliateReferrals.Add(referral);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Manually linked user {UserId} to profile {ProfileId} via code {Code}", newUserId, profile.Id, referralCode);
        }

        // ─── Commission Creation ──────────────────────────────────────────────

        /// <summary>
        /// Convenience method for Admin-triggered plan assignment.
        /// Accepts optional rate overrides to bypass the plan's default commission percentages.
        /// Pass null to use the plan's configured rates.
        /// </summary>
        public async Task ProcessPaymentCommissionAsync(
            Guid userId, int paymentId, decimal amount, string currency, int planId, int subscriptionId,
            decimal? firstCommissionOverride = null, decimal? recurringCommissionOverride = null)
        {
            var settings = await GetSettingsAsync();
            if (!settings.IsEnabled) return;

            // Prevent duplicate commissions
            var isAlreadyCommissioned = await _db.AffiliateCommissions
                .AnyAsync(c => c.PaymentId == paymentId && 
                               c.Type != CommissionType.Reversal);
            if (isAlreadyCommissioned) return;

            // Check if user was referred by an affiliate
            var referral = await _db.AffiliateReferrals
                .Include(r => r.AffiliateProfile)
                .FirstOrDefaultAsync(r => r.ReferredUserId == userId && r.AffiliateProfile.IsActive);

            if (referral == null) return; // Not a referred user — skip

            var plan = await _db.Plans.FindAsync(planId);
            if (plan == null) return;

            bool isRecurring = referral.HasConverted;
            if (isRecurring && !settings.RecurringEnabled) return;

            decimal commissionAmount = 0;
            decimal rate = 0;

            if (isRecurring)
            {
                if (recurringCommissionOverride.HasValue)
                {
                    rate = recurringCommissionOverride.Value;
                    commissionAmount = Math.Round(amount * rate / 100m, 2);
                }
                else if (plan.AffiliateRecurringCommissionType == "Fixed")
                {
                    commissionAmount = currency.ToUpper() == "USD" ? plan.AffiliateRecurringCommissionValueUsd : plan.AffiliateRecurringCommissionValueEgp;
                }
                else
                {
                    rate = currency.ToUpper() == "USD" ? plan.AffiliateRecurringCommissionValueUsd : plan.AffiliateRecurringCommissionValueEgp;
                    commissionAmount = Math.Round(amount * rate / 100m, 2);
                }
            }
            else
            {
                if (firstCommissionOverride.HasValue)
                {
                    rate = firstCommissionOverride.Value;
                    commissionAmount = Math.Round(amount * rate / 100m, 2);
                }
                else if (plan.AffiliateFirstCommissionType == "Fixed")
                {
                    commissionAmount = currency.ToUpper() == "USD" ? plan.AffiliateFirstCommissionValueUsd : plan.AffiliateFirstCommissionValueEgp;
                }
                else
                {
                    rate = currency.ToUpper() == "USD" ? plan.AffiliateFirstCommissionValueUsd : plan.AffiliateFirstCommissionValueEgp;
                    commissionAmount = Math.Round(amount * rate / 100m, 2);
                }
            }

            if (isRecurring && recurringCommissionOverride < 0) return;
            if (!isRecurring && firstCommissionOverride < 0) return;
            if (commissionAmount <= 0) return;

            var commission = new AffiliateCommission
            {
                AffiliateProfileId = referral.AffiliateProfileId,
                AffiliateReferralId = referral.Id,
                CustomerId = userId,
                PlanId = planId,
                SubscriptionId = subscriptionId,
                PaymentId = paymentId,
                Type = isRecurring ? CommissionType.Recurring : CommissionType.FirstPurchase,
                Amount = commissionAmount,
                Currency = currency,
                Rate = rate,
                Status = CommissionStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                AvailableAt = DateTime.UtcNow.AddDays(settings.HoldPeriodDays)
            };

            if (!isRecurring)
                referral.HasConverted = true;

            _db.AffiliateCommissions.Add(commission);
            await _db.SaveChangesAsync();

            _logger.LogInformation(
                "Admin-assigned {Type} commission {Amount} {Currency} (rate {Rate}%) for affiliate {AffiliateId} on payment {PaymentId}",
                commission.Type, commission.Amount, commission.Currency, commission.Rate,
                referral.AffiliateProfileId, paymentId);
        }

        /// <summary>
        /// Called after a successful payment is recorded.
        /// Determines if an affiliate commission should be created.
        /// </summary>
        public async Task CreateCommissionAsync(int paymentId, bool isRecurring)

        {
            var settings = await GetSettingsAsync();
            if (!settings.IsEnabled) return;

            if (isRecurring && !settings.RecurringEnabled) return;

            // Prevent duplicate commissions
            var expectedType = isRecurring ? CommissionType.Recurring : CommissionType.FirstPurchase;
            var isAlreadyCommissioned = await _db.AffiliateCommissions
                .AnyAsync(c => c.PaymentId == paymentId && c.Type == expectedType);
            if (isAlreadyCommissioned) return;

            var payment = await _db.Payments
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == paymentId);

            if (payment == null) return;
            if (payment.PlanId == null || payment.SubscriptionId == null) return;

            // Find the active referral linking this customer to an affiliate
            var referral = await _db.AffiliateReferrals
                .Include(r => r.AffiliateProfile)
                .FirstOrDefaultAsync(r =>
                    r.ReferredUserId == payment.UserId &&
                    r.AffiliateProfile.IsActive);

            if (referral == null) return;

            var plan = await _db.Plans.FindAsync(payment.PlanId.Value);
            if (plan == null) return;

            // Enforcement: Max Inactivity Days
            if (settings.MaxInactivityDays > 0)
            {
                var lastCommission = await _db.AffiliateCommissions
                    .Where(c => c.AffiliateReferralId == referral.Id)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync();

                var referenceDate = lastCommission != null ? lastCommission.CreatedAt : referral.ClickedAt;
                if ((DateTime.UtcNow - referenceDate).TotalDays > settings.MaxInactivityDays)
                {
                    _logger.LogInformation("Skipping commission and unlinking referral — inactivity period of {Days} days exceeded for referral {ReferralId}", settings.MaxInactivityDays, referral.Id);
                    referral.ReferredUserId = null; // Unlink permanently
                    await _db.SaveChangesAsync();
                    return;
                }
            }

            // Enforcement: Max Recurring Months
            if (isRecurring && settings.MaxRecurringMonths > 0)
            {
                var firstCommission = await _db.AffiliateCommissions
                    .Where(c => c.AffiliateReferralId == referral.Id)
                    .OrderBy(c => c.CreatedAt)
                    .FirstOrDefaultAsync();

                if (firstCommission != null && firstCommission.CreatedAt.AddMonths(settings.MaxRecurringMonths) < DateTime.UtcNow)
                {
                    _logger.LogInformation("Skipping commission — max recurring months ({MaxMonths}) exceeded for referral {ReferralId}", settings.MaxRecurringMonths, referral.Id);
                    return; // Just skip
                }
            }

            decimal commissionAmount = 0;
            decimal rate = 0;

            if (isRecurring)
            {
                if (plan.AffiliateRecurringCommissionType == "Fixed")
                {
                    commissionAmount = payment.Currency.ToUpper() == "USD" ? plan.AffiliateRecurringCommissionValueUsd : plan.AffiliateRecurringCommissionValueEgp;
                }
                else
                {
                    rate = payment.Currency.ToUpper() == "USD" ? plan.AffiliateRecurringCommissionValueUsd : plan.AffiliateRecurringCommissionValueEgp;
                    commissionAmount = Math.Round(payment.Amount * rate / 100m, 2);
                }
            }
            else
            {
                if (plan.AffiliateFirstCommissionType == "Fixed")
                {
                    commissionAmount = payment.Currency.ToUpper() == "USD" ? plan.AffiliateFirstCommissionValueUsd : plan.AffiliateFirstCommissionValueEgp;
                }
                else
                {
                    rate = payment.Currency.ToUpper() == "USD" ? plan.AffiliateFirstCommissionValueUsd : plan.AffiliateFirstCommissionValueEgp;
                    commissionAmount = Math.Round(payment.Amount * rate / 100m, 2);
                }
            }

            if (commissionAmount <= 0) return;

            // Check if StopOnCancellation applies
            if (isRecurring && settings.StopOnCancellation)
            {
                var subscription = await _db.Subscriptions.FindAsync(payment.SubscriptionId.Value);
                if (subscription != null && subscription.Status.ToLower() == "canceled")
                {
                    _logger.LogInformation("Skipping commission — subscription is cancelled for payment {PaymentId}", paymentId);
                    return;
                }
            }

            var commission = new AffiliateCommission
            {
                AffiliateProfileId = referral.AffiliateProfileId,
                AffiliateReferralId = referral.Id,
                CustomerId = payment.UserId,
                PlanId = payment.PlanId.Value,
                SubscriptionId = payment.SubscriptionId.Value,
                PaymentId = payment.Id,
                Type = isRecurring ? CommissionType.Recurring : CommissionType.FirstPurchase,
                Amount = commissionAmount,
                Currency = payment.Currency,         // NEVER converted
                Rate = rate,
                Status = CommissionStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                AvailableAt = DateTime.UtcNow.AddDays(settings.HoldPeriodDays)
            };

            // Mark referral as converted on first purchase
            if (!isRecurring)
                referral.HasConverted = true;

            _db.AffiliateCommissions.Add(commission);
            await _db.SaveChangesAsync();

            _logger.LogInformation(
                "Created {Type} commission {Amount} {Currency} (rate {Rate}%) for affiliate {AffiliateId} on payment {PaymentId}",
                commission.Type, commission.Amount, commission.Currency, commission.Rate,
                referral.AffiliateProfileId, paymentId);
        }

        // ─── Hold Period Processing ───────────────────────────────────────────

        /// <summary>
        /// Executed by a daily Hangfire job.
        /// Moves PENDING commissions past their AvailableAt to AVAILABLE.
        /// </summary>
        public async Task ProcessPendingCommissionsAsync()
        {
            var now = DateTime.UtcNow;
            var pending = await _db.AffiliateCommissions
                .Where(c => c.Status == CommissionStatus.Pending && c.AvailableAt <= now)
                .ToListAsync();

            foreach (var commission in pending)
                commission.Status = CommissionStatus.Available;

            if (pending.Count > 0)
            {
                await _db.SaveChangesAsync();
                _logger.LogInformation("Processed {Count} pending commissions to AVAILABLE", pending.Count);
            }
        }

        // ─── Refund / Reversal ────────────────────────────────────────────────

        /// <summary>
        /// Called when a payment is refunded.
        /// PENDING → CANCELLED (silently).
        /// AVAILABLE → Creates a new REVERSAL record (auditable).
        /// </summary>
        public async Task ReverseCommissionAsync(int paymentId)
        {
            var commissions = await _db.AffiliateCommissions
                .Where(c => c.PaymentId == paymentId &&
                            c.Type != CommissionType.Reversal &&
                            (c.Status == CommissionStatus.Pending || c.Status == CommissionStatus.Available))
                .ToListAsync();

            foreach (var commission in commissions)
            {
                if (commission.Status == CommissionStatus.Pending)
                {
                    commission.Status = CommissionStatus.Cancelled;
                }
                else if (commission.Status == CommissionStatus.Available)
                {
                    // Immutable ledger: add a new REVERSAL record
                    var reversal = new AffiliateCommission
                    {
                        AffiliateProfileId = commission.AffiliateProfileId,
                        AffiliateReferralId = commission.AffiliateReferralId,
                        CustomerId = commission.CustomerId,
                        PlanId = commission.PlanId,
                        SubscriptionId = commission.SubscriptionId,
                        PaymentId = commission.PaymentId,
                        Type = CommissionType.Reversal,
                        Amount = -commission.Amount,        // Negative to offset the original
                        Currency = commission.Currency,
                        Rate = commission.Rate,
                        Status = CommissionStatus.Reversed,
                        CreatedAt = DateTime.UtcNow,
                        AvailableAt = DateTime.UtcNow
                    };
                    commission.Status = CommissionStatus.Reversed;
                    _db.AffiliateCommissions.Add(reversal);
                }
            }

            await _db.SaveChangesAsync();
        }

        // ─── Balances ─────────────────────────────────────────────────────────

        /// <summary>
        /// Calculates available and pending balances per currency.
        /// Balance is always computed from the ledger — never stored as a field.
        /// </summary>
        public async Task<List<AffiliateCurrencyBalance>> GetBalancesAsync(int affiliateProfileId)
        {
            // Database-level grouping and summing for performance
            var commissionTotals = await _db.AffiliateCommissions
                .Where(c => c.AffiliateProfileId == affiliateProfileId)
                .GroupBy(c => new { c.Currency, c.Status })
                .Select(g => new { g.Key.Currency, g.Key.Status, Total = g.Sum(c => c.Amount) })
                .ToListAsync();

            var payoutTotals = await _db.AffiliatePayouts
                .Where(p => p.AffiliateProfileId == affiliateProfileId && 
                            p.Status != PayoutStatus.Rejected && 
                            p.Status != PayoutStatus.Failed)
                .GroupBy(p => p.Currency)
                .Select(g => new { Currency = g.Key, Total = g.Sum(p => p.Amount) })
                .ToListAsync();

            var currencies = commissionTotals.Select(c => c.Currency).Distinct().ToList();
            var result = new List<AffiliateCurrencyBalance>();

            foreach (var currency in currencies)
            {
                decimal available = commissionTotals
                    .Where(c => c.Currency == currency && c.Status == CommissionStatus.Available)
                    .Sum(c => c.Total);

                decimal paid = payoutTotals
                    .Where(p => p.Currency == currency)
                    .Sum(p => p.Total);

                decimal pending = commissionTotals
                    .Where(c => c.Currency == currency && c.Status == CommissionStatus.Pending)
                    .Sum(c => c.Total);

                result.Add(new AffiliateCurrencyBalance
                {
                    Currency = currency,
                    Available = available - paid,
                    Pending = pending
                });
            }

            return result;
        }

        // ─── Payout ───────────────────────────────────────────────────────────

        public async Task<(bool Success, string Error)> RequestPayoutAsync(
            int affiliateProfileId, decimal amount, string currency, string method, string account, string? message = null)
        {
            var settings = await GetSettingsAsync();

            // Minimum payout check
            var minimum = currency == "USD" ? settings.MinPayoutUsd : settings.MinPayoutEgp;
            if (amount < minimum)
                return (false, $"Minimum payout is {minimum} {currency}.");

            // Use Serializable transaction to prevent Double Spend via race condition
            using var transaction = await _db.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
            try
            {
                // Available balance check
                var balances = await GetBalancesAsync(affiliateProfileId);
                var balance = balances.FirstOrDefault(b => b.Currency == currency);
                if (balance == null || balance.Available < amount)
                    return (false, "Insufficient available balance.");

                var payout = new AffiliatePayout
                {
                    AffiliateProfileId = affiliateProfileId,
                    Amount = amount,
                    Currency = currency,
                    PayoutMethod = method,
                    PayoutAccount = account,
                    AffiliateMessage = message,
                    Status = PayoutStatus.Pending,
                    RequestedAt = DateTime.UtcNow
                };

                _db.AffiliatePayouts.Add(payout);
                await _db.SaveChangesAsync();
                
                await transaction.CommitAsync();
                return (true, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Transaction failed during payout request for profile {ProfileId}", affiliateProfileId);
                return (false, "A concurrency error occurred, please try again.");
            }
        }

        // ─── Admin Stats ──────────────────────────────────────────────────────

        public async Task<AffiliateStatsDto> GetAffiliateStatsAsync(int affiliateProfileId)
        {
            var profile = await _db.AffiliateProfiles
                .Include(p => p.Referrals)
                .FirstOrDefaultAsync(p => p.Id == affiliateProfileId);

            if (profile == null) return new AffiliateStatsDto();

            var paidCustomers = await _db.AffiliateCommissions
                .Where(c => c.AffiliateProfileId == affiliateProfileId &&
                            c.Type == CommissionType.FirstPurchase)
                .Select(c => c.CustomerId)
                .Distinct()
                .CountAsync();

            var activeSubscriptions = await _db.Subscriptions
                .Where(s => _db.AffiliateReferrals.Any(r => r.AffiliateProfileId == affiliateProfileId && r.ReferredUserId == s.UserId)
                            && s.Status.ToLower() == "active" 
                            && s.EndDate > DateTime.UtcNow)
                .CountAsync();

            var balances = await GetBalancesAsync(affiliateProfileId);

            int signups = profile.Referrals.Count(r => r.ReferredUserId.HasValue);
            int clicks = profile.TotalClicks;

            return new AffiliateStatsDto
            {
                TotalClicks = clicks,
                TotalSignups = signups,
                PaidCustomers = paidCustomers,
                ActiveSubscriptions = activeSubscriptions,
                ConversionRate = clicks > 0 ? Math.Round((decimal)paidCustomers / clicks * 100, 1) : 0,
                Balances = balances
            };
        }

        // ─── Helpers ──────────────────────────────────────────────────────────

        private async Task<string> GenerateUniqueCodeAsync()
        {
            string code;
            int attempts = 0;
            do
            {
                code = GenerateCode();
                attempts++;
                if (attempts > 50) throw new Exception("Could not generate unique affiliate code after 50 attempts.");
            } while (await _db.AffiliateProfiles.AnyAsync(p => p.ReferralCode == code));
            return code;
        }

        private static string GenerateCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var rng = new Random();
            return new string(Enumerable.Repeat(chars, 8).Select(s => s[rng.Next(s.Length)]).ToArray());
        }

        private async Task UpsertSettingAsync(string key, string value, string description)
        {
            var setting = await _db.AppSettings.FirstOrDefaultAsync(s => s.Key == key);
            if (setting == null)
            {
                _db.AppSettings.Add(new AppSetting { Key = key, Value = value, Description = description, UpdatedAt = DateTime.UtcNow });
            }
            else
            {
                setting.Value = value;
                setting.UpdatedAt = DateTime.UtcNow;
            }
        }

        private static bool GetBool(Dictionary<string, string> d, string key, bool def)
            => d.TryGetValue(key, out var v) ? v.ToLower() == "true" : def;

        private static int GetInt(Dictionary<string, string> d, string key, int def)
            => d.TryGetValue(key, out var v) && int.TryParse(v, out var n) ? n : def;

        private static decimal GetDecimal(Dictionary<string, string> d, string key, decimal def)
            => d.TryGetValue(key, out var v) && decimal.TryParse(v, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var n) ? n : def;
    }
}
