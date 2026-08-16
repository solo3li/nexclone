const fs = require('fs');
const path = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\API\\Controllers\\Admin\\ToolConfigAdminController.cs';
let content = fs.readFileSync(path, 'utf8');

const regex = /foreach\s*\(\s*var\s*kvp\s*in\s*ModelCosts\s*\)\s*\{[\s\S]*?settingsDict\[modelName\]\s*=\s*new[\s\S]*?\}\s*\}/;

const replacement = `foreach (var kvp in ModelCosts)
                    {
                        var rawKey = kvp.Key;
                        var cost = kvp.Value;
                        
                        var parts = rawKey.Split('|');
                        var modelName = parts[0];
                        var res = parts.Length > 1 ? parts[1].ToLower() : "default";

                        bool isPerSec = isVideo; // Default behavior
                        if (ModelIsPerSecond != null && ModelIsPerSecond.ContainsKey(rawKey))
                        {
                            isPerSec = ModelIsPerSecond[rawKey];
                        }

                        if (!settingsDict.ContainsKey(modelName))
                        {
                            settingsDict[modelName] = new
                            {
                                IsPerSecond = isPerSec,
                                BaseCost = 0m,
                                CostPerSecond = new System.Collections.Generic.Dictionary<string, decimal>(),
                                FixedCost = new System.Collections.Generic.Dictionary<string, decimal>()
                            };
                        }

                        // Use dynamic mapping to update the nested dictionary
                        var mConfig = (dynamic)settingsDict[modelName];
                        if (isPerSec)
                        {
                            mConfig.CostPerSecond[res] = cost;
                        }
                        else
                        {
                            mConfig.FixedCost[res] = cost;
                        }
                    }`;

if (content.includes("foreach (var kvp in ModelCosts)")) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Patched ModelCosts loop");
}
