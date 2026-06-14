using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;

namespace NexClone.Backend.Services
{
    public class CreditManagerService
    {
        private readonly ApplicationDbContext _context;

        // Pricing Rules
        // "gpt": per prompt
        // "text-to-voice": per character
        // "voice-to-text": per second
        // "bg-remover": per image
        // "img-to-txt": per image
        private readonly Dictionary<string, decimal> _toolPricing = new Dictionary<string, decimal>
        {
            { "gpt", 2m },             // 2 credits per prompt
            { "text-to-voice", 0.1m }, // 0.1 credit per character (1 credit = 10 chars)
            { "voice-to-text", 1m },   // 1 credit per second
            { "bg-remover", 5m },      // 5 credits per image
            { "img-to-txt", 3m }       // 3 credits per image
        };

        public CreditManagerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public decimal CalculateCost(string toolId, decimal amount)
        {
            if (_toolPricing.TryGetValue(toolId, out decimal rate))
            {
                return rate * amount;
            }
            return 0m;
        }

        public async Task<bool> IsToolAllowedForUser(Guid userId, string toolId)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return false;

            // Admin always has access
            if (user.IsStaff) return true;

            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status == "Active" && s.EndDate > DateTime.UtcNow);

            if (activeSubscription == null) return false;

            // Example AllowedTools format: "[\"gpt\", \"text-to-voice\"]"
            var allowedToolsJson = activeSubscription.Plan.AllowedTools ?? "[]";
            
            // Simple string check to avoid parsing JSON constantly
            return allowedToolsJson.Contains($"\"{toolId}\"");
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
