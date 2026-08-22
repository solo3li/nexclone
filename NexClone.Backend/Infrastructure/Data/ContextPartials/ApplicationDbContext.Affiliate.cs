using Microsoft.EntityFrameworkCore;

namespace NexClone.Backend.Infrastructure.Data
{
    public partial class ApplicationDbContext
    {
        public DbSet<AffiliateProfile> AffiliateProfiles { get; set; } = null!;
        public DbSet<AffiliateReferral> AffiliateReferrals { get; set; } = null!;
        public DbSet<AffiliateCommission> AffiliateCommissions { get; set; } = null!;
        public DbSet<AffiliatePayout> AffiliatePayouts { get; set; } = null!;

        private void ConfigureAffiliate(ModelBuilder builder)
        {
            builder.Entity<AffiliateProfile>()
                .HasOne(ap => ap.User)
                .WithMany()
                .HasForeignKey(ap => ap.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<AffiliateProfile>()
                .HasIndex(ap => ap.ReferralCode)
                .IsUnique();

            builder.Entity<AffiliateReferral>()
                .HasOne(ar => ar.AffiliateProfile)
                .WithMany(ap => ap.Referrals)
                .HasForeignKey(ar => ar.AffiliateProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<AffiliateReferral>()
                .HasOne(ar => ar.ReferredUser)
                .WithMany()
                .HasForeignKey(ar => ar.ReferredUserId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<AffiliateCommission>()
                .HasOne(ac => ac.AffiliateProfile)
                .WithMany(ap => ap.Commissions)
                .HasForeignKey(ac => ac.AffiliateProfileId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<AffiliateCommission>()
                .HasOne(ac => ac.AffiliateReferral)
                .WithMany(ar => ar.Commissions)
                .HasForeignKey(ac => ac.AffiliateReferralId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<AffiliateCommission>()
                .HasOne(ac => ac.Customer)
                .WithMany()
                .HasForeignKey(ac => ac.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<AffiliateCommission>()
                .HasOne(ac => ac.Plan)
                .WithMany()
                .HasForeignKey(ac => ac.PlanId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<AffiliateCommission>()
                .HasOne(ac => ac.Subscription)
                .WithMany()
                .HasForeignKey(ac => ac.SubscriptionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<AffiliateCommission>()
                .HasOne(ac => ac.Payment)
                .WithMany()
                .HasForeignKey(ac => ac.PaymentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<AffiliatePayout>()
                .HasOne(ap => ap.AffiliateProfile)
                .WithMany(p => p.Payouts)
                .HasForeignKey(ap => ap.AffiliateProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}