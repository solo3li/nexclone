using System;
using System.ComponentModel.DataAnnotations;

namespace NexClone.Backend.Models
{
    public class CustomPage
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Slug { get; set; } = string.Empty; // e.g., "privacy", "about"

        [Required]
        public string TitleEn { get; set; } = string.Empty;

        [Required]
        public string TitleAr { get; set; } = string.Empty;

        public string ContentEn { get; set; } = string.Empty;
        public string ContentAr { get; set; } = string.Empty;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
