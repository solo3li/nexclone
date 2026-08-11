'use client';

import { AffiliateCurrencyBalance } from '@/store/useAffiliateStore';

interface Props {
  balances: AffiliateCurrencyBalance[];
  isRtl: boolean;
}

const CURRENCY_CONFIG: Record<string, { symbol: string; color: string; bg: string }> = {
  USD: { symbol: '$',   color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  EGP: { symbol: 'EGP ', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
};

export default function AffiliateOverview({ balances, isRtl }: Props) {
  if (balances.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/40">
        {isRtl ? 'لا توجد أرصدة بعد. شارك رابط الإحالة لتبدأ.' : 'No balances yet. Share your referral link to get started.'}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">
        {isRtl ? 'الأرصدة' : 'Balances'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {balances.map((b) => {
          const cfg = CURRENCY_CONFIG[b.currency] ?? { symbol: '', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' };

          return (
            <div
              key={b.currency}
              className={`rounded-2xl border p-6 ${cfg.bg} backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-2xl font-black ${cfg.color}`}>{b.currency}</span>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                  {b.currency === 'USD' ? '🌎' : '🇪🇬'}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-white/40 mb-1">{isRtl ? 'متاح للسحب' : 'Available'}</div>
                  <div className={`text-3xl font-extrabold tracking-tight ${cfg.color}`}>
                    {cfg.symbol}{b.available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="text-xs text-white/40 mb-1">{isRtl ? 'في انتظار إتاحة' : 'Pending'}</div>
                  <div className="text-xl font-bold text-amber-400">
                    {cfg.symbol}{b.pending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
