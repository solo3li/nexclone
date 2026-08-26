'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import AffiliateOverview from '@/components/affiliate/AffiliateOverview';
import AffiliateReferralLink from '@/components/affiliate/AffiliateReferralLink';
import AffiliateStatsGrid from '@/components/affiliate/AffiliateStatsGrid';
import AffiliateReferralsTable from '@/components/affiliate/AffiliateReferralsTable';
import AffiliateCommissionsTable from '@/components/affiliate/AffiliateCommissionsTable';
import AffiliateWithdrawalForm from '@/components/affiliate/AffiliateWithdrawalForm';
import AffiliatePayoutsTable from '@/components/affiliate/AffiliatePayoutsTable';

const TABS = [
  { id: 'overview',    labelEn: 'Overview',      labelAr: 'نظرة عامة' },
  { id: 'link',        labelEn: 'Referral Link', labelAr: 'رابط الإحالة' },
  { id: 'referrals',   labelEn: 'Referrals',     labelAr: 'الإحالات' },
  { id: 'earnings',    labelEn: 'Earnings',      labelAr: 'الأرباح' },
  { id: 'withdrawals', labelEn: 'Withdrawals',   labelAr: 'السحب' },
];

export default function AffiliateDashboard() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [activeTab, setActiveTab] = useState('overview');

  const {
    profile, stats, balances, referrals, commissions, payouts,
  } = useAffiliateStore();

  return (
    <div className="max-w-6xl mx-auto relative z-10 pt-36 md:pt-40 pb-24 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
          {isRtl ? '💰 أرباحي' : '💰 My Earnings'}
        </h1>

        {profile && (
          <p className="text-white/40 mt-2 text-sm">
            {isRtl ? 'معرفك:' : 'Your ID:'} <span className="text-violet-400 font-mono">{profile.affiliateDisplayId}</span>
          </p>
        )}
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 bg-white/5 rounded-2xl p-1 overflow-x-auto border border-white/10 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            {isRtl ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <AffiliateOverview balances={balances} isRtl={isRtl} />
              {stats && <AffiliateStatsGrid stats={stats} isRtl={isRtl} />}
            </div>
          )}

          {activeTab === 'link' && profile && (
            <AffiliateReferralLink profile={profile} isRtl={isRtl} />
          )}

          {activeTab === 'referrals' && (
            <AffiliateReferralsTable referrals={referrals} isRtl={isRtl} />
          )}

          {activeTab === 'earnings' && (
            <AffiliateCommissionsTable commissions={commissions} isRtl={isRtl} />
          )}

          {activeTab === 'withdrawals' && (
            <div className="space-y-8">
              <AffiliateWithdrawalForm balances={balances} isRtl={isRtl} />
              <AffiliatePayoutsTable payouts={payouts} isRtl={isRtl} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
