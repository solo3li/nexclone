"use client";

import dynamic from 'next/dynamic';

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { 
  Play, Download, Loader2, Wand2, 
  Video, UploadCloud, Image as ImageIcon, 
  Zap, Settings, ChevronDown, Wallet, ArrowLeft, ArrowRight,
  Monitor, Smartphone
} from "lucide-react";
import { useAppStore } from "../../../../src/store/useAppStore";
import { useToolsStore } from '../../../../src/store/useToolsStore';
import { useRouter, Link } from "../../../../src/i18n/routing";
import api from "../../../../src/utils/api";
import ToolInstructions from "../../../../components/ToolInstructions";

function ImageToVideoPage() {
  const t = useTranslations("ImageToVideo");
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user, isAuthenticated, hasPhoneNumber } = useAppStore();
  const router = useRouter();
  const ArrowIcon = locale === 'ar' ? ArrowRight : ArrowLeft;
  const { setUser } = useAppStore();
  const updateUser = useAppStore(state => state.updateUser);
  const { startAvatar } = useToolsStore();

  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [estimatedCost, setEstimatedCost] = useState<number>(user?.activePlan?.avatarVideoCostPerGeneration || 1);
  const [chargedWallet, setChargedWallet] = useState<string | null>(null);

  const [renderingSpeed, setRenderingSpeed] = useState<"std" | "pro">("std");
  
  useEffect(() => {
    if (isAuthenticated && user) {
      const subId = sessionStorage.getItem('preferredSubscriptionId');
      const qs = subId ? `?subscriptionId=${subId}&renderingSpeed=${renderingSpeed}` : `?renderingSpeed=${renderingSpeed}`;
      api.get(`/api/video/estimate-avatar${qs}`).then(res => {
        if (res.data) {
          setEstimatedCost(res.data.estimatedCost);
          setChargedWallet(res.data.chargedWalletName);
        }
      }).catch(err => {
        console.warn("Failed to get estimated cost:", err.response?.data?.error || err.message);
      });
    } else {
      setEstimatedCost(
        renderingSpeed === "pro" 
          ? (user?.activePlan?.avatarVideoProCost || 2) 
          : (user?.activePlan?.avatarVideoCostPerGeneration || 1)
      );
      setChargedWallet(null);
    }
  }, [isAuthenticated, user, renderingSpeed]);
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get("/api/settings/public");
        setIsMaintenanceMode(res.data?.isMaintenanceMode || false);
      } catch {
        // /api/settings/public may not be available — fail silently
        // isMaintenanceMode defaults to false, so the page renders normally
      }
    };
    fetchConfig();
  }, []);

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
              if (res.data.status === 'completed') {
                setVideoUrl(res.data.fileUrl);
                setIsProcessing(false);
                setCurrentTaskId(null);
                api.get("/api/auth/me").then(userRes => {
                  if (userRes.data) setUser(userRes.data);
                }).catch(err => console.error(err));
              } else if (res.data.status === 'failed') {
                setError(res.data.errorMessage || 'Operation failed');
                setIsProcessing(false);
                setCurrentTaskId(null);
              }
            }
          } catch(err) {
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
  }, [isProcessing, currentTaskId]);

  const handleProcessClick = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!imageFile) {
      setError(isRtl ? "الرجاء رفع صورة الشخصية." : "Please upload an avatar image.");
      return;
    }
    setError("");
    setShowConfirmModal(true);
  };

  const confirmGenerate = async () => {
    setShowConfirmModal(false);
    if (!imageFile) return;
    
    setIsProcessing(true);
    setCurrentTaskId(null);
    setElapsedSeconds(0);
    setError("");
    setVideoUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      if (audioFile) formData.append("audio", audioFile);
      if (prompt) formData.append("prompt", prompt);
      formData.append("renderingSpeed", renderingSpeed);

      const subId = sessionStorage.getItem('preferredSubscriptionId');
      if (subId) {
        formData.append("subscriptionId", subId);
      }
      const responseData = await startAvatar(formData);
      
      if (responseData && (responseData.id || responseData.taskId)) {
        setCurrentTaskId(responseData.id || responseData.taskId);
        api.get("/api/auth/me").then(res => {
          if (res.data) setUser(res.data);
        }).catch(err => console.error(err));
      } else {
        throw new Error("No task ID returned");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || t('error'));
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
    if (!videoUrl) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5208';
    const proxyUrl = `${apiUrl}/api/video/download-proxy?url=${encodeURIComponent(videoUrl)}`;
    
    const element = document.createElement("a");
    element.href = proxyUrl;
    element.target = "_blank";
    element.download = "generated_video.mp4";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="absolute top-1/4 left-1/4 w-[60%] h-[500px] bg-fuchsia-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />
      
      <div className="container mx-auto px-4 py-6 md:py-8 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative">
          
          {/* Left Column - Main Workspace */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-4 order-2 lg:order-1"
          >
            <div className="flex-1 bg-[#120822]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-4 flex flex-col relative overflow-hidden group shadow-2xl transition-all duration-500 hover:border-fuchsia-500/30">
              
              <div className="flex justify-between items-center px-2 mb-4" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-fuchsia-400" />
                  <span className="text-white/80 font-semibold text-sm">{t('uploadImage')}</span>
                </div>
              </div>

              {/* Upload Zone */}
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative min-h-[300px] border-2 border-dashed border-white/10 hover:border-fuchsia-500/50 rounded-xl bg-[#0a0015]/60 flex flex-col items-center justify-center gap-4 transition-all overflow-hidden group/upload cursor-pointer"
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Uploaded" className="absolute inset-0 w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-medium flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" />
                        {isRtl ? "انقر لتغيير الصورة" : "Click to change image"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageUrl(URL.createObjectURL(file));
                          setImageFile(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-fuchsia-500/10 flex items-center justify-center">
                      <UploadCloud className="w-8 h-8 text-fuchsia-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-white/80 font-medium mb-1">{t('imagePlaceholder')}</p>
                      <p className="text-white/40 text-xs">JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageUrl(URL.createObjectURL(file));
                          setImageFile(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </>
                )}
              </div>

              {/* URL Input Fallback */}
              <div className="mt-4" dir={isRtl ? 'rtl' : 'ltr'}>
                <input
                  type="text"
                  value={imageUrl.startsWith('blob:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder={isRtl ? "أو أدخل رابط الصورة هنا..." : "Or enter image URL here..."}
                  className="w-full bg-[#0a0015]/60 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 transition-all placeholder:text-white/30 text-sm"
                />
              </div>

              {/* Audio Input (Optional) */}
              <div className="mt-4 flex flex-col gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
                <label className="text-white/80 font-semibold text-sm px-1">{isRtl ? "ملف صوتي (مطلوب للـ Lip Sync)" : "Audio File (Required for Lip Sync)"}</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAudioFile(e.target.files[0]);
                      }
                    }}
                    className="w-full bg-[#0a0015]/60 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-500/10 file:text-fuchsia-400 hover:file:bg-fuchsia-500/20"
                  />
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mt-4 flex flex-col gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
                <label className="text-white/80 font-semibold text-sm px-1">{t('videoPrompt')}</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('promptPlaceholder')}
                  className="w-full bg-[#0a0015]/60 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 transition-all placeholder:text-white/30 text-sm min-h-[100px] resize-none"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-xl border border-red-500/20 mt-4 mx-2 text-center">
                  {error}
                  {(error.includes("رصيد") || error.includes("Insufficient") || error.includes("credits")) && (
                    <div className="mt-3">
                      <Link href="/pricing" className="inline-block px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 hover:text-white rounded-lg font-medium transition-colors">
                        {user?.activeSubscriptions?.some((s: any) => !s.isFreeTrial && !s.isDefaultRegistrationPlan)
                          ? (isRtl ? 'جدد اشتراكك' : 'Renew Subscription')
                          : (isRtl ? 'اشترك في باقة' : 'Subscribe to a plan')}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {isProcessing && (
                <div className="mt-4 p-4 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin" />
                  <div className="text-center">
                    <h3 className="text-white font-bold mb-1">{isRtl ? "جاري المعالجة..." : "Processing..."}</h3>
                    <p className="text-white/60 text-sm">{isRtl ? "تستغرق هذه العملية وقتاً طويلاً. يمكنك إغلاق هذه الصفحة، وسنرسل لك إشعاراً عند الانتهاء." : "This process takes some time. You can close this page, we will notify you when it's done."}</p>
                    <div className="mt-2 text-2xl font-mono text-fuchsia-300 font-bold">{formatTime(elapsedSeconds)}</div>
                  </div>
                  <Link href="/history" className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                     {isRtl ? "الذهاب لسجل العمليات" : "Go to History"}
                  </Link>
                </div>
              )}

              {!isProcessing && (
                <button
                    onClick={handleProcessClick}
                    disabled={!imageFile || !audioFile}
                    className="w-full mt-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                  <Wand2 className="w-5 h-5" />
                  {t('generate')}
                </button>
              )}

              {/* Output Video Player */}
              {videoUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-[#0a0015]/60 border border-white/5 rounded-xl flex flex-col gap-4"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Video className="w-5 h-5 text-fuchsia-400" />
                      {t('result')}
                    </h3>
                    <button onClick={downloadVideo} disabled={isDownloading} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white text-sm transition-all font-medium">
                      {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {isDownloading ? (isRtl ? "جاري التحميل..." : "Downloading...") : t('download')}
                    </button>
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                     <video controls src={videoUrl} className="w-full h-full object-contain" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Settings Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-4 order-1 lg:order-2"
          >
            <div className="bg-[#120822]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-3 flex-shrink-0">
              <div className="flex items-center gap-2 mb-4 px-1" dir={isRtl ? 'rtl' : 'ltr'}>
                <Settings className="w-4 h-4 text-fuchsia-400" />
                <h2 className="text-base font-bold text-white">{t('taskSettings')}</h2>
              </div>
              
              <div className="space-y-3" dir={isRtl ? 'rtl' : 'ltr'}>
                
                {/* Processing Speed Selection */}
                <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-3">
                  <h3 className="text-white text-sm font-medium">{isRtl ? "سرعة المعالجة" : "Processing Speed"}</h3>
                  <div className="flex bg-black/40 rounded-lg p-1">
                    <button
                      onClick={() => setRenderingSpeed("std")}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${renderingSpeed === "std" ? "bg-white/20 text-white shadow-sm" : "text-white/60 hover:text-white/80"}`}
                    >
                      {isRtl ? "عادي" : "Standard"}
                    </button>
                    <button
                      onClick={() => setRenderingSpeed("pro")}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${renderingSpeed === "pro" ? "bg-fuchsia-600/50 text-fuchsia-100 shadow-sm" : "text-white/60 hover:text-white/80"}`}
                    >
                      {isRtl ? "سريع (Pro)" : "Fast (Pro)"}
                    </button>
                  </div>
                </div>

                {/* Cost Estimation */}
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-fuchsia-200/80 text-xs font-medium">{t('estimatedCost')}</span>
                  <div className="flex items-center gap-1 text-fuchsia-400 font-bold">
                    <Wallet className="w-4 h-4" />
                    <span>{estimatedCost} {t('credits')}</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f0024] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{isRtl ? "تأكيد العملية" : "Confirm Action"}</h3>
                <p className="text-white/50 text-sm">{isRtl ? "سيتم خصم رصيد من حسابك" : "Credits will be deducted"}</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 mb-6 flex justify-between items-center">
              <span className="text-white/70 font-medium">{t('estimatedCost')}:</span>
              <div className="flex flex-col items-end">
                <span className="text-fuchsia-400 font-bold text-xl">{estimatedCost} {t('credits')}</span>
                {chargedWallet && <span className="text-white/40 text-[10px]">({isRtl ? 'سيتم الخصم من' : 'Will be deducted from'}: {chargedWallet})</span>}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={confirmGenerate}
                className="flex-1 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                {isRtl ? "تأكيد" : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <ToolInstructions 
        toolId="image_to_video"
        title={isRtl ? "كيفية استخدام تحويل الصورة لفيديو" : "How to use Image to Video"}
        instructions={isRtl ? [
          "قم برفع صورة واضحة ترغب في تحويلها إلى فيديو.",
          "يمكنك اختيارياً إضافة ملف صوتي ليقوم الذكاء الاصطناعي بمزامنة الشفاه مع الصوت.",
          "اكتب وصفاً (Prompt) للمشهد الذي تريده أو اتركه للذكاء الاصطناعي.",
          "اضغط على زر (توليد) وانتظر بضع ثوانٍ حتى يتم الانتهاء."
        ] : [
          "Upload a clear image you want to convert into a video.",
          "Optionally add an audio file for AI lip-syncing.",
          "Write a prompt describing the scene you want.",
          "Click Generate and wait a few seconds for the output."
        ]}
      />
    </>
  );
}

export default dynamic(() => Promise.resolve(ImageToVideoPage), { ssr: false });
