const fs = require('fs');
const glob = require('glob'); // Not using glob, just hardcoded paths

const files = [
  'frontend/app/[locale]/tools/text-to-image/Client.tsx',
  'frontend/app/[locale]/tools/image-to-video/Client.tsx',
  'frontend/app/[locale]/tools/text-to-video/Client.tsx',
  'frontend/app/[locale]/tools/motion-control/Client.tsx',
  'frontend/app/[locale]/tools/reference-to-video/Client.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`Not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // Remove the function block
  const functionRegex = /[ \t]*\/\/[^\n]*AI Prompt Enhancer Action[^\n]*\n[ \t]*const handleEnhancePrompt = \(\) => {[\s\S]*?  };\n/g;
  content = content.replace(functionRegex, '');

  // Remove the button block
  const buttonRegex = /[ \t]*<button[^>]*onClick=\{handleEnhancePrompt\}[^>]*>[\s\S]*?<\/button>\n/g;
  content = content.replace(buttonRegex, '');

  fs.writeFileSync(file, content);
  console.log(`Processed ${file}`);
});
