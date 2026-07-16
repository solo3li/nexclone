using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class AffiliateTransaction
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid AffiliateId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,4)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = "Commission"; // Commission, Payout, ConversionToCredits

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(255)]
        public string Notes { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Status { get; set; } = "Completed"; // Completed, Pending, Rejected (For Payouts)

        [ForeignKey("AffiliateId")]
        public virtual ApplicationUser Affiliate { get; set; } = null!;
    }
}
