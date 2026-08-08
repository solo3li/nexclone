using Hangfire;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Core.Messages;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.ExternalServices
{
    public class QueueEmailService : IEmailService
    {
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly NexClone.Backend.Infrastructure.ExternalServices.BrevoEmailService _fallbackEmailService;

        public QueueEmailService(IBackgroundJobClient backgroundJobClient, NexClone.Backend.Infrastructure.ExternalServices.BrevoEmailService fallbackEmailService)
        {
            _backgroundJobClient = backgroundJobClient;
            _fallbackEmailService = fallbackEmailService;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string toName, string subject, string htmlContent)
        {
            // Enqueue job with Hangfire instead of MassTransit
            _backgroundJobClient.Enqueue<NexClone.Backend.Infrastructure.Consumers.EmailConsumer>(
                x => x.Consume(new SendEmailMessage
                {
                    ToEmail = toEmail,
                    ToName = toName,
                    Subject = subject,
                    HtmlBody = htmlContent
                })
            );

            return await Task.FromResult(true); // Assume success for queueing
        }
    }
}
