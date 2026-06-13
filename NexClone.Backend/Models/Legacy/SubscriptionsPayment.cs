using System;
using System.Collections.Generic;

namespace NexClone.Backend.Models.Legacy;

public partial class SubscriptionsPayment
{
    public long Id { get; set; }

    public string PaymentId { get; set; } = null!;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = null!;

    public string Method { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public long? PlanId { get; set; }

    public long? SubscriptionId { get; set; }

    public Guid UserId { get; set; }

    public string? Notes { get; set; }

    public virtual SubscriptionsPlan? Plan { get; set; }

    public virtual SubscriptionsSubscription? Subscription { get; set; }

    public virtual UserAuthUser User { get; set; } = null!;
}
