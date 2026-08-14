using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class AffiliateProfile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        /// <summary>Display ID shown to user e.g. "AF-00124"</summary>
        [Required]
        [MaxLength(20)]
        public string AffiliateDisplayId { get; set; } = string.Empty;

        /// <summary>Unique referral code e.g. "SOLO123"</summary>
        [Required]
        [MaxLength(50)]
        public string ReferralCode { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        /// <summary>Total number of link clicks tracked</summary>
        public int TotalClicks { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Onboarding Fields
        [MaxLength(20)]
        public string? MobileNumber { get; set; }

        [MaxLength(100)]
        public string? TelegramUsername { get; set; }

        [MaxLength(20)]
        public string? WhatsappNumber { get; set; }

        [MaxLength(200)]
        public string? FacebookAccount { get; set; }

        public DateTime? PolicyAcceptedAt { get; set; }
        // Navigation
        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

        public ICollection<AffiliateReferral> Referrals { get; set; } = new List<AffiliateReferral>();
        public ICollection<AffiliateCommission> Commissions { get; set; } = new List<AffiliateCommission>();
        public ICollection<AffiliatePayout> Payouts { get; set; } = new List<AffiliatePayout>();
    }
}
