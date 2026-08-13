"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useAuthStore } from "../../../src/store/useAuthStore";
import { useProfileStore } from "../../../src/store/useProfileStore";
import { useHistoryStore } from "../../../src/store/useHistoryStore";

// Components
import ProfileHeaderCard from "../../../src/components/profile/ProfileHeaderCard";
import ProfileOverview from "../../../src/components/profile/ProfileOverview";
import ProfileSettings from "../../../src/components/profile/ProfileSettings";
import ProfileSubscription from "../../../src/components/profile/ProfileSubscription";
import ProfileHistory from "../../../src/components/profile/ProfileHistory";
import ProfileSupport from "../../../src/components/profile/ProfileSupport";

const TABS = [
  { id: 'overview',     labelEn: 'Overview',           labelAr: 'نظرة عامة' },
  { id: 'history',      labelEn: 'History',            labelAr: 'سجل العمليات' },
  { id: 'subscription', labelEn: 'Subscription',       labelAr: 'الاشتراكات' },
  { id: 'support',      labelEn: 'Support',            labelAr: 'الدعم' },
  { id: 'settings',     labelEn: 'Account Settings',   labelAr: 'إعدادات الحساب' },
];

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  
  const { user, isAuthenticated, isInitializing } = useAuthStore();
  const { updateProfile, changePassword } = useProfileStore();
  const { fetchHistory } = useHistoryStore();
  
  const [historyCount, setHistoryCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setIsReady(true);
  }, [user]);

  useEffect(() => {
    const getHistoryCount = async () => {
      if (!user) return;
      try {
        const history = await fetchHistory();
        setHistoryCount(history.length);
      } catch (err) {
        console.error("Failed to fetch history count:", err);
      }
    };
    if (isReady) {
      getHistoryCount();
    }
  }, [user, isReady, fetchHistory]);


  if (isInitializing || !isReady) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]" aria-busy="true" aria-label="Loading profile">
         <Loader2 className="w-10 h-10 animate-spin text-fuchsia-500" />
      </div>
    );
  }

  if (isReady && !isAuthenticated && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
         <div className="text-center p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl max-w-md w-full relative overflow-hidden">
            <div className="w-20 h-20 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-white/10 shadow-xl">
               <Lock className="w-10 h-10 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{isRtl ? "سجل الدخول للمتابعة" : "Login to continue"}</h2>
            <p className="text-white/60 mb-8">{isRtl ? "يجب عليك تسجيل الدخول أو إنشاء حساب جديد للوصول إلى هذه الصفحة." : "You need to login or create a new account to access this page."}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button onClick={() => router.push(`/${locale}/login`)} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all w-full">{isRtl ? "تسجيل الدخول" : "Login"}</button>
               <button onClick={() => router.push(`/${locale}/register`)} className="px-6 py-3 bg-white text-[#0a0015] hover:bg-white/90 rounded-xl font-bold transition-all w-full">{isRtl ? "انضم الآن" : "Join Now"}</button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-2 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">{t('title')}</h1>
      </motion.div>

      {/* Header Banner Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <ProfileHeaderCard 
          user={user} 
          historyCount={historyCount} 
          isRtl={isRtl} 
          locale={locale} 
        />
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-1 bg-white/5 rounded-2xl p-1 overflow-x-auto border border-white/10 w-full no-scrollbar"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            {isRtl ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </motion.div>

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
            <ProfileOverview user={user} historyCount={historyCount} isRtl={isRtl} />
          )}

          {activeTab === 'history' && (
            <ProfileHistory isRtl={isRtl} locale={locale} />
          )}

          {activeTab === 'subscription' && (
            <ProfileSubscription user={user} isRtl={isRtl} locale={locale} />
          )}

          {activeTab === 'support' && (
            <ProfileSupport isRtl={isRtl} locale={locale} />
          )}

          {activeTab === 'settings' && (
            <ProfileSettings 
              user={user} 
              isRtl={isRtl} 
              updateProfile={updateProfile} 
              changePassword={changePassword} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
