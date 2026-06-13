using System;
using System.Collections.Generic;

namespace NexClone.Backend.Models.Legacy;

public partial class SubscriptionsPlan
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public int DurationDays { get; set; }

    public decimal PriceUsd { get; set; }

    public decimal PriceEgp { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<SubscriptionsPayment> SubscriptionsPayments { get; set; } = new List<SubscriptionsPayment>();

    public virtual ICollection<SubscriptionsSubscription> SubscriptionsSubscriptions { get; set; } = new List<SubscriptionsSubscription>();
}
