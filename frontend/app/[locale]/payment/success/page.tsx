"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from "../../../../src/components/Navbar";
import Footer from "../../../../src/components/Footer";
import MobileBottomNav from "../../../../src/components/MobileBottomNav";
import CursorGlow from "../../../../src/components/CursorGlow";

export default function PaymentSuccessPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <CursorGlow />
      <Navbar />

      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden"
        >
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

          {/* Animated checkmark icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="flex justify-center mb-6 relative z-10"
          >
            <div className="rounded-full bg-emerald-500/20 p-4 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-16 h-16 text-emerald-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200"
          >
            {isRtl ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg mb-8"
          >
            {isRtl 
              ? 'تم تفعيل باقتك بنجاح. شكراً لثقتك بنا ونتمنى لك تجربة ممتعة.' 
              : 'Your subscription has been activated successfully. Thank you for your trust!'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              href={`/${locale}/profile`}
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
            >
              {isRtl ? 'الذهاب إلى حسابي' : 'Go to Profile'}
              {!isRtl && <ArrowRight className="w-5 h-5" />}
              {isRtl && <ArrowRight className="w-5 h-5 rotate-180" />}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
      <MobileBottomNav />
      <div className="h-16 md:hidden" />
    </div>
  );
}
