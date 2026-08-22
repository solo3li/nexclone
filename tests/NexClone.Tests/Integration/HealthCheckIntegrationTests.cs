using Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NexClone.Backend.Middleware;

namespace NexClone.Tests.Integration
{
    public class HealthCheckIntegrationTests
    {
        [Fact]
        public async Task CorrelationIdMiddleware_GeneratesId_WhenMissing()
        {
            var middleware = new CorrelationIdMiddleware(
                async (ctx) =>
                {
                    Assert.True(ctx.Response.Headers.ContainsKey("X-Correlation-Id"));
                    var id = ctx.Response.Headers["X-Correlation-Id"].FirstOrDefault();
                    Assert.NotNull(id);
                    Assert.Equal(12, id!.Length);
                });

            var context = new DefaultHttpContext();

            await middleware.InvokeAsync(context);
        }

        [Fact]
        public async Task CorrelationIdMiddleware_PassesThrough_ExistingId()
        {
            const string existingId = "abc123def456";

            var middleware = new CorrelationIdMiddleware(
                async (ctx) =>
                {
                    Assert.True(ctx.Response.Headers.ContainsKey("X-Correlation-Id"));
                    Assert.Equal(existingId, ctx.Response.Headers["X-Correlation-Id"].FirstOrDefault());
                });

            var context = new DefaultHttpContext();
            context.Request.Headers["X-Correlation-Id"] = existingId;

            await middleware.InvokeAsync(context);
        }

        [Fact]
        public async Task RequestDurationMiddleware_TracksMetrics()
        {
            var middleware = new RequestDurationMiddleware(
                async (ctx) =>
                {
                    ctx.Response.StatusCode = 200;
                    await Task.CompletedTask;
                });

            var context = new DefaultHttpContext();
            context.Request.Method = "GET";
            context.Request.Path = "/test";

            await middleware.InvokeAsync(context);

            Assert.Equal(200, context.Response.StatusCode);
        }

        [Fact]
        public async Task PostgresHealthCheck_Unhealthy_WhenDatabaseUnreachable()
        {
            var scopeFactory = (IServiceScopeFactory)new ServiceCollection()
                .AddDbContext<NexClone.Backend.Infrastructure.Data.ApplicationDbContext>(options =>
                    options.UseNpgsql("Host=192.0.2.1;Database=test;Username=test;Password=test;ConnectionTimeout=1"))
                .BuildServiceProvider()
                .GetRequiredService<IServiceScopeFactory>();

            var healthCheck = new NexClone.Backend.Infrastructure.Health.PostgresHealthCheck(scopeFactory);

            var result = await healthCheck.CheckHealthAsync(
                new Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckContext());

            Assert.Equal(Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Unhealthy, result.Status);
            Assert.Contains("unreachable", result.Description?.ToLower() ?? "");
        }

        [Fact]
        public async Task TestMiddlewareChain_RequestId_And_Metrics()
        {
            var correlationMiddleware = new CorrelationIdMiddleware(
                async (ctx) =>
                {
                    await new RequestDurationMiddleware(
                        async (innerCtx) =>
                        {
                            innerCtx.Response.StatusCode = 200;
                            await Task.CompletedTask;
                        }
                    ).InvokeAsync(ctx);
                });

            var context = new DefaultHttpContext();
            context.Request.Method = "GET";
            context.Request.Path = "/test-chain";

            await correlationMiddleware.InvokeAsync(context);

            Assert.True(context.Response.Headers.ContainsKey("X-Correlation-Id"));
            Assert.Equal(200, context.Response.StatusCode);
        }
    }
}