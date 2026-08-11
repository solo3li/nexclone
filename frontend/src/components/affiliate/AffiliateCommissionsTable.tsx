'use client';

import { AffiliateCommission } from '@/store/useAffiliateStore';
import { useEffect, useState } from 'react';

interface Props {
  commissions: AffiliateCommission[];
  isRtl: boolean;
}

export default function AffiliateCommissionsTable({ commissions, isRtl }: Props) {
  const [now, setNow] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (commissions.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/40">
        {isRtl ? 'لا توجد أرباح بعد.' : 'No earnings yet.'}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">
        {isRtl ? 'الأرباح' : 'Earnings'}
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-white/50 font-medium">{isRtl ? 'تاريخ' : 'Date'}</th>
                <th className="px-6 py-4 text-left text-white/50 font-medium">{isRtl ? 'النوع' : 'Type'}</th>
                <th className="px-6 py-4 text-left text-white/50 font-medium">{isRtl ? 'العميل' : 'Customer'}</th>
                <th className="px-6 py-4 text-center text-white/50 font-medium">{isRtl ? 'الخطة' : 'Plan'}</th>
                <th className="px-6 py-4 text-right text-white/50 font-medium">{isRtl ? 'العمولة' : 'Commission'}</th>
                <th className="px-6 py-4 text-center text-white/50 font-medium">{isRtl ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => {
                const isReversal = c.type === 'REVERSAL';
                const isPending = c.status === 'PENDING';
                
                let statusColor = 'text-white/50 border-white/10 bg-white/5';
                if (c.status === 'PENDING') statusColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';
                if (c.status === 'AVAILABLE') statusColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
                if (c.status === 'PAID') statusColor = 'text-blue-400 border-blue-500/20 bg-blue-500/10';
                if (c.status === 'CANCELLED' || c.status === 'REVERSED') statusColor = 'text-red-400 border-red-500/20 bg-red-500/10';

                let daysLeft = 0;
                if (isPending) {
                  const availDate = new Date(c.availableAt).getTime();
                  daysLeft = Math.ceil((availDate - now) / (1000 * 60 * 60 * 24));
                }

                return (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/50 text-xs">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-white/60">
                        {c.type === 'FIRST_PURCHASE' && (isRtl ? 'أول شراء' : 'First Purchase')}
                        {c.type === 'RECURRING' && (isRtl ? 'تجديد' : 'Recurring')}
                        {c.type === 'REVERSAL' && (isRtl ? 'مرتجع' : 'Reversal')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {c.customerName}
                    </td>
                    <td className="px-6 py-4 text-center text-white/70">
                      {isRtl ? c.plan.nameAr : c.plan.name}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${isReversal ? 'text-red-400' : 'text-emerald-400'}`}>
                      {c.amount > 0 ? '+' : ''}{c.amount} <span className="text-xs font-normal opacity-50">{c.currency}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${statusColor}`}>
                        <span>{c.status}</span>
                      </div>
                      {isPending && daysLeft > 0 && (
                        <div className="text-[10px] text-amber-400/60 mt-1">
                          {isRtl ? `متاح بعد ${daysLeft} أيام` : `Available in ${daysLeft}d`}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
