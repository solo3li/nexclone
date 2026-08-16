const fs = require('fs');
const file = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\Views\\ToolConfigAdmin\\Edit.cshtml';
let content = fs.readFileSync(file, 'utf8');

const regex = /\s*\/\/\s*Try to parse existing prices from config\.AdditionalSettings[\s\S]*?\} catch \{\}\r?\n\s*\}/;
const match = content.match(regex);

if (match) {
    const block = match[0];
    content = content.replace(block, '');
    
    const target1 = '@if (toolName == "text-to-video"';
    content = content.replace(target1, '@{\n' + block + '\n}\n' + target1);
}

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

const target2Regex = /@if\s*\(toolName\s*!=\s*"text-to-video"[\s\S]*?\{\s*<div\s*style="display:\s*flex;\s*justify-content:\s*space-between;\s*align-items:\s*center;\s*margin-bottom:\s*1rem;"/;

const target2Match = content.match(target2Regex);
if (target2Match) {
    content = content.replace(target2Match[0], flatRateBlock + '\n' + target2Match[0]);
}

fs.writeFileSync(file, content, 'utf8');
