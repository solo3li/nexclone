using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NexClone.Backend.Models
{
    public class ToolRoutingRule
    {
        [Key]
        public int Id { get; set; }

        public Guid ToolConfigurationId { get; set; }
        
        [ForeignKey("ToolConfigurationId")]
        public ToolConfiguration ToolConfiguration { get; set; }

        // Priority is no longer used for fallback ordering, but rather it could be kept for ordering in UI
        // We add QualityLevel to map "Standard", "Medium", "High"
        [StringLength(50)]
        public string QualityLevel { get; set; } = "Standard";

        [StringLength(100)]
        public string ProviderName { get; set; }

        [StringLength(100)]
        public string ModelName { get; set; }

        public TimeSpan? ActiveFromTime { get; set; }
        
        public TimeSpan? ActiveToTime { get; set; }

        public int? MaxDailyRequests { get; set; }
        
        public int? MaxRequestsPerMinute { get; set; }
    }
}
