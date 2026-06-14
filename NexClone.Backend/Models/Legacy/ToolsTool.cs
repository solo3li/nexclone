using System;
using System.Collections.Generic;

namespace NexClone.Backend.Models.Legacy;

public partial class ToolsTool
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public decimal CreditCost { get; set; } = 1.00m;
}
