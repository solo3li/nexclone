using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class Voice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [MaxLength(100)]
        public string? VoiceName { get; set; }

        [MaxLength(100)]
        public string? Name { get; set; }

        [MaxLength(10)]
        public string? Gender { get; set; }

        [MaxLength(100)]
        public string? Accent { get; set; }

        [MaxLength(100)]
        public string? DemoAudio { get; set; }

        [MaxLength(100)]
        public string? GeminiVoice { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsPremium { get; set; } = false;
        public int Order { get; set; } = 0;
    }

    public class Dialect
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [MaxLength(100)]
        public string? Name { get; set; }

        [MaxLength(200)]
        public string? Value { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsPremium { get; set; } = false;
        public int Order { get; set; } = 0;
    }

    public class Emotion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [MaxLength(100)]
        public string? Name { get; set; }

        [MaxLength(200)]
        public string? Value { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsPremium { get; set; } = false;
        public int Order { get; set; } = 0;
    }

    public class Style
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [MaxLength(200)]
        public string? Name { get; set; }

        [MaxLength(300)]
        public string? Value { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsPremium { get; set; } = false;
        public int Order { get; set; } = 0;
    }

    public class TextToVoiceSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; } = 1;

        public bool IsActive { get; set; } = true;
        public int MaxTextLength { get; set; } = 5000;
        public int MaxConcurrentOperations { get; set; } = 10;

        // Quota-based Fallback Routing Settings
        public int? FallbackThresholdLimit { get; set; }
        public int? FallbackResetDurationHours { get; set; }
        public int CurrentPrimaryRequestCount { get; set; } = 0;
        public DateTime? LastResetDate { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class TextToVoiceModelPricing : IModelPricingEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string QualityLevel { get; set; } = "Standard"; // "Standard", "Medium", "High"

        [Required]
        [MaxLength(100)]
        public string ModelName { get; set; } = "gemini-2.5-flash-preview-tts";

        [Required]
        [MaxLength(100)]
        public string ProviderName { get; set; } = "Gemini";

        [MaxLength(50)]
        public string BillingType { get; set; } = "PerCharacter";

        public decimal CostPerChar { get; set; } = 0.001m;
        public decimal BaseCost { get; set; } = 0m;

        [MaxLength(50)]
        public string AllowedWallet { get; set; } = "Standard"; // "Standard", "Premium", "Both"

        public bool IsActive { get; set; } = true;
    }
}
