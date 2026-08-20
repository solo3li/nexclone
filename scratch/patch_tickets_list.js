const fs = require('fs');
const file = 'frontend/app/[locale]/profile/tickets/Client.tsx';
let content = fs.readFileSync(file, 'utf8');

// Container padding
content = content.replace(
  /className="bg-white\/5 border border-white\/10 p-8 rounded-3xl"/g,
  'className="bg-white/5 border border-white/10 p-4 sm:p-8 rounded-2xl sm:rounded-3xl"'
);

// Header flex
content = content.replace(
  /className="flex justify-between items-center mb-8"/g,
  'className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8"'
);

// Ticket item container
content = content.replace(
  /className="bg-white\/5 border border-white\/10 rounded-2xl p-6 hover:border-violet-500\/50 transition-colors flex justify-between items-center"/g,
  'className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-violet-500/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"'
);

// Ticket item status column
content = content.replace(
  /className="flex flex-col items-end gap-2"/g,
  'className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0"'
);

fs.writeFileSync(file, content);
console.log('Patched');
