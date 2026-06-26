using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace NexClone.Backend.Models
{
    public class ToolConfiguration
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string ToolName { get; set; } = string.Empty; // e.g. "text-to-voice", "bg-remover"

        public bool IsActive { get; set; } = true;
        public bool IsMaintenanceMode { get; set; } = false;

        public ICollection<ToolRoutingRule> RoutingRules { get; set; } = new List<ToolRoutingRule>();

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // JSON field for any extra settings the tool might need
        [Column(TypeName = "jsonb")]
        public string AdditionalSettings { get; set; } = "{}";
    }
}
