using System.Threading.Tasks;

namespace NexClone.Backend.Core.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string toName, string subject, string htmlContent);
    }
}
