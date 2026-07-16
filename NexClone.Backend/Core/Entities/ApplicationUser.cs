using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FullName { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public bool IsVerified { get; set; } = false;
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsStaff { get; set; } = false;
        
        // Credits Economy
        public decimal AvailableCredits { get; set; } = 0;

        // Affiliate System
        public Guid? ReferredById { get; set; }
        public bool IsCashAffiliate { get; set; } = false;
        
        [Column(TypeName = "decimal(18,4)")]
        [ConcurrencyCheck]
        public decimal AffiliateCashBalance { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public UserPhoneNumber? PhoneNumberDetails { get; set; }
        public ICollection<EmailVerification> EmailVerifications { get; set; } = new List<EmailVerification>();
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<UserWallet> Wallets { get; set; } = new List<UserWallet>();
    }
}
