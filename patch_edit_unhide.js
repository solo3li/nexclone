const fs = require('fs');
const path = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\NexClone.Backend\\Views\\ToolConfigAdmin\\Edit.cshtml';
let content = fs.readFileSync(path, 'utf8');

let count = 0;
content = content.replace(/@if\s*\(toolName\s*!=\s*"text-to-video"\s*&&\s*toolName\s*!=\s*"image-to-video"\s*&&\s*toolName\s*!=\s*"reference-to-video"\s*&&\s*toolName\s*!=\s*"text-to-image"\s*&&\s*toolName\s*!=\s*"advanced-lip-sync"\)/g, (match) => {
    count++;
    if (count === 2) {
        return "@if (true)";
    }
    return match;
});

fs.writeFileSync(path, content, 'utf8');
