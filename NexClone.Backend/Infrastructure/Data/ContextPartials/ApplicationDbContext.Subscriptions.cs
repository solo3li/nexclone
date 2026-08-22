using Microsoft.EntityFrameworkCore;

namespace NexClone.Backend.Infrastructure.Data
{
    public partial class ApplicationDbContext
    {
        public DbSet<Plan> Plans { get; set; } = null!;
        public DbSet<Subscription> Subscriptions { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<Invoice> Invoices { get; set; } = null!;
        public DbSet<PaymentGatewayConfig> PaymentGatewayConfigs { get; set; } = null!;
        public DbSet<PlanPaymentGateway> PlanPaymentGateways { get; set; } = null!;

        private void ConfigureSubscriptions(ModelBuilder builder)
        {
            builder.Entity<Subscription>()
                .HasOne(s => s.User)
                .WithMany(u => u.Subscriptions)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Subscription>()
                .HasOne(s => s.Plan)
                .WithMany(p => p.Subscriptions)
                .HasForeignKey(s => s.PlanId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Payment>()
                .HasOne(p => p.Plan)
                .WithMany(pl => pl.Payments)
                .HasForeignKey(p => p.PlanId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Payment>()
                .HasOne(p => p.Subscription)
                .WithMany(s => s.Payments)
                .HasForeignKey(p => p.SubscriptionId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<PlanPaymentGateway>()
                .HasOne(ppg => ppg.Plan)
                .WithMany(p => p.PlanPaymentGateways)
                .HasForeignKey(ppg => ppg.PlanId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PlanPaymentGateway>()
                .HasOne(ppg => ppg.GatewayConfig)
                .WithMany(gc => gc.PlanPaymentGateways)
                .HasForeignKey(ppg => ppg.GatewayConfigId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}