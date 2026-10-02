"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../src/components/Navbar";
import Footer from "../../../../src/components/Footer";
import MobileBottomNav from "../../../../src/components/MobileBottomNav";
import {
  ArrowLeft, ArrowRight, Clock, Calendar, Zap, Play, FileText,
  Volume2, Mic, CheckCircle, XCircle, AlertCircle, Video, Smile, Image as ImageIcon,
  Copy, Check, Layers, Sliders, ExternalLink, Music, Film, Sparkles
} from "lucide-react";
import { useHistoryStore } from "../../../../src/store/useHistoryStore";
import { ModelBrandIcon } from "../../../../src/components/BrandLogos";

interface RecordDetail {
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
  inputText: string;
  creditsUsed: number;
  metadataJson?: string;
}

function parseMetadata(json?: string) {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function formatModelName(model?: string): { name: string; brand: string } {
  if (!model) return { name: "", brand: "" };
  const m = model.toLowerCase();
  if (m.includes("veo-3.1")) return { name: "Google Veo 3.1", brand: "Google DeepMind" };
  if (m.includes("veo-3.0") || m === "veo") return { name: "Google Veo 3.0", brand: "Google DeepMind" };
  if (m.includes("seedance-2.0") || m === "seedance") return { name: "ByteDance Seedance 2.0", brand: "ByteDance AI" };
  if (m.includes("seedance-1.5")) return { name: "ByteDance Seedance 1.5", brand: "ByteDance AI" };
  if (m.includes("seedance-1.0")) return { name: "ByteDance Seedance 1.0", brand: "ByteDance AI" };
  if (m.includes("grok")) return { name: "xAI Grok Imagine", brand: "xAI" };
  return { name: model.toUpperCase(), brand: "AI Model" };
}

export default function HistoryDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const isRtl = locale === "ar";
  const router = useRouter();

  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { fetchHistoryItem } = useHistoryStore();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await fetchHistoryItem(id);
        setRecord(data);
      } catch (err) {
        console.error("Failed to fetch detail:", err);
        setError(isRtl ? "فشل في تحميل تفاصيل العملية" : "Failed to load record details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, isRtl]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20 text-white/50">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    if (error || !record) {
      return (
        <div className="text-center py-20 text-red-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{error || "Not found"}</p>
        </div>
      );
    }

    const isVideo = record.type === "text-to-video" || record.type === "image-to-video" || record.type === "reference-to-video" || record.type === "lip-sync" || record.type === "lipsync" || record.type === "motion-control";
    const isAudio = record.type === "text-to-voice" || record.type === "voice-to-text" || record.type === "tts" || record.type === "stt";
    const isImage = record.type === "text-to-image" || record.type === "bg-remover" || record.type === "image";

    const isCompleted = record.status === "completed" || record.status === "succeeded";
    const isFailed = record.status === "failed" || record.status === "error";
    const isExpired = record.status === "expired";

    const meta = parseMetadata(record.metadataJson);
    const modelInfo = formatModelName(meta?.model);

    const hasSpecs = meta && (meta.model || meta.resolution || meta.aspectRatio || meta.duration || meta.mode || meta.audioEnabled !== undefined || meta.orientation || meta.renderingSpeed);
    const hasReferenceMedia = meta && ((meta.imageUrls && meta.imageUrls.length > 0) || (meta.videoUrls && meta.videoUrls.length > 0) || (meta.audioUrls && meta.audioUrls.length > 0));

    const handleDownload = async (url: string, defaultName: string) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = defaultName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
      } catch {
        window.open(url, "_blank");
      }
    };

    return (
      <div className="space-y-8" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header Summary */}
        <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {record.type === "text-to-image" && <ImageIcon className="w-6 h-6 text-amber-400" />}
                {record.type === "text-to-video" && <Video className="w-6 h-6 text-cyan-400" />}
                {record.type === "reference-to-video" && <Video className="w-6 h-6 text-purple-400" />}
                {record.type === "motion-control" && <Video className="w-6 h-6 text-emerald-400" />}
                {record.type === "voice-to-text" && <Mic className="w-6 h-6 text-fuchsia-400" />}
                {record.type === "text-to-voice" && <Volume2 className="w-6 h-6 text-violet-400" />}
                {record.type === "gpt" && <FileText className="w-6 h-6 text-emerald-400" />}
                {record.type === "image-to-video" && <Video className="w-6 h-6 text-orange-400" />}
                {record.type === "lip-sync" && <Smile className="w-6 h-6 text-rose-400" />}
                {record.type === "lipsync" && <Smile className="w-6 h-6 text-rose-400" />}
                <span>{record.title ? record.title.split("/").pop() : ""}</span>
              </h2>

              {modelInfo.name && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-medium text-xs shadow-sm">
                  <ModelBrandIcon modelId={meta?.model} className="w-4 h-4 shrink-0" />
                  <span>{modelInfo.name}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {record.date}</span>
              {record.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {record.duration}</span>}
              {record.creditsUsed > 0 && (
                <span className="flex items-center gap-1.5 font-bold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2.5 py-1 rounded-lg">
                  <Zap className="w-4 h-4" /> {record.creditsUsed} {isRtl ? "كريدت" : "Credits"}
                </span>
              )}
            </div>
          </div>

          <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${
            isCompleted ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
            isFailed ? "bg-red-500/10 text-red-400 border border-red-500/20" :
            isExpired ? "bg-gray-500/10 text-gray-400 border border-gray-500/20" :
            "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          }`}>
            {isCompleted && <CheckCircle className="w-4 h-4" />}
            {isFailed && <XCircle className="w-4 h-4" />}
            {isExpired && <AlertCircle className="w-4 h-4" />}
            {isRtl 
              ? (isCompleted ? "مكتمل" : isFailed ? "فشل" : isExpired ? "منتهي الصلاحية" : "قيد المعالجة")
              : (isCompleted ? "Completed" : isFailed ? "Failed" : isExpired ? "Expired" : "Processing")}
          </div>
        </div>

        {/* Expired Message */}
        {isExpired && (
          <div className="bg-gray-500/10 rounded-3xl p-6 md:p-8 border border-gray-500/20 text-center">
             <h3 className="text-gray-400 font-medium flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {isRtl ? "تم حذف الملف (مر أكثر من 14 يوماً) لتوفير مساحة التخزين" : "File expired and removed after 14 days to save storage"}
             </h3>
          </div>
        )}

        {/* Technical Specifications Grid */}
        {hasSpecs && (
          <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
            <h3 className="text-white/80 font-bold mb-5 text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-violet-400" />
              <span>{isRtl ? "المواصفات الفنية للعملية" : "Technical Specifications"}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {meta?.model && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs text-white/40">{isRtl ? "النموذج الذكي" : "AI Model"}</span>
                  <div className="flex items-center gap-2">
                    <ModelBrandIcon modelId={meta.model} className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-semibold text-white truncate">{modelInfo.name}</span>
                  </div>
                </div>
              )}

              {meta?.resolution && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs text-white/40">{isRtl ? "الدقة والجودة" : "Resolution"}</span>
                  <span className="text-sm font-mono font-bold text-cyan-300">{meta.resolution}</span>
                </div>
              )}

              {meta?.aspectRatio && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs text-white/40">{isRtl ? "أبعاد العرض" : "Aspect Ratio"}</span>
                  <span className="text-sm font-mono font-bold text-amber-300">{meta.aspectRatio}</span>
                </div>
              )}

              {meta?.duration > 0 && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs text-white/40">{isRtl ? "مدة المشهد" : "Duration"}</span>
                  <span className="text-sm font-mono font-bold text-purple-300">{meta.duration}s</span>
                </div>
              )}

              {meta?.mode && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs text-white/40">{isRtl ? "نمط التوليد" : "Mode"}</span>
                  <span className="text-sm font-medium text-emerald-300 uppercase">{meta.mode}</span>
                </div>
              )}

              {meta?.audioEnabled !== undefined && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs text-white/40">{isRtl ? "الصوت التوليدي" : "Audio"}</span>
                  <span className={`text-sm font-medium ${meta.audioEnabled ? "text-emerald-400" : "text-white/40"}`}>
                    {meta.audioEnabled ? (isRtl ? "مُفعّل (مع الصوت)" : "Enabled") : (isRtl ? "مكتوم (بدون صوت)" : "Muted")}
                  </span>
                </div>
              )}

              {meta?.renderingSpeed && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs text-white/40">{isRtl ? "سرعة الرندرة" : "Speed"}</span>
                  <span className="text-sm font-medium text-blue-300 uppercase">{meta.renderingSpeed}</span>
                </div>
              )}

              {meta?.orientation && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs text-white/40">{isRtl ? "اتجاه الشخصية" : "Orientation"}</span>
                  <span className="text-sm font-medium text-pink-300">{meta.orientation}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Reference Media / Storyboard Gallery */}
        {hasReferenceMedia && (
          <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
            <h3 className="text-white/80 font-bold text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-fuchsia-400" />
              <span>{isRtl ? "الوسائط المرجعية المدخلة (الستوريبورد)" : "Input Reference Media & Storyboard"}</span>
            </h3>

            {/* Images */}
            {meta?.imageUrls && meta.imageUrls.length > 0 && (
              <div>
                <span className="text-xs text-white/50 block mb-3 font-medium">
                  {isRtl ? `الصور المرجعية المرفقة (${meta.imageUrls.length})` : `Reference Images (${meta.imageUrls.length})`}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {meta.imageUrls.map((url: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setPreviewImage(url)}
                      className="group relative aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-white/15 bg-black/40 cursor-pointer hover:border-violet-500/50 transition-all shadow-md"
                    >
                      <img src={url} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                        {isRtl ? `إطار ${idx + 1}` : `Frame ${idx + 1}`}
                      </div>
                      <div className="absolute inset-0 bg-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white drop-shadow" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {meta?.videoUrls && meta.videoUrls.length > 0 && (
              <div>
                <span className="text-xs text-white/50 block mb-3 font-medium">
                  {isRtl ? `الفيديوهات المرجعية (${meta.videoUrls.length})` : `Reference Videos (${meta.videoUrls.length})`}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {meta.videoUrls.map((url: string, idx: number) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 p-2">
                      <div className="flex items-center gap-2 mb-2 px-2 text-xs text-white/60">
                        <Film className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isRtl ? `فيديو مرجعي ${idx + 1}` : `Reference Video ${idx + 1}`}</span>
                      </div>
                      <video controls className="w-full rounded-xl max-h-60 bg-black/60" src={url} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio */}
            {meta?.audioUrls && meta.audioUrls.length > 0 && (
              <div>
                <span className="text-xs text-white/50 block mb-3 font-medium">
                  {isRtl ? `الملفات الصوتية المرجعية (${meta.audioUrls.length})` : `Reference Audios (${meta.audioUrls.length})`}
                </span>
                <div className="space-y-3">
                  {meta.audioUrls.map((url: string, idx: number) => (
                    <div key={idx} className="rounded-2xl border border-white/15 bg-black/40 p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs text-white/60">
                        <Music className="w-3.5 h-3.5 text-violet-400" />
                        <span>{isRtl ? `صوت مرجعي ${idx + 1}` : `Reference Audio ${idx + 1}`}</span>
                      </div>
                      <audio controls className="w-full" src={url} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Text / Prompt */}
        {record.inputText && (
          <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/60 font-medium text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                <span>{isRtl ? "النص المدخل (Prompt)" : "Input Prompt"}</span>
              </h3>
              <button
                onClick={() => copyToClipboard(record.inputText)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 hover:text-white text-xs transition-all"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? (isRtl ? "تم النسخ" : "Copied!") : (isRtl ? "نسخ الوصف" : "Copy Prompt")}</span>
              </button>
            </div>
            <p className="text-white text-lg leading-relaxed whitespace-pre-wrap selection:bg-violet-500/40 bg-black/20 p-4 rounded-2xl border border-white/5 font-sans">
              {record.inputText}
            </p>
          </div>
        )}

        {/* Result Text (If Voice-to-Text or GPT) */}
        {record.resultText && record.type !== "text-to-voice" && (
          <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-emerald-400/80 font-medium text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{isRtl ? "النتيجة النصية المستخرجة" : "Extracted Result"}</span>
              </h3>
              <button
                onClick={() => copyToClipboard(record.resultText)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 hover:text-white text-xs transition-all"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? (isRtl ? "تم النسخ" : "Copied!") : (isRtl ? "نسخ النص" : "Copy Text")}</span>
              </button>
            </div>
            <div className="bg-black/30 rounded-2xl p-5 md:p-6 border border-white/5">
              <p className="text-white leading-relaxed whitespace-pre-wrap">{record.resultText}</p>
            </div>
          </div>
        )}

        {/* Media Player (Video/Audio/Image) */}
        {record.fileUrl && (
          <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl p-6 md:p-8 border border-fuchsia-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-fuchsia-300 font-medium text-sm flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span>{isRtl ? "النتيجة النهائية المولدة" : "Generated Output"}</span>
              </h3>
              <button
                onClick={() => handleDownload(record.fileUrl, `${record.type}_${record.id.slice(0, 8)}.${isImage ? 'png' : isVideo ? 'mp4' : 'mp3'}`)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-white text-xs font-semibold transition-all shadow-md hover:scale-[1.02]"
              >
                <span>{isRtl ? "تحميل النتيجة" : "Download Result"}</span>
              </button>
            </div>
            
            {isVideo && (
              <video controls className="w-full mt-2 rounded-2xl border border-white/15 bg-black/60 shadow-2xl" src={record.fileUrl}>
                Your browser does not support the video element.
              </video>
            )}
            
            {isAudio && (
              <audio controls className="w-full mt-2" src={record.fileUrl}>
                Your browser does not support the audio element.
              </audio>
            )}

            {isImage && (
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 flex items-center justify-center p-3">
                <img src={record.fileUrl} alt="Result" className="max-h-[650px] w-auto rounded-xl object-contain shadow-2xl" />
              </div>
            )}
          </div>
        )}

        {/* Lightbox Modal for Image Preview */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewImage(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden border border-white/20 bg-black/90 p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={previewImage} alt="Preview" className="max-h-[80vh] w-auto rounded-2xl object-contain" />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-white/20 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] selection:bg-violet-500/30">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="h-full flex flex-col"
        >
          {/* Back Button */}
          <button 
            onClick={() => router.push(`/${locale}/history`)}
            className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit mb-8"
          >
            {isRtl ? <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />}
            <span>{isRtl ? "العودة للسجل" : "Back to History"}</span>
          </button>

          {renderContent()}

        </motion.div>
      </main>

      <Footer />
      <MobileBottomNav />
      <div className="h-16 md:hidden" />
    </div>
  );
}
