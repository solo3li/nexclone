using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NexClone.Backend.Core.Entities
{
    public class Plan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string NameAr { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(1000)]
        public string? DescriptionAr { get; set; }

        // Manual Features (newline separated)
        public string? Features { get; set; }
        public string? FeaturesAr { get; set; }

        public int DurationDays { get; set; }
        
        public int GracePeriodDays { get; set; } = 3;

        public decimal PriceUsd { get; set; }
        public decimal PriceEgp { get; set; }

        public decimal TaxPercentageUsd { get; set; } = 0;
        public decimal TaxPercentageEgp { get; set; } = 0;
        public decimal FixedFeeUsd { get; set; } = 0;
        public decimal FixedFeeEgp { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Economy
        public decimal MonthlyCredits { get; set; } = 0;
        public decimal StandardCredits { get; set; } = 0;
        public decimal PremiumCredits { get; set; } = 0;

        // AI Tools Access Permissions (8 Tools)
        public bool TextToImageEnabled { get; set; } = true;
        public bool TextToVideoEnabled { get; set; } = true;
        public bool ImageToVideoEnabled { get; set; } = true;
        public bool ReferenceToVideoEnabled { get; set; } = true;
        public bool LipSyncEnabled { get; set; } = true;
        public bool MotionControlEnabled { get; set; } = true;
        public bool SttEnabled { get; set; } = true;
        public bool TtsEnabled { get; set; } = true;
        public bool AvatarVideoEnabled { get; set; } = true;

        // Free Trial Flag
        public bool IsFreeTrial { get; set; } = false;

        // TTS Allowed Voices (Comma separated VoiceNames)
        public string? AllowedVoices { get; set; }

        // Default Registration Plan
        public bool IsDefaultRegistrationPlan { get; set; } = false;

        // Affiliate Commission Settings
        [MaxLength(50)]
        public string AffiliateFirstCommissionType { get; set; } = "Percentage"; // "Percentage" or "Fixed"
        public decimal AffiliateFirstCommissionValueUsd { get; set; } = 0;
        public decimal AffiliateFirstCommissionValueEgp { get; set; } = 0;

        [MaxLength(50)]
        public string AffiliateRecurringCommissionType { get; set; } = "Percentage"; // "Percentage" or "Fixed"
        public decimal AffiliateRecurringCommissionValueUsd { get; set; } = 0;
        public decimal AffiliateRecurringCommissionValueEgp { get; set; } = 0;

        // Soft Delete
        public bool IsDeleted { get; set; } = false;

        // Navigation
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<PlanPaymentGateway> PlanPaymentGateways { get; set; } = new List<PlanPaymentGateway>();
    }
}
