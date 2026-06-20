"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Navbar from "../../../src/components/Navbar";
import Footer from "../../../src/components/Footer";
import {
  Activity, Crown, History, Mic, Volume2, FileText,
  Image, Loader2, Trash2, ExternalLink, ChevronRight,
  Clock, Zap, AlertCircle
} from "lucide-react";
import api from "../../../src/utils/api";
import { useAppStore } from "../../../src/store/useAppStore";

interface GenerationRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  createdAt: string;
  duration: string;
  status: string;
  lang: string;
  voice: string;
  fileUrl: string;
  creditsUsed: number;
}

const TOOL_ICONS: Record<string, any> = {
  "text-to-voice": Volume2,
  "voice-to-text": Mic,
  "gpt": FileText,
  "bg-remover": Image,
};

const TOOL_COLORS: Record<string, string> = {
  "text-to-voice": "from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400",
  "voice-to-text": "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30 text-fuchsia-400",
  "gpt": "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
  "bg-remover": "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
};

const TOOL_LABELS: Record<string, string> = {
  "text-to-voice": "نص إلى صوت",
  "voice-to-text": "صوت إلى نص",
  "gpt": "GPT",
  "bg-remover": "إزالة خلفية",
};

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  const user = useAppStore(state => state.user);

  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const deleteRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(isRtl ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/history/${id}`);
      setHistory(prev => prev.filter(r => r.id !== id));
    } catch {
      alert(isRtl ? "فشل الحذف" : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const goToDetail = (id: string) => {
    router.push(`/${locale}/profile/history/${id}`);
  };

  const filters = ["all", "text-to-voice", "voice-to-text", "gpt", "bg-remover"];
  const filtered = activeFilter === "all" ? history : history.filter(r => r.type === activeFilter);

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col">
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[600px] bg-fuchsia-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[500px] bg-violet-600/10 blur-[120px] pointer-events-none z-0 rounded-full" />

      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-extrabold text-white">{t('title')}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
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
                  <span className="text-emerald-400 font-medium text-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> {user?.activePlan ? user.activePlan.status : "Active"}
                  </span>
                </div>
                <button onClick={() => router.push(`/${locale}/pricing`)} className="w-full py-3 mt-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all hover:border-white/20">
                  {t('subscription.upgrade')}
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
                <h2 className="text-xl font-bold text-white">{t('usage.title')}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-white">{history.length}</p>
                  <p className="text-xs text-white/50 mt-1">{isRtl ? "إجمالي العمليات" : "Total Operations"}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-emerald-400">
                    {user?.availableCredits || 0}
                  </p>
                  <p className="text-xs text-white/50 mt-1">{isRtl ? "كريدت متاح" : "Available Credits"}</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Real History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6" dir={isRtl ? "rtl" : "ltr"}>
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30">
                  <History className="w-5 h-5 text-fuchsia-400" />
                </div>
                <h2 className="text-xl font-bold text-white flex-1">
                  {isRtl ? "سجل العمليات" : "Generation History"}
                </h2>
                <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {filtered.length} {isRtl ? "عملية" : "records"}
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2 mb-5 flex-wrap" dir={isRtl ? "rtl" : "ltr"}>
                {filters.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeFilter === f
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                        : "bg-white/5 text-white/50 hover:text-white border border-white/10"
                    }`}
                  >
                    {f === "all" ? (isRtl ? "الكل" : "All") : (TOOL_LABELS[f] || f)}
                  </button>
                ))}
              </div>

              {/* Content */}
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-white/40">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                    <p className="text-sm">{isRtl ? "جاري التحميل..." : "Loading..."}</p>
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-white/30">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">{isRtl ? "لا توجد عمليات بعد" : "No operations yet"}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[550px] pr-1">
                  <AnimatePresence>
                    {filtered.map((record, i) => {
                      const Icon = TOOL_ICONS[record.type] || Zap;
                      const colorClass = TOOL_COLORS[record.type] || "from-white/10 to-white/5 border-white/10 text-white/50";

                      return (
                        <motion.div
                          key={record.id}
                          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => goToDetail(record.id)}
                          className="group flex items-center gap-4 p-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-violet-500/30 rounded-2xl cursor-pointer transition-all"
                          dir={isRtl ? "rtl" : "ltr"}
                        >
                          {/* Icon */}
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center border shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate" title={record.title}>
                              {record.title.split('/').pop()}
                            </p>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-[11px] text-white/40 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {record.date}
                              </span>
                              {record.lang && record.lang !== "-" && (
                                <span className="text-[11px] text-white/40">{record.lang}</span>
                              )}
                              {record.creditsUsed > 0 && (
                                <span className="text-[11px] text-fuchsia-400/70 flex items-center gap-0.5">
                                  <Zap className="w-2.5 h-2.5" />
                                  {record.creditsUsed}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status + Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                              record.status === "completed"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                : record.status === "failed"
                                ? "bg-red-500/15 text-red-400 border border-red-500/20"
                                : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                            }`}>
                              {record.status === "completed" ? (isRtl ? "مكتمل" : "Done") :
                               record.status === "failed" ? (isRtl ? "فشل" : "Failed") :
                               (isRtl ? "جاري" : "Processing")}
                            </span>
                            <button
                              onClick={(e) => deleteRecord(record.id, e)}
                              disabled={deletingId === record.id}
                              className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                            >
                              {deletingId === record.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />
                              }
                            </button>
                            <ChevronRight className={`w-4 h-4 text-white/20 group-hover:text-violet-400 transition-colors ${isRtl ? "rotate-180" : ""}`} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
