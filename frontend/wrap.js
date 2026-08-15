const fs = require('fs');
const path = require('path');

const files = [
  'app/[locale]/affiliate/page.tsx',
  'app/[locale]/complete-profile/page.tsx',
  'app/[locale]/forgot-password/page.tsx',
  'app/[locale]/free-trial/page.tsx',
  'app/[locale]/history/[id]/page.tsx',
  'app/[locale]/history/page.tsx',
  'app/[locale]/login/page.tsx',
  'app/[locale]/payment/success/page.tsx',
  'app/[locale]/privacy/page.tsx',
  'app/[locale]/profile/history/[id]/page.tsx',
  'app/[locale]/profile/invoices/page.tsx',
  'app/[locale]/profile/page.tsx',
  'app/[locale]/profile/tickets/[id]/page.tsx',
  'app/[locale]/profile/tickets/page.tsx',
  'app/[locale]/register/page.tsx',
  'app/[locale]/reset-password/page.tsx',
  'app/[locale]/support/page.tsx',
  'app/[locale]/tools/page.tsx',
  'app/[locale]/tools/reference-to-video/page.tsx',
  'app/[locale]/tools/text-to-image/page.tsx',
  'app/[locale]/verify-email/page.tsx',
  'app/[locale]/verify-invoice/[token]/page.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    const dir = path.dirname(file);
    const clientPath = path.join(dir, 'Client.tsx');
    if (!fs.existsSync(clientPath)) {
      fs.renameSync(file, clientPath);
    }
    const pageContent = import Client from './Client';\nexport default async function Page({ params }: { params: Promise<any> }) {\n  return <Client params={params} />;\n};
    fs.writeFileSync(file, pageContent, 'utf8');
  }
}
console.log('Done wrapping pages.');
