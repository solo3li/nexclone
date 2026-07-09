"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";
import MobileBottomNav from "../../../src/components/MobileBottomNav";
import { Wallet, Zap, Shield, ArrowRight } from "lucide-react";
import { useAppStore } from "../../../src/store/useAppStore";
import { Link } from "../../../src/i18n/routing";

export default function WalletsPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  
  const user = useAppStore(state => state.user);
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    if (!isAuthenticated && isReady) {
      router.push("/login");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) return null;

  const totalCredits = user?.wallets?.reduce((acc: number, w: any) => acc + w.balance, 0) || user?.availableCredits || 0;
  const wallets = user?.wallets || [{ code: "GENERAL", balance: user?.availableCredits || 0 }];

  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-fuchsia-500/30 flex flex-col" dir={isRtl ? "rtl" : "ltr"}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Wallet className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-medium">{isRtl ? "محفظتي" : "My Wallets"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">
            {isRtl ? "رصيد المحافظ" : "Wallets Balance"}
          </h1>
          <p className="text-xl text-white/50 font-medium max-w-2xl mx-auto">
            {isRtl ? "تابع رصيد جميع محافظك لجميع الأدوات المتاحة" : "Track all your wallet balances for all available tools"}
          </p>
        </motion.div>

        {/* Total Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-900/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-1">
                {isRtl ? "إجمالي الرصيد" : "Total Balance"}
              </p>
              <div className="text-4xl font-black text-white">
                {totalCredits} <span className="text-xl text-white/40 font-medium">{isRtl ? "نقطة" : "Credits"}</span>
              </div>
            </div>
          </div>
          <Link href="/pricing" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-colors flex items-center gap-2 group">
            {isRtl ? "شحن الرصيد" : "Top Up Credits"}
            <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
          </Link>
        </motion.div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.05) }}
              className="bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-3xl p-6 transition-all group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white/50 group-hover:text-fuchsia-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{wallet.code}</h3>
                    <p className="text-white/40 text-xs uppercase tracking-wider">{isRtl ? "محفظة أداة" : "Tool Wallet"}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-sm mb-1">{isRtl ? "الرصيد المتاح" : "Available Balance"}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                      {wallet.balance}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white/30" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
