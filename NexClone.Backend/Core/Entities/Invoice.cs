using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string InvoiceNumber { get; set; } = string.Empty;

        // Subscription link
        [Required]
        public int SubscriptionId { get; set; }
        [ForeignKey(nameof(SubscriptionId))]
        public Subscription Subscription { get; set; } = null!;

        // User link
        [Required]
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string PaymentGateway { get; set; } = "Manual"; // Paymob, PayPal, etc.

        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "Unknown"; // Card, Wallet, etc.

        [MaxLength(100)]
        public string? TransactionId { get; set; } // Paymob Order ID or PayPal Capture ID

        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = "USD";

        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }

        [MaxLength(1000)]
        public string? MinioPdfUrl { get; set; } // S3/MinIO link to the generated PDF

        [Required]
        [MaxLength(100)]
        public string VerificationToken { get; set; } = Guid.NewGuid().ToString();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
