using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    /// <summary>
    /// Immutable commission ledger entry.
    /// Records are never modified — refunds create new REVERSAL records.
    /// </summary>
    public class AffiliateCommission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AffiliateProfileId { get; set; }

        [Required]
        public int AffiliateReferralId { get; set; }

        [Required]
        public Guid CustomerId { get; set; }

        [Required]
        public int PlanId { get; set; }

        [Required]
        public int SubscriptionId { get; set; }

        [Required]
        public int PaymentId { get; set; }

        /// <summary>FIRST_PURCHASE | RECURRING | REVERSAL</summary>
        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        /// <summary>Matches the currency of the original payment — NEVER converted.</summary>
        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = string.Empty;

        /// <summary>Exact percentage rate used at commission creation time.</summary>
        public decimal Rate { get; set; }

        /// <summary>PENDING | AVAILABLE | CANCELLED | REVERSED | PAID</summary>
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "PENDING";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>CreatedAt + global HoldPeriodDays. Job will set AVAILABLE after this date.</summary>
        public DateTime AvailableAt { get; set; }

        public DateTime? PaidAt { get; set; }

        // Navigation
        [ForeignKey(nameof(AffiliateProfileId))]
        public AffiliateProfile AffiliateProfile { get; set; } = null!;

        [ForeignKey(nameof(AffiliateReferralId))]
        public AffiliateReferral AffiliateReferral { get; set; } = null!;

        [ForeignKey(nameof(CustomerId))]
        public ApplicationUser Customer { get; set; } = null!;

        [ForeignKey(nameof(PlanId))]
        public Plan Plan { get; set; } = null!;

        [ForeignKey(nameof(SubscriptionId))]
        public Subscription Subscription { get; set; } = null!;

        [ForeignKey(nameof(PaymentId))]
        public Payment Payment { get; set; } = null!;
    }

    public static class CommissionType
    {
        public const string FirstPurchase = "FIRST_PURCHASE";
        public const string Recurring = "RECURRING";
        public const string Reversal = "REVERSAL";
    }

    public static class CommissionStatus
    {
        public const string Pending = "PENDING";
        public const string Available = "AVAILABLE";
        public const string Cancelled = "CANCELLED";
        public const string Reversed = "REVERSED";
        public const string Paid = "PAID";
    }
}
