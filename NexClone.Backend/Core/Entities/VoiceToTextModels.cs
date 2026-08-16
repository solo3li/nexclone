using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class VoiceToTextSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; } = 1;

        public bool IsActive { get; set; } = true;
        public long MaxAudioFileSizeMb { get; set; } = 25;
        public int MaxAudioDurationMinutes { get; set; } = 10;
        public int MaxConcurrentOperations { get; set; } = 10;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class VoiceToTextModelPricing : IModelPricingEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ModelName { get; set; } = "gpt-4o-mini-transcribe";

        [Required]
        [MaxLength(100)]
        public string ProviderName { get; set; } = "OpenAI";

        [MaxLength(50)]
        public string BillingType { get; set; } = "PerMinute";

        public decimal CostPerMinute { get; set; } = 1.0m;
        public decimal CostPerSecond { get; set; } = 0.0167m;
        public decimal BaseCost { get; set; } = 0m;

        [MaxLength(50)]
        public string AllowedWallet { get; set; } = "Standard"; // "Standard", "Premium", or "Both"

        public bool IsActive { get; set; } = true;
    }
}
