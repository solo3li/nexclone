const fs = require('fs');
const path = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\Views\\ToolConfigAdmin\\Edit.cshtml';
let content = fs.readFileSync(path, 'utf8');

const regex = /<div class="bx--form-item" style="margin-top: 2rem; margin-bottom: 2rem;">\s*<h4 class="bx--label".*?>@Localizer\["Model Pricing \(Flat Rate\)"\]<\/h4>[\s\S]*?<\/div>\s*<\/div>\s*\}/;

const replacement = `<div class="bx--form-item" style="margin-top: 2rem; margin-bottom: 2rem;">
                                <h4 class="bx--label" style="font-weight: 600; font-size: 1rem; margin-bottom: 0.5rem; color: #0f62fe;">@Localizer["Model Pricing (Flat Rate)"]</h4>
                                <div style="background: #f4f4f4; padding: 1.5rem; border-radius: 4px; border-left: 4px solid #0f62fe;">
                                    @if (toolName == "text-to-voice")
                                    {
                                        <div style="display: flex; gap: 2rem;">
                                            <div>
                                                <label class="bx--label">Cost Per Char (Standard)</label>
                                                <input type="number" step="0.0001" min="0" name="ModelCosts[default]" class="bx--text-input" style="width: 150px;" value="@(currentPrices.ContainsKey("default") ? currentPrices["default"] : 0.001m)" />
                                            </div>
                                            <div>
                                                <label class="bx--label">Cost Per Char (High/Premium)</label>
                                                <input type="number" step="0.0001" min="0" name="ModelCosts[High]" class="bx--text-input" style="width: 150px;" value="@(currentPrices.ContainsKey("High") ? currentPrices["High"] : 0.01m)" />
                                            </div>
                                        </div>
                                    }
                                    else
                                    {
                                        <label class="bx--label">Cost Per Unit (Credits)</label>
                                        <input type="number" step="0.0001" min="0" name="ModelCosts[default]" class="bx--text-input" style="width: 150px;" value="@(currentPrices.ContainsKey("default") ? currentPrices["default"] : 1.0m)" />
                                    }
                                </div>
                            </div>
                        }`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content, 'utf8');
