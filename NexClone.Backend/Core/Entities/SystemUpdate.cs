using System;
using System.ComponentModel.DataAnnotations;

namespace NexClone.Backend.Core.Entities
{
    public class SystemUpdate
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Arabic Title is required")]
        [StringLength(255)]
        public string TitleAr { get; set; } = string.Empty;

        [Required(ErrorMessage = "Arabic Description is required")]
        public string DescriptionAr { get; set; } = string.Empty;

        [Required(ErrorMessage = "English Title is required")]
        [StringLength(255)]
        public string TitleEn { get; set; } = string.Empty;

        [Required(ErrorMessage = "English Description is required")]
        public string DescriptionEn { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
