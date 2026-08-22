using NexClone.Backend.Core.Interfaces;

namespace NexClone.Backend.Application.Services.Pricing
{
    public class ToolCostCalculatorFactory
    {
        private readonly IEnumerable<IToolCostCalculator> _calculators;

        public ToolCostCalculatorFactory(IEnumerable<IToolCostCalculator> calculators)
        {
            _calculators = calculators;
        }

        public IToolCostCalculator? GetCalculator(string toolId)
        {
            return _calculators.FirstOrDefault(c =>
                c.ToolIds.Contains(toolId, StringComparer.OrdinalIgnoreCase));
        }
    }
}