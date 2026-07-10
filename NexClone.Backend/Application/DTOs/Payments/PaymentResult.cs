namespace NexClone.Backend.Application.DTOs.Payments
{
    public class PaymentResult
    {
        public bool IsSuccess { get; set; }
        public string? CheckoutUrl { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
