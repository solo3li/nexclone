import re
import sys

file_path = r'c:\Users\solo\Desktop\nexcole\nexclone\NexClone.Backend\Views\ToolConfigAdmin\Edit.cshtml'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update text-to-video variables
    t2v_var_target = 'var grokVideo = t2vPricings.FirstOrDefault(p => p.ModelName.ToLower().Contains("grok")) ?? new NexClone.Backend.Core.Entities.TextToVideoModelPricing { CostPerSecond_480p = 2.4m, CostPerSecond_720p = 4.5m, CostPerSecond_1080p = 8.0m };'
    t2v_var_replacement = t2v_var_target + '\n    var seedanceVideo = t2vPricings.FirstOrDefault(p => p.ModelName.ToLower().Contains("seedance")) ?? new NexClone.Backend.Core.Entities.TextToVideoModelPricing { CostPerSecond_480p = 0.0143m, CostPerSecond_720p = 0.0286m };'
    content = content.replace(t2v_var_target, t2v_var_replacement)

    # 2. Add text-to-video card before @if (toolName == "reference-to-video")
    t2v_card = '''
    <!-- 3. Seedance 2.0 Mini Video Card -->
    <div style="background: #ffffff; padding: 1.75rem; border: 1px solid #e0e0e0; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f4f4f4; padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="background: #0f62fe; color: white; font-weight: bold; font-size: 0.75rem; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.5px;">CRUN AI</span>
                <h3 class="bx--type-productive-heading-03" style="margin: 0; color: #161616;">Seedance 2.0 Mini (ByteDance)</h3>
            </div>
            <span style="background: #e8f8f0; color: #198038; font-weight: 600; font-size: 0.8rem; padding: 4px 12px; border-radius: 4px; border: 1px solid #a7f0ba;">
                ● @Localizer["Cost Per Second (6s - 15s)"]
            </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
            <div class="bx--form-item">
                <label class="bx--label" style="font-weight: 600;">@Localizer["480p Cost (Credits / Sec)"]</label>
                <input type="number" step="0.0001" min="0" name="ModelCosts[seedance|480p]" class="bx--text-input" value="@seedanceVideo.CostPerSecond_480p" style="font-size: 1.05rem; font-weight: bold;" />
                <div class="bx--form__helper-text">Cost per second (Default: 0.0143)</div>
            </div>
            <div class="bx--form-item">
                <label class="bx--label" style="font-weight: 600;">@Localizer["720p Cost (Credits / Sec)"]</label>
                <input type="number" step="0.0001" min="0" name="ModelCosts[seedance|720p]" class="bx--text-input" value="@seedanceVideo.CostPerSecond_720p" style="font-size: 1.05rem; font-weight: bold;" />
                <div class="bx--form__helper-text">Cost per second (Default: 0.0286)</div>
            </div>
        </div>

        <div style="background: #f4f4f4; padding: 1rem 1.25rem; border-radius: 4px; border-left: 4px solid #0f62fe;">
            <label class="bx--label" style="font-weight: 600; margin-bottom: 0.5rem; display: block;">@Localizer["Supported Modes & Aspect Ratios"]</label>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">16:9</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">9:16</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">1:1</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">3:4</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">4:3</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">21:9</span>
            </div>
            <div style="font-size: 0.8rem; color: #525252;">Duration: <strong style="color: #161616;">6s to 15s</strong></div>
        </div>
    </div>
}
'''
    content = content.replace('    </div>\n}', '    </div>\n' + t2v_card, 1)

    # 3. Update reference-to-video variables
    r2v_var_target = 'var veoLite = i2vPricings.FirstOrDefault(p => p.ModelName == "veo 3.1 Lite") ?? new NexClone.Backend.Core.Entities.ImageToVideoModelPricing { FixedCost_720p = 15.0m, FixedCost_1080p = 22.5m, FixedCost_4k = 75.0m };'
    r2v_var_replacement = r2v_var_target + '\n    var seedanceVideo = i2vPricings.FirstOrDefault(p => p.ModelName.ToLower().Contains("seedance")) ?? new NexClone.Backend.Core.Entities.ImageToVideoModelPricing { CostPerSecond_480p = 0.0143m, CostPerSecond_720p = 0.0286m };'
    content = content.replace(r2v_var_target, r2v_var_replacement, 1)

    # 4. Add reference-to-video card before @if (toolName == "image-to-video")
    r2v_card = '''
    <!-- Seedance 2.0 Mini Reference to Video Card -->
    <div style="background: #ffffff; padding: 1.75rem; border: 1px solid #e0e0e0; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f4f4f4; padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="background: #0f62fe; color: white; font-weight: bold; font-size: 0.75rem; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.5px;">CRUN AI</span>
                <h3 class="bx--type-productive-heading-03" style="margin: 0; color: #161616;">Seedance 2.0 Mini (ByteDance)</h3>
            </div>
            <span style="background: #e8f8f0; color: #198038; font-weight: 600; font-size: 0.8rem; padding: 4px 12px; border-radius: 4px; border: 1px solid #a7f0ba;">
                ● @Localizer["Cost Per Second (6s - 15s)"]
            </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
            <div class="bx--form-item">
                <label class="bx--label" style="font-weight: 600;">@Localizer["480p Cost (Credits / Sec)"]</label>
                <input type="number" step="0.0001" min="0" name="ModelCosts[seedance|480p]" class="bx--text-input" value="@seedanceVideo.CostPerSecond_480p" style="font-size: 1.05rem; font-weight: bold;" />
                <div class="bx--form__helper-text">Cost per second (Default: 0.0143)</div>
            </div>
            <div class="bx--form-item">
                <label class="bx--label" style="font-weight: 600;">@Localizer["720p Cost (Credits / Sec)"]</label>
                <input type="number" step="0.0001" min="0" name="ModelCosts[seedance|720p]" class="bx--text-input" value="@seedanceVideo.CostPerSecond_720p" style="font-size: 1.05rem; font-weight: bold;" />
                <div class="bx--form__helper-text">Cost per second (Default: 0.0286)</div>
            </div>
        </div>

        <div style="background: #f4f4f4; padding: 1rem 1.25rem; border-radius: 4px; border-left: 4px solid #0f62fe;">
            <label class="bx--label" style="font-weight: 600; margin-bottom: 0.5rem; display: block;">@Localizer["Supported Specifications"]</label>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">16:9</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">9:16</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">Up to 3 Images</span>
            </div>
        </div>
    </div>
}
'''
    content = content.replace('    </div>\n}\n@if (toolName == "image-to-video")', '    </div>\n' + r2v_card + '\n@if (toolName == "image-to-video")', 1)

    # 5. Update image-to-video variables
    i2v_var_target = 'var grokVideo = i2vPricings.FirstOrDefault(p => p.ModelName.ToLower().Contains("grok")) ?? new NexClone.Backend.Core.Entities.ImageToVideoModelPricing { CostPerSecond_480p = 2.4m, CostPerSecond_720p = 4.5m, CostPerSecond_1080p = 8.0m };'
    i2v_var_replacement = i2v_var_target + '\n    var seedanceVideo = i2vPricings.FirstOrDefault(p => p.ModelName.ToLower().Contains("seedance")) ?? new NexClone.Backend.Core.Entities.ImageToVideoModelPricing { CostPerSecond_480p = 0.0143m, CostPerSecond_720p = 0.0286m };'
    content = content.replace(i2v_var_target, i2v_var_replacement, 1)

    # 6. Add image-to-video card at the end of the image-to-video block
    i2v_card = '''
    <!-- 3. Seedance 2.0 Mini Video Card -->
    <div style="background: #ffffff; padding: 1.75rem; border: 1px solid #e0e0e0; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f4f4f4; padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="background: #0f62fe; color: white; font-weight: bold; font-size: 0.75rem; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.5px;">CRUN AI</span>
                <h3 class="bx--type-productive-heading-03" style="margin: 0; color: #161616;">Seedance 2.0 Mini (ByteDance)</h3>
            </div>
            <span style="background: #e8f8f0; color: #198038; font-weight: 600; font-size: 0.8rem; padding: 4px 12px; border-radius: 4px; border: 1px solid #a7f0ba;">
                ● @Localizer["Cost Per Second (6s - 15s)"]
            </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
            <div class="bx--form-item">
                <label class="bx--label" style="font-weight: 600;">@Localizer["480p Cost (Credits / Sec)"]</label>
                <input type="number" step="0.0001" min="0" name="ModelCosts[seedance|480p]" class="bx--text-input" value="@seedanceVideo.CostPerSecond_480p" style="font-size: 1.05rem; font-weight: bold;" />
                <div class="bx--form__helper-text">Cost per second (Default: 0.0143)</div>
            </div>
            <div class="bx--form-item">
                <label class="bx--label" style="font-weight: 600;">@Localizer["720p Cost (Credits / Sec)"]</label>
                <input type="number" step="0.0001" min="0" name="ModelCosts[seedance|720p]" class="bx--text-input" value="@seedanceVideo.CostPerSecond_720p" style="font-size: 1.05rem; font-weight: bold;" />
                <div class="bx--form__helper-text">Cost per second (Default: 0.0286)</div>
            </div>
        </div>

        <div style="background: #f4f4f4; padding: 1rem 1.25rem; border-radius: 4px; border-left: 4px solid #0f62fe;">
            <label class="bx--label" style="font-weight: 600; margin-bottom: 0.5rem; display: block;">@Localizer["Supported Modes & Aspect Ratios"]</label>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">16:9</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">9:16</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">1:1</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">3:4</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">4:3</span>
                <span style="background: white; border: 1px solid #c6c6c6; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; color: #161616;">21:9</span>
            </div>
            <div style="font-size: 0.8rem; color: #525252;">Duration: <strong style="color: #161616;">6s to 15s</strong></div>
        </div>
    </div>
}
'''
    content = content.replace('    </div>\n}\n                        @if (toolName != "text-to-video"', '    </div>\n' + i2v_card + '\n                        @if (toolName != "text-to-video"', 1)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Modification complete.")
except Exception as e:
    print(f"Error: {e}")
