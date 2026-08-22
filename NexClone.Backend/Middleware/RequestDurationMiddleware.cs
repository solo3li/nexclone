using Prometheus;
using System.Diagnostics;

namespace NexClone.Backend.Middleware
{
    public class RequestDurationMiddleware
    {
        private readonly RequestDelegate _next;

        private static readonly Histogram RequestDuration = Metrics
            .CreateHistogram("http_request_duration_seconds",
                "HTTP request duration in seconds",
                new HistogramConfiguration
                {
                    Buckets = Histogram.ExponentialBuckets(0.01, 2, 12),
                    LabelNames = new[] { "method", "endpoint", "status_code" }
                });

        private static readonly Counter RequestTotal = Metrics
            .CreateCounter("http_requests_total",
                "Total HTTP requests",
                new CounterConfiguration
                {
                    LabelNames = new[] { "method", "endpoint", "status_code" }
                });

        private static readonly Gauge RequestsInFlight = Metrics
            .CreateGauge("http_requests_in_flight",
                "Number of HTTP requests currently being processed");

        public RequestDurationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var sw = Stopwatch.StartNew();
            RequestsInFlight.Inc();

            try
            {
                await _next(context);
            }
            finally
            {
                RequestsInFlight.Dec();
                sw.Stop();

                var endpoint = context.GetEndpoint()?.DisplayName
                    ?? context.Request.Path.Value
                    ?? "/unknown";

                var statusCode = context.Response.StatusCode.ToString();
                var method = context.Request.Method;

                RequestDuration
                    .WithLabels(method, endpoint, statusCode)
                    .Observe(sw.Elapsed.TotalSeconds);

                RequestTotal
                    .WithLabels(method, endpoint, statusCode)
                    .Inc();
            }
        }
    }
}