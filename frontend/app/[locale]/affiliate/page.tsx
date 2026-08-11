'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useAuthStore } from '@/store/useAuthStore';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import AffiliateOverview from '@/components/affiliate/AffiliateOverview';
import AffiliateReferralLink from '@/components/affiliate/AffiliateReferralLink';
import AffiliateStatsGrid from '@/components/affiliate/AffiliateStatsGrid';
import AffiliateReferralsTable from '@/components/affiliate/AffiliateReferralsTable';
import AffiliateCommissionsTable from '@/components/affiliate/AffiliateCommissionsTable';
import AffiliateWithdrawalForm from '@/components/affiliate/AffiliateWithdrawalForm';
import AffiliatePayoutsTable from '@/components/affiliate/AffiliatePayoutsTable';

const TABS = [
  { id: 'overview',     labelEn: 'Overview',      labelAr: 'نظرة عامة' },
  { id: 'link',         labelEn: 'Referral Link',  labelAr: 'رابط الإحالة' },
  { id: 'referrals',   labelEn: 'Referrals',      labelAr: 'الإحالات' },
  { id: 'earnings',    labelEn: 'Earnings',       labelAr: 'الأرباح' },
  { id: 'withdrawals', labelEn: 'Withdrawals',    labelAr: 'السحب' },
];

export default function AffiliatePage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [activeTab, setActiveTab] = useState('overview');

  const { isAuthenticated, isInitializing } = useAuthStore();
  const {
    profile, stats, balances, referrals, commissions, payouts,
    fetchProfile, fetchStats, fetchBalances, fetchReferrals, fetchCommissions, fetchPayouts,
    isLoading
  } = useAffiliateStore();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      fetchProfile();
      fetchStats();
      fetchBalances();
      fetchReferrals();
      fetchCommissions();
      fetchPayouts();
    }
  }, [isAuthenticated, isInitializing]);

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/60">
        {isRtl ? 'يرجى تسجيل الدخول للوصول إلى لوحة الإحالة.' : 'Please log in to access your affiliate dashboard.'}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[400px] bg-violet-600/10 blur-[120px] pointer-events-none rounded-full z-0" />
      <div className="absolute bottom-0 right-0 w-[30%] h-[300px] bg-fuchsia-600/10 blur-[100px] pointer-events-none rounded-full z-0" />

      <Navbar />

      <div className="max-w-6xl mx-auto relative z-10 pt-28 pb-24 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            {isRtl ? '🤝 برنامج الإحالة' : '🤝 Affiliate Program'}
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

      <Footer />
      <MobileBottomNav />
      <div className="h-16 md:hidden" />
    </div>
  );
}
