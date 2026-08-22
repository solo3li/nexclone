using Microsoft.EntityFrameworkCore;

namespace NexClone.Backend.Infrastructure.Data
{
    public partial class ApplicationDbContext
    {
        public DbSet<ApiConfiguration> ApiConfigurations { get; set; } = null!;
        public DbSet<ToolConfiguration> ToolConfigurations { get; set; } = null!;
        public DbSet<ToolRoutingRule> ToolRoutingRules { get; set; } = null!;
        public DbSet<GenerationHistory> GenerationHistories { get; set; } = null!;

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
        public DbSet<VoiceToTextSetting> VoiceToTextSettings { get; set; } = null!;
        public DbSet<VoiceToTextModelPricing> VoiceToTextModelPricings { get; set; } = null!;
        public DbSet<TextToVoiceSetting> TextToVoiceSettings { get; set; } = null!;
        public DbSet<TextToVoiceModelPricing> TextToVoiceModelPricings { get; set; } = null!;

        private void ConfigureAiTools(ModelBuilder builder)
        {
            builder.Entity<GenerationHistory>()
                .HasOne(h => h.User)
                .WithMany()
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}