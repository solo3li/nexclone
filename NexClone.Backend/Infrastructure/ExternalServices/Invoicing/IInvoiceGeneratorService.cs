using System.Threading.Tasks;
using NexClone.Backend.Core.Entities;

namespace NexClone.Backend.Infrastructure.ExternalServices.Invoicing
{
    public interface IInvoiceGeneratorService
    {
        Task<byte[]> GenerateInvoicePdfAsync(Invoice invoice);
    }
}
