using System;
using System.IO;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        string path = @"c:\Users\solo\Desktop\nexcole\nexclone\NexClone.Backend\Views\ToolConfigAdmin\Edit.cshtml";
        string content = File.ReadAllText(path);

        string regexPattern = @"(?s)// Try to parse existing prices from config\.AdditionalSettings\s+var currentPrices = new Dictionary<string, decimal>\(\);\s+var currentPerSec = new Dictionary<string, bool>\(\);\s+if \(!string\.IsNullOrEmpty\(config\.AdditionalSettings\)\)\s+\{\s+try \{\s+var jDoc = System\.Text\.Json\.JsonDocument\.Parse\(config\.AdditionalSettings\);\s+foreach \(var prop in jDoc\.RootElement\.EnumerateObject\(\)\)\s+\{\s+var mConfig = prop\.Value;\s+if \(mConfig\.TryGetProperty\("IsPerSecond", out var isPerSecProp\) && isPerSecProp\.GetBoolean\(\)\)\s+\{\s+currentPerSec\[prop\.Name\] = true;\s+if \(mConfig\.TryGetProperty\("CostPerSecond", out var cps\) && cps\.TryGetProperty\("default", out var cpsVal\)\)\s+currentPrices\[prop\.Name\] = cpsVal\.GetDecimal\(\);\s+\}\s+else\s+\{\s+currentPerSec\[prop\.Name\] = false;\s+if \(mConfig\.TryGetProperty\("FixedCost", out var fc\) && fc\.TryGetProperty\("default", out var fcVal\)\)\s+currentPrices\[prop\.Name\] = fcVal\.GetDecimal\(\);\s+\}\s+\}\s+\} catch \{\}\s+\}";

        var match = Regex.Match(content, regexPattern);
        if (match.Success)
        {
            string block = match.Value;
            content = content.Remove(match.Index, match.Length);

            string target1 = "@if (toolName == "text-to-video";
            int pos = content.IndexOf(target1);
            
            string toInsert = "@{
" + block + "
}
" + target1;
            content = content.Insert(pos, toInsert);
            content = content.Remove(pos + toInsert.Length, target1.Length);
        }

        string flatRateBlock = @"
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
";

        string target2 = "@if (toolName != "text-to-video" && toolName != "image-to-video" && toolName != "reference-to-video" && toolName != "text-to-image" && toolName != "advanced-lip-sync")\r\n                        {\r\n                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">";
        
        // fix target2 if line endings are different
        string target2Pattern = @"(?s)@if \(toolName != "text-to-video" && toolName != "image-to-video" && toolName != "reference-to-video" && toolName != "text-to-image" && toolName != "advanced-lip-sync"\)\s*\{\s*<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">";
        var match2 = Regex.Match(content, target2Pattern);
        if (match2.Success)
        {
            content = content.Insert(match2.Index, flatRateBlock);
        }

        File.WriteAllText(path, content);
    }
}
