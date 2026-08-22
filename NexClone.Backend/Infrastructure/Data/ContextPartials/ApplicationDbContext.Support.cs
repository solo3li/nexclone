using Microsoft.EntityFrameworkCore;

namespace NexClone.Backend.Infrastructure.Data
{
    public partial class ApplicationDbContext
    {
        public DbSet<SupportTicket> SupportTickets { get; set; } = null!;
        public DbSet<TicketMessage> TicketMessages { get; set; } = null!;
        public DbSet<ManualPaymentMethod> ManualPaymentMethods { get; set; } = null!;

        private void ConfigureSupport(ModelBuilder builder)
        {
        }
    }
}