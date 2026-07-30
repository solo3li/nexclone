using MassTransit;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Core.Messages;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.ExternalServices
{
    public class QueueEmailService : IEmailService
    {
        private readonly IPublishEndpoint _publishEndpoint;

        public QueueEmailService(IPublishEndpoint publishEndpoint)
        {
            _publishEndpoint = publishEndpoint;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string toName, string subject, string htmlContent)
        {
            // Publish to RabbitMQ instead of sending synchronously
            await _publishEndpoint.Publish(new SendEmailMessage
            {
                ToEmail = toEmail,
                ToName = toName,
                Subject = subject,
                HtmlBody = htmlContent
            });

            return true; // Assume success for queueing
        }
    }
}
