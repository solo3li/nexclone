using System;
using System.Collections.Generic;

namespace NexClone.Backend.Models.Legacy;

public partial class SubscriptionsSubscription
{
    public long Id { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public long PlanId { get; set; }

    public Guid UserId { get; set; }

    public virtual SubscriptionsPlan Plan { get; set; } = null!;

    public virtual ICollection<SubscriptionsPayment> SubscriptionsPayments { get; set; } = new List<SubscriptionsPayment>();
}
