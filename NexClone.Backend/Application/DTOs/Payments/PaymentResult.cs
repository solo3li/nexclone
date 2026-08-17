namespace NexClone.Backend.Application.DTOs.Payments
{
    public class PaymentResult
    {
        public bool IsSuccess { get; set; }
        public string? CheckoutUrl { get; set; }
        public string? OrderId { get; set; }
        public string? ClientId { get; set; }
        public string? ErrorMessage { get; set; }
        /// <summary>Provider name: "Paymob", "PayPal", "Manual"</summary>
        public string? Provider { get; set; }
    }
}
