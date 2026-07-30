"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { 
  Download, Loader2, Wand2, 
  Video, UploadCloud, Image as ImageIcon, 
  Zap, Settings, Wallet,
  Monitor, Smartphone
} from "lucide-react";
import { useAppStore } from "../../../../src/store/useAppStore";
import { useRouter } from "../../../../src/i18n/routing";
import api from "../../../../src/utils/api";
import ToolInstructions from "../../../../components/ToolInstructions";

export default function AdvancedLipSyncPage() {
  const t = useTranslations("ImageToVideo");
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { isAuthenticated } = useAppStore();
  const router = useRouter();
  const { setUser } = useAppStore();

  const [inputVideoUrl, setInputVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [selectedQuality, setSelectedQuality] = useState("Standard");
  
  const [estimatedCost, setEstimatedCost] = useState<number>(user?.activePlan?.lipSyncCostPerGeneration || 1);
  const [chargedWallet, setChargedWallet] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.get("/api/video/estimate-lipsync").then(res => {
        if (res.data) {
          setEstimatedCost(res.data.estimatedCost);
          setChargedWallet(res.data.chargedWalletName);
        }
      }).catch(err => console.error(err));
    } else {
      setEstimatedCost(user?.activePlan?.lipSyncCostPerGeneration || 1);
      setChargedWallet(null);
    }
  }, [isAuthenticated, user]);


  const handleProcessClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!videoFile || !audioFile) return;
    setError("");
    setShowConfirmModal(true);
  };

  const confirmGenerate = async () => {
    setShowConfirmModal(false);
    if (!videoFile || !audioFile) return;
    
    setIsProcessing(true);
    setError("");
    setVideoUrl(null);

    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("audio", audioFile);

      const response = await api.post("/api/video/start-lipsync", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const taskId = response.data.taskId;
      
      api.get("/api/auth/me").then(res => {
        if (res.data) setUser(res.data);
      }).catch(err => console.error(err));

      const pollTask = async () => {
        try {
          const statusRes = await api.get(`/api/video/status/${taskId}`);
          const data = statusRes.data;
          
          if (data.status === "succeeded" || data.status === "completed") {
            setVideoUrl(data.url);
            setIsProcessing(false);
          } else if (data.status === "failed") {
            setError(data.error || "Generation failed.");
            setIsProcessing(false);
          } else {
            setTimeout(pollTask, 5000);
          }
        } catch (err: any) {
          setError("Error checking status");
          setIsProcessing(false);
        }
      };

      setTimeout(pollTask, 5000);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || t('error'));
      setIsProcessing(false);
    }
  };

  const downloadVideo = async () => {
    if (!videoUrl) return;
    try {
      setIsDownloading(true);
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      const element = document.createElement("a");
      element.href = localUrl;
      element.download = "generated_video.mp4";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(localUrl);
    } catch (err) {
      console.error("Error downloading video:", err);
      const element = document.createElement("a");
      element.href = videoUrl;
      element.target = "_blank";
      element.download = "generated_video.mp4";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setInputVideoUrl(url);
      setVideoFile(file);
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
          
          {/* Main Workspace */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-12 max-w-4xl mx-auto w-full flex flex-col gap-4"
          >
            <div className="flex-1 bg-[#120822]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-4 flex flex-col relative overflow-hidden group shadow-2xl transition-all duration-500 hover:border-fuchsia-500/30">
              
              <div className="flex justify-between items-center px-2 mb-4" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-fuchsia-400" />
                  <span className="text-white/80 font-semibold text-sm">{isRtl ? "رفع الفيديو" : "Upload Video"}</span>
                </div>
              </div>

              {/* Upload Zone */}
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative min-h-[300px] border-2 border-dashed border-white/10 hover:border-fuchsia-500/50 rounded-xl bg-[#0a0015]/60 flex flex-col items-center justify-center gap-4 transition-all overflow-hidden group/upload cursor-pointer"
              >
                {inputVideoUrl ? (
                  <>
                    <video src={inputVideoUrl} className="absolute inset-0 w-full h-full object-contain p-2" controls={false} autoPlay loop muted />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-medium flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" />
                        {isRtl ? "انقر لتغيير الفيديو" : "Click to change video"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setInputVideoUrl(URL.createObjectURL(file));
                          setVideoFile(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-fuchsia-500/10 flex items-center justify-center">
                      <Video className="w-8 h-8 text-fuchsia-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-white/80 font-medium mb-1">{isRtl ? "اسحب وأفلت الفيديو هنا" : "Drag and drop video here"}</p>
                      <p className="text-white/40 text-xs">MP4, WEBM, MOV (Max 50MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setInputVideoUrl(URL.createObjectURL(file));
                          setVideoFile(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </>
                )}
              </div>

              {/* Audio Input */}
              <div className="mt-4">
                <div className="relative min-h-[150px] border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-xl bg-[#0a0015]/60 flex flex-col items-center justify-center gap-4 transition-all overflow-hidden group/upload cursor-pointer">
                  {audioFile ? (
                    <div className="text-center p-4">
                      <p className="text-amber-400 font-medium mb-1">{audioFile.name}</p>
                      <p className="text-white/60 text-sm">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <UploadCloud className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-white/80 font-medium mb-1">{isRtl ? "رفع الملف الصوتي" : "Upload Audio File"}</p>
                        <p className="text-white/40 text-xs">MP3, WAV (Max 5MB)</p>
                      </div>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setAudioFile(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>

              {error && <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-xl border border-red-500/20 mt-4 mx-2">{error}</div>}

              <button
                  onClick={handleProcessClick}
                  disabled={isProcessing || !videoFile || !audioFile}
                  className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    {t('generate')}
                  </>
                )}
              </button>

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
        toolId="advanced_lip_sync"
        title={isRtl ? "كيفية استخدام مزامنة الشفاه المتقدمة" : "How to use Advanced Lip Sync"}
        instructions={isRtl ? [
          "قم برفع ملف فيديو واضح يحتوي على وجه شخص يتحدث.",
          "قم برفع ملف صوتي ترغب في أن ينطق به الشخص في الفيديو.",
          "تأكد من أن مدة الصوت تتناسب مع مدة الفيديو للحصول على أفضل نتيجة.",
          "اضغط على (توليد) وانتظر الذكاء الاصطناعي لدمج الصوت مع حركة الشفاه."
        ] : [
          "Upload a clear video featuring a speaking person's face.",
          "Upload the audio file you want the person to speak.",
          "Ensure the audio duration matches the video for best results.",
          "Click Generate and wait for the AI to sync the lips with the new audio."
        ]}
      />
    </>
  );
}
