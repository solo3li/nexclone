using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace NexClone.Backend.Application.BackgroundJobs
{
    public class MediaCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<MediaCleanupService> _logger;

        public MediaCleanupService(IServiceProvider serviceProvider, ILogger<MediaCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Media Cleanup Background Service started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupOldMediaAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing Media Cleanup Service.");
                }

                // Run once a day
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task CleanupOldMediaAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var mediaService = scope.ServiceProvider.GetRequiredService<IMediaService>();

            var expiryDate = DateTime.UtcNow.AddDays(-14);

            _logger.LogInformation($"Searching for processed media older than {expiryDate}...");

            int totalDeleted = 0;
            bool hasMoreRecords = true;
            int batchSize = 100;

            while (hasMoreRecords && !stoppingToken.IsCancellationRequested)
            {
                // Fetch in batches of 100 to prevent Out of Memory (OOM) errors and infinite loops
                var oldRecords = await dbContext.GenerationHistories
                    .Where(h => h.CreatedAt < expiryDate 
                                && h.Status != "expired" 
                                && h.FileUrl != null && h.FileUrl != "")
                    .Take(batchSize)
                    .ToListAsync(stoppingToken);

                if (oldRecords.Count == 0)
                {
                    hasMoreRecords = false;
                    break;
                }

                foreach (var record in oldRecords)
                {
                    try
                    {
                        // 1. Delete physical file from MinIO
                        if (!string.IsNullOrWhiteSpace(record.FileUrl))
                        {
                            await mediaService.DeleteFileAsync(record.FileUrl);
                        }

                        // 2. Also try to delete input files if any URL is found in InputText (some tools store it here)
                        if (!string.IsNullOrWhiteSpace(record.InputText) && 
                            (record.InputText.StartsWith("http://") || record.InputText.StartsWith("https://")))
                        {
                            await mediaService.DeleteFileAsync(record.InputText);
                        }

                        // 3. Update database record
                        record.FileUrl = ""; // Clear URL
                        record.Status = "expired";
                        
                        totalDeleted++;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to clean up media for history ID {record.Id}");
                        // Mark as expired anyway to prevent infinite loop on corrupted files
                        record.Status = "expired"; 
                    }
                }

                // Save changes incrementally after each batch to prevent data loss on crash
                await dbContext.SaveChangesAsync(stoppingToken);
            }

            _logger.LogInformation($"Successfully cleaned up {totalDeleted} media files in total.");
        }
    }
}
