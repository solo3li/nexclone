using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NexClone.Backend.Models;
using NexClone.Backend.Models.Legacy;
using System.Linq;

namespace NexClone.Backend.Services
{
    public class ToolPolicy
    {
        public bool Enabled { get; set; } = false;
        // -1 means unlimited
        public int MaxCharsPerRequest { get; set; } = 150; 
        public long MaxFileSizeMb { get; set; } = 25;
        // Cost per unit. If not set, we will fallback to LegacyDbContext
        public decimal? CostPerUnit { get; set; }
    }

    public class PolicyValidationResult
    {
        public bool IsAllowed { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public decimal TotalCost { get; set; }
    }

    public class UsagePolicyService
    {
        private readonly ApplicationDbContext _context;
        private readonly LegacyDbContext _legacyContext;

        public UsagePolicyService(ApplicationDbContext context, LegacyDbContext legacyContext)
        {
            _context = context;
            _legacyContext = legacyContext;
        }

        /// <summary>
        /// Validates limits and deducts credits in one go.
        /// usageAmount: for text-to-voice this is character count, for voice-to-text this is file size in bytes.
        /// </summary>
        public async Task<PolicyValidationResult> ValidateAndChargeAsync(Guid userId, string toolId, decimal usageAmount)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) 
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "User not found." };

            // Admins skip all limits and costs
            if (user.IsStaff) 
                return new PolicyValidationResult { IsAllowed = true, TotalCost = 0 };

            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (activeSubscription == null)
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "No active subscription found." };

            var toolPolicy = GetToolPolicy(activeSubscription.Plan.AllowedTools, toolId);

            if (!toolPolicy.Enabled)
            {
                // Fallback check against old AllowedTools format (like ["gpt", "text-to-voice"])
                if (!IsToolAllowedLegacyFormat(activeSubscription.Plan.AllowedTools, toolId))
                {
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your current plan does not have access to this tool." };
                }
            }

            // Specific limits check
            if (toolId == "text-to-voice")
            {
                if (toolPolicy.MaxCharsPerRequest != -1 && usageAmount > toolPolicy.MaxCharsPerRequest)
                {
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Your current plan allows a maximum of {toolPolicy.MaxCharsPerRequest} characters per request." };
                }
            }
            
            if (toolId == "voice-to-text")
            {
                if (toolPolicy.MaxFileSizeMb != -1 && usageAmount > (toolPolicy.MaxFileSizeMb * 1024 * 1024))
                {
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"File too large. Maximum allowed size is {toolPolicy.MaxFileSizeMb}MB." };
                }
            }

            // Cost Calculation
            decimal costPerUnit = toolPolicy.CostPerUnit ?? GetLegacyCostPerUnit(toolId);
            decimal amountForCost = usageAmount;
            
            // Legacy scaling for voice-to-text was 1 credit per 100KB
            if (toolId == "voice-to-text")
            {
                amountForCost = usageAmount / 102400m; 
            }

            decimal totalCost = amountForCost * costPerUnit;

            // Check credits
            if (user.AvailableCredits < totalCost)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient credits. This requires {totalCost:F2} credits." };
            }

            // Deduct
            user.AvailableCredits -= totalCost;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new PolicyValidationResult { IsAllowed = true, TotalCost = totalCost };
        }

        public ToolPolicy GetToolPolicy(string allowedToolsJson, string toolId)
        {
            var policy = new ToolPolicy();
            if (string.IsNullOrWhiteSpace(allowedToolsJson)) return policy;

            try
            {
                if (allowedToolsJson.Trim().StartsWith("{"))
                {
                    using var doc = JsonDocument.Parse(allowedToolsJson);
                    if (doc.RootElement.TryGetProperty(toolId, out var toolElement))
                    {
                        if (toolElement.ValueKind == JsonValueKind.Object)
                        {
                            policy.Enabled = true;
                            if (toolElement.TryGetProperty("enabled", out var e))
                                policy.Enabled = e.GetBoolean();
                            if (toolElement.TryGetProperty("max_chars_per_request", out var m))
                                policy.MaxCharsPerRequest = m.GetInt32();
                            if (toolElement.TryGetProperty("max_file_size_mb", out var f))
                                policy.MaxFileSizeMb = f.GetInt64();
                            if (toolElement.TryGetProperty("cost_per_unit", out var c))
                                policy.CostPerUnit = c.GetDecimal();
                        }
                        else if (toolElement.ValueKind == JsonValueKind.Number)
                        {
                            // Old { "text-to-voice": 150 } format
                            policy.Enabled = true;
                            policy.MaxCharsPerRequest = toolElement.GetInt32();
                        }
                    }
                }
            }
            catch { }
            return policy;
        }

        private bool IsToolAllowedLegacyFormat(string allowedToolsJson, string toolId)
        {
            if (string.IsNullOrWhiteSpace(allowedToolsJson)) return false;
            if (allowedToolsJson.Trim().StartsWith("["))
            {
                return allowedToolsJson.Contains($"\"{toolId}\"");
            }
            return false;
        }

        private decimal GetLegacyCostPerUnit(string toolId)
        {
            var tool = _legacyContext.ToolsTools.FirstOrDefault(t => t.Name == toolId);
            return tool?.CreditCost ?? 1m;
        }
    }
}
