'use client';

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "../../i18n/routing";

interface Props {
  user: any;
  isRtl: boolean;
  locale: string;
}

export default function ProfileSubscription({ user, isRtl, locale }: Props) {
  const t = useTranslations("Profile");
  const router = useRouter();

  // Calculate status
  const status = (user?.activePlan?.status || "Active").toLowerCase();
  let statusColor = "text-emerald-400";
  let statusBg = "bg-emerald-400";
  let statusText = isRtl ? "نشط" : "Active";
  
  if (status === "freeze") {
    statusColor = "text-amber-400";
    statusBg = "bg-amber-400";
    statusText = isRtl ? "فترة السماح" : "Grace Period";
  } else if (status === "expired") {
    statusColor = "text-rose-400";
    statusBg = "bg-rose-400";
    statusText = isRtl ? "منتهي" : "Expired";
  }

  // Calculate days left text
  let daysLeftText = "";
  if (user?.activePlan?.endDate) {
    const diffTime = new Date(user.activePlan.endDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
    if (diffTime < 0) {
      if (diffDays <= 1) daysLeftText = isRtl ? "(انتهى اليوم)" : "(Expired today)";
      else daysLeftText = isRtl ? `(انتهى منذ ${diffDays} أيام)` : `(Expired ${diffDays} days ago)`;
    } else {
      if (diffDays === 0) daysLeftText = isRtl ? "(ينتهي اليوم)" : "(Expires today)";
      else daysLeftText = isRtl ? `(متبقي ${diffDays} يوم)` : `(${diffDays} days left)`;
    }
  }

  return (
    <div className="space-y-6">
      {/* Subscription Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden max-w-3xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
            <Crown className="w-5 h-5 text-yellow-400" />
          </div>
          <h2 className="text-xl font-bold text-white">{t('subscription.title')}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-white/60">{t('subscription.plan')}</span>
            <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-full text-sm">
              {user?.activePlan ? (isRtl ? user.activePlan.nameAr : user.activePlan.name) : (isRtl ? "مجاني" : "Free")}
            </span>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-white/60">{t('subscription.status')}</span>
            <span className={`${statusColor} font-medium text-sm flex items-center gap-1`}>
              <span className={`w-2 h-2 rounded-full ${statusBg}`} /> {statusText}
            </span>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-white/60">{isRtl ? "تاريخ الانتهاء" : "Expiration Date"}</span>
            <div className="flex flex-col items-end gap-1">
              <span className="text-white font-medium text-sm">
                {user?.activePlan?.endDate 
                  ? new Date(user.activePlan.endDate).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })
                  : (isRtl ? "بدون تاريخ انتهاء (مجاني)" : "No expiration (Free)")
                }
              </span>
              {user?.activePlan?.endDate && (
                <span className="text-xs text-white/50">{daysLeftText}</span>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => router.push(`/pricing`)} 
            className="w-full py-4 mt-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white font-bold transition-colors shadow-lg shadow-violet-600/20"
          >
            {t('subscription.upgrade')}
          </button>
        </div>
      </motion.div>

      {/* Invoices Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden max-w-3xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            {isRtl ? "الفواتير الضريبية" : "Tax Invoices"}
          </h2>
        </div>
        <p className="text-white/50 text-sm mb-5 leading-relaxed">
          {isRtl
            ? "قم بتحميل وعرض فواتيرك الضريبية للاشتراكات السابقة."
            : "Download and view your tax invoices for past subscriptions."}
        </p>
        <button
          onClick={() => router.push(`/profile/invoices`)}
          className="w-full py-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {isRtl ? "عرض فواتيري" : "My Invoices"}
        </button>
      </motion.div>
    </div>
  );
}
