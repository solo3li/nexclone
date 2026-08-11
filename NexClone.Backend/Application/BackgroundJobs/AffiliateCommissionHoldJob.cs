using Hangfire;
using Microsoft.Extensions.Logging;
using NexClone.Backend.Application.Services;
using System.Threading.Tasks;

namespace NexClone.Backend.Application.BackgroundJobs
{
    /// <summary>
    /// Hangfire recurring job — runs daily.
    /// Moves affiliate commissions from PENDING → AVAILABLE after the global Hold Period.
    /// </summary>
    [Queue("default")]
    public class AffiliateCommissionHoldJob
    {
        private readonly AffiliateService _affiliateService;
        private readonly ILogger<AffiliateCommissionHoldJob> _logger;

        public AffiliateCommissionHoldJob(AffiliateService affiliateService, ILogger<AffiliateCommissionHoldJob> logger)
        {
            _affiliateService = affiliateService;
            _logger = logger;
        }

        public async Task ProcessAsync()
        {
            _logger.LogInformation("[AffiliateCommissionHoldJob] Running daily hold period check...");
            await _affiliateService.ProcessPendingCommissionsAsync();
            _logger.LogInformation("[AffiliateCommissionHoldJob] Completed.");
        }
    }
}
