"use client";

import React, { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '../../../../src/utils/api';
import { useAppStore } from '../../../../src/store/useAppStore';
import { useAuthStore } from '../../../../src/store/useAuthStore';
import Navbar from "../../../../src/components/Navbar";
import Footer from "../../../../src/components/Footer";
import MobileBottomNav from "../../../../src/components/MobileBottomNav";
import CursorGlow from "../../../../src/components/CursorGlow";

function SuccessContent() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const searchParams = useSearchParams();
  const method = searchParams.get('method');
  
  const isManual = method === 'manual';

  useEffect(() => {
    const provider  = searchParams.get('provider');   // 'PayPal' | 'Paymob'
    const token     = searchParams.get('token');      // PayPal redirect token (orderId)

    const refreshSession = async () => {
      try {
        // --- Paymob: txId is available for reference but activation is handled by webhook ---
        // No client-side verify needed; the Paymob webhook activates the subscription server-side.

        // --- PayPal redirect flow: capture the order ---
        // When PayPal redirects back it includes ?token=ORDER_ID in the URL
        if (provider === 'PayPal' && token) {
          try {
            await api.post('/api/checkout/capture-paypal-order', { orderId: token });
          } catch (captureErr: any) {
            // If already captured (409 / "Already processed") that's fine
            console.warn('[PaymentSuccess] PayPal capture:', captureErr?.response?.data?.error || captureErr?.message);
          }
        }

        // Always refresh the user session so UI reflects the new plan
        const res = await api.get('/api/auth/me');
        if (res.data) {
          useAppStore.getState().setUser(res.data);
          useAuthStore.getState().setUser(res.data);
        }
      } catch (err) {
        console.warn('[PaymentSuccess] session refresh error:', err);
      }
    };

    refreshSession();
  }, [searchParams]);

  // Theme based on payment method
  const theme = isManual ? {
    color: 'purple',
    gradient: 'from-purple-400 to-purple-200',
    shadow: 'shadow-[0_0_40px_rgba(168,85,247,0.3)]',
    bg: 'bg-purple-500/20',
    btnBg: 'bg-purple-500 hover:bg-purple-600',
    btnShadow: 'shadow-purple-500/20 hover:shadow-purple-500/40',
    orbTop: 'bg-purple-600/20',
    orbBottom: 'bg-fuchsia-600/20',
    icon: <Clock className="w-16 h-16 text-purple-400" />,
    titleEn: 'Request Submitted!',
    titleAr: 'تم إرسال الطلب بنجاح!',
    descEn: 'Admin will review your receipt and activate your plan shortly. Thank you!',
    descAr: 'سوف تقوم الإدارة بمراجعة إيصال الدفع وتفعيل الباقة قريباً. شكراً لك!'
  } : {
    color: 'emerald',
    gradient: 'from-emerald-400 to-emerald-200',
    shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]',
    bg: 'bg-emerald-500/20',
    btnBg: 'bg-emerald-500 hover:bg-emerald-600',
    btnShadow: 'shadow-emerald-500/20 hover:shadow-emerald-500/40',
    orbTop: 'bg-emerald-600/20',
    orbBottom: 'bg-blue-600/20',
    icon: (
      <svg className="w-16 h-16 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          d="M20 6L9 17l-5-5"
        />
      </svg>
    ),
    titleEn: 'Payment Successful!',
    titleAr: 'تم الدفع بنجاح!',
    descEn: 'Your subscription has been activated successfully. Thank you for your trust!',
    descAr: 'تم تفعيل باقتك بنجاح. شكراً لثقتك بنا ونتمنى لك تجربة ممتعة.'
  };

  return (
    <>
      {/* Background Orbs */}
      <div className={`absolute top-[20%] left-[20%] w-[40%] h-[40%] ${theme.orbTop} rounded-full blur-[120px] pointer-events-none`} />
      <div className={`absolute bottom-[20%] right-[20%] w-[40%] h-[40%] ${theme.orbBottom} rounded-full blur-[120px] pointer-events-none`} />

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative z-10">
        
        {/* Pulsing rings behind the card */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1.4], opacity: [0.5, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className={`absolute w-64 h-64 rounded-full border-2 border-${theme.color}-500/30 z-0 pointer-events-none`}
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.3, 1.6], opacity: [0.4, 0.1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          className={`absolute w-64 h-64 rounded-full border-2 border-${theme.color}-500/20 z-0 pointer-events-none`}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden z-10"
        >
          {/* Subtle inner glow */}
          <div className={`absolute inset-0 bg-gradient-to-b from-${theme.color}-500/10 to-transparent pointer-events-none`} />

          {/* Animated checkmark icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
            className="flex justify-center mb-6 relative z-10"
          >
            <div className={`rounded-full ${theme.bg} p-5 ${theme.shadow} flex items-center justify-center`}>
              {theme.icon}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${theme.gradient}`}
          >
            {isRtl ? theme.titleAr : theme.titleEn}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg mb-10 font-medium"
          >
            {isRtl ? theme.descAr : theme.descEn}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              href={`/${locale}/profile`}
              className={`inline-flex items-center justify-center gap-2 w-full py-4 ${theme.btnBg} text-white rounded-xl font-bold transition-all duration-300 shadow-lg ${theme.btnShadow}`}
            >
              {isRtl ? 'الذهاب إلى حسابي' : 'Go to Profile'}
              {!isRtl && <ArrowRight className="w-5 h-5" />}
              {isRtl && <ArrowRight className="w-5 h-5 rotate-180" />}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <CursorGlow />
      <Navbar />

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
           <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>

      <Footer />
      <MobileBottomNav />
      <div className="h-16 md:hidden" />
    </div>
  );
}
