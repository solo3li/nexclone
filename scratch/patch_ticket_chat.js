const fs = require('fs');
const file = 'frontend/app/[locale]/profile/tickets/[id]/Client.tsx';
let content = fs.readFileSync(file, 'utf8');

// Container padding
content = content.replace(
  /className="bg-white\/5 border border-white\/10 p-6 md:p-8 rounded-3xl flex flex-col h-\[calc\(100vh-200px\)\] min-h-\[500px\] w-full"/g,
  'className="bg-white/5 border border-white/10 p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl flex flex-col h-[calc(100vh-200px)] min-h-[500px] w-full"'
);

// Chat bubble width
content = content.replace(
  /max-w-\[80%\] rounded-2xl p-4/g,
  'max-w-[90%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4'
);

// Input container
content = content.replace(
  /className="flex items-center gap-3"/g,
  'className="flex items-center gap-2 sm:gap-3"'
);

// Send button
content = content.replace(
  /className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl transition-colors text-sm font-semibold"/g,
  'className="px-4 sm:px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl transition-colors text-sm font-semibold"'
);

fs.writeFileSync(file, content);
console.log('Patched chat');
