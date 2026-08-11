'use client';

import { AffiliatePayout } from '@/store/useAffiliateStore';

interface Props {
  payouts: AffiliatePayout[];
  isRtl: boolean;
}

export default function AffiliatePayoutsTable({ payouts, isRtl }: Props) {
  if (payouts.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-white mb-5">
        {isRtl ? 'سجل السحوبات' : 'Withdrawal History'}
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-white/50 font-medium">{isRtl ? 'تاريخ الطلب' : 'Date'}</th>
                <th className="px-6 py-4 text-left text-white/50 font-medium">{isRtl ? 'المبلغ' : 'Amount'}</th>
                <th className="px-6 py-4 text-left text-white/50 font-medium">{isRtl ? 'الطريقة' : 'Method'}</th>
                <th className="px-6 py-4 text-center text-white/50 font-medium">{isRtl ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => {
                let statusColor = 'text-white/50 border-white/10 bg-white/5';
                if (p.status === 'PENDING') statusColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';
                if (p.status === 'APPROVED') statusColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
                if (p.status === 'PROCESSING') statusColor = 'text-blue-400 border-blue-500/20 bg-blue-500/10';
                if (p.status === 'PAID') statusColor = 'text-green-400 border-green-500/20 bg-green-500/10';
                if (p.status === 'REJECTED' || p.status === 'FAILED') statusColor = 'text-red-400 border-red-500/20 bg-red-500/10';

                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/50 text-xs">
                      {new Date(p.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {p.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal opacity-50">{p.currency}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/80 font-medium">{p.payoutMethod}</div>
                      <div className="text-white/40 text-xs mt-1 truncate max-w-[200px]">{p.payoutAccount}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${statusColor}`}>
                        <span>{p.status}</span>
                      </div>
                      {p.rejectionReason && (
                        <div className="text-[10px] text-red-400/80 mt-1 max-w-[200px] mx-auto leading-tight">
                          {p.rejectionReason}
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
