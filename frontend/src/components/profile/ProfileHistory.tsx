'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Zap, Clock, ChevronRight, Loader2, FileText, Image, Mic, Volume2, Video, Smile } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "../../i18n/routing";
import { useHistoryStore } from "../../store/useHistoryStore";

interface Props {
  isRtl: boolean;
  locale: string;
}

const TOOL_ICONS: Record<string, any> = {
  "text-to-image": Image,
  "text-to-video": Video,
  "image-to-video": Video,
  "reference-to-video": Video,
  "lipsync": Smile,
  "lip-sync": Smile,
  "motion-control": Video,
  "text-to-voice": Volume2,
  "voice-to-text": Mic,
  "gpt": FileText,
  "bg-remover": Image,
};

const TOOL_COLORS: Record<string, string> = {
  "text-to-image": "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
  "text-to-video": "from-indigo-500/20 to-cyan-500/20 border-indigo-500/30 text-cyan-400",
  "image-to-video": "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400",
  "reference-to-video": "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
  "lipsync": "from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400",
  "lip-sync": "from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400",
  "motion-control": "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
  "text-to-voice": "from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400",
  "voice-to-text": "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30 text-fuchsia-400",
  "gpt": "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
  "bg-remover": "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
};

export default function ProfileHistory({ isRtl, locale }: Props) {
  const t = useTranslations("Profile");
  const router = useRouter();
  const { historyItems, fetchHistory } = useHistoryStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory().finally(() => setLoading(false));
  }, []);

  const latestItems = historyItems.slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30">
              <History className="w-5 h-5 text-fuchsia-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{isRtl ? "سجل العمليات الأخير" : "Recent History"}</h2>
          </div>
          <button 
            onClick={() => router.push('/history')}
            className="text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
          >
            {isRtl ? "عرض الكل" : "View All"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" />
          </div>
        ) : latestItems.length === 0 ? (
          <div className="text-center py-10 text-white/40">
            <p>{isRtl ? "لا توجد عمليات بعد" : "No operations yet"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {latestItems.map((record, i) => {
                const Icon = TOOL_ICONS[record.type] || Zap;
                const colorClass = TOOL_COLORS[record.type] || "from-white/10 to-white/5 border-white/10 text-white/50";

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl"
                    dir={isRtl ? "rtl" : "ltr"}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center border shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-base truncate" title={record.title}>
                        {record.title.split('/').pop()}
                      </p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-white/50 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {record.date}
                        </span>
                        {record.creditsUsed > 0 && (
                          <span className="text-xs font-bold text-fuchsia-400 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {record.creditsUsed}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        (record.status === "completed" || record.status === "succeeded") ? "bg-emerald-500/15 text-emerald-400"
                          : (record.status === "failed" || record.status === "error") ? "bg-red-500/15 text-red-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}>
                        {(record.status === "completed" || record.status === "succeeded") ? (isRtl ? "مكتمل" : "Done") :
                         (record.status === "failed" || record.status === "error") ? (isRtl ? "فشل" : "Failed") :
                         (isRtl ? "معالجة" : "Processing")}
                      </span>
                      <button 
                        onClick={() => router.push(`/history/${record.id}`)}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <ChevronRight className={`w-4 h-4 text-white/50 ${isRtl ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
