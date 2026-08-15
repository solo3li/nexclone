"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { 
  Video, 
  Music, 
  Zap, 
  SlidersHorizontal, 
  ChevronDown, 
  Monitor, 
  Coins, 
  Check, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  X, 
  Scissors, 
  Volume2, 
  Download, 
  Loader2, 
  Layers,
  ArrowLeftRight,
  Clock,
  Sparkles,
  Play,
  Pause,
  Smile,
  ShieldCheck
} from "lucide-react";
import { useAppStore } from "../../../../src/store/useAppStore";
import { useToolsStore } from "../../../../src/store/useToolsStore";
import api from "../../../../src/utils/api";
import MediaTrimmer from "../../../../components/MediaTrimmer";

interface LipSyncModel {
  id: string;
  name: string;
  nameAr: string;
  badge: string;
  badgeAr: string;
  desc: string;
  descAr: string;
}

const LIPSYNC_MODELS: LipSyncModel[] = [
  {
    id: "vidu-lipsync-std",
    name: "Standard Studio Sync",
    nameAr: "استوديو سينك القياسي",
    badge: "Fast Rendering",
    badgeAr: "معالجة سريعة",
    desc: "Optimized for fast rendering and talking head videos",
    descAr: "معالجة متوازنة وسريعة لمقاطع التحدث التوضيحية"
  }
];

const ACCURACY_OPTIONS = [
  { id: "studio", label: "Studio Grade (أعلى دقة لمخارج الحروف)", labelEn: "Studio Grade (High Precision)", desc: "Maximum phonetic alignment", descAr: "تطابق تام لحركة الفم واللسان مع كل نبرة" },
  { id: "balanced", label: "Balanced (متوازن وسلس)", labelEn: "Balanced (Smooth Flow)", desc: "Smooth blend with slight facial movement", descAr: "حركة ناعمة مريحة للعين" }
];

const EXPRESSION_OPTIONS = [
  { id: "natural", label: "تعبيرات طبيعية ومحايدة", labelEn: "Natural & Neutral", desc: "Default facial expression", descAr: "يحافظ على وضعية وجه المتحدث الأصلية" },
  { id: "expressive", label: "تعبيرات حماسية وتفاعلية", labelEn: "Expressive & Dynamic", desc: "Enhanced emotional delivery", descAr: "تفاعل حركي مع نبرات الصوت القوية" }
];

function AdvancedLipSyncPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user, setUser, isAuthenticated } = useAppStore();
  const { startLipsync } = useToolsStore();

  // Media Inputs
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);

  // Trimmer Modals
  const [showVideoTrimmer, setShowVideoTrimmer] = useState(false);
  const [showAudioTrimmer, setShowAudioTrimmer] = useState(false);

  // Settings State
  const [selectedModelId, setSelectedModelId] = useState<string>("vidu-lipsync-std");

  // Dropdown UI Open States
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Processing & Polling State
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cost Estimation
  const [estimatedCost, setEstimatedCost] = useState<number>(user?.activePlan?.lipSyncCostPerGeneration || 1);
  const [isEstimating, setIsEstimating] = useState(false);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Refs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const accRef = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const exprRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) setIsModelDropdownOpen(false);
      if (accRef.current && !accRef.current.contains(event.target as Node)) setIsAccDropdownOpen(false);
      if (resRef.current && !resRef.current.contains(event.target as Node)) setIsResDropdownOpen(false);
      if (exprRef.current && !exprRef.current.contains(event.target as Node)) setIsExprDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMediaDuration = (file: File, type: 'video' | 'audio'): Promise<number> => {
    return new Promise((resolve) => {
      const el = document.createElement(type);
      el.preload = 'metadata';
      el.onloadedmetadata = () => {
        resolve(el.duration);
        URL.revokeObjectURL(el.src);
      };
      el.src = URL.createObjectURL(file);
    });
  };

  // Dynamic cost calculation based on audio / video duration
  useEffect(() => {
    const effectiveDuration = audioDuration ?? videoDuration;
    if (effectiveDuration == null || !isAuthenticated || !user) {
      setEstimatedCost(user?.activePlan?.lipSyncCostPerGeneration || 1);
      return;
    }
    setIsEstimating(true);
    const params = new URLSearchParams();
    params.append('durationSeconds', effectiveDuration.toFixed(2));
    api.get(`/api/video/estimate-lipsync?${params.toString()}`)
      .then(res => {
        if (res.data && (res.data.estimatedCost !== undefined || res.data.totalCost !== undefined)) {
          setEstimatedCost(res.data.estimatedCost || res.data.totalCost || 1);
        }
      })
      .catch(() => {
        // Fallback: 1 credit per 5s block
        const blocks = Math.max(1, Math.ceil(effectiveDuration / 5));
        setEstimatedCost(blocks);
      })
      .finally(() => setIsEstimating(false));
  }, [isAuthenticated, user, videoDuration, audioDuration]);

  // Polling for Lipsync result
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;

    if (isProcessing) {
      setElapsedSeconds(0);
      timer = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);

      if (currentTaskId) {
        pollInterval = setInterval(async () => {
          try {
            const res = await api.get(`/api/video/status/${currentTaskId}`);
            const data = res.data;
            if (data && (data.status === "succeeded" || data.status === "completed")) {
              setOutputVideoUrl(data.url || data.fileUrl);
              setIsProcessing(false);
              setCurrentTaskId(null);
              setSuccessMessage(isRtl ? "🎉 تمت مزامنة الشفاه بنجاح! يمكنك الآن مشاهدة وتحميل الفيديو." : "🎉 Lip sync completed successfully!");
              api.get("/api/auth/me").then(uRes => {
                if (uRes.data) setUser(uRes.data);
              }).catch(() => {});
            } else if (data && data.status === "failed") {
              setError(data.error || data.errorMessage || (isRtl ? "فشلت عملية مزامنة الشفاه" : "Lip sync operation failed"));
              setIsProcessing(false);
              setCurrentTaskId(null);
            }
          } catch (err) {
            console.error("Lip sync polling error:", err);
          }
        }, 3000);
      }
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      clearInterval(timer);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isProcessing, currentTaskId, isRtl, setUser]);

  // Media Handlers
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      const dur = await getMediaDuration(file, 'video');
      setVideoDuration(dur);
      setShowVideoTrimmer(false);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setVideoDuration(null);
    setShowVideoTrimmer(false);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      const dur = await getMediaDuration(file, 'audio');
      setAudioDuration(dur);
      setShowAudioTrimmer(false);
    }
  };

  const removeAudio = () => {
    setAudioFile(null);
    setAudioPreview(null);
    setAudioDuration(null);
    setShowAudioTrimmer(false);
    setIsPlayingAudio(false);
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  const toggleAudioPlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const currentModel = useMemo(() => {
    return LIPSYNC_MODELS.find(m => m.id === selectedModelId) || LIPSYNC_MODELS[0];
  }, [selectedModelId]);

  const totalUserCredits = (user?.standardCredits || 0) + (user?.premiumCredits || 0);
  const hasSufficientCredits = totalUserCredits >= estimatedCost;

  // Submit Handler
  const handleStartLipSync = async () => {
    if (!isAuthenticated) {
      console.log("[LipSync Client] Start clicked, but not authenticated! Redirecting...");
      window.location.href = `/${locale}/login`;
      return;
    }
    if (!videoFile) {
      setError(isRtl ? "الرجاء رفع ملف فيديو يحتوي على وجه المتحدث" : "Please upload a speaker video file");
      return;
    }
    if (!audioFile) {
      setError(isRtl ? "الرجاء رفع الملف الصوتي المطلوب مزامنته" : "Please upload the target audio file");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);
    setOutputVideoUrl(null);

    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("audio", audioFile);
      formData.append("model", selectedModelId);

      const responseData = await startLipsync(formData);
      const taskId = responseData?.id || responseData?.taskId;
      if (taskId) {
        setCurrentTaskId(taskId);
        setSuccessMessage(isRtl ? "تم إرسال المهمة بنجاح! جاري معالجة حركة الشفاه بالذكاء الاصطناعي..." : "Task submitted! Processing lip sync AI model...");
        api.get("/api/auth/me").then(res => {
          if (res.data) setUser(res.data);
        }).catch(() => {});
      } else {
        throw new Error("No task ID returned");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || (isRtl ? "حدث خطأ أثناء إرسال طلب المزامنة" : "Error starting lip sync"));
      setIsProcessing(false);
      setCurrentTaskId(null);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const downloadVideo = () => {
    if (!outputVideoUrl) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5208';
    const proxyUrl = `${apiUrl}/api/video/download-proxy?url=${encodeURIComponent(outputVideoUrl)}`;
    
    const element = document.createElement("a");
    element.href = proxyUrl;
    element.target = "_blank";
    element.download = "lipsync_result.mp4";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Duration Comparison Analysis
  const isDurationMatching = useMemo(() => {
    if (!videoDuration || !audioDuration) return null;
    const diff = Math.abs(videoDuration - audioDuration);
    return diff <= 1.5; // Within 1.5s difference is ideal
  }, [videoDuration, audioDuration]);

  return (
    <div className="max-w-7xl mx-auto pb-16 pt-2" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Main Studio 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* 1. Main Center Area: Dual Media Studio (Video & Audio File Only)          */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Dual Media Pairing Studio */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-fuchsia-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "منصة مطابقة الفيديو والصوت (Lip Sync Media Pairing)" : "Lip Sync Media Pairing"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "ارفع فيديو المتحدث والملف الصوتي المطلوب مزامنته مع حركة الشفاه" : "Upload speaker video and the target audio track to sync mouth movement"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              
              {/* Slot 1: Source Video File */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white/80 px-1">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>{isRtl ? "فيديو الشخصية المتحدثة" : "Speaker Video"}</span>
                  </span>
                  {videoFile && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowVideoTrimmer(true)}
                        className="text-[10px] text-fuchsia-400 hover:text-fuchsia-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Scissors className="w-3 h-3" />
                        <span>{isRtl ? "تقطيع" : "Trim"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="text-[10px] text-red-400 hover:text-red-300 font-normal transition-colors"
                      >
                        {isRtl ? "حذف" : "Remove"}
                      </button>
                    </div>
                  )}
                </div>

                <div
                  onClick={() => !videoPreview && videoInputRef.current?.click()}
                  className={`relative h-48 rounded-xl border transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer group ${
                    videoPreview 
                      ? "border-fuchsia-500/40 bg-black/40" 
                      : "border-white/10 border-dashed bg-[#06010f] hover:border-fuchsia-500/50 hover:bg-white/5"
                  }`}
                >
                  {videoPreview ? (
                    <>
                      <video src={videoPreview} controls className="w-full h-full object-contain p-2" />
                      <div className="absolute top-2 end-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeVideo(); }}
                          className="p-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {videoDuration !== null && (
                        <div className="absolute bottom-2 start-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-fuchsia-300 font-mono border border-fuchsia-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{videoDuration.toFixed(1)}s</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-fuchsia-500/15 border border-white/5 group-hover:border-fuchsia-500/30 flex items-center justify-center transition-colors">
                        <Video className="w-4 h-4 text-white/40 group-hover:text-fuchsia-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white/70 group-hover:text-white block">
                          {isRtl ? "رفع فيديو المتحدث" : "Upload Speaker Video"}
                        </span>
                        <span className="text-[10px] text-white/30 block mt-0.5">
                          {isRtl ? "وجه واضح وإضاءة جيدة MP4, MOV" : "Clear face MP4, MOV, WEBM"}
                        </span>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={videoInputRef} onChange={handleVideoChange} accept="video/*" className="hidden" />
                </div>
              </div>

              {/* Slot 2: Target Audio File */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white/80 px-1">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isRtl ? "الملف الصوتي (Audio Track)" : "Target Audio Track"}</span>
                  </span>
                  {audioFile && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAudioTrimmer(true)}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Scissors className="w-3 h-3" />
                        <span>{isRtl ? "تقطيع" : "Trim"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={removeAudio}
                        className="text-[10px] text-red-400 hover:text-red-300 font-normal transition-colors"
                      >
                        {isRtl ? "حذف" : "Remove"}
                      </button>
                    </div>
                  )}
                </div>

                <div
                  onClick={() => !audioPreview && audioInputRef.current?.click()}
                  className={`relative h-48 rounded-xl border transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer group ${
                    audioPreview 
                      ? "border-amber-500/40 bg-black/40" 
                      : "border-white/10 border-dashed bg-[#06010f] hover:border-amber-500/50 hover:bg-white/5"
                  }`}
                >
                  {audioPreview ? (
                    <div className="w-full h-full p-4 flex flex-col items-center justify-center space-y-3">
                      <audio ref={audioPlayerRef} src={audioPreview} onEnded={() => setIsPlayingAudio(false)} className="hidden" />
                      
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleAudioPlay(); }}
                        className="w-12 h-12 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 flex items-center justify-center text-amber-300 transition-transform active:scale-95 shadow-lg shadow-amber-950/50"
                      >
                        {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ms-0.5" />}
                      </button>

                      <div className="text-center">
                        <p className="text-xs font-bold text-white truncate max-w-[200px]">{audioFile?.name}</p>
                        <p className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                          {audioDuration ? `${audioDuration.toFixed(1)}s` : "Audio Ready"}
                        </p>
                      </div>

                      <div className="absolute top-2 end-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeAudio(); }}
                          className="p-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-amber-500/15 border border-white/5 group-hover:border-amber-500/30 flex items-center justify-center transition-colors">
                        <Music className="w-4 h-4 text-white/40 group-hover:text-amber-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white/70 group-hover:text-white block">
                          {isRtl ? "رفع الملف الصوتي" : "Upload Audio File"}
                        </span>
                        <span className="text-[10px] text-white/30 block mt-0.5">
                          {isRtl ? "صوت نقي وواضح MP3, WAV, M4A" : "Clear speech MP3, WAV, M4A"}
                        </span>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={audioInputRef} onChange={handleAudioChange} accept="audio/*" className="hidden" />
                </div>
              </div>

            </div>

            {/* Live Duration Sync Indicator */}
            {(videoDuration !== null || audioDuration !== null) && (
              <div className="bg-[#06010f] border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 font-mono">
                  <div className="flex items-center gap-1.5 text-fuchsia-300">
                    <Video className="w-3.5 h-3.5" />
                    <span>{isRtl ? "الفيديو:" : "Video:"} {videoDuration ? `${videoDuration.toFixed(1)}s` : "--"}</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? "الصوت:" : "Audio:"} {audioDuration ? `${audioDuration.toFixed(1)}s` : "--"}</span>
                  </div>
                </div>

                {isDurationMatching !== null && (
                  <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${
                    isDurationMatching 
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" 
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      {isDurationMatching 
                        ? (isRtl ? "المدة متناسقة ومثالية للرندر ✨" : "Duration matched perfectly ✨") 
                        : (isRtl ? "تنبيه: يُفضل تقطيع الفيديو ليطابق مدة الصوت" : "Tip: Trim video to match audio length")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Media Trimmers */}
            {showVideoTrimmer && videoFile && (
              <div className="pt-2 border-t border-white/5">
                <MediaTrimmer
                  file={videoFile}
                  type="video"
                  isRtl={isRtl}
                  accentColor="fuchsia"
                  onTrimmed={async (f) => {
                    setVideoFile(f);
                    setVideoPreview(URL.createObjectURL(f));
                    const dur = await getMediaDuration(f, 'video');
                    setVideoDuration(dur);
                    setShowVideoTrimmer(false);
                  }}
                  onCancel={() => setShowVideoTrimmer(false)}
                />
              </div>
            )}

            {showAudioTrimmer && audioFile && (
              <div className="pt-2 border-t border-white/5">
                <MediaTrimmer
                  file={audioFile}
                  type="audio"
                  isRtl={isRtl}
                  accentColor="amber"
                  onTrimmed={async (f) => {
                    setAudioFile(f);
                    setAudioPreview(URL.createObjectURL(f));
                    const dur = await getMediaDuration(f, 'audio');
                    setAudioDuration(dur);
                    setShowAudioTrimmer(false);
                  }}
                  onCancel={() => setShowAudioTrimmer(false)}
                />
              </div>
            )}

          </div>

          {/* Processing Banner */}
          {isProcessing && (
            <div className="p-5 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-md">
              <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin" />
              <div className="text-center space-y-1">
                <h3 className="text-white font-bold text-sm md:text-base">
                  {isRtl ? "جاري مطابقة ومزامنة الشفاه مع الصوت..." : "Synchronizing Lips with Audio..."}
                </h3>
                <p className="text-white/60 text-xs">
                  {isRtl ? "يتم تعديل إطارات الفم والوجه بدقة فائقة لتطابق نبرات الصوت بدون أي تشويش." : "Rendering realistic mouth movements matching audio phonemes."}
                </p>
                <div className="text-2xl font-mono text-fuchsia-300 font-bold pt-1">{formatTime(elapsedSeconds)}</div>
              </div>
            </div>
          )}

          {/* Notifications: Error / Success */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3 backdrop-blur-md">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div className="space-y-0.5">
                <p className="font-bold">{isRtl ? "خطأ في المزامنة" : "Lip Sync Error"}</p>
                <p className="text-xs text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-start gap-3 backdrop-blur-md">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              <div className="space-y-0.5">
                <p className="font-bold">{isRtl ? "اكتملت العملية" : "Lip Sync Completed"}</p>
                <p className="text-xs text-emerald-300/80">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Output Video Player */}
          {outputVideoUrl && (
            <div className="bg-[#0b0416]/95 border border-fuchsia-500/30 rounded-2xl p-5 shadow-2xl space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4 text-fuchsia-400" />
                  <span>{isRtl ? "الفيديو النهائي المتزامن" : "Synchronized Lip Sync Video"}</span>
                </h3>
                <button
                  type="button"
                  onClick={downloadVideo}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-xl text-xs font-bold transition-all hover:opacity-90 shadow-md"
                >
                  {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{isRtl ? "تحميل الفيديو" : "Download Video"}</span>
                </button>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/10">
                <video controls src={outputVideoUrl} className="w-full h-full object-contain" />
              </div>
            </div>
          )}

          {/* Action Bar & Submit CTA */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-start">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-white/50">
                <span>{isRtl ? "المحرك:" : "Engine:"}</span>
                <span className="font-bold text-white">{isRtl ? currentModel.nameAr : currentModel.name}</span>
                
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-white/50">{isRtl ? "التكلفة التقديرية:" : "Estimated Cost:"}</span>
                <span className="text-xl font-black text-amber-300 font-mono">{estimatedCost}</span>
                <span className="text-xs text-amber-300/70 font-semibold">{isRtl ? "نقطة" : "Credits"}</span>
                {(audioDuration || videoDuration) && (
                  <span className="text-[10px] text-white/40 font-mono">
                    ({Math.ceil((audioDuration ?? videoDuration ?? 5) / 5)} {isRtl ? "وحدات × 5ث" : "blocks × 5s"})
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartLipSync}
              disabled={isProcessing || !videoFile || !audioFile || (!hasSufficientCredits && isAuthenticated)}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isProcessing || !videoFile || !audioFile || !hasSufficientCredits
                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-fuchsia-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-fuchsia-900/40 hover:shadow-fuchsia-800/70 active:scale-[0.98]"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isRtl ? "جاري المزامنة..." : "Processing Lip Sync..."}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{isRtl ? `بدء مزامنة الشفاه (${estimatedCost} نقطة)` : `Start Lip Sync (${estimatedCost} Credits)`}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. Side Settings Panel: Compact Dropdowns & Parameters Controls           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          <div className="sticky top-20 bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-fuchsia-400" />
                <span>{isRtl ? "إعدادات مزامنة الشفاه" : "Lip Sync Settings"}</span>
              </h2>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Options</span>
            </div>

            {/* 1. Sync Model Engine Dropdown */}
            <div className="space-y-1.5 relative" ref={modelRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>{isRtl ? "محرك المزامنة (AI Model)" : "Sync Engine"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-fuchsia-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs md:text-sm text-white truncate">
                      {isRtl ? currentModel.nameAr : currentModel.name}
                    </span>
                    <span className="text-[9px] font-bold text-fuchsia-400 bg-fuchsia-500/10 px-1 py-0.5 rounded shrink-0">
                      {isRtl ? currentModel.badgeAr : currentModel.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 truncate mt-0.5">
                    {isRtl ? currentModel.descAr : currentModel.desc}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 shrink-0 ${isModelDropdownOpen ? "rotate-180 text-fuchsia-400" : ""}`} />
              </button>

              {/* Model Dropdown Menu */}
              {isModelDropdownOpen && (
                <div className="absolute z-50 top-full mt-1.5 w-full bg-[#0d041c] border border-fuchsia-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {LIPSYNC_MODELS.map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setSelectedModelId(m.id); setIsModelDropdownOpen(false); }}
                        className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-fuchsia-600/25 text-white border border-fuchsia-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{isRtl ? m.nameAr : m.name}</span>
                          </div>
                          <p className="text-[10px] text-white/40">{isRtl ? m.descAr : m.desc}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Live Summary & Wallet Widget */}
            <div className="pt-2 border-t border-white/5 space-y-2.5">
              <div className="bg-[#06010f] border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">{isRtl ? "تكلفة العملية:" : "Operation Cost:"}</span>
                  <span className="font-bold text-amber-300 font-mono">{estimatedCost} Cr</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">{isRtl ? "الرصيد المتاح:" : "Your Balance:"}</span>
                  <span className="font-bold text-white font-mono">{totalUserCredits.toLocaleString()} Cr</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-white/5">
                  <span className="text-white/50">{isRtl ? "الرصيد المتبقي:" : "Remaining:"}</span>
                  <span className={`font-bold font-mono ${hasSufficientCredits ? "text-emerald-400" : "text-red-400"}`}>
                    {(totalUserCredits - estimatedCost).toLocaleString()} Cr
                  </span>
                </div>
              </div>

              {!hasSufficientCredits && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{isRtl ? "رصيدك غير كافٍ. يرجى شحن الرصيد." : "Insufficient credits. Please top up."}</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdvancedLipSyncPage), { ssr: false });
