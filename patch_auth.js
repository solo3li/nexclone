const fs = require('fs');
const path = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\API\\Controllers\\Client\\AuthController.cs';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
            var activeSub = allSubs.FirstOrDefault(s => s.Status == "active" || s.Status == "freeze");

            // Fetch dynamic prices to override Plan defaults
            var tools = await _context.ToolConfigurations.ToListAsync();
            
            decimal GetDynamicCost(string toolName, string modelKey, decimal fallback)
            {
                var tool = tools.FirstOrDefault(t => t.ToolName == toolName);
                if (tool != null && !string.IsNullOrEmpty(tool.AdditionalSettings))
                {
                    try
                    {
                        using var doc = System.Text.Json.JsonDocument.Parse(tool.AdditionalSettings);
                        if (doc.RootElement.TryGetProperty(modelKey, out var modelNode) || doc.RootElement.TryGetProperty("default", out modelNode))
                        {
                            if (modelNode.TryGetProperty("CostPerSecond", out var cps) && cps.TryGetProperty("default", out var cpsVal)) return cpsVal.GetDecimal();
                            if (modelNode.TryGetProperty("FixedCost", out var fc) && fc.TryGetProperty("default", out var fcVal)) return fcVal.GetDecimal();
                        }
                    }
                    catch { }
                }
                return fallback;
            }

            var ttsCost = GetDynamicCost("text-to-voice", "default", activeSub?.Plan?.TtsCostPerChar ?? 0.001m);
            var ttsCostHigh = GetDynamicCost("text-to-voice", "high", activeSub?.Plan?.TtsCostPerCharHigh ?? 0.01m);
            var avatarCost = GetDynamicCost("kling_avatar_image2video", "default", activeSub?.Plan?.AvatarVideoCostPerGeneration ?? 1.0m);
            var avatarProCost = GetDynamicCost("kling_avatar_image2video", "pro", activeSub?.Plan?.AvatarVideoProCost ?? 2.0m);
            var lipSyncCost = GetDynamicCost("advanced-lip-sync", "default", activeSub?.Plan?.LipSyncCostPerGeneration ?? 1.0m);
            var sttCost = GetDynamicCost("voice-to-text", "default", activeSub?.Plan?.SttCostPerMinute ?? 1.0m);

            var activeSubscriptionsResponse = allSubs
`;

content = content.replace(/var activeSub = allSubs\.FirstOrDefault\(s => s\.Status == "active" \|\| s\.Status == "freeze"\);\s+var activeSubscriptionsResponse = allSubs/, replacement);

const returnObjRegex = /ActivePlan = activeSub != null \? new \{([\s\S]*?)\} : null/;
const returnObjReplacement = `ActivePlan = activeSub != null ? new {
                    Name = activeSub.Plan.Name,
                    NameAr = activeSub.Plan.NameAr,
                    Status = activeSub.Status,
                    EndDate = activeSub.EndDate,
                    FreezeEndDate = activeSub.EndDate.AddDays(activeSub.Plan.GracePeriodDays),
                    TtsCustomInstructionsEnabled = activeSub.Plan.TtsCustomInstructionsEnabled,
                    AvatarVideoCostPerGeneration = avatarCost,
                    AvatarVideoProCost = avatarProCost,
                    LipSyncCostPerGeneration = lipSyncCost,
                    LipSyncCostPerSecond = activeSub.Plan.LipSyncCostPerSecond,
                    SttCostPerMinute = sttCost,
                    TtsCostPerChar = ttsCost,
                    TtsCostPerCharHigh = ttsCostHigh,
                    IsFreeTrial = activeSub.Plan.IsFreeTrial,
                    IsDefaultRegistrationPlan = activeSub.Plan.IsDefaultRegistrationPlan
                } : null`;

content = content.replace(returnObjRegex, returnObjReplacement);
fs.writeFileSync(path, content, 'utf8');
