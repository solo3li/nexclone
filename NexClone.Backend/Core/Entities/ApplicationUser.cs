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
        public DateTime? LastVerificationEmailSentAt { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsStaff { get; set; } = false;
        public bool IsSuperAdmin { get; set; } = false;
        
        // Admin Sidebar Sections Visibility (Comma-separated string)
        public string? VisibleAdminSections { get; set; }
        
        // Credits Economy (StandardCredits + PremiumCredits are the real balances)
        public decimal StandardCredits { get; set; } = 0;
        public decimal PremiumCredits { get; set; } = 0;

        // Affiliate System (Removed)


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public UserPhoneNumber? PhoneNumberDetails { get; set; }
        public ICollection<EmailVerification> EmailVerifications { get; set; } = new List<EmailVerification>();
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
