using MassTransit;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Core.Messages;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.ExternalServices
{
    public class QueueEmailService : IEmailService
    {
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly NexClone.Backend.Infrastructure.ExternalServices.BrevoEmailService _fallbackEmailService;

        public QueueEmailService(IPublishEndpoint publishEndpoint, NexClone.Backend.Infrastructure.ExternalServices.BrevoEmailService fallbackEmailService)
        {
            _publishEndpoint = publishEndpoint;
            _fallbackEmailService = fallbackEmailService;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string toName, string subject, string htmlContent)
        {
            // Publish to RabbitMQ (fire and forget so it doesn't hang the API if RabbitMQ is down)
            _ = Task.Run(async () => 
            {
                try 
                {
                    await _publishEndpoint.Publish(new SendEmailMessage
                    {
                        ToEmail = toEmail,
                        ToName = toName,
                        Subject = subject,
                        HtmlBody = htmlContent
                    });
                } 
                catch 
                {
                    // Fallback to synchronous email sending if RabbitMQ is unreachable
                    try
                    {
                        await _fallbackEmailService.SendEmailAsync(toEmail, toName, subject, htmlContent);
                    }
                    catch
                    {
                        // Ignore
                    }
                }
            });

            return true; // Assume success for queueing
        }
    }
}
