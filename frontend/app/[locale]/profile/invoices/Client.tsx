'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '../../../../src/store/useAppStore';
import { useHistoryStore } from '../../../../src/store/useHistoryStore';
import { Download, FileText, ArrowLeft, ArrowRight, Crown, Activity, Lock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';


export default function MyInvoicesPage() {
  const { locale } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isInitializing } = useAppStore();
  const { fetchHistory, fetchInvoices, invoices, isLoading } = useHistoryStore();
  const [historyCount, setHistoryCount] = useState(0);

  const isRtl = locale === 'ar';

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated) {
          const history = await fetchHistory();
          setHistoryCount(history.length);
          await fetchInvoices();
        }
      } catch (err) {}
    };
    loadData();
  }, [isAuthenticated, fetchHistory, fetchInvoices]);

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen bg-[#0A0A0A]">
         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center py-20">
         <div className="text-center p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl max-w-md w-full relative overflow-hidden">
            <div className="w-20 h-20 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-white/10 shadow-xl">
               <Lock className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{isRtl ? "سجل الدخول للمتابعة" : "Login to continue"}</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button onClick={() => router.push(`/${locale}/login`)} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all w-full">{isRtl ? "تسجيل الدخول" : "Login"}</button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-6 lg:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={() => router.push(`/${locale}/profile`)}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          {isRtl ? "العودة للملف الشخصي" : "Back to Profile"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Subscriptions & Usage */}
          <div className="lg:col-span-1 space-y-6">
            {/* Subscription Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent blur-2xl" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{isRtl ? "اشتراكي الحالي" : "My Subscription"}</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-white/60">{isRtl ? "الباقة" : "Plan"}</span>
                  <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-full text-sm">
                    {user?.activePlan ? (isRtl ? user.activePlan.nameAr : user.activePlan.name) : (isRtl ? "مجاني" : "Free")}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-white/60">{isRtl ? "الحالة" : "Status"}</span>
                  {(() => {
                    const status = (user?.activePlan?.status || "Active").toLowerCase();
                    let color = "text-emerald-400";
                    let bgColor = "bg-emerald-400";
                    let text = isRtl ? "نشط" : "Active";
                    
                    if (status === "freeze") {
                      color = "text-amber-400";
                      bgColor = "bg-amber-400";
                      text = isRtl ? "فترة السماح" : "Grace Period";
                    } else if (status === "expired") {
                      color = "text-rose-400";
                      bgColor = "bg-rose-400";
                      text = isRtl ? "منتهي" : "Expired";
                    }

                    return (
                      <span className={`${color} font-medium text-sm flex items-center gap-1`}>
                        <span className={`w-2 h-2 rounded-full ${bgColor}`} /> {text}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-white/60">{isRtl ? "تاريخ الانتهاء" : "Expiration Date"}</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-white font-medium text-sm">
                      {user?.activePlan?.endDate 
                        ? new Date(user.activePlan.endDate).toLocaleDateString(isRtl ? "ar-EG" : "en-US")
                        : (isRtl ? "بدون تاريخ انتهاء" : "No expiration")}
                    </span>
                  </div>
                </div>
                <button onClick={() => router.push(`/${locale}/pricing`)} className="w-full py-3 mt-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all hover:border-white/20">
                  {isRtl ? "ترقية الباقة" : "Upgrade Plan"}
                </button>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Activity className="w-5 h-5 text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{isRtl ? "الاستخدام" : "Usage"}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-white">{historyCount}</p>
                  <p className="text-xs text-white/50 mt-1">{isRtl ? "إجمالي العمليات" : "Total Operations"}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-emerald-400">
                    {Number(user?.standardCredits || 0).toFixed(0)} <span className="text-sm text-amber-400">/ {Number(user?.premiumCredits || 0).toFixed(0)}</span>
                  </p>
                  <p className="text-xs text-white/50 mt-1">{isRtl ? "الرصيد العادي / المميز" : "Standard / Premium Credits"}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Invoices */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {isRtl ? "فواتيري الضريبية" : "My Tax Invoices"}
                  </h1>
                  <p className="text-white/50 mt-1">
                    {isRtl ? "قائمة بجميع فواتير الاشتراكات الخاصة بك" : "A list of all your subscription invoices"}
                  </p>
                </div>
              </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">
                {isRtl ? "لا توجد فواتير حالياً." : "No invoices found."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={invoice.invoiceNumber}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{invoice.invoiceNumber}</h3>
                      <p className="text-white/50 text-sm mt-1">
                        {new Date(invoice.date).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')} • {invoice.planName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-indigo-400">
                        {invoice.totalAmount} {invoice.currency === 'EGP' ? (isRtl ? 'ج.م' : 'EGP') : invoice.currency}
                      </p>
                    </div>
                    {invoice.minioPdfUrl && (
                      <a
                        href={invoice.minioPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                      >
                        <Download size={18} />
                        <span className="hidden sm:inline">{isRtl ? "تحميل PDF" : "Download PDF"}</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
