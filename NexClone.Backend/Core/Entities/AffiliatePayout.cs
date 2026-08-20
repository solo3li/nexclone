using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    /// <summary>
    /// Affiliate payout (withdrawal) request.
    /// Admin manually approves and marks as PAID.
    /// </summary>
    public class AffiliatePayout
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AffiliateProfileId { get; set; }

        public decimal Amount { get; set; }

        /// <summary>Must match the currency of the available balance being withdrawn.</summary>
        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = string.Empty;

        /// <summary>e.g. "PayPal", "Bank Transfer", "Vodafone Cash"</summary>
        [Required]
        [MaxLength(100)]
        public string PayoutMethod { get; set; } = string.Empty;

        /// <summary>Email, IBAN, wallet number, etc.</summary>
        [Required]
        [MaxLength(300)]
        public string PayoutAccount { get; set; } = string.Empty;

        /// <summary>Optional message from the affiliate</summary>
        [MaxLength(500)]
        public string? AffiliateMessage { get; set; }

        /// <summary>PENDING | APPROVED | PROCESSING | PAID | REJECTED | FAILED</summary>
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "PENDING";

        [MaxLength(500)]
        public string? RejectionReason { get; set; }

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ProcessedAt { get; set; }
        
        [MaxLength(1000)]
        public string? TransferReceiptUrl { get; set; }

        // Navigation
        [ForeignKey(nameof(AffiliateProfileId))]
        public AffiliateProfile AffiliateProfile { get; set; } = null!;
    }

    public static class PayoutStatus
    {
        public const string Pending = "PENDING";
        public const string Approved = "APPROVED";
        public const string Processing = "PROCESSING";
        public const string Paid = "PAID";
        public const string Rejected = "REJECTED";
        public const string Failed = "FAILED";
    }
}
