using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;
using System;
using System.Threading.Tasks;

namespace NexClone.Backend.Application.Services
{
    public class DynamicConcurrencyManager : IDynamicConcurrencyManager
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IMemoryCache _cache;
        
        // Default concurrency if not configured
        private const int DefaultConcurrency = 10;

        public DynamicConcurrencyManager(IServiceProvider serviceProvider, IMemoryCache cache)
        {
            _serviceProvider = serviceProvider;
            _cache = cache;
        }

        public async Task<int> GetConcurrencyLimitAsync(string toolName)
        {
            string cacheKey = $"ConcurrencyLimit_{toolName}";
            
            if (_cache.TryGetValue(cacheKey, out int cachedLimit))
            {
                return cachedLimit;
            }

            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            string settingKey = $"Concurrency_{toolName}";
            
            var setting = await dbContext.AppSettings.FirstOrDefaultAsync(s => s.Key == settingKey);
            
            int limit = DefaultConcurrency;
            if (setting != null && int.TryParse(setting.Value, out int parsedLimit) && parsedLimit > 0)
            {
                limit = parsedLimit;
            }

            // Cache for 1 minute so we don't hit the DB for every single message
            _cache.Set(cacheKey, limit, TimeSpan.FromMinutes(1));
            
            return limit;
        }
    }
}
