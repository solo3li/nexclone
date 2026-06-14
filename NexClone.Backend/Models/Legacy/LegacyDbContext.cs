using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NexClone.Backend.Models.Legacy;

public partial class LegacyDbContext : DbContext
{
    public LegacyDbContext()
    {
    }

    public LegacyDbContext(DbContextOptions<LegacyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<SubscriptionsPayment> SubscriptionsPayments { get; set; }

    public virtual DbSet<SubscriptionsPlan> SubscriptionsPlans { get; set; }

    public virtual DbSet<SubscriptionsSubscription> SubscriptionsSubscriptions { get; set; }

    public virtual DbSet<TextToVoiceDarijatdialect> TextToVoiceDarijatdialects { get; set; }

    public virtual DbSet<TextToVoiceDarijatemotion> TextToVoiceDarijatemotions { get; set; }

    public virtual DbSet<TextToVoiceDarijatstyle> TextToVoiceDarijatstyles { get; set; }

    public virtual DbSet<TextToVoiceDarijatvoice> TextToVoiceDarijatvoices { get; set; }

    public virtual DbSet<ToolsTool> ToolsTools { get; set; }

    public virtual DbSet<UserAuthUser> UserAuthUsers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=thomas.proxy.rlwy.net;Port=26423;Database=railway;Username=postgres;Password=vEaCDNCWiHsROlcZjJUekWOgTtINWhJY");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SubscriptionsPayment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subscriptions_payment_pkey");

            entity.ToTable("subscriptions_payment");

            entity.HasIndex(e => e.PlanId, "subscriptions_payment_plan_id_5477c589");

            entity.HasIndex(e => e.SubscriptionId, "subscriptions_payment_subscription_id_f8df362c");

