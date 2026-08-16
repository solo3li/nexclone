const fs = require('fs');
const path = 'c:\\Users\\solo\\Desktop\\nexcole\\nexclone\\frontend\\app\\[locale]\\tools\\text-to-voice\\Client.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/setEstimatedCost\(1\);/g, "setEstimatedCost(Math.max((text.length * (selectedQuality === 'High' ? (user?.activePlan?.ttsCostPerCharHigh ?? 0.01) : (user?.activePlan?.ttsCostPerChar ?? 0.001))), 0.0001));");

fs.writeFileSync(path, content, 'utf8');
