using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace NexClone.Backend.Infrastructure.Data
{
    public partial class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>, IDataProtectionKeyContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>(b =>
            {
                b.Property(u => u.StandardCredits).IsConcurrencyToken();
                b.Property(u => u.PremiumCredits).IsConcurrencyToken();
            });

            ConfigureIdentity(builder);
            ConfigureSubscriptions(builder);
            ConfigureAiTools(builder);
            ConfigureContent(builder);
            ConfigureAffiliate(builder);
            ConfigureSupport(builder);
        }
    }
}