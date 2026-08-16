using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Core.Entities
{
    public class AvatarToVideoSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; } = 1;

        public bool IsActive { get; set; } = true;
        public long MaxImageFileSizeMb { get; set; } = 15;
        public long MaxAudioFileSizeMb { get; set; } = 15;
        public int MaxPromptLength { get; set; } = 500;
        public int MaxConcurrentOperations { get; set; } = 10;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class AvatarToVideoModelPricing : IModelPricingEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string ModelName { get; set; } = "kling_avatar_image2video";

        [Required]
        [MaxLength(100)]
        public string ProviderName { get; set; } = "Picsart";

        [MaxLength(50)]
        public string BillingType { get; set; } = "PerRequest"; // "PerRequest" or "PerSecond"

        public decimal UnitCost { get; set; } = 10.0m;
        public decimal BaseCost { get; set; } = 0m;

        [MaxLength(50)]
        public string AllowedWallet { get; set; } = "Standard"; // "Standard" or "Premium"

        public bool IsActive { get; set; } = true;
    }
}
