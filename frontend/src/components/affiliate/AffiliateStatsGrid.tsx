'use client';

import { AffiliateStats } from '@/store/useAffiliateStore';

interface Props {
  stats: AffiliateStats;
  isRtl: boolean;
}

export default function AffiliateStatsGrid({ stats, isRtl }: Props) {
  const items = [
    { icon: '👆', labelEn: 'Total Clicks',         labelAr: 'إجمالي النقرات',       value: stats.totalClicks.toLocaleString(),       color: 'text-blue-400' },
    { icon: '👤', labelEn: 'Signups',               labelAr: 'التسجيلات',             value: stats.totalSignups.toLocaleString(),      color: 'text-violet-400' },
    { icon: '💳', labelEn: 'Paid Customers',        labelAr: 'عملاء مدفوعون',         value: stats.paidCustomers.toLocaleString(),     color: 'text-emerald-400' },
    { icon: '📦', labelEn: 'Active Subscriptions',  labelAr: 'اشتراكات نشطة',        value: stats.activeSubscriptions.toLocaleString(), color: 'text-fuchsia-400' },
    { icon: '📊', labelEn: 'Conversion Rate',       labelAr: 'معدل التحويل',          value: `${stats.conversionRate}%`,              color: 'text-amber-400' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">
        {isRtl ? 'إحصائيات الأداء' : 'Performance Stats'}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.map((item) => (
          <div
            key={item.labelEn}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:border-white/20 transition-colors"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className={`text-2xl font-black ${item.color} mb-1`}>{item.value}</div>
            <div className="text-xs text-white/40">{isRtl ? item.labelAr : item.labelEn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
