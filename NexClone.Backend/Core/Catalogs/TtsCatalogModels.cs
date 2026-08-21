using System.Collections.Generic;

namespace NexClone.Backend.Core.Catalogs
{
    public class VoiceCatalogItem
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string VoiceName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Accent { get; set; } = string.Empty;
        public string? DemoAudio { get; set; }
        public string GeminiVoice { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool IsPremium { get; set; } = false;
        public int Order { get; set; } = 0;
    }

    public class OptionCatalogItem
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool IsPremium { get; set; } = false;
        public int Order { get; set; } = 0;
    }
}
