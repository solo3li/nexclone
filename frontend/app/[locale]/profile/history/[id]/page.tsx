"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../../src/components/Navbar";
import Footer from "../../../../../src/components/Footer";
import {
  ArrowLeft, ArrowRight, Volume2, Mic, FileText, Image,
  Clock, Globe, User, Zap, CheckCircle2, XCircle, Loader2,
  Download, Copy, Play, Pause
} from "lucide-react";
import api from "../../../../../src/utils/api";

interface HistoryDetail {
  id: string;
  type: string;
  title: string;
  createdAt: string;
  date: string;
  duration: string;
  status: string;
  lang: string;
  voice: string;
  fileUrl: string;
  resultText: string;
  creditsUsed: number;
}

const TOOL_META: Record<string, { icon: any; label_ar: string; label_en: string; color: string }> = {
  "text-to-voice": { icon: Volume2, label_ar: "تحويل النص إلى صوت", label_en: "Text to Voice", color: "violet" },
  "voice-to-text": { icon: Mic, label_ar: "تحويل الصوت إلى نص", label_en: "Voice to Text", color: "fuchsia" },
  "gpt": { icon: FileText, label_ar: "GPT", label_en: "GPT", color: "blue" },
  "bg-remover": { icon: Image, label_ar: "إزالة خلفية", label_en: "Background Remover", color: "emerald" },
};

export default function HistoryDetailPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [record, setRecord] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/api/history/${id}`);
        setRecord(res.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const goBack = () => router.push(`/${locale}/profile`);

  const copyText = () => {
    if (record?.resultText) navigator.clipboard.writeText(record.resultText);
  };

  const downloadFile = () => {
    if (!record?.fileUrl) return;
    const a = document.createElement("a");
    const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://178.62.192.74:8080";
    a.href = `${backendBase}${record.fileUrl}`;
    a.download = record.title || "output";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleAudio = () => {
    if (!record?.fileUrl) return;
    if (!audio) {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://178.62.192.74:8080";
      const a = new Audio(`${backendBase}${record.fileUrl}`);
      a.onended = () => setIsPlaying(false);
      a.play();
      setAudio(a);
      setIsPlaying(true);
    } else {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play(); setIsPlaying(true); }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !record) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-center">
          <div>
            <XCircle className="w-16 h-16 text-red-400/50 mx-auto mb-4" />
            <p className="text-white/60 text-lg">{isRtl ? "العملية غير موجودة" : "Record not found"}</p>
            <button onClick={goBack} className="mt-4 px-6 py-2 bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 rounded-xl transition-all">
              {isRtl ? "العودة" : "Go Back"}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const meta = TOOL_META[record.type] || { icon: Zap, label_ar: record.type, label_en: record.type, color: "violet" };
  const Icon = meta.icon;
  const toolLabel = isRtl ? meta.label_ar : meta.label_en;
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const colorMap: Record<string, string> = {
    violet: "bg-violet-500/20 border-violet-500/30 text-violet-400",
    fuchsia: "bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-400",
    blue: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    emerald: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
  };
  const iconColor = colorMap[meta.color] || colorMap.violet;

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col">
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[600px] bg-violet-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />

      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10 max-w-4xl">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={goBack}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <BackArrow className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{isRtl ? "العودة للملف الشخصي" : "Back to Profile"}</span>
        </motion.button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 ${iconColor}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${iconColor}`}>
                  {toolLabel}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  record.status === "completed"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/15 text-red-400 border border-red-500/20"
                }`}>
                  {record.status === "completed"
                    ? (isRtl ? "✓ مكتمل" : "✓ Completed")
                    : (isRtl ? "✗ فشل" : "✗ Failed")}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-white mt-2 leading-tight">{record.title}</h1>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Info Cards */}
          {[
            { icon: Clock, label: isRtl ? "التاريخ" : "Date", value: record.date },
            { icon: Globe, label: isRtl ? "اللغة" : "Language", value: record.lang || "Auto" },
            { icon: Zap, label: isRtl ? "الكريدت المستخدم" : "Credits Used", value: String(record.creditsUsed) },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
              dir={isRtl ? "rtl" : "ltr"}
            >
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="w-4 h-4 text-white/40" />
                <span className="text-xs text-white/40 font-medium">{item.label}</span>
              </div>
              <p className="text-white font-bold text-lg">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Voice Info if text-to-voice */}
        {record.voice && record.voice !== "-" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" />
              <span className="text-xs text-white/50">{isRtl ? "الصوت المستخدم" : "Voice Used"}</span>
              <span className="text-white font-semibold text-sm ml-2">{record.voice}</span>
            </div>
          </motion.div>
        )}

        {/* Audio Player (for text-to-voice) */}
        {record.fileUrl && record.type === "text-to-voice" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-violet-500/20 rounded-2xl p-5 mb-6"
            dir="ltr"
          >
            <p className="text-xs text-white/40 font-medium mb-3 text-right">{isRtl ? "الملف الصوتي" : "Audio Output"}</p>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAudio}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all active:scale-95 shrink-0"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div className="h-full w-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                </div>
                <p className="text-xs text-white/30 mt-1.5">{record.duration || "—"}</p>
              </div>
              <button
                onClick={downloadFile}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
                title={isRtl ? "تحميل" : "Download"}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Result Text (for voice-to-text or gpt) */}
        {record.resultText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">
                {isRtl ? "النص المُحوَّل" : "Transcribed Text"}
              </p>
              <button
                onClick={copyText}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white text-xs transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                {isRtl ? "نسخ" : "Copy"}
              </button>
            </div>
            <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap" dir="auto">
              {record.resultText}
            </p>
          </motion.div>
        )}

      </main>

      <Footer />
    </div>
  );
}
