'use client';

import { AffiliateReferral } from '@/store/useAffiliateStore';

interface Props {
  referrals: AffiliateReferral[];
  isRtl: boolean;
}

export default function AffiliateReferralsTable({ referrals, isRtl }: Props) {
  if (referrals.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/40">
        {isRtl ? 'لا توجد إحالات بعد.' : 'No referrals yet. Share your link to start earning.'}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">
        {isRtl ? 'الإحالات' : 'Referrals'}
        <span className="ml-2 text-sm text-white/30 font-normal">({referrals.length})</span>
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-white/50 font-medium">{isRtl ? 'المستخدم' : 'User'}</th>
                <th className="px-6 py-4 text-left text-white/50 font-medium">{isRtl ? 'تاريخ الانضمام' : 'Joined'}</th>
                <th className="px-6 py-4 text-center text-white/50 font-medium">{isRtl ? 'الاشتراك النشط' : 'Active Plan'}</th>
                <th className="px-6 py-4 text-center text-white/50 font-medium">{isRtl ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.referralId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">
                      {r.referredUser?.name || r.referredUser?.email || '—'}
                    </div>
                    {r.referredUser?.email && r.referredUser?.name && (
                      <div className="text-xs text-white/30">{r.referredUser.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/50 text-xs">
                    {new Date(r.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {r.activeSubscription ? (
                      <span className="text-emerald-400 font-medium">{r.activeSubscription.planName}</span>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {r.hasConverted ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                        {isRtl ? 'مُحوَّل' : 'Converted'}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/20">
                        {isRtl ? 'مسجّل' : 'Signed Up'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
