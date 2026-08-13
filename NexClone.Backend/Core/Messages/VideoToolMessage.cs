using System;

namespace NexClone.Backend.Core.Messages
{
    public class VideoToolMessage
    {
        public Guid HistoryId { get; set; }
        public Guid UserId { get; set; }
        public string ToolType { get; set; } = string.Empty; // text-to-video, image-to-video, etc.
        public string Provider { get; set; } = "CrunAI";
        
        public string Prompt { get; set; } = string.Empty;
        public string Model { get; set; } = "veo"; // veo, grok
        public string Resolution { get; set; } = "1080p";
        public string Mode { get; set; } = string.Empty; // For grok: fun, normal, spicy
        public int Duration { get; set; } = 0; // For grok duration
        public string AspectRatio { get; set; } = "16:9";

        public byte[]? Image1Bytes { get; set; }
        public string? Image1ContentType { get; set; }
        
        public byte[]? Image2Bytes { get; set; }
        public string? Image2ContentType { get; set; }
        
        public byte[]? Image3Bytes { get; set; }
        public string? Image3ContentType { get; set; }
    }
}
