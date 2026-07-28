"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";
import MobileBottomNav from "../../../src/components/MobileBottomNav";
import {
  Wallet, Zap, Shield, ArrowRight, ArrowLeft, Mic, Volume2,
  Video, Smile, Image, Sparkles, TrendingUp, RefreshCw
} from "lucide-react";
import { useAppStore } from "../../../src/store/useAppStore";
import { Link } from "../../../src/i18n/routing";

// ── Wallet metadata ────────────────────────────────────────────────────────
const WALLET_META: Record<string, { label: string; labelAr: string; icon: any; gradient: string; glow: string; iconColor: string }> = {
  GENERAL:        { label: "General",          labelAr: "عامة",            icon: Sparkles, gradient: "from-violet-600 to-fuchsia-600",  glow: "shadow-violet-500/25",  iconColor: "text-violet-300" },
  AUDIO:          { label: "Voice Tools",      labelAr: "أدوات الصوت",     icon: Volume2,  gradient: "from-fuchsia-600 to-pink-600",    glow: "shadow-fuchsia-500/25", iconColor: "text-fuchsia-300" },
  STT:            { label: "Speech to Text",   labelAr: "صوت إلى نص",      icon: Mic,      gradient: "from-pink-600 to-rose-600",       glow: "shadow-pink-500/25",    iconColor: "text-pink-300" },
  LIPSYNC:        { label: "Lip Sync",         labelAr: "مزامنة الشفاه",   icon: Smile,    gradient: "from-rose-600 to-red-600",        glow: "shadow-rose-500/25",    iconColor: "text-rose-300" },
  IMAGE_TO_VIDEO: { label: "Image to Video",   labelAr: "صورة إلى فيديو", icon: Video,    gradient: "from-orange-500 to-amber-600",    glow: "shadow-orange-500/25",  iconColor: "text-orange-300" },
  BG_REMOVER:     { label: "BG Remover",       labelAr: "إزالة خلفية",     icon: Image,    gradient: "from-emerald-500 to-teal-600",    glow: "shadow-emerald-500/25", iconColor: "text-emerald-300" },
};

const getFallbackMeta = (code: string) => ({
  label: code,
  labelAr: code,
  icon: Shield,
  gradient: "from-violet-600 to-fuchsia-600",
  glow: "shadow-violet-500/25",
  iconColor: "text-violet-300",
});

// ── Animated counter ───────────────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const from = 0;
    const to = value;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return <>{displayed.toLocaleString()}</>;
}

// ── Balance bar ────────────────────────────────────────────────────────────
function BalanceBar({ balance, total, gradient }: { balance: number; total: number; gradient: string }) {
  const pct = total > 0 ? Math.min((balance / total) * 100, 100) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  );
}

