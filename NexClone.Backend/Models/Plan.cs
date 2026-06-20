using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NexClone.Backend.Models
{
    public class Plan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        public int DurationDays { get; set; }

        public decimal PriceUsd { get; set; }
        public decimal PriceEgp { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Economy
        public decimal MonthlyCredits { get; set; } = 0;
        // Text-To-Voice (TTS) Settings
        public bool TtsEnabled { get; set; } = true;
        public int TtsMaxCharsPerRequest { get; set; } = 3000;
        public decimal TtsCostPerChar { get; set; } = 0.001m;

        // Voice-To-Text (STT) Settings
        public bool SttEnabled { get; set; } = true;
        public int SttMaxFileSizeMb { get; set; } = 25;
        public decimal SttCostPer100Kb { get; set; } = 1.0m;

        // Free Trial Flag
        public bool IsFreeTrial { get; set; } = false;

        // Navigation
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
