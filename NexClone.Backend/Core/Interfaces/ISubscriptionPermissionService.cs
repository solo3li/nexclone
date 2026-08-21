using System;
using System.Collections.Generic;

namespace NexClone.Backend.Core.Interfaces
{
    public class PlanPermissions
    {
        public bool HasActiveSubscription { get; set; }
        public bool IsFrozenDueToFreePlanOnly { get; set; }
        
        public List<string> AllowedVoices { get; set; } = new List<string>();

        public bool TextToImageEnabled { get; set; }
        public bool TextToVideoEnabled { get; set; }
        public bool ImageToVideoEnabled { get; set; }
        public bool ReferenceToVideoEnabled { get; set; }
        public bool LipSyncEnabled { get; set; }
        public bool MotionControlEnabled { get; set; }
        public bool SttEnabled { get; set; }
        public bool TtsEnabled { get; set; }
        public bool AvatarVideoEnabled { get; set; }
    }

    public interface ISubscriptionPermissionService
    {
        System.Threading.Tasks.Task<PlanPermissions> GetEffectivePermissionsAsync(Guid userId);
    }
}
