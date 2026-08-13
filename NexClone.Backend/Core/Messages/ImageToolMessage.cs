using System;

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
    }
}
