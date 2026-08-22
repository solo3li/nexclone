using Serilog;
using Serilog.Context;

namespace NexClone.Backend.Middleware
{
    public class CorrelationIdMiddleware
    {
        private readonly RequestDelegate _next;

        public CorrelationIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var correlationId = context.Request.Headers["X-Correlation-Id"].FirstOrDefault()
                                ?? Guid.NewGuid().ToString("N")[..12];

            using (LogContext.PushProperty("CorrelationId", correlationId))
            {
                context.Response.Headers["X-Correlation-Id"] = correlationId;
                await _next(context);
            }
        }
    }
}