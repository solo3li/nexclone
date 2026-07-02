using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NexClone.Backend.Models;
using NexClone.Backend.Services;

namespace NexClone.Backend.Services
{
    public class SubscriptionStatusService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<SubscriptionStatusService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromHours(1);

        public SubscriptionStatusService(IServiceProvider serviceProvider, ILogger<SubscriptionStatusService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SubscriptionStatusService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckSubscriptionsAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing CheckSubscriptionsAsync.");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("SubscriptionStatusService is stopping.");
        }

        private async Task CheckSubscriptionsAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var emailTemplateService = scope.ServiceProvider.GetRequiredService<IEmailTemplateService>();

            var now = DateTime.UtcNow;

            // 1. Find active subscriptions that should enter grace period (freeze)
            var activeToFreeze = await context.Subscriptions
                .Include(s => s.Plan)
                .Include(s => s.User)
                .Where(s => s.Status == "active" && s.EndDate <= now)
                .ToListAsync();

            foreach (var sub in activeToFreeze)
            {
                sub.Status = "freeze";
                
                if (sub.User != null && !string.IsNullOrEmpty(sub.User.Email))
                {
                    var htmlBody = emailTemplateService.GetGracePeriodEmail(
                        sub.User.FullName ?? sub.User.Email,
                        sub.Plan.NameAr ?? sub.Plan.Name,
                        sub.Plan.GracePeriodDays);

                    await emailService.SendEmailAsync(
                        sub.User.Email, 
                        sub.User.FullName ?? "", 
                        "تنبيه: باقتك الآن في فترة السماح - NexMedia AI", 
                        htmlBody);
                }
            }

            // 2. Find frozen subscriptions that should expire
            var freezeToExpire = await context.Subscriptions
                .Include(s => s.Plan)
                .Include(s => s.User)
                .Where(s => s.Status == "freeze")
                .ToListAsync();

            foreach (var sub in freezeToExpire)
            {
                var freezeEndDate = sub.EndDate.AddDays(sub.Plan.GracePeriodDays);
                if (now > freezeEndDate)
                {
                    sub.Status = "expired";
                    if (sub.User != null)
                    {
                        sub.User.AvailableCredits = 0;
                        
                        if (!string.IsNullOrEmpty(sub.User.Email))
                        {
                            var htmlBody = emailTemplateService.GetSubscriptionExpiredEmail(
                                sub.User.FullName ?? sub.User.Email,
                                sub.Plan.NameAr ?? sub.Plan.Name);

                            await emailService.SendEmailAsync(
                                sub.User.Email, 
                                sub.User.FullName ?? "", 
                                "تنبيه: انتهت صلاحية باقتك - NexMedia AI", 
                                htmlBody);
                        }
                    }
                }
            }

            if (activeToFreeze.Any() || freezeToExpire.Any(s => s.Status == "expired"))
            {
                await context.SaveChangesAsync();
                _logger.LogInformation($"Processed {activeToFreeze.Count} freezes and {freezeToExpire.Count(s => s.Status == "expired")} expirations.");
            }
        }
    }
}
