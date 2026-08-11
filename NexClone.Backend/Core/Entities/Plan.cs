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
        // Text-To-Voice (TTS) Settings
        public bool TtsEnabled { get; set; } = true;
        public int TtsMaxCharsPerRequest { get; set; } = 3000;
        public int TtsCharactersBlock { get; set; } = 1;
        public decimal TtsCostPerChar { get; set; } = 0.001m;
        public decimal TtsCostPerCharHigh { get; set; } = 0.01m;
        public bool TtsCustomInstructionsEnabled { get; set; } = false;

        // Voice-To-Text (STT) Settings
        public bool SttEnabled { get; set; } = true;
        public int SttMaxFileSizeMb { get; set; } = 25;
        public decimal SttCostPerMinute { get; set; } = 1.0m;

        // Avatar Image-to-Video Settings
        public bool AvatarVideoEnabled { get; set; } = true;
        public decimal AvatarVideoCostPerGeneration { get; set; } = 1.0m;
        public decimal AvatarVideoProCost { get; set; } = 2.0m;
        public int AvatarVideoMaxFileSizeMb { get; set; } = 15;
        public int AvatarVideoMaxAudioFileSizeMb { get; set; } = 15;
        public int AvatarVideoMaxCharsPerRequest { get; set; } = 500;

        // Advanced Lip-Sync Settings
        public bool LipSyncEnabled { get; set; } = true;
        public decimal LipSyncCostPerGeneration { get; set; } = 1.0m;
        public int LipSyncMaxVideoFileSizeMb { get; set; } = 50;
        public int LipSyncMaxAudioFileSizeMb { get; set; } = 15;
        public int LipSyncMaxDurationSeconds { get; set; } = 60;
        public decimal LipSyncCostPerSecond { get; set; } = 0.2m;

        // Motion Control Settings
        public bool MotionControlEnabled { get; set; } = true;
        public decimal MotionControlCostPerGeneration { get; set; } = 1.0m;
        public decimal MotionControlProCost { get; set; } = 2.0m;
        public int MotionControlMaxVideoFileSizeMb { get; set; } = 50;
        public int MotionControlMaxImageFileSizeMb { get; set; } = 15;

        // Free Trial Flag
        public bool IsFreeTrial { get; set; } = false;

        // TTS Allowed Voices (Comma separated VoiceNames)
        public string? AllowedVoices { get; set; }

        // Default Registration Plan
        public bool IsDefaultRegistrationPlan { get; set; } = false;

        // Soft Delete
        public bool IsDeleted { get; set; } = false;

        // Navigation
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<PlanPaymentGateway> PlanPaymentGateways { get; set; } = new List<PlanPaymentGateway>();
    }
}
