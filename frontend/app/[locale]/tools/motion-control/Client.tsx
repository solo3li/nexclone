"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { 
  Video, 
  Image as ImageIcon, 
  Zap, 
  Wand2, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronDown, 
  Monitor, 
  Coins, 
  Check, 
  Copy, 
  CheckCheck, 
  Trash2, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  X, 
  Scissors, 
  Volume2, 
  VolumeX, 
  FastForward, 
  Download, 
  Loader2, 
  Layers,
  ArrowLeftRight
} from "lucide-react";
import { useAppStore } from "../../../../src/store/useAppStore";
import { useToolsStore } from "../../../../src/store/useToolsStore";
import api from "../../../../src/utils/api";
import MediaTrimmer from "../../../../components/MediaTrimmer";

const SAMPLE_MOTION_PROMPTS = {
  ar: [
    { title: "حركة سينمائية طبيعية", text: "نقل حركي انسيابي متطابق مع الفيديو المرجعي، مع الحفاظ الكامل على ملامح وتفاصيل الشخصية الأصلية والأقمشة بدقة 1080p." },
    { title: "تفاعل وتحدث تعبيري", text: "مطابقة حركية دقيقة لإيماءات اليدين وتعبيرات الوجه وانحناءات الجسد الطبيعية مع إضاءة سينمائية محيطية دافئة." },
    { title: "حركة رياضية وديناميكية", text: "محاكاة واقعية عالية السرعة للحركات الرياضية والانعطافات الجسدية مع فيزياء حركة واقعية وتفاصيل بصرية نقية." },
    { title: "رقص وتمايل إيقاعي", text: "انسيابية فائقة في نقل حركات الرقص والتناغم الحركي مع ثبات تام لملامح الوجه وزاوية الكاميرا." }
  ],
  en: [
    { title: "Cinematic Natural Motion", text: "Fluid motion transfer accurately mirroring the reference video, preserving character facial identity and fabric physics in full 1080p." },
    { title: "Expressive Gestures & Speech", text: "Precise gesture matching, natural body posture changes, and expressive nuances with coherent volumetric ambient lighting." },
    { title: "Dynamic Athletic Movement", text: "High-speed athletic motion tracking with realistic physical momentum and crisp character detail retention." },
    { title: "Rhythmic Dance Flow", text: "Ultra-smooth choreographic motion transfer maintaining strict facial consistency and natural camera perspective." }
  ]
};

function MotionControlPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user, setUser, isAuthenticated } = useAppStore();
  const { startMotionControl, estimateMotionControl } = useToolsStore();

  // Media Inputs
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Trimmer State
  const [showVideoTrimmer, setShowVideoTrimmer] = useState(false);

  // Form Parameters
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState<"720p" | "1080p">("1080p");
  const [renderingSpeed, setRenderingSpeed] = useState<"std" | "pro">("pro");
  const [characterOrientation, setCharacterOrientation] = useState<"video" | "image">("video");
  const [keepOriginalSound, setKeepOriginalSound] = useState<"yes" | "no">("yes");

  // Dropdown States
  const [isResDropdownOpen, setIsResDropdownOpen] = useState(false);
  const [isSpeedDropdownOpen, setIsSpeedDropdownOpen] = useState(false);
  const [isOrientDropdownOpen, setIsOrientDropdownOpen] = useState(false);
  const [isSoundDropdownOpen, setIsSoundDropdownOpen] = useState(false);

  // Execution & Progress State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Cost Estimation
  const [estimatedCost, setEstimatedCost] = useState<number>(user?.activePlan?.avatarVideoCostPerGeneration || 5);
  const [isEstimating, setIsEstimating] = useState(false);

  // Refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const orientRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resRef.current && !resRef.current.contains(event.target as Node)) setIsResDropdownOpen(false);
      if (speedRef.current && !speedRef.current.contains(event.target as Node)) setIsSpeedDropdownOpen(false);
      if (orientRef.current && !orientRef.current.contains(event.target as Node)) setIsOrientDropdownOpen(false);
      if (soundRef.current && !soundRef.current.contains(event.target as Node)) setIsSoundDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch estimated cost
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated && user) {
      setIsEstimating(true);
      const qs = `?renderingSpeed=${renderingSpeed}&resolution=${resolution}`;
      estimateMotionControl(qs)
        .then((data: any) => {
          if (data && (data.estimatedCost !== undefined || data.totalCost !== undefined)) {
            if (isMounted) setEstimatedCost(data.estimatedCost || data.totalCost || 5);
          }
        })
        .catch(() => {
          if (isMounted) setEstimatedCost(renderingSpeed === "pro" ? 5 : 3);
        })
        .finally(() => {
          if (isMounted) setIsEstimating(false);
        });
    }
    return () => { isMounted = false; };
  }, [isAuthenticated, user, renderingSpeed, resolution]);

  // Polling for completion
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;

    if (isProcessing) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);

      if (currentTaskId) {
        pollInterval = setInterval(async () => {
          try {
            const res = await api.get(`/api/history/${currentTaskId}`);
            if (res.data) {
              if (res.data.status === 'completed' || res.data.status === 'succeeded') {
                setOutputVideoUrl(res.data.fileUrl);
                setIsProcessing(false);
                setCurrentTaskId(null);
                setSuccessMessage(isRtl ? "🎉 اكتمل نقل الحركة بنجاح! يمكنك الآن مشاهدة وتحميل الفيديو." : "🎉 Motion transfer completed successfully!");
                api.get("/api/auth/me").then(uRes => {
                  if (uRes.data) setUser(uRes.data);
                }).catch(() => {});
              } else if (res.data.status === 'failed') {
                setError(res.data.errorMessage || (isRtl ? "فشلت عملية نقل الحركة" : "Operation failed"));
                setIsProcessing(false);
                setCurrentTaskId(null);
              }
            }
          } catch (err) {
            console.error("Polling error:", err);
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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setShowVideoTrimmer(false);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setShowVideoTrimmer(false);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const totalUserCredits = (user?.standardCredits || 0) + (user?.premiumCredits || 0);
  const hasSufficientCredits = totalUserCredits >= estimatedCost;


  const handleCopyPrompt = () => {
    if (prompt.trim()) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearPrompt = () => {
    setPrompt("");
  };

  // Submit Handler
  const handleStartGeneration = async () => {
    if (!imageFile) {
      setError(isRtl ? "الرجاء رفع صورة الشخصية المراد تطبيق الحركة عليها" : "Please upload a character image");
      return;
    }
    if (!videoFile) {
      setError(isRtl ? "الرجاء رفع فيديو الحركة المرجعي" : "Please upload a reference motion video");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);
    setOutputVideoUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("video", videoFile);
      if (prompt.trim()) formData.append("prompt", prompt.trim());
      formData.append("resolution", resolution);
      formData.append("renderingSpeed", renderingSpeed);
      formData.append("orientation", characterOrientation);
      formData.append("keepOriginalSound", keepOriginalSound);

      const responseData = await startMotionControl(formData);
      if (responseData && (responseData.id || responseData.taskId)) {
        setCurrentTaskId(responseData.id || responseData.taskId);
        setSuccessMessage(isRtl ? "تم إرسال مهمة نقل الحركة بنجاح! جاري المعالجة..." : "Motion task queued successfully! Processing...");
        api.get("/api/auth/me").then(res => {
          if (res.data) setUser(res.data);
        }).catch(() => {});
      } else {
        throw new Error("No task ID returned");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || (isRtl ? "حدث خطأ أثناء بدء عملية نسخ الحركة" : "Error starting motion transfer"));
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
    element.download = "motion_transfer_result.mp4";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 pt-2" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Main Studio 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* 1. Main Center/Right Area: Dual Media Pairing & Prompt Studio             */}
        {/* ========================================================================= */}
        <div className="order-2 lg:order-1 lg:col-span-8 space-y-5">
          
          {/* Dual Uploading Pairing Grid */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "منصة مطابقة ونقل الحركة (Motion Transfer Pairing)" : "Motion Transfer Pairing"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "ارفع صورة الشخصية الهدف وفيديو الحركة المطلوب نسخه" : "Pair target character image with source motion reference video"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              
              {/* Slot 1: Target Character Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white/80 px-1">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isRtl ? "صورة الشخصية الهدف" : "Target Character Image"}</span>
                  </span>
                  {imageFile && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-[10px] text-red-400 hover:text-red-300 font-normal transition-colors"
                    >
                      {isRtl ? "حذف" : "Remove"}
                    </button>
                  )}
                </div>

                <div
                  onClick={() => !imagePreview && imageInputRef.current?.click()}
                  className={`relative h-48 rounded-xl border transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer group ${
                    imagePreview 
                      ? "border-cyan-500/40 bg-black/40" 
                      : "border-white/10 border-dashed bg-[#06010f] hover:border-cyan-500/50 hover:bg-white/5"
                  }`}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Target Character" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                        <span className="text-[10px] text-white/80 font-medium truncate">{imageFile?.name}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(); }}
                          className="p-1 rounded-lg bg-red-500 text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-cyan-500/15 border border-white/5 group-hover:border-cyan-500/30 flex items-center justify-center transition-colors">
                        <Upload className="w-4 h-4 text-white/40 group-hover:text-cyan-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white/70 group-hover:text-white block">
                          {isRtl ? "رفع صورة الشخصية" : "Upload Character"}
                        </span>
                        <span className="text-[10px] text-white/30 block mt-0.5">
                          {isRtl ? "يفضل النصف العلوي أو الجسم كامل" : "Full or upper body recommended"}
                        </span>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
              </div>

              {/* Slot 2: Reference Motion Video */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white/80 px-1">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isRtl ? "فيديو الحركة المرجعي" : "Motion Reference Video"}</span>
                  </span>
                  {videoFile && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowVideoTrimmer(true)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
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
                      ? "border-blue-500/40 bg-black/40" 
                      : "border-white/10 border-dashed bg-[#06010f] hover:border-blue-500/50 hover:bg-white/5"
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
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-blue-500/15 border border-white/5 group-hover:border-blue-500/30 flex items-center justify-center transition-colors">
                        <Video className="w-4 h-4 text-white/40 group-hover:text-blue-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white/70 group-hover:text-white block">
                          {isRtl ? "رفع فيديو الحركة" : "Upload Reference Video"}
                        </span>
                        <span className="text-[10px] text-white/30 block mt-0.5">
                          {isRtl ? "حركات واضحة ومستقرة MP4, MOV" : "Clear movement MP4, MOV"}
                        </span>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={videoInputRef} onChange={handleVideoChange} accept="video/*" className="hidden" />
                </div>
              </div>

            </div>

            {/* Video Trimmer Modal / Drawer */}
            {showVideoTrimmer && videoFile && (
              <div className="pt-2 border-t border-white/5">
                <MediaTrimmer
                  file={videoFile}
                  type="video"
                  isRtl={isRtl}
                  accentColor="cyan"
                  onTrimmed={(f) => {
                    setVideoFile(f);
                    setVideoPreview(URL.createObjectURL(f));
                    setShowVideoTrimmer(false);
                  }}
                  onCancel={() => setShowVideoTrimmer(false)}
                />
              </div>
            )}
          </div>

          {/* Motion Prompt Direction Studio */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md relative overflow-hidden group focus-within:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "توجيه المشهد والإضاءة (Motion Direction Prompt) - اختياري" : "Motion Direction Prompt (Optional)"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "أضف تفاصيل حول البيئة المحيطة أو جودة الإضاءة لتعزيز واقعية الفيديو" : "Describe environmental lighting, styling, or background details to enhance realism"}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5">

                {prompt && (
                  <>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      title={isRtl ? "نسخ النص" : "Copy"}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 transition-all"
                    >
                      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearPrompt}
                      title={isRtl ? "مسح النص" : "Clear"}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-300 border border-white/5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Prompt Textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder={
                  isRtl 
                    ? "اكتب وصفاً إضافياً للمشهد الحركي... (اختياري، مثلاً: نقل حركي انسيابي متطابق، إضاءة سينمائية دافئة، ثبات ملامح الوجه بدقة 1080p)" 
                    : "Describe additional motion direction... (e.g. Smooth natural body physics, warm cinematic studio rim lighting, 1080p clarity)"
                }
                className="w-full bg-[#06010f] border border-white/10 rounded-xl p-4 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 resize-none text-sm md:text-base leading-relaxed transition-all shadow-inner font-sans"
              />
              <div className="absolute bottom-3 end-3 text-[11px] text-white/40 font-mono bg-[#06010f]/90 px-2 py-0.5 rounded border border-white/5">
                {prompt.length} / 2000
              </div>
            </div>

          </div>

          {/* Processing State Banner */}
          {isProcessing && (
            <div className="p-5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-md">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="text-center space-y-1">
                <h3 className="text-white font-bold text-sm md:text-base">
                  {isRtl ? "جاري نقل ومطابقة الحركة..." : "Transferring Motion..."}
                </h3>
                <p className="text-white/60 text-xs">
                  {isRtl ? "قد تستغرق العملية بضع دقائق. يتم معالجة كل إطار لضمان ثبات الملامح." : "Processing video frames to ensure accurate motion fidelity."}
                </p>
                <div className="text-2xl font-mono text-cyan-300 font-bold pt-1">{formatTime(elapsedSeconds)}</div>
              </div>
            </div>
          )}

          {/* Notifications: Error / Success */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3 backdrop-blur-md">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div className="space-y-0.5">
                <p className="font-bold">{isRtl ? "خطأ في المعالجة" : "Processing Error"}</p>
                <p className="text-xs text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-start gap-3 backdrop-blur-md">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              <div className="space-y-0.5">
                <p className="font-bold">{isRtl ? "نجحت العملية" : "Task Completed"}</p>
                <p className="text-xs text-emerald-300/80">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Output Video Player (When ready) */}
          {outputVideoUrl && (
            <div className="bg-[#0b0416]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span>{isRtl ? "الفيديو النهائي المتحرك" : "Generated Motion Video"}</span>
                </h3>
                <button
                  type="button"
                  onClick={downloadVideo}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-xs font-bold transition-all hover:opacity-90 shadow-md"
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
                <span>{isRtl ? "الدقة:" : "Resolution:"}</span>
                <span className="text-cyan-300 font-bold">{resolution}</span>
                <span>•</span>
                <span>{renderingSpeed === "pro" ? "Pro Quality" : "Standard"}</span>
                <span>•</span>
                <span>{isRtl ? (keepOriginalSound === "yes" ? "صوت مدمج" : "صامت") : (keepOriginalSound === "yes" ? "Audio On" : "Mute")}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-white/50">{isRtl ? "التكلفة:" : "Cost:"}</span>
                <span className="text-xl font-black text-cyan-300 font-mono">{estimatedCost}</span>
                <span className="text-xs text-cyan-300/70 font-semibold">{isRtl ? "نقطة" : "Credits"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartGeneration}
              disabled={isProcessing || !imageFile || !videoFile || !hasSufficientCredits}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isProcessing || !imageFile || !videoFile || !hasSufficientCredits
                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-cyan-900/40 hover:shadow-cyan-800/70 active:scale-[0.98]"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isRtl ? "جاري نسخ الحركة..." : "Transferring Motion..."}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-cyan-300" />
                  <span>{isRtl ? `بدء نسخ الحركة (${estimatedCost} نقطة)` : `Start Motion Transfer (${estimatedCost} Credits)`}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. Side Settings Panel: Compact Dropdowns & Parameters Controls           */}
        {/* ========================================================================= */}
        <div className="order-1 lg:order-2 lg:col-span-4 space-y-5">
          <div className="sticky top-20 bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? "إعدادات نسخ الحركة" : "Motion Settings"}</span>
              </h2>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Options</span>
            </div>

            {/* 1. Resolution Dropdown Select */}
            <div className="space-y-1.5 relative" ref={resRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isRtl ? "دقة الفيديو (Resolution)" : "Resolution"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsResDropdownOpen(!isResDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-cyan-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div>
                  <span className="font-bold text-xs md:text-sm text-white block">
                    {resolution === "1080p" ? "1080p Full HD" : "720p HD"}
                  </span>
                  <span className="text-[10px] text-white/40 block">
                    {resolution === "1080p" ? (isRtl ? "دقة كاملة فائقة النقاء" : "Full High Definition") : (isRtl ? "دقة قياسية سريعة" : "High Definition")}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isResDropdownOpen ? "rotate-180 text-cyan-400" : ""}`} />
              </button>

              {/* Resolution Dropdown Menu */}
              {isResDropdownOpen && (
                <div className="absolute z-40 top-full mt-1.5 w-full bg-[#0d041c] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => { setResolution("1080p"); setIsResDropdownOpen(false); }}
                    className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                      resolution === "1080p" 
                        ? "bg-cyan-500/20 text-white border border-cyan-500/40" 
                        : "hover:bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">1080p (Full HD)</span>
                      <span className="text-[10px] text-white/40">{isRtl ? "أعلى دقة وثبات للتفاصيل" : "Recommended for maximum clarity"}</span>
                    </div>
                    {resolution === "1080p" && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setResolution("720p"); setIsResDropdownOpen(false); }}
                    className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                      resolution === "720p" 
                        ? "bg-cyan-500/20 text-white border border-cyan-500/40" 
                        : "hover:bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">720p (HD)</span>
                      <span className="text-[10px] text-white/40">{isRtl ? "دقة قياسية أسرع في المعالجة" : "Faster rendering"}</span>
                    </div>
                    {resolution === "720p" && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>
                </div>
              )}
            </div>

            {/* 2. Processing Speed / Quality Dropdown Select */}
            <div className="space-y-1.5 relative" ref={speedRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <FastForward className="w-3.5 h-3.5 text-blue-400" />
                <span>{isRtl ? "جودة وسرعة المعالجة" : "Processing Mode"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsSpeedDropdownOpen(!isSpeedDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-blue-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div>
                  <span className="font-bold text-xs md:text-sm text-white block">
                    {renderingSpeed === "pro" ? (isRtl ? "وضع الاحتراف Pro (أعلى جودة)" : "Pro Quality Mode") : (isRtl ? "الوضع القياسي Standard" : "Standard Speed Mode")}
                  </span>
                  <span className="text-[10px] text-white/40 block">
                    {renderingSpeed === "pro" ? (isRtl ? "معالجة أعمق لأدق تفاصيل الحركة" : "Deep frame-by-frame physics") : (isRtl ? "رندر سريع متوازن" : "Fast balanced render")}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isSpeedDropdownOpen ? "rotate-180 text-blue-400" : ""}`} />
              </button>

              {/* Speed Dropdown Menu */}
              {isSpeedDropdownOpen && (
                <div className="absolute z-30 top-full mt-1.5 w-full bg-[#0d041c] border border-blue-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => { setRenderingSpeed("pro"); setIsSpeedDropdownOpen(false); }}
                    className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                      renderingSpeed === "pro" 
                        ? "bg-blue-500/20 text-white border border-blue-500/40" 
                        : "hover:bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">{isRtl ? "وضع الاحتراف Pro" : "Pro Mode"}</span>
                      <span className="text-[10px] text-white/40">{isRtl ? "أفضل دقة وتماسك حركي" : "Best quality & stability"}</span>
                    </div>
                    {renderingSpeed === "pro" && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRenderingSpeed("std"); setIsSpeedDropdownOpen(false); }}
                    className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                      renderingSpeed === "std" 
                        ? "bg-blue-500/20 text-white border border-blue-500/40" 
                        : "hover:bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">{isRtl ? "الوضع القياسي Standard" : "Standard Mode"}</span>
                      <span className="text-[10px] text-white/40">{isRtl ? "سرعة مضاعفة في التوليد" : "Fast generation"}</span>
                    </div>
                    {renderingSpeed === "std" && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </button>
                </div>
              )}
            </div>

            {/* 3. Character Orientation Dropdown Select */}
            <div className="space-y-1.5 relative" ref={orientRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isRtl ? "توجيه ومحاذاة الشخصية" : "Character Orientation"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsOrientDropdownOpen(!isOrientDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-indigo-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div>
                  <span className="font-bold text-xs md:text-sm text-white block">
                    {characterOrientation === "video" ? (isRtl ? "محاذاة حسب حركة الفيديو" : "Follow Video Motion") : (isRtl ? "ثبات اتجاه الصورة الأصلية" : "Maintain Image Pose")}
                  </span>
                  <span className="text-[10px] text-white/40 block">
                    {characterOrientation === "video" ? (isRtl ? "تتبع كامل لزوايا وانحناءات الفيديو" : "Adapts to reference camera angle") : (isRtl ? "الحفاظ على زاوية الصورة الثابتة" : "Keeps image original perspective")}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isOrientDropdownOpen ? "rotate-180 text-indigo-400" : ""}`} />
              </button>

              {/* Orientation Dropdown Menu */}
              {isOrientDropdownOpen && (
                <div className="absolute z-20 top-full mt-1.5 w-full bg-[#0d041c] border border-indigo-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => { setCharacterOrientation("video"); setIsOrientDropdownOpen(false); }}
                    className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                      characterOrientation === "video" 
                        ? "bg-indigo-500/20 text-white border border-indigo-500/40" 
                        : "hover:bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">{isRtl ? "محاذاة الفيديو (موصى به)" : "Video Alignment (Recommended)"}</span>
                      <span className="text-[10px] text-white/40">{isRtl ? "حركة متطابقة 100% مع الفيديو" : "Matches video camera & body shifts"}</span>
                    </div>
                    {characterOrientation === "video" && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCharacterOrientation("image"); setIsOrientDropdownOpen(false); }}
                    className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                      characterOrientation === "image" 
                        ? "bg-indigo-500/20 text-white border border-indigo-500/40" 
                        : "hover:bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">{isRtl ? "ثبات زاوية الصورة" : "Image Orientation"}</span>
                      <span className="text-[10px] text-white/40">{isRtl ? "الحفاظ على منظور الصورة الأصلي" : "Locks source image camera angle"}</span>
                    </div>
                    {characterOrientation === "image" && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  </button>
                </div>
              )}
            </div>

            {/* 4. Keep Original Sound Dropdown Select */}
            <div className="space-y-1.5 relative" ref={soundRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                {keepOriginalSound === "yes" ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-white/40" />}
                <span>{isRtl ? "الاحتفاظ بصوت الفيديو الأصلي" : "Keep Original Audio"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsSoundDropdownOpen(!isSoundDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-emerald-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div>
                  <span className="font-bold text-xs md:text-sm text-white block">
                    {keepOriginalSound === "yes" ? (isRtl ? "نعم (دمج صوت الفيديو المرجعي)" : "Yes (Include Audio)") : (isRtl ? "لا (فيديو صامت بدون صوت)" : "No (Mute Video)")}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isSoundDropdownOpen ? "rotate-180 text-emerald-400" : ""}`} />
              </button>

              {/* Sound Dropdown Menu */}
              {isSoundDropdownOpen && (
                <div className="absolute z-10 top-full mt-1.5 w-full bg-[#0d041c] border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => { setKeepOriginalSound("yes"); setIsSoundDropdownOpen(false); }}
                    className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                      keepOriginalSound === "yes" 
                        ? "bg-emerald-500/20 text-white border border-emerald-500/40" 
                        : "hover:bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-xs text-white">{isRtl ? "نعم (مدمج بالصوت)" : "Yes (With Audio)"}</span>
                    </div>
                    {keepOriginalSound === "yes" && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setKeepOriginalSound("no"); setIsSoundDropdownOpen(false); }}
                    className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                      keepOriginalSound === "no" 
                        ? "bg-emerald-500/20 text-white border border-emerald-500/40" 
                        : "hover:bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <VolumeX className="w-3.5 h-3.5 text-white/50" />
                      <span className="font-bold text-xs text-white">{isRtl ? "لا (فيديو صامت)" : "No (Mute)"}</span>
                    </div>
                    {keepOriginalSound === "no" && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                </div>
              )}
            </div>

            {/* 5. Live Summary & Wallet Widget */}
            <div className="pt-2 border-t border-white/5 space-y-2.5">
              <div className="bg-[#06010f] border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">{isRtl ? "تكلفة العملية:" : "Operation Cost:"}</span>
                  <span className="font-bold text-cyan-300 font-mono">{estimatedCost} Cr</span>
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

export default dynamic(() => Promise.resolve(MotionControlPage), { ssr: false });