            entity.HasIndex(e => e.UserId, "subscriptions_payment_user_id_d337a89a");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount)
                .HasPrecision(10, 2)
                .HasColumnName("amount");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.Currency)
                .HasMaxLength(10)
                .HasColumnName("currency");
            entity.Property(e => e.Method)
                .HasMaxLength(20)
                .HasColumnName("method");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.PaymentId)
                .HasMaxLength(255)
                .HasColumnName("payment_id");
            entity.Property(e => e.PlanId).HasColumnName("plan_id");
            entity.Property(e => e.Status)
                .HasMaxLength(10)
                .HasColumnName("status");
            entity.Property(e => e.SubscriptionId).HasColumnName("subscription_id");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Plan).WithMany(p => p.SubscriptionsPayments)
                .HasForeignKey(d => d.PlanId)
                .HasConstraintName("subscriptions_payment_plan_id_5477c589_fk_subscriptions_plan_id");

            entity.HasOne(d => d.Subscription).WithMany(p => p.SubscriptionsPayments)
                .HasForeignKey(d => d.SubscriptionId)
                .HasConstraintName("subscriptions_paymen_subscription_id_f8df362c_fk_subscript");

            entity.HasOne(d => d.User).WithMany(p => p.SubscriptionsPayments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("subscriptions_payment_user_id_d337a89a_fk_user_auth_user_id");
        });

        modelBuilder.Entity<SubscriptionsPlan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subscriptions_plan_pkey");

            entity.ToTable("subscriptions_plan");

            entity.HasIndex(e => e.Name, "subscriptions_plan_name_9815df88_like").HasOperators(new[] { "varchar_pattern_ops" });

            entity.HasIndex(e => e.Name, "subscriptions_plan_name_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DurationDays).HasColumnName("duration_days");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.PriceEgp)
                .HasPrecision(10, 2)
                .HasColumnName("price_egp");
            entity.Property(e => e.PriceUsd)
                .HasPrecision(10, 2)
                .HasColumnName("price_usd");
        });

        modelBuilder.Entity<SubscriptionsSubscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subscriptions_subscription_pkey");

            entity.ToTable("subscriptions_subscription");

            entity.HasIndex(e => e.PlanId, "subscriptions_subscription_plan_id_2c895107");

            entity.HasIndex(e => e.UserId, "subscriptions_subscription_user_id_a353e93d");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.PlanId).HasColumnName("plan_id");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(10)
                .HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Plan).WithMany(p => p.SubscriptionsSubscriptions)
                .HasForeignKey(d => d.PlanId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("subscriptions_subscr_plan_id_2c895107_fk_subscript");

            entity.HasOne(d => d.User).WithMany(p => p.SubscriptionsSubscriptions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("subscriptions_subscr_user_id_a353e93d_fk_user_auth");
        });

        modelBuilder.Entity<TextToVoiceDarijatdialect>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("text_to_voice_darijatdialect_pkey");

            entity.ToTable("text_to_voice_darijatdialect");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.IsPremium).HasColumnName("is_premium");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Order).HasColumnName("order");
            entity.Property(e => e.Value)
                .HasMaxLength(200)
                .HasColumnName("value");
        });

        modelBuilder.Entity<TextToVoiceDarijatemotion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("text_to_voice_darijatemotion_pkey");

            entity.ToTable("text_to_voice_darijatemotion");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.IsPremium).HasColumnName("is_premium");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Order).HasColumnName("order");
            entity.Property(e => e.Value)
                .HasMaxLength(200)
                .HasColumnName("value");
        });

        modelBuilder.Entity<TextToVoiceDarijatstyle>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("text_to_voice_darijatstyle_pkey");

            entity.ToTable("text_to_voice_darijatstyle");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.IsPremium).HasColumnName("is_premium");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .HasColumnName("name");
            entity.Property(e => e.Order).HasColumnName("order");
            entity.Property(e => e.Value)
                .HasMaxLength(300)
                .HasColumnName("value");
        });

        modelBuilder.Entity<TextToVoiceDarijatvoice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("text_to_voice_darijatvoice_pkey");

            entity.ToTable("text_to_voice_darijatvoice");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Accent)
                .HasMaxLength(100)
                .HasColumnName("accent");
            entity.Property(e => e.DemoAudio)
                .HasMaxLength(100)
                .HasColumnName("demo_audio");
            entity.Property(e => e.GeminiVoice)
                .HasMaxLength(100)
                .HasColumnName("gemini_voice");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasColumnName("gender");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.IsPremium).HasColumnName("is_premium");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Order).HasColumnName("order");
            entity.Property(e => e.VoiceName)
                .HasMaxLength(100)
                .HasColumnName("voice_name");
        });

        modelBuilder.Entity<ToolsTool>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tools_tool_pkey");

            entity.ToTable("tools_tool");

            entity.HasIndex(e => e.Name, "tools_tool_name_cd362bb0_like").HasOperators(new[] { "varchar_pattern_ops" });

            entity.HasIndex(e => e.Name, "tools_tool_name_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.CreditCost)
                .HasPrecision(10, 2)
                .HasColumnName("credit_cost");
            entity.Property(e => e.IsActive)
                .HasColumnName("is_active");
        });

        modelBuilder.Entity<UserAuthUser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_auth_user_pkey");

            entity.ToTable("user_auth_user");

            entity.HasIndex(e => e.Email, "user_auth_user_email_b2452b58_like").HasOperators(new[] { "varchar_pattern_ops" });

            entity.HasIndex(e => e.Email, "user_auth_user_email_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("country");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(254)
                .HasColumnName("email");
            entity.Property(e => e.Image)
                .HasMaxLength(500)
                .HasColumnName("image");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.IsStaff).HasColumnName("is_staff");
            entity.Property(e => e.IsSuperuser).HasColumnName("is_superuser");
            entity.Property(e => e.IsVerified).HasColumnName("is_verified");
            entity.Property(e => e.LastLogin).HasColumnName("last_login");
            entity.Property(e => e.Password)
                .HasMaxLength(128)
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
