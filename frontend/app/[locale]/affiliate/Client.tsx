'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useAppStore } from '@/store/useAppStore';
import { useAffiliateStore } from '@/store/useAffiliateStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import AffiliateDashboard from '@/components/affiliate/AffiliateDashboard';

export default function AffiliatePage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();

  // useAppStore — the single source of truth for auth state in this app
  const { user, isAuthenticated, isInitializing } = useAppStore();
  const {
    fetchProfile, fetchStats, fetchBalances, fetchReferrals, fetchCommissions, fetchPayouts,
    isLoading,
  } = useAffiliateStore();

  useEffect(() => {
    if (!isInitializing && isAuthenticated && user?.isAffiliate) {
      fetchProfile();
      fetchStats();
      fetchBalances();
      fetchReferrals();
      fetchCommissions();
      fetchPayouts();
    }
  }, [isAuthenticated, isInitializing, user?.isAffiliate]);

  useEffect(() => {
    // Not-joined (or stale-flagged) users belong on the marketing/join page.
    if (!isInitializing && isAuthenticated && !user?.isAffiliate) {
      router.replace('/affiliate-program');
    }
  }, [isAuthenticated, isInitializing, user?.isAffiliate, router]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[400px] bg-violet-600/10 blur-[120px] pointer-events-none rounded-full z-0" />
      <div className="absolute bottom-0 right-0 w-[30%] h-[300px] bg-fuchsia-600/10 blur-[100px] pointer-events-none rounded-full z-0" />

      <Navbar />

      {isInitializing || (isLoading && !user?.isAffiliate) ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500" />
        </div>
      ) : !isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center text-white/60">
          {isRtl ? 'يرجى تسجيل الدخول للوصول إلى لوحة الأرباح.' : 'Please log in to access your earnings dashboard.'}
        </div>
      ) : user?.isAffiliate ? (
        <AffiliateDashboard />
      ) : null}

      <Footer />
      <MobileBottomNav />
      <div className="h-16 md:hidden" />
    </div>
  );
}
