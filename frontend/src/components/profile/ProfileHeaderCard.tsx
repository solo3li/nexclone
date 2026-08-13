'use client';

import { User as UserIcon, Crown } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  user: any;
  historyCount: number;
  isRtl: boolean;
  locale: string;
}

export default function ProfileHeaderCard({ user, historyCount, isRtl, locale }: Props) {
  const t = useTranslations("Profile");

  const standardCredits = Number(user?.standardCredits || 0).toFixed(0);
  const premiumCredits = Number(user?.premiumCredits || 0).toFixed(0);

  // Status computation
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

  // Calculate days left
  let daysLeftText = "";
  if (user?.activePlan?.endDate) {
    const diffTime = new Date(user.activePlan.endDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
    if (diffTime < 0) {
      daysLeftText = diffDays <= 1 
        ? (isRtl ? "(انتهى اليوم)" : "(Expired today)") 
        : (isRtl ? `(انتهى منذ ${diffDays} أيام)` : `(Expired ${diffDays} days ago)`);
    } else {
      daysLeftText = diffDays === 0 
        ? (isRtl ? "(ينتهي اليوم)" : "(Expires today)") 
        : (isRtl ? `(متبقي ${diffDays} يوم)` : `(${diffDays} days left)`);
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 relative overflow-hidden mb-6">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-center md:items-stretch">
        
        {/* User Identity Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 flex-1 text-center sm:text-start">
          <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 rounded-full bg-white/10 overflow-hidden border-2 border-white/20 flex items-center justify-center">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user?.fullName || "Profile image"} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10 text-white/50" />
            )}
          </div>
          <div className="flex flex-col justify-center h-full py-1">
            <h2 className="text-2xl font-extrabold text-white">{user?.fullName || "User"}</h2>
            <p className="text-white/50 text-sm mt-1">{user?.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full w-fit mx-auto sm:mx-0">
              <span className={`w-2 h-2 rounded-full ${statusBg}`} />
              <span className="text-xs font-semibold text-white/80">{statusText}</span>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-white/10 self-stretch my-2" />

        {/* Plan Section */}
        <div className="flex-1 flex flex-col justify-center border-t border-white/10 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto text-center sm:text-start">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 sm:mb-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-medium text-white/60">{t('subscription.plan')}</h3>
          </div>
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mb-1">
            {user?.activePlan ? (isRtl ? user.activePlan.nameAr : user.activePlan.name) : (isRtl ? "مجاني" : "Free")}
          </p>
          <p className="text-xs text-white/50">
            {user?.activePlan?.endDate ? (
              <>
                {new Date(user.activePlan.endDate).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}
                <span className="mx-1">•</span>
                <span className={statusColor}>{daysLeftText}</span>
              </>
            ) : (isRtl ? "بدون تاريخ انتهاء" : "No expiration")}
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-white/10 self-stretch my-2" />

        {/* Usage Section */}
        <div className="flex-1 flex flex-col justify-center border-t border-white/10 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
          <h3 className="text-sm font-medium text-white/60 mb-2 sm:mb-3 text-center sm:text-start">{isRtl ? "الرصيد المتاح" : "Available Credits"}</h3>
          
          <div className="space-y-3 w-full max-w-[200px] mx-auto sm:mx-0">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{isRtl ? "عادي" : "Standard"}</span>
                <span className="text-emerald-400 font-bold">{standardCredits}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{isRtl ? "مميز" : "Premium"}</span>
                <span className="text-amber-400 font-bold">{premiumCredits}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 h-1.5 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
