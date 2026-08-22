using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace NexClone.Backend.Infrastructure.Data
{
    public partial class ApplicationDbContext
    {
        public DbSet<UserPhoneNumber> PhoneNumbers { get; set; } = null!;
        public DbSet<EmailVerification> EmailVerifications { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<DeviceFingerprint> DeviceFingerprints { get; set; } = null!;
        public DbSet<DataProtectionKey> DataProtectionKeys { get; set; } = null!;

        private void ConfigureIdentity(ModelBuilder builder)
        {
            builder.Entity<ApplicationUser>()
                .HasOne(u => u.PhoneNumberDetails)
                .WithOne(p => p.User)
                .HasForeignKey<UserPhoneNumber>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}