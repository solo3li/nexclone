using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Models
{
    public class SupportTicket
    {
        [Key]
        public int Id { get; set; }

        public Guid UserId { get; set; }
        
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;

        // "Open", "InProgress", "Closed"
        public string Status { get; set; } = "Open";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TicketMessage> Messages { get; set; } = new List<TicketMessage>();
    }

    public class TicketMessage
    {
        [Key]
        public int Id { get; set; }

        public int TicketId { get; set; }

        [ForeignKey("TicketId")]
        public SupportTicket Ticket { get; set; } = null!;

        // Null if it's from Admin
        public Guid? SenderId { get; set; }

        [ForeignKey("SenderId")]
        public ApplicationUser? Sender { get; set; }

        public string Content { get; set; } = string.Empty;

        public string AttachmentUrl { get; set; } = string.Empty;
        public string AttachmentType { get; set; } = string.Empty; // "image", "audio", ""

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsAdminMessage { get; set; } = false;
    }
}
