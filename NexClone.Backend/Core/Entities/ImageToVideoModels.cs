using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class ImageToVideoSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; } = 1;

        public bool IsActive { get; set; } = true;
        public long MaxImageFileSizeMb { get; set; } = 25;
        public int MaxDurationSeconds { get; set; } = 30;
        public int MaxPromptLength { get; set; } = 1000;
        public int MaxConcurrentOperations { get; set; } = 10;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ImageToVideoModelPricing : IModelPricingEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ModelName { get; set; } = "grok";

        [Required]
        [MaxLength(100)]
        public string ProviderName { get; set; } = "CrunAI";

        [MaxLength(50)]
        public string BillingType { get; set; } = "PerSecond";

        public decimal BaseCost { get; set; } = 0m;
        public decimal CostPerSecond_480p { get; set; } = 2.4m;
        public decimal CostPerSecond_720p { get; set; } = 4.5m;
        public decimal CostPerSecond_1080p { get; set; } = 8.0m;
        public decimal CostPerSecond_4k { get; set; } = 15.0m;

        public decimal FixedCost_480p { get; set; } = 20.0m;
        public decimal FixedCost_720p { get; set; } = 30.0m;
        public decimal FixedCost_1080p { get; set; } = 37.5m;
        public decimal FixedCost_4k { get; set; } = 90.0m;

        [MaxLength(50)]
        public string AllowedWallet { get; set; } = "Premium";

        public bool IsActive { get; set; } = true;
    }
}
