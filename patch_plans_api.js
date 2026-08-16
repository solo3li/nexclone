const fs = require('fs');
const path = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\API\\Controllers\\Client\\PlatformController.cs';
let content = fs.readFileSync(path, 'utf8');

const regex = /public async Task<IActionResult> GetPlans\(\)\s*\{\s*var plans = await _context\.Plans\s*\.Where\(p => !p\.IsDefaultRegistrationPlan && !p\.IsDeleted\)\s*\.OrderBy\(p => p\.PriceUsd\)\s*\.ToListAsync\(\);\s*return Ok\(plans\);\s*\}/;

const replacement = `public async Task<IActionResult> GetPlans()
        {
            var plans = await _context.Plans
                .Where(p => !p.IsDefaultRegistrationPlan && !p.IsDeleted)
                .OrderBy(p => p.PriceUsd)
                .ToListAsync();

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

            foreach (var p in plans)
            {
                p.TtsCostPerChar = GetDynamicCost("text-to-voice", "default", p.TtsCostPerChar);
                p.TtsCostPerCharHigh = GetDynamicCost("text-to-voice", "high", p.TtsCostPerCharHigh);
                p.AvatarVideoCostPerGeneration = GetDynamicCost("kling_avatar_image2video", "default", p.AvatarVideoCostPerGeneration);
                p.AvatarVideoProCost = GetDynamicCost("kling_avatar_image2video", "pro", p.AvatarVideoProCost);
                p.LipSyncCostPerGeneration = GetDynamicCost("advanced-lip-sync", "default", p.LipSyncCostPerGeneration);
                p.SttCostPerMinute = GetDynamicCost("voice-to-text", "default", p.SttCostPerMinute);
            }

            return Ok(plans);
        }`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content, 'utf8');
