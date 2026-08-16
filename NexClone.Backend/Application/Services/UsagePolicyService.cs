using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Text.Json;

using Microsoft.AspNetCore.SignalR;
using NexClone.Backend.Hubs;

namespace NexClone.Backend.Application.Services
{
    public class ToolPolicy
    {
        public bool Enabled { get; set; } = false;
        // -1 means unlimited
        public int MaxCharsPerRequest { get; set; } = 150; 
        public long MaxFileSizeMb { get; set; } = 25;
        
        // Extended media limits
        public long MaxImageFileSizeMb { get; set; } = 15;
        public long MaxAudioFileSizeMb { get; set; } = 15;
        public long MaxVideoFileSizeMb { get; set; } = 50;
        
        // Limits for specific tools
        public int MaxDurationSeconds { get; set; } = 60;

        // Cost per unit. If not set, we will fallback to LegacyDbContext
        public decimal? CostPerUnit { get; set; }
        public decimal? BaseCost { get; set; }
        public int BlockSize { get; set; } = 1;
        public int RoundUpToNearest { get; set; } = 1;
    }

    public class PolicyValidationResult
    {
        public bool IsAllowed { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public decimal TotalCost { get; set; }
        public decimal StandardCreditsCharged { get; set; }
        public decimal PremiumCreditsCharged { get; set; }
    }

    public class ModelPricingConfig
    {
        public bool IsPerSecond { get; set; }
        public decimal BaseCost { get; set; }
        public System.Collections.Generic.Dictionary<string, decimal> CostPerSecond { get; set; } = new System.Collections.Generic.Dictionary<string, decimal>();
        public System.Collections.Generic.Dictionary<string, decimal> FixedCost { get; set; } = new System.Collections.Generic.Dictionary<string, decimal>();
    }

    public class UsagePolicyService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public UsagePolicyService(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<ToolPolicy> GetToolPolicyForUserAsync(Guid userId, string toolId, string quality = "Standard")
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return new ToolPolicy { Enabled = true };

            var activeSubscription = user.Subscriptions
                .FirstOrDefault(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (activeSubscription == null) return new ToolPolicy { Enabled = true };

            return GetToolPolicy(activeSubscription.Plan, toolId, quality);
        }

        public async Task<PolicyValidationResult> ValidateAndChargeAsync(Guid userId, string toolId, decimal usageAmountForLimits, decimal? usageAmountForCost = null, string quality = "Standard", int? subscriptionId = null)
        {
            var estimate = await EstimateCostAsync(userId, toolId, usageAmountForLimits, usageAmountForCost, quality, subscriptionId);
            if (!estimate.IsAllowed) return estimate;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "User not found." };

            int retries = 3;
            bool saved = false;
            while (retries > 0 && !saved)
            {
                try
                {
                    user.StandardCredits -= estimate.StandardCreditsCharged;
                    user.PremiumCredits -= estimate.PremiumCreditsCharged;
                        
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    
                    if (_hubContext != null) {
                        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveWalletUpdate");
                    }
                    
                    saved = true;
                }
                catch (DbUpdateConcurrencyException)
                {
                    retries--;
                    if (retries == 0)
                    {
                        return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "A system error occurred while processing your request. Please try again." };
                    }
                    
                    await _context.Entry(user).ReloadAsync();
                    
                    decimal remainingCost = estimate.TotalCost;
                    decimal standardToCharge = 0;
                    decimal premiumToCharge = 0;

                    var toolConfig = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolId);
                    bool allowStandard = toolConfig?.AllowStandardCredits ?? true;
                    bool allowPremium = toolConfig?.AllowPremiumCredits ?? false;

                    if (allowStandard)
                    {
                        standardToCharge = Math.Min(user.StandardCredits, remainingCost);
                        remainingCost -= standardToCharge;
                    }

                    if (allowPremium && remainingCost > 0)
                    {
                        premiumToCharge = Math.Min(user.PremiumCredits, remainingCost);
                        remainingCost -= premiumToCharge;
                    }

                    if (remainingCost > 0)
                    {
                        return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Insufficient credits after state refresh. Please top up your wallet." };
                    }
                    
                    estimate.StandardCreditsCharged = standardToCharge;
                    estimate.PremiumCreditsCharged = premiumToCharge;
                }
            }

