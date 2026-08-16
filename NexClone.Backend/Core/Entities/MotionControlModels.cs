using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class MotionControlSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; } = 1;

        public bool IsActive { get; set; } = true;
        public long MaxVideoFileSizeMb { get; set; } = 100;
        public long MaxImageFileSizeMb { get; set; } = 25;
        public int MaxDurationSeconds { get; set; } = 30;
        public int MaxConcurrentOperations { get; set; } = 10;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class MotionControlModelPricing : IModelPricingEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ModelName { get; set; } = "kling-motion-control";

        [Required]
        [MaxLength(100)]
        public string ProviderName { get; set; } = "KlingAI";

        [MaxLength(50)]
        public string BillingType { get; set; } = "FlatRate";

        public decimal CostPerGeneration { get; set; } = 20.0m;
        public decimal CostPerSecond { get; set; } = 2.0m;
        public decimal BaseCost { get; set; } = 0m;

        [MaxLength(50)]
        public string AllowedWallet { get; set; } = "Standard"; // "Standard", "Premium", "Both"

        public bool IsActive { get; set; } = true;
    }
}
