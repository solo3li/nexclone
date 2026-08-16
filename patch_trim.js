const fs = require('fs');
const path = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\API\\Controllers\\Admin\\ToolConfigAdminController.cs';
let content = fs.readFileSync(path, 'utf8');

const regex = /var setting = await _context\.AppSettings\.FirstOrDefaultAsync\(s => s\.Key == settingKey\);/;
const replacement = `config.ToolName = config.ToolName?.Trim();
                    string settingKey2 = $"Concurrency_{config.ToolName}";
                    var setting = await _context.AppSettings.FirstOrDefaultAsync(s => s.Key == settingKey2);
                    settingKey = settingKey2;`;

if (!content.includes('config.ToolName?.Trim()')) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log("Patched");
}
