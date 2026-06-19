"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";
import { Activity, CreditCard, Receipt, Zap, Crown } from "lucide-react";

export default function ProfilePage() {
  const t = useTranslations("Profile");

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col">
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[600px] bg-fuchsia-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-violet-600/10 blur-[120px] pointer-events-none z-0 rounded-full" />

      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-white">{t('title')}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Usage & Subscriptions */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Subscription Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent blur-2xl" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{t('subscription.title')}</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-white/60">{t('subscription.plan')}</span>
                  <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-full text-sm">Pro</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-white/60">{t('subscription.status')}</span>
                  <span className="text-emerald-400 font-medium text-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active
                  </span>
                </div>
                <button className="w-full py-3 mt-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all hover:border-white/20">
                  {t('subscription.upgrade')}
                </button>
              </div>
            </motion.div>

            {/* Usage Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Activity className="w-5 h-5 text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{t('usage.title')}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">{t('usage.tokens')}</span>
                    <span className="text-white font-medium">45,231 / 100,000</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-[45%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">{t('usage.generations')}</span>
                    <span className="text-white font-medium">128 / 500</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-[25%]" />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Transactions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                  <Receipt className="w-5 h-5 text-pink-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{t('transactions.title')}</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" dir={t('title') === 'ملفي الشخصي' ? 'rtl' : 'ltr'}>
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-sm">
                      <th className="pb-4 font-medium px-4 text-start">{t('transactions.date')}</th>
                      <th className="pb-4 font-medium px-4 text-start">{t('transactions.amount')}</th>
                      <th className="pb-4 font-medium px-4 text-start">{t('transactions.status')}</th>
                      <th className="pb-4 font-medium px-4 text-end">{t('transactions.invoice')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: "Oct 15, 2026", amount: "$29.00", status: "Paid" },
                      { date: "Sep 15, 2026", amount: "$29.00", status: "Paid" },
                      { date: "Aug 15, 2026", amount: "$29.00", status: "Paid" },
                      { date: "Jul 15, 2026", amount: "$29.00", status: "Paid" },
                    ].map((tx, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 text-white/80">{tx.date}</td>
                        <td className="py-4 px-4 text-white font-medium">{tx.amount}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-end">
                          <button className="text-violet-400 hover:text-violet-300 text-sm font-medium">Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
