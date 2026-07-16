using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class AffiliateReferral
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ReferrerId { get; set; }

        [Required]
        public Guid ReferredUserId { get; set; }

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(20)]
        public string Status { get; set; } = "Active"; // Active, Suspended, Rejected

        [MaxLength(200)]
        public string? Reason { get; set; }

        [ForeignKey("ReferrerId")]
        public virtual ApplicationUser Referrer { get; set; } = null!;

        [ForeignKey("ReferredUserId")]
        public virtual ApplicationUser ReferredUser { get; set; } = null!;
    }
}
