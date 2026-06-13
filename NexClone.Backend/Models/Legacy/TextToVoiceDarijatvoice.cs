using System;
using System.Collections.Generic;

namespace NexClone.Backend.Models.Legacy;

public partial class TextToVoiceDarijatvoice
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string VoiceName { get; set; } = null!;

    public string Accent { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public bool IsPremium { get; set; }

    public bool IsActive { get; set; }

    public string? DemoAudio { get; set; }

    public int Order { get; set; }

    public string GeminiVoice { get; set; } = null!;
}
