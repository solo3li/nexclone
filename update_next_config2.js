const fs = require('fs');
const file = '/root/nexmedia/nexclone/frontend/next.config.mjs';
let content = fs.readFileSync(file, 'utf8');
const replacement = `beforeFiles: [
        {
          source: '/nexmedia-files-zyavomezs0/:path*',
          destination: 'http://minio:9001/nexmedia-files-zyavomezs0/:path*',
        },
        {
          source: '/nexmedia/:path*',
          destination: 'http://minio:9001/nexmedia/:path*',
        },`;
content = content.replace('beforeFiles: [', replacement);
fs.writeFileSync(file, content);
