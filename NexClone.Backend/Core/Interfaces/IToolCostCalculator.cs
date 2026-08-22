namespace NexClone.Backend.Core.Interfaces
{
    public class PricingRequest
    {
        public string ToolId { get; set; } = string.Empty;
        public decimal UsageAmountForCost { get; set; }
        public decimal UsageAmountForLimits { get; set; }
        public string ModelName { get; set; } = "default";
        public string Resolution { get; set; } = "default";
    }

    public class PricingResult
    {
        public bool IsAllowed { get; set; } = true;
        public string? ErrorMessage { get; set; }
        public decimal TotalCost { get; set; }
        public bool AllowStandard { get; set; } = true;
        public bool AllowPremium { get; set; }
    }

    public interface IToolCostCalculator
    {
        string[] ToolIds { get; }
        Task<PricingResult> CalculateAsync(PricingRequest request);
    }
}