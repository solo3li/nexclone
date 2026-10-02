using System;
using System.Collections.Generic;

namespace NexClone.Backend.Core.Messages
{
    public class VideoToolMessage
    {
        public Guid HistoryId { get; set; }
        public Guid UserId { get; set; }
        public string ToolType { get; set; } = string.Empty; // text-to-video, image-to-video, etc.
        public string Provider { get; set; } = "CrunAI";
        
        public string Prompt { get; set; } = string.Empty;
        public string Model { get; set; } = "veo"; // veo, grok, seedance
        public string Resolution { get; set; } = "1080p";
        public string Mode { get; set; } = string.Empty; // For grok: fun, normal, spicy
        public int Duration { get; set; } = 0; // Duration in seconds
        public string AspectRatio { get; set; } = "16:9";
        public bool? AudioEnabled { get; set; } // For synchronized audio generation (e.g. Seedance)

        // S3 URLs of uploaded media (avoids DB bloat in Hangfire)
        public List<string> ImageUrls { get; set; } = new();
        public List<string> VideoUrls { get; set; } = new();
        public List<string> AudioUrls { get; set; } = new();

        // Legacy fallback byte arrays for backward compatibility with existing jobs
        public byte[]? Image1Bytes { get; set; }
        public string? Image1ContentType { get; set; }
        
        public byte[]? Image2Bytes { get; set; }
        public string? Image2ContentType { get; set; }
        
        public byte[]? Image3Bytes { get; set; }
        public string? Image3ContentType { get; set; }
    }
}
