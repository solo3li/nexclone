using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend.Application.Services
{
    public class SubscriptionPermissionService : ISubscriptionPermissionService
    {
        private readonly ApplicationDbContext _context;

        public SubscriptionPermissionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PlanPermissions> GetEffectivePermissionsAsync(Guid userId)
        {
            var activeSubscriptions = await _context.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.UserId == userId && (s.Status.ToLower() == "active" || s.Status.ToLower() == "freeze") && s.EndDate > DateTime.UtcNow)
                .ToListAsync();

            var permissions = new PlanPermissions();

            if (!activeSubscriptions.Any())
            {
                permissions.HasActiveSubscription = false;
                permissions.IsFrozenDueToFreePlanOnly = false;
                return permissions;
            }

            permissions.HasActiveSubscription = true;

            // Free/Trial restriction: The account should only be considered Free/Trial-only when ALL active subscriptions are Free/Trial.
            // If at least one valid paid subscription is active, it must not be treated as Free/Trial-only.
            permissions.IsFrozenDueToFreePlanOnly = activeSubscriptions.All(s => 
                s.Plan.IsFreeTrial || s.Plan.PriceUsd == 0 || s.Plan.Name.ToLower().Contains("free"));

            // AllowedVoices: UNION DISTINCT across all active subscriptions
            permissions.AllowedVoices = activeSubscriptions
                .Where(s => !string.IsNullOrEmpty(s.Plan.AllowedVoices))
                .SelectMany(s => s.Plan.AllowedVoices.Split(','))
                .Select(v => v.Trim())
                .Where(v => !string.IsNullOrEmpty(v))
                .Distinct()
                .ToList();

            // Tool access: OR across all active subscriptions
            permissions.TextToImageEnabled = activeSubscriptions.Any(s => s.Plan.TextToImageEnabled);
            permissions.TextToVideoEnabled = activeSubscriptions.Any(s => s.Plan.TextToVideoEnabled);
            permissions.ImageToVideoEnabled = activeSubscriptions.Any(s => s.Plan.ImageToVideoEnabled);
            permissions.ReferenceToVideoEnabled = activeSubscriptions.Any(s => s.Plan.ReferenceToVideoEnabled);
            permissions.LipSyncEnabled = activeSubscriptions.Any(s => s.Plan.LipSyncEnabled);
            permissions.MotionControlEnabled = activeSubscriptions.Any(s => s.Plan.MotionControlEnabled);
            permissions.SttEnabled = activeSubscriptions.Any(s => s.Plan.SttEnabled);
            permissions.TtsEnabled = activeSubscriptions.Any(s => s.Plan.TtsEnabled);
            permissions.AvatarVideoEnabled = activeSubscriptions.Any(s => s.Plan.AvatarVideoEnabled);

            return permissions;
        }
    }
}
