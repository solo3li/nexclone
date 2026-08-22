namespace NexClone.Backend.Core.Entities
{
    public enum SubscriptionStatus
    {
        Active,
        Freeze,
        Expired,
        Canceled
    }

    public static class SubscriptionStatusHelper
    {
        public static SubscriptionStatus FromString(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return SubscriptionStatus.Active;
            var lower = value.ToLowerInvariant().Trim();
            return lower switch
            {
                "active" => SubscriptionStatus.Active,
                "freeze" => SubscriptionStatus.Freeze,
                "expired" => SubscriptionStatus.Expired,
                "canceled" => SubscriptionStatus.Canceled,
                _ => SubscriptionStatus.Active
            };
        }

        public static string ToDbString(this SubscriptionStatus status)
        {
            return status.ToString().ToLowerInvariant();
        }

        public static bool IsUsable(this SubscriptionStatus status)
        {
            return status == SubscriptionStatus.Active || status == SubscriptionStatus.Freeze;
        }

        public static bool IsEnded(this SubscriptionStatus status)
        {
            return status == SubscriptionStatus.Expired || status == SubscriptionStatus.Canceled;
        }
    }
}