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

        // Limits
        public int MaxTtsCharacters { get; set; } = 0;
        public int MaxSttMinutes { get; set; } = 0;
        public int MaxImagesGenerated { get; set; } = 0;

        // Navigation
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
