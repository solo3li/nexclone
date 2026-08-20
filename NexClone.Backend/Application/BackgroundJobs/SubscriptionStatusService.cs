using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace NexClone.Backend.Application.BackgroundJobs
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
                    await CheckSubscriptionsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing CheckSubscriptionsAsync.");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("SubscriptionStatusService is stopping.");
        }

        private async Task CheckSubscriptionsAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<Infrastructure.Data.ApplicationDbContext>();
            var emailTemplateService = scope.ServiceProvider.GetRequiredService<Core.Interfaces.IEmailTemplateService>();
            var walletService = scope.ServiceProvider.GetRequiredService<Services.WalletService>();

            var now = DateTime.UtcNow;

            // 1. Find active subscriptions that should enter grace period (freeze)
            var activeToFreeze = await context.Subscriptions
                .Include(s => s.Plan)
                .Include(s => s.User)
                .Where(s => s.Status == "active" && s.EndDate <= now)
                .ToListAsync(stoppingToken);

            foreach (var sub in activeToFreeze)
            {
                sub.Status = "freeze";
                
                if (sub.User != null && !string.IsNullOrEmpty(sub.User.Email))
                {
                    var htmlBody = emailTemplateService.GetGracePeriodEmail(
                        sub.User.FullName ?? sub.User.Email,
                        sub.Plan.NameAr ?? sub.Plan.Name,
                        sub.Plan.GracePeriodDays);

                    Hangfire.BackgroundJob.Enqueue<Infrastructure.Consumers.EmailConsumer>(c => 
                        c.Consume(new Core.Messages.SendEmailMessage { 
                            ToEmail = sub.User.Email, 
                            ToName = sub.User.FullName ?? "", 
                            Subject = "تنبيه: باقتك الآن في فترة السماح - NexMedia AI", 
                            HtmlBody = htmlBody 
                        }));
                }
            }

            // 2. Find frozen subscriptions that should expire
            // Push date logic to EF Core (Npgsql supports this) to prevent pulling all frozen users into memory
            var freezeToExpire = await context.Subscriptions
                .Include(s => s.Plan)
                .Include(s => s.User)
                .Where(s => s.Status == "freeze" && s.EndDate.AddDays(s.Plan.GracePeriodDays) < now)
                .ToListAsync(stoppingToken);

            foreach (var sub in freezeToExpire)
            {
                sub.Status = "expired";
                if (sub.User != null)
                {
                    // Check if the user has a valid active subscription before resetting credits
                    bool hasActiveSub = await context.Subscriptions.AnyAsync(s => s.UserId == sub.UserId && s.Id != sub.Id && s.Status == "active" && s.EndDate > now, stoppingToken);
                    if (!hasActiveSub)
                    {
                        await walletService.ResetAllWalletsAsync(sub.User.Id);
                    }
                    
                    if (!string.IsNullOrEmpty(sub.User.Email))
                    {
                        var htmlBody = emailTemplateService.GetSubscriptionExpiredEmail(
                            sub.User.FullName ?? sub.User.Email,
                            sub.Plan.NameAr ?? sub.Plan.Name);

                        Hangfire.BackgroundJob.Enqueue<Infrastructure.Consumers.EmailConsumer>(c => 
                            c.Consume(new Core.Messages.SendEmailMessage { 
                                ToEmail = sub.User.Email, 
                                ToName = sub.User.FullName ?? "", 
                                Subject = "تنبيه: انتهت صلاحية باقتك - NexMedia AI", 
                                HtmlBody = htmlBody 
                            }));
                    }
                }
            }

            if (activeToFreeze.Any() || freezeToExpire.Any())
            {
                await context.SaveChangesAsync(stoppingToken);
                _logger.LogInformation($"Processed {activeToFreeze.Count} freezes and {freezeToExpire.Count} expirations.");
            }
        }
    }
}
