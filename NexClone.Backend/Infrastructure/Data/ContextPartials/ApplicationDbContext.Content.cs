using Microsoft.EntityFrameworkCore;

namespace NexClone.Backend.Infrastructure.Data
{
    public partial class ApplicationDbContext
    {
        public DbSet<BlogPost> BlogPosts { get; set; } = null!;
        public DbSet<BlogComment> BlogComments { get; set; } = null!;
        public DbSet<CustomPage> CustomPages { get; set; } = null!;
        public DbSet<EmailTemplate> EmailTemplates { get; set; } = null!;
        public DbSet<SystemUpdate> SystemUpdates { get; set; } = null!;
        public DbSet<AppSetting> AppSettings { get; set; } = null!;

        private void ConfigureContent(ModelBuilder builder)
        {
        }
    }
}