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
        
        // JSON array of allowed tool identifiers, e.g., ["gpt", "text-to-voice", "voice-to-text", "bg-remover", "img-to-txt"]
        public string AllowedTools { get; set; } = "[]";

        // Navigation
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
