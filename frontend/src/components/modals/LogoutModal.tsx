'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, Monitor, MonitorOff, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useAppStore } from '../../store/useAppStore';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';

export default function LogoutModal() {
  const { isLogoutModalOpen, setLogoutModalOpen, logout, logoutAll } = useAppStore();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  if (!isLogoutModalOpen) return null;

  const handleClose = () => {
    if (isLoggingOut || isLoggingOutAll) return;
    setLogoutModalOpen(false);
  };

  const handleLogoutSingle = async () => {
    setIsLoggingOut(true);
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
      setLogoutModalOpen(false);
      logout();
      window.location.href = `/${locale}`;
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    try {
      await logoutAll();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOutAll(false);
      setLogoutModalOpen(false);
      window.location.href = `/${locale}`;
    }
  };

  return (
    <AnimatePresence>
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0015] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                  <LogOut className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isRtl ? 'تسجيل الخروج' : 'Logout'}
                  </h3>
                  <p className="text-sm text-white/60">
                    {isRtl ? 'من أين تريد تسجيل الخروج؟' : 'Where do you want to log out from?'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoggingOut || isLoggingOutAll}
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLogoutSingle}
                disabled={isLoggingOut || isLoggingOutAll}
                className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left disabled:opacity-50"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isLoggingOut ? (
                    <Loader2 className="w-5 h-5 text-white/70 animate-spin" />
                  ) : (
                    <Monitor className="w-5 h-5 text-white/70" />
                  )}
                </div>
                <div className="flex-1 text-left rtl:text-right">
                  <h4 className="text-white font-semibold text-base mb-0.5">
                    {isRtl ? 'هذا الجهاز فقط' : 'This device only'}
                  </h4>
                  <p className="text-white/50 text-xs">
                    {isRtl ? 'سيتم تسجيل الخروج من متصفحك الحالي.' : 'You will be logged out from this browser.'}
                  </p>
                </div>
              </button>

              <button
                onClick={handleLogoutAll}
                disabled={isLoggingOut || isLoggingOutAll}
                className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 transition-all text-left disabled:opacity-50"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isLoggingOutAll ? (
                    <Loader2 className="w-5 h-5 text-rose-400 animate-spin" />
                  ) : (
                    <MonitorOff className="w-5 h-5 text-rose-400" />
                  )}
                </div>
                <div className="flex-1 text-left rtl:text-right">
                  <h4 className="text-rose-400 font-semibold text-base mb-0.5">
                    {isRtl ? 'من جميع الأجهزة' : 'From all devices'}
                  </h4>
                  <p className="text-rose-400/60 text-xs">
                    {isRtl ? 'سيتم إنهاء الجلسة في جميع الهواتف والحواسيب.' : 'End session across all phones and computers.'}
                  </p>
                </div>
              </button>
            </div>
            
            <div className="mt-6 flex justify-end">
               <button
                 onClick={handleClose}
                 disabled={isLoggingOut || isLoggingOutAll}
                 className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
               >
                 {isRtl ? 'إلغاء' : 'Cancel'}
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
