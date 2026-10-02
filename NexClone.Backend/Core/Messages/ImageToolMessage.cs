using System;
using System.Collections.Generic;

namespace NexClone.Backend.Core.Messages
{
    public class ImageToolMessage
    {
        public Guid HistoryId { get; set; }
        public Guid UserId { get; set; }
        public string Provider { get; set; } = "CrunAI";
        
        public string Prompt { get; set; } = string.Empty;
        public string Model { get; set; } = "grok";
        public string AspectRatio { get; set; } = "16:9";
        public string Mode { get; set; } = "standard"; // standard or quality
        public List<string> ImageUrls { get; set; } = new(); // For grok-imagine/i2i (1-5 reference images)
    }
}
