using Hangfire;
using Microsoft.Extensions.Logging;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Core.Messages;
using System;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.Consumers
{
    [Queue("email_queue")]
    public class EmailConsumer
    {
        private readonly NexClone.Backend.Infrastructure.ExternalServices.BrevoEmailService _emailService;
        private readonly ILogger<EmailConsumer> _logger;

        public EmailConsumer(NexClone.Backend.Infrastructure.ExternalServices.BrevoEmailService emailService, ILogger<EmailConsumer> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        public async Task Consume(SendEmailMessage message)
        {
            _logger.LogInformation($"[Email Task] Sending email to {message.ToEmail}");

            try
            {
                await _emailService.SendEmailAsync(message.ToEmail, message.ToName, message.Subject, message.HtmlBody);
                _logger.LogInformation($"[Email Task] Email sent to {message.ToEmail} successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Email Task] Failed to send email to {message.ToEmail}");
                throw;
            }
        }
    }
}
