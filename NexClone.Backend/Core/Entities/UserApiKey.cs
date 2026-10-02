using System;

namespace NexClone.Backend.Core.Entities
{
    public class UserApiKey
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;
        public string KeyHash { get; set; } = string.Empty;
        public string KeyPrefix { get; set; } = string.Empty;
        public string Name { get; set; } = "Default API Key";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUsedAt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
