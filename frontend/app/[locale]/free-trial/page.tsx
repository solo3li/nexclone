"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "../../../src/i18n/routing";
import { Link } from "../../../src/i18n/routing";
import Navbar from "../../../src/components/Navbar";
import { Zap, Star, ArrowRight, ArrowLeft, Gift, Clock, Sparkles, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const features = [
  {
    icon: Zap,
    en: "AI Voice & Text Tools",
    ar: "أدوات الصوت والنص بالذكاء الاصطناعي",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Star,
    en: "Premium Quality Outputs",
    ar: "نتائج بجودة احترافية",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Gift,
    en: "Free Credits Included",
    ar: "رصيد مجاني مُضمَّن",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Clock,
    en: "Limited Time Offer",
    ar: "عرض لفترة محدودة",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FreeTrialPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[500px] bg-violet-600/10 blur-[140px] pointer-events-none z-0 rounded-full" />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[400px] bg-fuchsia-600/8 blur-[120px] pointer-events-none z-0 rounded-full" />

      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10 pt-24 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg"
        >
          {/* Main Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

            {/* Sparkles icon top */}
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-violet-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                <Sparkles className="w-10 h-10 text-violet-300" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={itemVariants} className="text-3xl font-bold text-white text-center mb-3">
              {isRtl ? "🎉 أهلاً بك في NexMedia!" : "🎉 Welcome to NexMedia!"}
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-white/60 text-center text-sm leading-relaxed mb-8">
              {isRtl
                ? "تم إنشاء حسابك بنجاح. لقد حصلت على التجربة المجانية! يرجى تفعيل بريدك الإلكتروني لبدء استخدام المنصة."
                : "Your account was created successfully. You've unlocked the free trial! Please verify your email to get started."}
            </motion.p>

            {/* Email verification notice */}
            <motion.div
              variants={itemVariants}
              className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8 flex gap-3 items-start"
            >
              <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 font-semibold text-sm mb-1">
                  {isRtl ? "تحقق من بريدك الإلكتروني" : "Check your email"}
                </p>
                <p className="text-amber-200/70 text-xs leading-relaxed">
                  {isRtl
                    ? `أرسلنا رابط التفعيل إلى بريدك. انقر عليه لتفعيل حسابك وبدء التجربة المجانية${dots}`
                    : `We sent an activation link to your email. Click it to activate your account and start your free trial${dots}`}
                </p>
              </div>
            </motion.div>

            {/* Features grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-8">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`${feature.bg} ${feature.border} border rounded-2xl p-3 flex flex-col gap-2`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <p className="text-white/80 text-xs font-medium leading-snug">
                    {isRtl ? feature.ar : feature.en}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              variants={itemVariants}
              onClick={() => router.push(`/${locale}/login`)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-opacity duration-300" />
              <span className="relative">{isRtl ? "تسجيل الدخول والبدء" : "Login & Get Started"}</span>
              <ArrowIcon className={`w-5 h-5 relative transition-transform duration-300 ${isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
            </motion.button>

            <motion.p variants={itemVariants} className="text-white/30 text-xs text-center mt-4">
              {isRtl
                ? "بعد التفعيل ستتمكن من تسجيل الدخول والاستمتاع بجميع المميزات"
                : "After verification you can log in and enjoy all features"}
            </motion.p>
          </motion.div>

          {/* Bottom note */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-white/30 text-xs">
              {isRtl ? "لم تصلك الرسالة؟ " : "Didn't receive the email? "}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 underline">
                {isRtl ? "سجّل الدخول لإعادة الإرسال" : "Login to resend"}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
