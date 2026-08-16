import re

with open(r'c:\Users\solo\Desktop\nexcole\nexclone\NexClone.Backend\Views\ToolConfigAdmin\Edit.cshtml', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Move currentPrices block out of the if block
block_to_move = '''                            // Try to parse existing prices from config.AdditionalSettings
                            var currentPrices = new Dictionary<string, decimal>();
                            var currentPerSec = new Dictionary<string, bool>();
                            if (!string.IsNullOrEmpty(config.AdditionalSettings))
                            {
                                try {
                                    var jDoc = System.Text.Json.JsonDocument.Parse(config.AdditionalSettings);
                                    foreach (var prop in jDoc.RootElement.EnumerateObject())
                                    {
                                        var mConfig = prop.Value;
                                        if (mConfig.TryGetProperty("IsPerSecond", out var isPerSecProp) && isPerSecProp.GetBoolean())
                                        {
                                            currentPerSec[prop.Name] = true;
                                            if (mConfig.TryGetProperty("CostPerSecond", out var cps) && cps.TryGetProperty("default", out var cpsVal))
                                                currentPrices[prop.Name] = cpsVal.GetDecimal();
                                        }
                                        else
                                        {
                                            currentPerSec[prop.Name] = false;
                                            if (mConfig.TryGetProperty("FixedCost", out var fc) && fc.TryGetProperty("default", out var fcVal))
                                                currentPrices[prop.Name] = fcVal.GetDecimal();
                                        }
                                    }
                                } catch {}
                            }'''

content = content.replace(block_to_move, '')

target_pos = content.find('@if (toolName == "text-to-video"')
content = content[:target_pos] + block_to_move + '\n\n                        ' + content[target_pos:]

# 2. Add Flat Rate Pricing block
flat_rate_block = '''                        @if (toolName != "text-to-video" && toolName != "image-to-video" && toolName != "reference-to-video" && toolName != "text-to-image" && toolName != "advanced-lip-sync")
                        {
                            <div class="bx--form-item" style="margin-top: 2rem; margin-bottom: 2rem;">
                                <h4 class="bx--label" style="font-weight: 600; font-size: 1rem; margin-bottom: 0.5rem; color: #0f62fe;">@Localizer["Model Pricing (Flat Rate)"]</h4>
                                <div style="background: #f4f4f4; padding: 1.5rem; border-radius: 4px; border-left: 4px solid #0f62fe;">
                                    <label class="bx--label">Cost Per Unit (Credits)</label>
                                    <input type="number" step="0.0001" min="0" name="ModelCosts[default]" class="bx--text-input" style="width: 150px;" value="@(currentPrices.ContainsKey("default") ? currentPrices["default"] : 1.0m)" />
                                </div>
                            </div>
                        }
'''

target_pos2 = content.find('@if (toolName != "text-to-video"')
content = content[:target_pos2] + flat_rate_block + '\n                        ' + content[target_pos2:]

with open(r'c:\Users\solo\Desktop\nexcole\nexclone\NexClone.Backend\Views\ToolConfigAdmin\Edit.cshtml', 'w', encoding='utf-8') as f:
    f.write(content)
