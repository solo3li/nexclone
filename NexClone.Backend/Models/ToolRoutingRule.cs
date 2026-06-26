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

        public int Priority { get; set; }

        [StringLength(100)]
        public string ProviderName { get; set; }

        [StringLength(100)]
        public string ModelName { get; set; }

        public TimeSpan? ActiveFromTime { get; set; }
        
        public TimeSpan? ActiveToTime { get; set; }

        public int? MaxDailyRequests { get; set; }
    }
}
