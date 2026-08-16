using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class TextToImageSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; } = 1;

        public bool IsActive { get; set; } = true;
        public int MaxPromptLength { get; set; } = 5000;
        public int MaxConcurrentOperations { get; set; } = 10;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class TextToImageModelPricing : IModelPricingEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ModelName { get; set; } = "grok-imagine";

        [Required]
        [MaxLength(100)]
        public string ProviderName { get; set; } = "CrunAI";

        [MaxLength(50)]
        public string BillingType { get; set; } = "PerRequest";

        public decimal CostPerImage { get; set; } = 4.0m;
        public decimal BaseCost { get; set; } = 0m;

        [MaxLength(50)]
        public string AllowedWallet { get; set; } = "Standard"; // "Standard" or "Premium" or "Both"

        public bool IsActive { get; set; } = true;
    }
}
