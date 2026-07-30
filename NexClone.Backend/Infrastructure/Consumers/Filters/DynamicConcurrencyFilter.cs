using MassTransit;
using NexClone.Backend.Core.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.Consumers.Filters
{
    public class DynamicConcurrencyFilter<T> : IFilter<ConsumeContext<T>> where T : class
    {
        private readonly IDynamicConcurrencyManager _concurrencyManager;
        private readonly string _toolName;
        
        // Since this class is generic, there will be one static _activeCount per message type T.
        // This is perfect since we map 1 message type = 1 tool = 1 queue.
        private static int _activeCount = 0;

        public DynamicConcurrencyFilter(IDynamicConcurrencyManager concurrencyManager, string toolName)
        {
            _concurrencyManager = concurrencyManager;
            _toolName = toolName;
        }

        public async Task Send(ConsumeContext<T> context, IPipe<ConsumeContext<T>> next)
        {
            while (!context.CancellationToken.IsCancellationRequested)
            {
                int limit = await _concurrencyManager.GetConcurrencyLimitAsync(_toolName);
                
                if (Interlocked.Increment(ref _activeCount) <= limit)
                {
                    try
                    {
                        await next.Send(context);
                        return;
                    }
                    finally
                    {
                        Interlocked.Decrement(ref _activeCount);
                    }
                }
                
                // Concurrency limit reached for this tool. Decrement and wait.
                Interlocked.Decrement(ref _activeCount);
                
                // Delay 1 second before checking again. 
                // This buffers the message asynchronously without blocking thread pool threads.
                await Task.Delay(1000, context.CancellationToken);
            }
        }

        public void Probe(ProbeContext context)
        {
            var scope = context.CreateFilterScope("dynamicConcurrencyFilter");
            scope.Add("toolName", _toolName);
        }
    }
}
