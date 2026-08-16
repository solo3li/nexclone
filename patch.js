const fs = require('fs');
const file = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\Views\\ToolConfigAdmin\\Edit.cshtml';
let content = fs.readFileSync(file, 'utf8');

const block = `                            // Try to parse existing prices from config.AdditionalSettings
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
                            }`;

content = content.replace(block, '');

const target1 = '@if (toolName == "text-to-video"';
content = content.replace(target1, block + '\n\n                        ' + target1);

const flatRateBlock = `
                        @if (toolName != "text-to-video" && toolName != "image-to-video" && toolName != "reference-to-video" && toolName != "text-to-image" && toolName != "advanced-lip-sync")
                        {
                            <div class="bx--form-item" style="margin-top: 2rem; margin-bottom: 2rem;">
                                <h4 class="bx--label" style="font-weight: 600; font-size: 1rem; margin-bottom: 0.5rem; color: #0f62fe;">@Localizer["Model Pricing (Flat Rate)"]</h4>
                                <div style="background: #f4f4f4; padding: 1.5rem; border-radius: 4px; border-left: 4px solid #0f62fe;">
                                    <label class="bx--label">Cost Per Unit (Credits)</label>
                                    <input type="number" step="0.0001" min="0" name="ModelCosts[default]" class="bx--text-input" style="width: 150px;" value="@(currentPrices.ContainsKey("default") ? currentPrices["default"] : 1.0m)" />
                                </div>
                            </div>
                        }
`;

const target2 = '@if (toolName != "text-to-video" && toolName != "image-to-video" && toolName != "reference-to-video" && toolName != "text-to-image" && toolName != "advanced-lip-sync")\r\n                        {\r\n                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">';

content = content.replace(target2, flatRateBlock + '\n' + target2);
if (content.indexOf(flatRateBlock) === -1) {
    const target2_alt = '@if (toolName != "text-to-video" && toolName != "image-to-video" && toolName != "reference-to-video" && toolName != "text-to-image" && toolName != "advanced-lip-sync")\n                        {\n                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">';
    content = content.replace(target2_alt, flatRateBlock + '\n' + target2_alt);
}

fs.writeFileSync(file, content, 'utf8');
console.log('done');
