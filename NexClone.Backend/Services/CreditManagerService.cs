using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;

using NexClone.Backend.Models.Legacy;

namespace NexClone.Backend.Services
{
    public class CreditManagerService
    {
        private readonly ApplicationDbContext _context;
        private readonly LegacyDbContext _legacyContext;

        public CreditManagerService(ApplicationDbContext context, LegacyDbContext legacyContext)
        {
            _context = context;
            _legacyContext = legacyContext;
        }
        // "text-to-voice": per character
        // "voice-to-text": per second
        // "bg-remover": per image
        // "img-to-txt": per image
        public decimal CalculateCost(string toolId, decimal amount)
        {
            var tool = _legacyContext.ToolsTools.FirstOrDefault(t => t.Name == toolId);
            if (tool != null)
            {
                return tool.CreditCost * amount;
            }
            return 1m * amount; // Default fallback if tool not found in DB
        }

        public async Task<bool> IsToolAllowedForUser(Guid userId, string toolId)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return false;

            // Admin always has access, even for testing maintenance tools
            if (user.IsStaff) return true;

            // Check if tool is active globally
            var tool = await _legacyContext.ToolsTools.FirstOrDefaultAsync(t => t.Name == toolId);
            if (tool != null && !tool.IsActive) return false;

            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status == "Active" && s.EndDate > DateTime.UtcNow);

            if (activeSubscription == null) return false;

            // Example AllowedTools format: "[\"gpt\", \"text-to-voice\"]" or "{\"text-to-voice\": 150}"
            var allowedToolsJson = activeSubscription.Plan.AllowedTools ?? "[]";
            
            if (allowedToolsJson.Trim().StartsWith("[")) {
                return allowedToolsJson.Contains($"\"{toolId}\"");
            } else if (allowedToolsJson.Trim().StartsWith("{")) {
                try {
                    var dict = System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.Dictionary<string, int>>(allowedToolsJson);
                    return dict != null && dict.ContainsKey(toolId);
                } catch {
                    return false;
                }
            }
            return false;
        }

        public async Task<bool> HasEnoughCredits(Guid userId, string toolId, decimal cost)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            if (user.IsStaff) return true; // Admins have unlimited credits

            // For dynamic tools, we should also check if they are allowed on the current plan.
            // But we keep separation of concerns. This method only checks balance.
            return user.AvailableCredits >= cost;
        }

        public async Task<bool> DeductCreditsAsync(Guid userId, decimal cost)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            if (user.IsStaff) return true; // Admins don't get deducted

            if (user.AvailableCredits < cost) return false;

            user.AvailableCredits -= cost;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
