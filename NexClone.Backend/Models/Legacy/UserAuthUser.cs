using System;
using System.Collections.Generic;

namespace NexClone.Backend.Models.Legacy;

public partial class UserAuthUser
{
    public string Password { get; set; } = null!;

    public DateTime? LastLogin { get; set; }

    public bool IsSuperuser { get; set; }

    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Country { get; set; } = null!;

    public bool IsVerified { get; set; }

    public string? Image { get; set; }

    public bool IsActive { get; set; }

    public bool IsStaff { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<SubscriptionsPayment> SubscriptionsPayments { get; set; } = new List<SubscriptionsPayment>();

    public virtual ICollection<SubscriptionsSubscription> SubscriptionsSubscriptions { get; set; } = new List<SubscriptionsSubscription>();
}
