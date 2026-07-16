using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class WalletType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty; // e.g. "AUDIO", "VIDEO", "GENERAL"

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<UserWallet> UserWallets { get; set; } = new List<UserWallet>();
        public ICollection<PackageWallet> PackageWallets { get; set; } = new List<PackageWallet>();
        public ICollection<PackageToolWallet> PackageToolWallets { get; set; } = new List<PackageToolWallet>();
    }

    public class UserWallet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

        [Required]
        public int WalletTypeId { get; set; }
        [ForeignKey(nameof(WalletTypeId))]
        public WalletType WalletType { get; set; } = null!;

        [Column(TypeName = "decimal(18,4)")]
        [ConcurrencyCheck]
        public decimal Balance { get; set; } = 0;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class PackageWallet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlanId { get; set; }
        [ForeignKey(nameof(PlanId))]
        public Plan Plan { get; set; } = null!;

        [Required]
        public int WalletTypeId { get; set; }
        [ForeignKey(nameof(WalletTypeId))]
        public WalletType WalletType { get; set; } = null!;

        [Column(TypeName = "decimal(18,4)")]
        public decimal CreditsAmount { get; set; } = 0;
    }

    public class PackageToolWallet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlanId { get; set; }
        [ForeignKey(nameof(PlanId))]
        public Plan Plan { get; set; } = null!;

        [Required]
        public Guid ToolConfigurationId { get; set; }
        [ForeignKey(nameof(ToolConfigurationId))]
        public ToolConfiguration ToolConfiguration { get; set; } = null!;

        [Required]
        public int WalletTypeId { get; set; }
        [ForeignKey(nameof(WalletTypeId))]
        public WalletType WalletType { get; set; } = null!;
    }
}
