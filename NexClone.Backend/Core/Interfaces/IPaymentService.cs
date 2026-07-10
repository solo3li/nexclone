using System.Threading.Tasks;

namespace NexClone.Backend.Core.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResult> CreatePaymobIntentAsync(int planId, string userId, string userEmail, string userFirstName, string userLastName, string phoneNumber);
    }
}