            return estimate;
        }

        public ToolPolicy GetToolPolicy(Plan plan, string toolId, string quality = "Standard")
        {
            var policy = new ToolPolicy();
            if (plan == null) return policy;

            if (toolId == "text-to-voice")
            {
                policy.Enabled = plan.TtsEnabled;
                policy.MaxCharsPerRequest = plan.TtsMaxCharsPerRequest;
                
                if (quality == "High")
                    policy.CostPerUnit = plan.TtsCostPerCharHigh;
                else
                    policy.CostPerUnit = plan.TtsCostPerChar;
                    
                policy.BlockSize = plan.TtsCharactersBlock;
            }
            else if (toolId == "voice-to-text")
            {
                policy.Enabled = plan.SttEnabled;
                policy.MaxFileSizeMb = plan.SttMaxFileSizeMb;
                policy.CostPerUnit = plan.SttCostPerMinute;
            }
            else if (toolId == "kling_avatar_image2video")
            {
                policy.Enabled = plan.AvatarVideoEnabled;
                if (quality == "pro")
                    policy.CostPerUnit = plan.AvatarVideoProCost;
                else
                    policy.CostPerUnit = plan.AvatarVideoCostPerGeneration;
                
                policy.MaxImageFileSizeMb = plan.AvatarVideoMaxFileSizeMb;
                policy.MaxAudioFileSizeMb = plan.AvatarVideoMaxAudioFileSizeMb;
                policy.MaxCharsPerRequest = plan.AvatarVideoMaxCharsPerRequest;
            }
            else if (toolId == "advanced-lip-sync" || toolId == "lipsync")
            {
                policy.Enabled = plan.LipSyncEnabled;
                
                // If checkbox is checked, we charge per second, else we charge per generation
                if (plan.LipSyncChargePerSecond)
                {
                    policy.BaseCost = 0; // No flat fee
                    policy.CostPerUnit = plan.LipSyncCostPerSecond;
                    policy.RoundUpToNearest = 5; // To calculate in blocks of 5 seconds
                }
                else
                {
                    policy.BaseCost = plan.LipSyncCostPerGeneration;
                    policy.CostPerUnit = 0;
                }

                policy.MaxVideoFileSizeMb = plan.LipSyncMaxVideoFileSizeMb;
                policy.MaxAudioFileSizeMb = plan.LipSyncMaxAudioFileSizeMb;
                policy.MaxDurationSeconds = plan.LipSyncMaxDurationSeconds;
            }
            else if (toolId == "kling_motion_control" || toolId == "motion-control")
            {
                policy.Enabled = plan.MotionControlEnabled;
                if (quality == "pro")
                    policy.CostPerUnit = plan.MotionControlProCost;
                else
                    policy.CostPerUnit = plan.MotionControlCostPerGeneration;
                
                policy.MaxVideoFileSizeMb = plan.MotionControlMaxVideoFileSizeMb;
                policy.MaxImageFileSizeMb = plan.MotionControlMaxImageFileSizeMb;
            }
            else if (toolId == "text-to-video")
            {
                policy.Enabled = plan.TextToVideoEnabled;
            }
            else if (toolId == "image-to-video")
            {
                policy.Enabled = plan.ImageToVideoEnabled;
            }
            else if (toolId == "reference-to-video")
            {
                policy.Enabled = plan.ReferenceToVideoEnabled;
            }
            else if (toolId == "text-to-image")
            {
                policy.Enabled = plan.TextToImageEnabled;
            }

            return policy;
        }

        private decimal GetLegacyCostPerUnit(string toolId)
        {
            return 1m;
        }

        public async Task<PolicyValidationResult> EstimateCostAsync(Guid userId, string toolId, decimal usageAmountForLimits, decimal? usageAmountForCost = null, string quality = "Standard", int? subscriptionId = null)
        {
            var user = await _context.Users
                .Include(u => u.Subscriptions.Where(s => s.Status.ToLower() == "active" || s.Status.ToLower() == "freeze"))
                    .ThenInclude(s => s.Plan)
                .AsSplitQuery()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) 
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "User not found." };

            var toolConfig = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolId);
            if (toolConfig != null && !toolConfig.IsActive)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "This tool is currently disabled." };
            }

            var hasFrozenSubscription = user.Subscriptions.Any(s => s.Status.ToLower() == "freeze");
            var hasActiveSubscription = user.Subscriptions.Any(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow);

            if (hasFrozenSubscription && !hasActiveSubscription)
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your account is currently in the freeze period. Please renew your subscription to continue using the services." };
            }

            var activeSubscription = user.Subscriptions
                .Where(s => s.Status.ToLower() == "active" && s.EndDate > DateTime.UtcNow)
                .OrderByDescending(s => s.Plan.IsDefaultRegistrationPlan || s.Plan.IsFreeTrial)
                .ThenBy(s => s.EndDate)
                .FirstOrDefault();

            if (activeSubscription != null && (activeSubscription.Plan.PriceUsd == 0 || activeSubscription.Plan.IsFreeTrial || activeSubscription.Plan.Name.ToLower().Contains("free")))
            {
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Your credits are frozen while on the Free plan. Please upgrade your plan to continue using the services." };
            }

            var toolPolicy = activeSubscription != null ? GetToolPolicy(activeSubscription.Plan, toolId, quality) : new ToolPolicy { Enabled = true };
            if (activeSubscription == null) toolPolicy.Enabled = true;

            if (toolId == "text-to-voice" && toolPolicy.MaxCharsPerRequest != -1 && usageAmountForLimits > toolPolicy.MaxCharsPerRequest)
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Your current plan allows a maximum of {toolPolicy.MaxCharsPerRequest} characters per request." };
            
            if (toolId == "voice-to-text" && toolPolicy.MaxFileSizeMb != -1 && usageAmountForLimits > (toolPolicy.MaxFileSizeMb * 1024 * 1024))
                return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"File too large. Maximum allowed size is {toolPolicy.MaxFileSizeMb}MB." };

            decimal costPerUnit = toolPolicy.CostPerUnit ?? GetLegacyCostPerUnit(toolId);
            decimal amountForCost = usageAmountForCost ?? usageAmountForLimits;
            
            if (toolPolicy.RoundUpToNearest > 1)
            {
                amountForCost = Math.Ceiling(amountForCost / toolPolicy.RoundUpToNearest) * toolPolicy.RoundUpToNearest;
            }

            if (toolId == "voice-to-text" && usageAmountForCost == null)
            {
                amountForCost = usageAmountForLimits / 102400m; 
            }

            if (toolPolicy.BlockSize > 1)
            {
                amountForCost = amountForCost / toolPolicy.BlockSize;
            }

            decimal totalCost = (toolPolicy.BaseCost ?? 0) + (amountForCost * costPerUnit);

            var parts = quality.Split('|');
            var modelName = parts[0];
            var resolution = parts.Length > 1 ? parts[1] : "default";

            bool allowStandard = toolConfig?.AllowStandardCredits ?? true;
            bool allowPremium = toolConfig?.AllowPremiumCredits ?? false;

            // 1. Check dedicated table: Avatar to Video
            if (toolId == "kling_avatar_image2video" || toolId == "avatar-to-video")
            {
                var avatarSetting = await _context.AvatarToVideoSettings.FirstOrDefaultAsync();
                if (avatarSetting != null && !avatarSetting.IsActive)
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Avatar to Video is currently disabled." };

                var pricing = await _context.AvatarToVideoModelPricings.FirstOrDefaultAsync(p => p.IsActive && (p.ModelName.ToLower() == modelName.ToLower() || p.ModelName.ToLower().Contains("avatar")));
                if (pricing == null) pricing = await _context.AvatarToVideoModelPricings.FirstOrDefaultAsync(p => p.IsActive);

                if (pricing != null)
                {
                    totalCost = pricing.BaseCost + (pricing.BillingType == "PerSecond" ? (amountForCost * pricing.UnitCost) : pricing.UnitCost);
                    allowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                    allowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                }
            }
            // 2. Check dedicated table: Text to Video
            else if (toolId == "text-to-video")
            {
                var t2vSetting = await _context.TextToVideoSettings.FirstOrDefaultAsync();
                if (t2vSetting != null && !t2vSetting.IsActive)
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Text to Video is currently disabled." };

                var pricing = await _context.TextToVideoModelPricings.FirstOrDefaultAsync(p => p.IsActive && (p.ModelName.ToLower() == modelName.ToLower() || modelName.ToLower().Contains(p.ModelName.ToLower())));
                if (pricing == null) pricing = await _context.TextToVideoModelPricings.FirstOrDefaultAsync(p => p.IsActive);

                if (pricing != null)
                {
                    string res = resolution.ToLower();
                    if (pricing.BillingType == "PerSecond")
                    {
                        decimal cps = res switch {
                            "480p" => pricing.CostPerSecond_480p,
                            "720p" => pricing.CostPerSecond_720p,
                            "1080p" => pricing.CostPerSecond_1080p,
                            "4k" => pricing.CostPerSecond_4k,
                            _ => pricing.CostPerSecond_720p
                        };
                        totalCost = pricing.BaseCost + (amountForCost * cps);
                    }
                    else
                    {
                        decimal fc = res switch {
                            "480p" => pricing.FixedCost_480p,
                            "720p" => pricing.FixedCost_720p,
                            "1080p" => pricing.FixedCost_1080p,
                            "4k" => pricing.FixedCost_4k,
                            _ => pricing.FixedCost_720p
                        };
                        totalCost = pricing.BaseCost + fc;
                    }
                    allowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                    allowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                }
            }
            // 3. Check dedicated table: Image to Video / Reference to Video
            else if (toolId == "image-to-video" || toolId == "reference-to-video")
            {
                var i2vSetting = await _context.ImageToVideoSettings.FirstOrDefaultAsync();
                if (i2vSetting != null && !i2vSetting.IsActive)
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Image to Video is currently disabled." };

                var pricing = await _context.ImageToVideoModelPricings.FirstOrDefaultAsync(p => p.IsActive && (p.ModelName.ToLower() == modelName.ToLower() || modelName.ToLower().Contains(p.ModelName.ToLower())));
                if (pricing == null) pricing = await _context.ImageToVideoModelPricings.FirstOrDefaultAsync(p => p.IsActive);

                if (pricing != null)
                {
                    string res = resolution.ToLower();
                    if (pricing.BillingType == "PerSecond")
                    {
                        decimal cps = res switch {
                            "480p" => pricing.CostPerSecond_480p,
                            "720p" => pricing.CostPerSecond_720p,
                            "1080p" => pricing.CostPerSecond_1080p,
                            "4k" => pricing.CostPerSecond_4k,
                            _ => pricing.CostPerSecond_720p
                        };
                        totalCost = pricing.BaseCost + (amountForCost * cps);
                    }
                    else
                    {
                        decimal fc = res switch {
                            "480p" => pricing.FixedCost_480p,
                            "720p" => pricing.FixedCost_720p,
                            "1080p" => pricing.FixedCost_1080p,
                            "4k" => pricing.FixedCost_4k,
                            _ => pricing.FixedCost_720p
                        };
                        totalCost = pricing.BaseCost + fc;
                    }
                    allowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                    allowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                }
            }
            // 4. Check dedicated table: LipSync
            else if (toolId == "advanced-lip-sync" || toolId == "vidu_advanced_lip_sync" || toolId == "lipsync")
            {
                var lipSetting = await _context.LipSyncSettings.FirstOrDefaultAsync();
                if (lipSetting != null && !lipSetting.IsActive)
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Lip-Sync is currently disabled." };

                var pricing = await _context.LipSyncModelPricings.FirstOrDefaultAsync(p => p.IsActive);
                if (pricing != null)
                {
                    double dur = (double)amountForCost;
                    if (dur <= 0) dur = 5.0;
                    int blocks = (int)Math.Ceiling(dur / 5.0);
                    decimal costPerBlock = pricing.BaseCost > 0 ? pricing.BaseCost : (pricing.CostPerSecond * 5.0m > 0 ? pricing.CostPerSecond * 5.0m : 12.0m);
                    totalCost = blocks * costPerBlock;
                    allowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                    allowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                }
            }
            // 5. Check dedicated table: Text to Image
            else if (toolId == "text-to-image")
            {
                var imgSetting = await _context.TextToImageSettings.FirstOrDefaultAsync();
                if (imgSetting != null && !imgSetting.IsActive)
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Text to Image is currently disabled." };

                var pricing = await _context.TextToImageModelPricings.FirstOrDefaultAsync(p => p.IsActive);
                if (pricing != null)
                {
                    totalCost = pricing.BaseCost + (amountForCost * pricing.CostPerImage);
                    allowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                    allowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                }
            }
            // 6. Check dedicated table: Motion Control
            else if (toolId == "motion-control" || toolId == "kling_motion_control")
            {
                var mcSetting = await _context.MotionControlSettings.FirstOrDefaultAsync();
                if (mcSetting != null && !mcSetting.IsActive)
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Motion Control is currently disabled." };

                var pricing = await _context.MotionControlModelPricings.FirstOrDefaultAsync(p => p.IsActive);
                if (pricing != null)
                {
                    totalCost = pricing.BaseCost + (amountForCost * pricing.CostPerSecond);
                    allowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                    allowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                }
            }
            // 7. Check dedicated table: Voice to Text (STT)
            else if (toolId == "voice-to-text" || toolId == "vtt" || toolId == "stt")
            {
                var vttSetting = await _context.VoiceToTextSettings.FirstOrDefaultAsync();
                if (vttSetting != null && !vttSetting.IsActive)
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = "Voice to Text is currently disabled." };

                var pricing = await _context.VoiceToTextModelPricings.FirstOrDefaultAsync(p => p.IsActive);
                if (pricing != null)
                {
                    double val = (double)amountForCost;
                    if (val <= 0) val = 1.0;
                    // If val > 30, it was passed in seconds (e.g. 120s -> 2 min), otherwise directly in minutes
                    double minutes = val > 30 ? (val / 60.0) : val;
                    totalCost = pricing.BaseCost + ((decimal)minutes * pricing.CostPerMinute);
                    if (totalCost < 0.1m) totalCost = 0.1m;
                    allowStandard = pricing.AllowedWallet.Equals("Standard", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                    allowPremium = pricing.AllowedWallet.Equals("Premium", StringComparison.OrdinalIgnoreCase) || pricing.AllowedWallet.Equals("Both", StringComparison.OrdinalIgnoreCase);
                }
            }
            // Fallback for tools with JSON settings (including TTS/VTT or legacy)
            else if (toolConfig != null && !string.IsNullOrEmpty(toolConfig.AdditionalSettings))
            {
                bool priceFound = false;
                try
                {
                    using var doc = JsonDocument.Parse(toolConfig.AdditionalSettings);
                    var modelNameLower = modelName.ToLower();
                    
                    JsonElement mConfigEl;
                    bool hasConfig = doc.RootElement.TryGetProperty(modelNameLower, out mConfigEl);
                    if (!hasConfig) hasConfig = doc.RootElement.TryGetProperty("default", out mConfigEl);
                    
                    if (hasConfig)
                    {
                        var mConfig = JsonSerializer.Deserialize<ModelPricingConfig>(mConfigEl.GetRawText(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (mConfig != null)
                        {
                            string res = resolution.ToLower();
                            if (mConfig.IsPerSecond)
                            {
                                decimal cps = mConfig.CostPerSecond.ContainsKey(res) ? mConfig.CostPerSecond[res] : 
                                              (mConfig.CostPerSecond.ContainsKey("default") ? mConfig.CostPerSecond["default"] : 0);
                                totalCost = mConfig.BaseCost + (amountForCost * cps);
                            }
                            else
                            {
                                decimal fc = mConfig.FixedCost.ContainsKey(res) ? mConfig.FixedCost[res] : 
                                              (mConfig.FixedCost.ContainsKey("default") ? mConfig.FixedCost["default"] : 0);
                                totalCost = mConfig.BaseCost + (amountForCost * fc);
                            }
                            priceFound = true;
                        }
                    }
                }
                catch { }
            }

            decimal remainingCost = totalCost;
            decimal standardToCharge = 0;
            decimal premiumToCharge = 0;

            if (allowStandard && !allowPremium)
            {
                // Must charge only Standard
                standardToCharge = totalCost;
                if (user.StandardCredits < standardToCharge)
                {
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient Standard credits. Requires {totalCost:F2} Standard credits." };
                }
            }
            else if (allowPremium && !allowStandard)
            {
                // Must charge only Premium
                premiumToCharge = totalCost;
                if (user.PremiumCredits < premiumToCharge)
                {
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient Premium credits. Requires {totalCost:F2} Premium credits." };
                }
            }
            else
            {
                // Both allowed: charge Standard first, then remainder from Premium
                if (allowStandard)
                {
                    standardToCharge = Math.Min(user.StandardCredits, remainingCost);
                    remainingCost -= standardToCharge;
                }

                if (allowPremium && remainingCost > 0)
                {
                    premiumToCharge = Math.Min(user.PremiumCredits, remainingCost);
                    remainingCost -= premiumToCharge;
                }

                if (remainingCost > 0)
                {
                    return new PolicyValidationResult { IsAllowed = false, ErrorMessage = $"Insufficient credits. Requires {totalCost:F2} total credits." };
                }
            }

            return new PolicyValidationResult { 
                IsAllowed = true, 
                TotalCost = totalCost, 
                StandardCreditsCharged = standardToCharge,
                PremiumCreditsCharged = premiumToCharge
            };
        }

        public async Task RefundAsync(Guid userId, decimal standardAmount, decimal premiumAmount)
        {
            if (standardAmount <= 0 && premiumAmount <= 0) return;

            int retries = 3;
            bool saved = false;
            while (retries > 0 && !saved)
            {
                try
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user != null)
                    {
                        user.StandardCredits += standardAmount;
                        user.PremiumCredits += premiumAmount;
                        
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();
                        
                        if (_hubContext != null) {
                            await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveWalletUpdate");
                        }
                    }
                    saved = true;
                }
                catch (DbUpdateConcurrencyException)
                {
                    retries--;
                    if (retries == 0) throw;
                }
            }
        }

        public async Task RefundByToolAsync(Guid userId, string toolId, decimal amount)
        {
            if (amount <= 0) return;
            var toolConfig = await _context.ToolConfigurations.FirstOrDefaultAsync(t => t.ToolName == toolId);
            bool allowPremium = toolConfig?.AllowPremiumCredits ?? false;
            
            if (allowPremium) 
            {
                await RefundAsync(userId, 0, amount);
            }
            else 
            {
                await RefundAsync(userId, amount, 0);
            }
        }
    }
}
