using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    /// <summary>
    /// Tracks a single ?ref= click event and its conversion state.
    /// One referral per (AffiliateProfile + visitor session).
    /// </summary>
    public class AffiliateReferral
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AffiliateProfileId { get; set; }

        /// <summary>Filled when the visitor registers as a user.</summary>
        public Guid? ReferredUserId { get; set; }

        /// <summary>Opaque cookie token to link a pre-registration visitor to this referral.</summary>
        [MaxLength(100)]
        public string? SessionToken { get; set; }

        public DateTime ClickedAt { get; set; } = DateTime.UtcNow;

        /// <summary>ClickedAt + global AttributionPeriodDays setting.</summary>
        public DateTime AttributionExpiresAt { get; set; }

        /// <summary>True when the referred visitor has registered AND made a qualifying payment.</summary>
        public bool HasConverted { get; set; } = false;

        /// <summary>
        /// Anchors the recurring-commission Time Window: set once, at the customer's first
        /// commission-attempted payment. Null until then.
        /// </summary>
        public DateTime? FirstEligiblePaymentAt { get; set; }

        /// <summary>
        /// Cumulative plan duration (days) of all packages that actually earned a commission.
        /// Capped by the global Affiliate.MaxPackageDurationDays setting.
        /// </summary>
        public int AccumulatedPackageDays { get; set; } = 0;

        // Navigation
        [ForeignKey(nameof(AffiliateProfileId))]
        public AffiliateProfile AffiliateProfile { get; set; } = null!;

        [ForeignKey(nameof(ReferredUserId))]
        public ApplicationUser? ReferredUser { get; set; }

        public ICollection<AffiliateCommission> Commissions { get; set; } = new List<AffiliateCommission>();
    }
}
