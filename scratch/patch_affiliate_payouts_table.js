const fs = require('fs');
const file = 'frontend/src/components/affiliate/AffiliatePayoutsTable.tsx';
let content = fs.readFileSync(file, 'utf8');

const originalLink = `{p.transferReceiptUrl && (
                        <div className="mt-2">
                          <a href={p.transferReceiptUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">
                            {isRtl ? 'عرض الإيصال' : 'View Receipt'}
                          </a>
                        </div>
                      )}`;

const replacementImage = `{p.transferReceiptUrl && (
                        <div className="mt-3 flex justify-center">
                          <a href={p.transferReceiptUrl} target="_blank" rel="noreferrer" className="block w-24 h-24 overflow-hidden rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors group relative">
                            <img src={p.transferReceiptUrl} alt="Receipt" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-[10px] font-bold">Zoom</span>
                            </div>
                          </a>
                        </div>
                      )}`;

content = content.replace(originalLink, replacementImage);
fs.writeFileSync(file, content);
console.log('Patched AffiliatePayoutsTable.tsx');