// ── Card shimmer ───────────────────────────────────────────────────────────
function ShimmerCard() {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/10" />
        <div className="space-y-2">
          <div className="h-4 w-28 bg-white/10 rounded" />
          <div className="h-3 w-16 bg-white/5 rounded" />
        </div>
      </div>
      <div className="h-8 w-24 bg-white/10 rounded mb-2" />
      <div className="h-1.5 w-full bg-white/5 rounded-full" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function WalletsPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const router = useRouter();

  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [isReady, setIsReady] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setIsReady(true);
    if (!isAuthenticated && isReady) router.push("/login");
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex flex-col" dir={isRtl ? "rtl" : "ltr"}>
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[1, 2, 3].map((i) => <ShimmerCard key={i} />)}
          </div>
        </main>
      </div>
    );
  }

  const wallets: any[] = user?.wallets?.length
    ? user.wallets
    : [{ code: "GENERAL", balance: user?.availableCredits || 0 }];

  const totalCredits = wallets.reduce((a: number, w: any) => a + (w.balance ?? 0), 0);
  const VISIBLE_COUNT = 6;
  const visibleWallets = showAll ? wallets : wallets.slice(0, VISIBLE_COUNT);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
  };

  return (
    <div
      className="min-h-screen bg-[#030014] text-white selection:bg-fuchsia-500/30 flex flex-col overflow-x-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.13, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-fuchsia-600 blur-[140px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-pink-600/5 blur-[120px]" />
      </div>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex flex-col">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
          >
            <Wallet className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-medium text-white/80">{isRtl ? "محفظتي" : "My Wallets"}</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
              {isRtl ? "رصيد المحافظ" : "Wallets Balance"}
            </span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto font-medium">
            {isRtl
              ? "تابع رصيد جميع محافظك لجميع الأدوات المتاحة"
              : "Track all your wallet balances for all available AI tools"}
          </p>
        </motion.div>

        {/* ── Total Balance Hero Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-10 rounded-3xl overflow-hidden"
        >
          {/* gradient border trick */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-600/30 via-fuchsia-500/20 to-pink-600/30 p-px">
            <div className="absolute inset-0 rounded-3xl bg-[#030014]" />
          </div>
          <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 pointer-events-none" />

            <div className="flex items-center gap-6 relative">
              <motion.div
                animate={{ boxShadow: ["0 0 20px rgba(139,92,246,0.3)", "0 0 40px rgba(217,70,239,0.4)", "0 0 20px rgba(139,92,246,0.3)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center"
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">
                  {isRtl ? "إجمالي الرصيد" : "Total Balance"}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">
                    <AnimatedNumber value={totalCredits} duration={1.5} />
                  </span>
                  <span className="text-xl text-white/30 font-medium">
                    {isRtl ? "نقطة" : "Credits"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-medium">
                    {wallets.length} {isRtl ? "محفظة نشطة" : "active wallets"}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/pricing"
              className="group relative flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl transition-opacity duration-300" />
              <span className="relative">{isRtl ? "شحن الرصيد" : "Top Up Credits"}</span>
              <ArrowIcon className={`w-4 h-4 relative transition-transform duration-300 ${isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
            </Link>
          </div>
        </motion.div>

        {/* ── Wallets Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {visibleWallets.map((wallet: any, idx: number) => {
              const meta = WALLET_META[wallet.code?.toUpperCase()] || getFallbackMeta(wallet.code);
              const Icon = meta.icon;
              const pct = totalCredits > 0 ? Math.min(Math.round((wallet.balance / totalCredits) * 100), 100) : 0;

              return (
                <motion.div
                  key={wallet.code || idx}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="group relative bg-white/[0.02] border border-white/8 hover:border-white/20 rounded-3xl p-6 overflow-hidden cursor-default"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {/* Card glow on hover */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${meta.gradient} blur-2xl scale-75`} style={{ opacity: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.06")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  />

                  {/* Top row: icon + code */}
                  <div className="flex items-start justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg ${meta.glow}`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-base text-white leading-tight">
                          {isRtl ? meta.labelAr : meta.label}
                        </h3>
                        <p className="text-white/30 text-[11px] uppercase tracking-widest mt-0.5">
                          {isRtl ? "محفظة" : "Wallet"}
                        </p>
                      </div>
                    </div>

                    {/* Share % badge */}
                    <div className={`px-2.5 py-1 rounded-full bg-gradient-to-r ${meta.gradient} bg-opacity-20 border border-white/10 text-xs font-bold text-white/80`}>
                      {pct}%
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mb-5">
                    <p className="text-white/30 text-xs mb-1">{isRtl ? "الرصيد المتاح" : "Available Balance"}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${meta.gradient}`}>
                        <AnimatedNumber value={wallet.balance ?? 0} duration={1 + idx * 0.1} />
                      </span>
                      <span className="text-white/30 text-sm font-medium">{isRtl ? "نقطة" : "pts"}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <BalanceBar balance={wallet.balance ?? 0} total={totalCredits} gradient={meta.gradient} />

                  {/* Subtle bottom shimmer line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${meta.gradient} opacity-20 group-hover:opacity-60 transition-opacity duration-500`} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Show more / less */}
        {wallets.length > VISIBLE_COUNT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-8"
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-white/70 hover:text-white transition-all duration-300"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${showAll ? "rotate-180" : ""}`} />
              {showAll
                ? (isRtl ? "عرض أقل" : "Show less")
                : (isRtl ? `عرض الكل (${wallets.length})` : `Show all (${wallets.length})`)}
            </motion.button>
          </motion.div>
        )}

        {/* Empty state */}
        {wallets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              <Wallet className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white/60 mb-2">{isRtl ? "لا توجد محافظ" : "No Wallets Found"}</h3>
            <p className="text-white/30 text-sm">{isRtl ? "اشترك في خطة للحصول على محافظ مخصصة" : "Subscribe to a plan to get dedicated wallets"}</p>
            <Link href="/pricing" className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:opacity-90 transition-opacity">
              {isRtl ? "استعرض الخطط" : "Browse Plans"}
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
