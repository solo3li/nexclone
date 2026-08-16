using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace NexClone.Backend.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>, IDataProtectionKeyContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserPhoneNumber> PhoneNumbers { get; set; } = null!;
        public DbSet<EmailVerification> EmailVerifications { get; set; } = null!;
        public DbSet<Plan> Plans { get; set; } = null!;
        public DbSet<Subscription> Subscriptions { get; set; } = null!;
        public DbSet<Invoice> Invoices { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<ApiConfiguration> ApiConfigurations { get; set; } = null!;
        public DbSet<PaymentGatewayConfig> PaymentGatewayConfigs { get; set; } = null!;
        public DbSet<GenerationHistory> GenerationHistories { get; set; } = null!;
        public DbSet<ManualPaymentMethod> ManualPaymentMethods { get; set; } = null!;
        public DbSet<DeviceFingerprint> DeviceFingerprints { get; set; } = null!;
        public DbSet<ToolConfiguration> ToolConfigurations { get; set; } = null!;
        public DbSet<ToolRoutingRule> ToolRoutingRules { get; set; } = null!;
        public DbSet<EmailTemplate> EmailTemplates { get; set; } = null!;
        public DbSet<AppSetting> AppSettings { get; set; } = null!;
        public DbSet<CustomPage> CustomPages { get; set; } = null!;
        public DbSet<BlogPost> BlogPosts { get; set; } = null!;
        public DbSet<BlogComment> BlogComments { get; set; } = null!;
        public DbSet<SupportTicket> SupportTickets { get; set; } = null!;
        public DbSet<TicketMessage> TicketMessages { get; set; } = null!;
        public DbSet<SystemUpdate> SystemUpdates { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<PlanPaymentGateway> PlanPaymentGateways { get; set; } = null!;
        // Affiliate System
        public DbSet<AffiliateProfile> AffiliateProfiles { get; set; } = null!;
        public DbSet<AffiliateReferral> AffiliateReferrals { get; set; } = null!;
        public DbSet<AffiliateCommission> AffiliateCommissions { get; set; } = null!;
        public DbSet<AffiliatePayout> AffiliatePayouts { get; set; } = null!;

        // DataProtection keys - persisted to DB to survive container restarts
        public DbSet<DataProtectionKey> DataProtectionKeys { get; set; } = null!;

        // TTS Lookups
        public DbSet<Voice> Voices { get; set; } = null!;
        public DbSet<Dialect> Dialects { get; set; } = null!;
        public DbSet<Emotion> Emotions { get; set; } = null!;
        public DbSet<Style> Styles { get; set; } = null!;

        // Dedicated Tool Settings & Model Pricings
        public DbSet<AvatarToVideoSetting> AvatarToVideoSettings { get; set; } = null!;
        public DbSet<AvatarToVideoModelPricing> AvatarToVideoModelPricings { get; set; } = null!;

        public DbSet<TextToVideoSetting> TextToVideoSettings { get; set; } = null!;
        public DbSet<TextToVideoModelPricing> TextToVideoModelPricings { get; set; } = null!;

        public DbSet<ImageToVideoSetting> ImageToVideoSettings { get; set; } = null!;
        public DbSet<ImageToVideoModelPricing> ImageToVideoModelPricings { get; set; } = null!;

        public DbSet<LipSyncSetting> LipSyncSettings { get; set; } = null!;
        public DbSet<LipSyncModelPricing> LipSyncModelPricings { get; set; } = null!;

        public DbSet<TextToImageSetting> TextToImageSettings { get; set; } = null!;
        public DbSet<TextToImageModelPricing> TextToImageModelPricings { get; set; } = null!;

        public DbSet<MotionControlSetting> MotionControlSettings { get; set; } = null!;
        public DbSet<MotionControlModelPricing> MotionControlModelPricings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Mark credit columns as concurrency tokens so EF Core raises DbUpdateConcurrencyException
            // when two simultaneous transactions try to deduct credits from the same user row.
            // The existing retry logic in UsagePolicyService handles the exception and retries.
            builder.Entity<ApplicationUser>(b =>
            {
                b.Property(u => u.StandardCredits).IsConcurrencyToken();
                b.Property(u => u.PremiumCredits).IsConcurrencyToken();
            });

            // Configure One-to-One relationship for ApplicationUser and UserPhoneNumber
            builder.Entity<ApplicationUser>()
                .HasOne(u => u.PhoneNumberDetails)
                .WithOne(p => p.User)
                .HasForeignKey<UserPhoneNumber>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Subscriptions mapping
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

            // Payments mapping
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

            // History mapping
            builder.Entity<GenerationHistory>()
                .HasOne(h => h.User)
                .WithMany()
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // RefreshToken mapping
            builder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // PlanPaymentGateway mapping
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

            // Affiliate System mapping
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
