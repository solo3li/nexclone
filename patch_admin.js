const fs = require('fs');
const path = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\API\\Controllers\\Admin\\ToolConfigAdminController.cs';
let content = fs.readFileSync(path, 'utf8');

const regex = /existing\.UpdatedAt = DateTime\.UtcNow;\s*_context\.ToolRoutingRules\.RemoveRange\(existing\.RoutingRules\);/;
const replacement = `existing.UpdatedAt = DateTime.UtcNow;

                    if (ModelCosts != null && ModelCosts.Any())
                    {
                        existing.AdditionalSettings = config.AdditionalSettings;
                    }

                    _context.ToolRoutingRules.RemoveRange(existing.RoutingRules);`;

if (!content.includes('existing.AdditionalSettings = config.AdditionalSettings;')) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Patched!");
} else {
    console.log("Already patched.");
}
