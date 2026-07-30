using System.Threading.Tasks;

namespace NexClone.Backend.Core.Interfaces
{
    public interface IDynamicConcurrencyManager
    {
        Task<int> GetConcurrencyLimitAsync(string toolName);
    }
}
