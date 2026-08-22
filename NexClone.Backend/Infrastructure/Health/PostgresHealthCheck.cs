using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace NexClone.Backend.Infrastructure.Health
{
    public class PostgresHealthCheck : IHealthCheck
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public PostgresHealthCheck(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<Data.ApplicationDbContext>();
                await dbContext.Database.ExecuteSqlRawAsync("SELECT 1", cancellationToken);
                return HealthCheckResult.Healthy("PostgreSQL connected");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy("PostgreSQL unreachable", ex);
            }
        }
    }
}