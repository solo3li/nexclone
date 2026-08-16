using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class LipSyncSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; } = 1;

        public bool IsActive { get; set; } = true;
        public long MaxVideoFileSizeMb { get; set; } = 100;
        public long MaxAudioFileSizeMb { get; set; } = 25;
        public int MaxAudioDurationSeconds { get; set; } = 120;
        public int MaxConcurrentOperations { get; set; } = 10;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class LipSyncModelPricing : IModelPricingEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ModelName { get; set; } = "vidu_advanced_lip_sync";

        [Required]
        [MaxLength(100)]
        public string ProviderName { get; set; } = "CrunAI";

        [MaxLength(50)]
        public string BillingType { get; set; } = "PerSecond";

        public decimal CostPerSecond { get; set; } = 0.5m;
        public decimal BaseCost { get; set; } = 0m;

        [MaxLength(50)]
        public string AllowedWallet { get; set; } = "Standard"; // "Standard" or "Premium"

        public bool IsActive { get; set; } = true;
    }
}
