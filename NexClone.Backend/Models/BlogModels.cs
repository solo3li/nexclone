using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Models
{
    public class BlogPost
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;

        public string MediaUrl { get; set; } = string.Empty;
        public string MediaType { get; set; } = string.Empty; // "image", "video", ""

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsPublished { get; set; } = true;

        public ICollection<BlogComment> Comments { get; set; } = new List<BlogComment>();
    }

    public class BlogComment
    {
        [Key]
        public int Id { get; set; }

        public int BlogPostId { get; set; }
        
        [ForeignKey("BlogPostId")]
        public BlogPost BlogPost { get; set; } = null!;

        public Guid? UserId { get; set; }
        
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public bool IsAdminReply { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
