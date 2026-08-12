'use client';

import { motion } from "framer-motion";
import { Activity, Clock, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";

interface Props {
  user: any;
  historyCount: number;
  isRtl: boolean;
}

export default function ProfileOverview({ user, historyCount, isRtl }: Props) {
  const t = useTranslations("Profile");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
            <Activity className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white">{t('usage.title')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-black/40 rounded-2xl p-5 border border-white/5 flex flex-col justify-center items-center">
            <Clock className="w-6 h-6 text-indigo-400 mb-2" />
            <p className="text-3xl font-extrabold text-white">{historyCount}</p>
            <p className="text-xs text-white/50 mt-1">{isRtl ? "إجمالي العمليات" : "Total Operations"}</p>
          </div>
          
          <div className="bg-black/40 rounded-2xl p-5 border border-white/5 flex flex-col justify-center items-center">
            <Zap className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-3xl font-extrabold text-emerald-400">
              {Number(user?.standardCredits || 0).toFixed(0)}
            </p>
            <p className="text-xs text-white/50 mt-1">{isRtl ? "الرصيد العادي" : "Standard Credits"}</p>
          </div>

          <div className="bg-black/40 rounded-2xl p-5 border border-white/5 flex flex-col justify-center items-center">
            <Zap className="w-6 h-6 text-amber-400 mb-2" />
            <p className="text-3xl font-extrabold text-amber-400">
              {Number(user?.premiumCredits || 0).toFixed(0)}
            </p>
            <p className="text-xs text-white/50 mt-1">{isRtl ? "الرصيد المميز" : "Premium Credits"}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Link 
          href="/pricing"
          className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-white mb-1">{isRtl ? "ترقية الباقة" : "Upgrade Plan"}</h3>
            <p className="text-xs text-white/50">{isRtl ? "اكتشف مميزات الباقات المتقدمة" : "Explore advanced plan features"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white transform group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? "rotate-180" : ""}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </Link>
        <Link 
          href="/affiliate"
          className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-white mb-1">{isRtl ? "نظام الإحالة" : "Affiliate System"}</h3>
            <p className="text-xs text-white/50">{isRtl ? "اربح العمولات من دعوة أصدقائك" : "Earn commissions by inviting friends"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white transform group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? "rotate-180" : ""}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
