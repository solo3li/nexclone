using System.Threading.Tasks;

namespace NexClone.Backend.Core.Interfaces
{
    public interface IPaymentService
    {
        /// <summary>
        /// Generic entry point for initiating a payment via any gateway.
        /// The implementation resolves the correct gateway based on the gatewayConfigId and currency.
        /// </summary>
        Task<PaymentResult> InitiatePaymentAsync(
            int planId,
            int gatewayConfigId,
            string userId,
            string userEmail,
            string userName,
            string phoneNumber,
            string currency,
            string method = null);
    }
}
