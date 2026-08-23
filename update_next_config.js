const fs = require('fs');
const file = '/root/nexmedia/nexclone/frontend/next.config.mjs';
let content = fs.readFileSync(file, 'utf8');
const replacement = `beforeFiles: [
        {
          source: '/mediaoss/:path*',
          destination: 'https://tempfile.mediaoss.bar/:path*',
        },`;
content = content.replace('beforeFiles: [', replacement);
fs.writeFileSync(file, content);
