using System;
using System.Collections.Generic;

namespace NexClone.Backend.Models.Legacy;

public partial class TextToVoiceDarijatdialect
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string Value { get; set; } = null!;

    public bool IsPremium { get; set; }

    public bool IsActive { get; set; }

    public int Order { get; set; }
}
