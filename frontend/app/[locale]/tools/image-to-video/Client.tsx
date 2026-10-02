"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { 
  Film, 
  Zap, 
  Wand2, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronDown, 
  Monitor, 
  Smartphone, 
  Square, 
  Clock, 
  Check, 
  Layers, 
  Copy, 
  CheckCheck, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon,
  Download,
  Maximize2,
  Loader2,
  Play
} from "lucide-react";
import api from "../../../../src/utils/api";
import { useAppStore } from "../../../../src/store/useAppStore";
import { signalRNotificationService } from "../../../../lib/signalr-client";
import { BottomSheetSelect } from "../../../../components/ui/BottomSheetSelect";
import { ModelBrandIcon } from "../../../../src/components/BrandLogos";
import { 
  trackToolView, 
  trackToolModelChange, 
  trackToolGenerateStart, 
  trackToolGenerateSuccess, 
  trackToolGenerateError, 
  trackToolDownload, 
  trackInsufficientCredits 
} from "../../../../src/utils/gtm";

interface ModelOption {
  id: string;
  family: string;
  name: string;
  nameAr: string;
  badge: string;
  badgeAr: string;
  desc: string;
  descAr: string;
  discount?: string;
  isPerSecond?: boolean;
  supportedResolutions: string[];
  prices: { [resolution: string]: number };
}

interface GeneratedVideoItem {
  id: string;
  url: string;
  prompt: string;
  model: string;
  resolution: string;
  aspectRatio: string;
  createdAt: string;
}

const MODELS: ModelOption[] = [
  {
    id: "veo-3.1-fast",
    family: "veo",
    name: "Google Veo 3.1 Fast",
    nameAr: "جوجل فيو 3.1 فاست (سريع)",
    badge: "Fast & 4K",
    badgeAr: "سريع • حتى 4K",
    desc: "Fastest image animation with smooth camera motion",
    descAr: "تحريك فائق السرعة للصور لمدة 8 ثواني بجودة سينمائية",
    discount: "-83%",
    isPerSecond: false,
    supportedResolutions: ["720p", "1080p", "4k"],
    prices: { "720p": 30, "1080p": 37.5, "4k": 90 }
  },
  {
    id: "veo-3.1-lite",
    family: "veo",
    name: "Google Veo 3.1 Lite",
    nameAr: "جوجل فيو 3.1 لايت (اقتصادي)",
    badge: "Budget Friendly",
    badgeAr: "اقتصادي وموفر",
    desc: "Lowest credit consumption for fast image animation drafts",
    descAr: "أقل استهلاك للنقاط ومثالي للتجارب وتحريك الصور السريع",
    discount: "-84%",
    isPerSecond: false,
    supportedResolutions: ["720p", "1080p", "4k"],
    prices: { "720p": 15, "1080p": 22.5, "4k": 75 }
  },
  {
    id: "grok-imagine",
    family: "grok",
    name: "xAI Grok Imagine",
    nameAr: "إكس إيه آي جروك إيماجين",
    badge: "Flexible Duration",
    badgeAr: "مدة مرنة 1-30 ثانية",
    desc: "Dynamic motion with per-second duration control",
    descAr: "حركة حيوية سريعة مع تسعير مرن بالثانية",
    discount: "Flexible",
    isPerSecond: true,
    supportedResolutions: ["480p", "720p", "1080p"],
    prices: { "480p": 2.4, "720p": 4.5, "1080p": 8.0 }
  },
  {
    id: "seedance-2.0-mini",
    family: "seedance",
    name: "Seedance 2.0 Mini",
    nameAr: "سيدانس 2.0 ميني",
    badge: "Dynamic Motion",
    badgeAr: "حركة ديناميكية",
    desc: "Advanced video generation with dynamic pricing and duration control",
    descAr: "توليد فيديو متقدم مع تسعير ديناميكي وتحكم في المدة",
    discount: "Flexible",
    isPerSecond: true,
    supportedResolutions: ["480p", "720p"],
    prices: { "480p": 3, "720p": 5 }
  }
];

const RESOLUTIONS = [
  { id: "480p", label: "480p (SD)", desc: "Standard Definition", descAr: "دقة قياسية SD" },
  { id: "720p", label: "720p (HD)", desc: "High Definition", descAr: "عالي الدقة HD" },
  { id: "1080p", label: "1080p (FHD)", desc: "Full High Definition", descAr: "دقة كاملة Full HD" },
  { id: "4k", label: "4K (UHD)", desc: "Ultra High Definition", descAr: "دقة سينمائية فائقة 4K" }
];

const ALL_ASPECT_RATIOS = [
  { id: "16:9", label: "16:9", desc: "YouTube / Desktop", descAr: "عرضي (يوتيوب وكمبيوتر)", icon: Monitor },
  { id: "9:16", label: "9:16", desc: "TikTok / Reels / Shorts", descAr: "طولي (تيك توك وريلز)", icon: Smartphone },
  { id: "1:1", label: "1:1", desc: "Instagram / Square", descAr: "مربع (انستغرام وبوستات)", icon: Square },
  { id: "2:3", label: "2:3", desc: "Vertical Portrait", descAr: "عمودي 2:3", icon: Smartphone },
  { id: "3:2", label: "3:2", desc: "Landscape Photo", descAr: "أفقي 3:2", icon: Monitor }
];

const ASPECT_RATIOS = ALL_ASPECT_RATIOS;

export default function ImageToVideoPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  useEffect(() => {
    trackToolView("image-to-video", isRtl ? "تحريك الصور إلى فيديو" : "Image to Video");
  }, [isRtl]);
  const { user, setUser } = useAppStore();

  // Selected Options
  const [selectedModelId, setSelectedModelId] = useState<string>("veo-3.1-fast");
  const [resolution, setResolution] = useState<string>("1080p");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [duration, setDuration] = useState<number>(6); // For Grok/Seedance
  const [mode, setMode] = useState<string>("normal"); // For Grok (normal, fun, spicy)
  const [prompt, setPrompt] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Single / Start Frame State (Veo & Seedance)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optional End Frame State (Veo & Seedance)
  const [endFrameFile, setEndFrameFile] = useState<File | null>(null);
  const [endFramePreview, setEndFramePreview] = useState<string | null>(null);
  const endFrameInputRef = useRef<HTMLInputElement>(null);

  // Multi-Image State for xAI Grok Imagine (up to 7 images)
  const [grokFiles, setGrokFiles] = useState<File[]>([]);
  const [grokPreviews, setGrokPreviews] = useState<string[]>([]);
  const grokInputRef = useRef<HTMLInputElement>(null);

  // Synchronized Audio Toggle (Seedance)
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Dropdown UI Open States
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isResDropdownOpen, setIsResDropdownOpen] = useState(false);
  const [isAspectDropdownOpen, setIsAspectDropdownOpen] = useState(false);

  // Generation and Polling State
  const [copied, setCopied] = useState(false);
  const [copiedResultPrompt, setCopiedResultPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Generated Outputs
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideoItem | null>(null);
  const [recentVideos, setRecentVideos] = useState<GeneratedVideoItem[]>([]);
  const [lightboxVideoUrl, setLightboxVideoUrl] = useState<string | null>(null);

  // Refs for dropdown clicks
  const modelRef = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const aspectRef = useRef<HTMLDivElement>(null);
  const resultCanvasRef = useRef<HTMLDivElement>(null);

  // Dynamic model pricing state loaded from backend
  const [modelOptions, setModelOptions] = useState<ModelOption[]>(MODELS);

  useEffect(() => {
    let active = true;
    const loadPricing = async () => {
      try {
        const res = await api.get('/api/video/pricing/image-to-video');
        if (active && res.data?.pricings) {
          const pricings = res.data.pricings;
          setModelOptions(prev => prev.map(m => {
            const normM = m.id.toLowerCase().replace(/[-_ ./]/g, '');
            // .NET returns PascalCase — match ModelName (PascalCase) and also check camelCase fallback
            let found = pricings.find((p: any) => {
              const name = p.ModelName || p.modelName || '';
              const normP = name.toLowerCase().replace(/[-_ ./]/g, '');
              return normP === normM;
            });
            if (!found) {
              // Fallback: partial match only when both keys are long enough to be unambiguous (≥6 chars)
              found = pricings.find((p: any) => {
                const name = p.ModelName || p.modelName || '';
                const normP = name.toLowerCase().replace(/[-_ ./]/g, '');
                const shorter = normP.length <= normM.length ? normP : normM;
                const longer = normP.length <= normM.length ? normM : normP;
                return shorter.length >= 6 && longer.includes(shorter);
              });
            }
            if (found) {
              // .NET returns PascalCase field names — support both casings for safety
              const billingType = found.BillingType || found.billingType || '';
              if (billingType === 'PerSecond') {
                return {
                  ...m,
                  prices: {
                    ...m.prices,
                    "480p": found.CostPerSecond_480p ?? found.costPerSecond_480p ?? m.prices["480p"],
                    "720p": found.CostPerSecond_720p ?? found.costPerSecond_720p ?? m.prices["720p"],
                    "1080p": found.CostPerSecond_1080p ?? found.costPerSecond_1080p ?? m.prices["1080p"],
                  }
                };
              } else {
                return {
                  ...m,
                  prices: {
                    ...m.prices,
                    "720p": found.FixedCost_720p ?? found.fixedCost_720p ?? m.prices["720p"],
                    "1080p": found.FixedCost_1080p ?? found.fixedCost_1080p ?? m.prices["1080p"],
                    "4k": found.FixedCost_4k ?? found.fixedCost_4k ?? m.prices["4k"],
                  }
                };
              }
            }
            return m;
          }));
        }
      } catch (err) {}
    };
    loadPricing();
    return () => { active = false; };
  }, []);

  // Find active model object
  const currentModel = useMemo(() => {
    return modelOptions.find(m => m.id === selectedModelId) || modelOptions[0];
  }, [modelOptions, selectedModelId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      if (resRef.current && !resRef.current.contains(event.target as Node)) {
        setIsResDropdownOpen(false);
      }
      if (aspectRef.current && !aspectRef.current.contains(event.target as Node)) {
        setIsAspectDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Adjust resolution if not supported by newly selected model
  const handleModelSelect = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    if (model) {
      setSelectedModelId(modelId);
      trackToolModelChange("image-to-video", modelId, model.name);
      if (!model.supportedResolutions.includes(resolution)) {
        setResolution(model.supportedResolutions.includes("1080p") ? "1080p" : model.supportedResolutions[0]);
      }
    }
    setIsModelDropdownOpen(false);
  };

  // Calculate live estimated cost dynamically from backend
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    const fetchCost = async () => {
      try {
        const res = await api.get(`/api/video/estimate-tool/image-to-video?model=${currentModel.id}&resolution=${resolution}&duration=${duration}`);
        if (active && res.data?.estimatedCost !== undefined) {
          setEstimatedCost(res.data.estimatedCost);
        } else if (active) {
          setEstimatedCost(null);
        }
      } catch (err) {
        if (active) setEstimatedCost(null);
      }
    };
    fetchCost();
    return () => { active = false; };
  }, [currentModel, resolution, duration]);

  // Polling for generation status
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;

    if (activeTaskId) {
      setElapsedSeconds(0);
      timer = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);

      const checkTask = async () => {
        try {
          const res = await api.get(`/api/video/status/${activeTaskId}`);
          const data = res.data;
          if (data && (data.status === "succeeded" || data.status === "completed")) {
            const finalUrl = data.url || data.fileUrl;
            if (finalUrl) {
              const newVidItem: GeneratedVideoItem = {
                id: data.id || activeTaskId,
                url: finalUrl,
                prompt: data.prompt || prompt || (isRtl ? "تحريك صورة" : "Image Animation"),
                model: currentModel.name,
                resolution: resolution,
                aspectRatio: aspectRatio,
                createdAt: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
              };

              setGeneratedVideo(newVidItem);
              setRecentVideos(prev => [newVidItem, ...prev.filter(x => x.id !== newVidItem.id)]);
              setActiveTaskId(null);
              setIsLoading(false);
              setSuccessMessage(isRtl ? "🎉 تم تحريك ورندر الفيديو بنجاح!" : "🎉 Image animated successfully!");

              trackToolGenerateSuccess({
                toolId: "image-to-video",
                modelId: currentModel.id,
                taskId: data.id || activeTaskId,
                durationSeconds: elapsedSeconds,
              });

              // Refresh user balance
              api.get("/api/auth/me").then(uRes => {
                if (uRes.data) setUser(uRes.data);
              }).catch(() => {});

              // Scroll smoothly to result
              setTimeout(() => {
                resultCanvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }, 300);
            }
          } else if (data && (data.status === "failed" || data.status === "error")) {
            setError(data.error || (isRtl ? "فشلت عملية تحريك الصورة" : "Animation generation failed"));
            trackToolGenerateError({
              toolId: "image-to-video",
              modelId: currentModel.id,
              errorMessage: data.error,
            });
            setActiveTaskId(null);
            setIsLoading(false);
          }
        } catch (err: any) {
          console.error("Polling status error:", err);
        }
      };

      pollInterval = setInterval(checkTask, 3000);

      // SignalR listener
      signalRNotificationService.startConnection();
      signalRNotificationService.onNotification(() => {
        checkTask();
      });

      return () => {
        clearInterval(timer);
        clearInterval(pollInterval);
      };
    }
  }, [activeTaskId, prompt, currentModel.name, resolution, aspectRatio, isRtl, locale, setUser]);

  // Total balance & check sufficiency
  const totalUserCredits = (user?.standardCredits || 0) + (user?.premiumCredits || 0);
  const hasSufficientCredits = estimatedCost === null || totalUserCredits >= estimatedCost;

  // Dynamic Aspect Ratios per Model
  const availableAspectRatios = useMemo(() => {
    if (selectedModelId.startsWith("veo")) {
      return ALL_ASPECT_RATIOS.filter(a => a.id === "16:9" || a.id === "9:16");
    }
    if (selectedModelId.includes("grok")) {
      return ALL_ASPECT_RATIOS;
    }
    return ALL_ASPECT_RATIOS.filter(a => a.id === "16:9" || a.id === "9:16" || a.id === "1:1");
  }, [selectedModelId]);

  useEffect(() => {
    if (selectedModelId.startsWith("veo") && aspectRatio === "1:1") {
      setAspectRatio("16:9");
    }
  }, [selectedModelId, aspectRatio]);

  // Adjust duration defaults
  useEffect(() => {
    if (selectedModelId.includes("seedance")) {
      if (duration < 4 || duration > 15) setDuration(5);
    } else if (selectedModelId.includes("grok")) {
      if (duration < 6 || duration > 30) setDuration(6);
    } else {
      setDuration(8);
    }
  }, [selectedModelId]);

  // Start Frame Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setError(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // End Frame Handlers
  const handleEndFrameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEndFrameFile(file);
      setEndFramePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeEndFrame = () => {
    setEndFrameFile(null);
    setEndFramePreview(null);
    if (endFrameInputRef.current) endFrameInputRef.current.value = '';
  };

  // Grok Multi-Image Handlers (up to 7 images)
  const handleGrokImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const remainingSlots = 7 - grokFiles.length;
      const newFiles = files.slice(0, remainingSlots);
      setGrokFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(f => URL.createObjectURL(f));
      setGrokPreviews(prev => [...prev, ...newPreviews]);
      setError(null);
    }
    if (grokInputRef.current) grokInputRef.current.value = '';
  };

  const removeGrokImage = (index: number) => {
    setGrokFiles(prev => prev.filter((_, i) => i !== index));
    setGrokPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (currentModel.family === "grok") {
        handleGrokImagesChange({ target: { files: e.dataTransfer.files } } as any);
      } else {
        handleImageChange({ target: { files: e.dataTransfer.files } } as any);
      }
    }
  };

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

  // Safe Cross-Origin HD Download
  const handleDownloadVideo = async (url: string, filename?: string) => {
    trackToolDownload({
      toolId: "image-to-video",
      format: "mp4",
      resolution: resolution,
    });
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || `animated_video_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const isUploadValid = currentModel.family === "grok" ? grokFiles.length > 0 : !!imageFile;

  // Submission handler
  const handleGenerate = async () => {
    if (currentModel.family === "grok") {
      if (grokFiles.length === 0) {
        setError(isRtl ? "يرجى رفع صورة واحدة على الأقل لتحريكها" : "Please upload at least one image to animate");
        return;
      }
    } else {
      if (!imageFile) {
        setError(isRtl ? "يرجى رفع إطار البداية (Start Frame) أولاً" : "Please upload a start frame image first");
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!hasSufficientCredits) {
      trackInsufficientCredits({
        toolId: "image-to-video",
        requiredCredits: estimatedCost || 0,
        currentBalance: totalUserCredits
      });
    }

    trackToolGenerateStart({
      toolId: "image-to-video",
      modelId: currentModel.id,
      resolution,
      aspectRatio,
      duration,
      estimatedCredits: estimatedCost ?? undefined,
    });

    try {
      const formData = new FormData();
      if (currentModel.family === "grok") {
        grokFiles.forEach(f => formData.append("images", f));
        formData.append("duration", duration.toString());
        formData.append("mode", mode);
      } else {
        if (imageFile) {
          formData.append("images", imageFile);
          formData.append("image", imageFile);
        }
        if (endFrameFile) {
          formData.append("images", endFrameFile);
        }
        if (currentModel.family === "seedance") {
          formData.append("duration", duration.toString());
          formData.append("audio", audioEnabled ? "true" : "false");
        } else {
          formData.append("duration", "8"); // Veo 8s standard
        }
      }

      if (prompt.trim()) formData.append("prompt", prompt.trim());
      formData.append("model", currentModel.id);
      formData.append("resolution", resolution);
      formData.append("aspectRatio", aspectRatio);

      const res = await api.post("/api/video/start-tool/image-to-video", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data?.taskId) {
        setActiveTaskId(res.data.taskId);
        setSuccessMessage(
          isRtl 
            ? "⚡ جاري تحريك ورندر المشهد عبر محرك الذكاء الاصطناعي..." 
            : "⚡ Animating video with AI engine..."
        );
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || (isRtl ? "حدث خطأ أثناء إرسال طلب التوليد" : "Error submitting animation task");
      setError(errMsg);
      trackToolGenerateError({
        toolId: "image-to-video",
        modelId: currentModel.id,
        errorMessage: errMsg,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 pt-2" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Main Studio 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* 1. Main Center/Right Area: Image Dropzone & Motion Prompt Studio          */}
        {/* ========================================================================= */}
        <div className="order-2 lg:order-1 lg:col-span-8 space-y-5">
          
          {/* Adaptive Image Upload Zone */}
          {currentModel.family === 'grok' ? (
            <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-pink-400" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block">
                      {isRtl ? "صور القصة / المشهد (Story Frames - حتى 7 صور)" : "Scene Story Frames (Up to 7 Images)"}
                    </label>
                    <span className="text-[11px] text-white/40 block">
                      {isRtl ? "ارفع من 1 إلى 7 صور متتابعة ليقوم Grok بربطها وتحريكها كفيديو متسلسل" : "Upload 1 to 7 sequential frames to weave into a continuous animated video"}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-violet-300">
                  {grokFiles.length} / 7
                </span>
              </div>

              <input
                ref={grokInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleGrokImagesChange}
                className="hidden"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {grokPreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/60 group">
                    <img src={preview} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 start-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white/80 border border-white/10">
                      #{idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGrokImage(idx)}
                      className="absolute top-1.5 end-1.5 p-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {grokFiles.length < 7 && (
                  <div
                    onClick={() => grokInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`aspect-video rounded-xl border-2 border-dashed ${isDragging ? 'border-pink-400 bg-pink-500/10' : 'border-white/15 bg-white/[0.02] hover:border-pink-500/50 hover:bg-white/[0.04]'} flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all p-3 text-center`}
                  >
                    <Upload className="w-5 h-5 text-pink-400" />
                    <span className="text-xs font-bold text-white/70">
                      {isRtl ? "إضافة صور" : "Add Image"}
                    </span>
                    <span className="text-[10px] text-white/40">
                      {isRtl ? `متبقي ${7 - grokFiles.length}` : `${7 - grokFiles.length} slots left`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Veo & Seedance: Start Frame & End Frame */
            <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-5 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "إطارات المشهد (Start & End Frames)" : "Animation Keyframes"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "إطار البداية إلزامي، ويمكنك تحديد إطار نهاية اختياري لضبط مسار التحريك" : "Start frame is required. End frame is optional to guide cinematic camera transition"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Start Frame (Required) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-violet-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                      {isRtl ? "إطار البداية (إلزامي)" : "Start Frame (Required)"}
                    </span>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{isRtl ? "حذف" : "Remove"}</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {!imagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed ${isDragging ? 'border-violet-400 bg-violet-500/10' : 'border-white/15 bg-[#06010f]/80 hover:border-violet-500/50 hover:bg-[#06010f]'} rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group min-h-[170px]`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 group-hover:scale-110 border border-violet-500/20 flex items-center justify-center transition-transform">
                        <Upload className="w-5 h-5 text-violet-400" />
                      </div>
                      <p className="text-xs font-bold text-white group-hover:text-violet-300">
                        {isRtl ? "رفع إطار البداية" : "Upload Start Frame"}
                      </p>
                      <p className="text-[10px] text-white/40">PNG, JPG, WEBP</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center h-[170px] group">
                      <img src={imagePreview} alt="Start Frame" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-bold"
                        >
                          {isRtl ? "تغيير" : "Change"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. End Frame (Optional) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white/70 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/30" />
                      {isRtl ? "إطار النهاية (اختياري)" : "End Frame (Optional)"}
                    </span>
                    {endFramePreview && (
                      <button
                        type="button"
                        onClick={removeEndFrame}
                        className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{isRtl ? "حذف" : "Remove"}</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={endFrameInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleEndFrameChange}
                    className="hidden"
                  />

                  {!endFramePreview ? (
                    <div
                      onClick={() => endFrameInputRef.current?.click()}
                      className="border-2 border-dashed border-white/10 bg-[#06010f]/40 hover:border-white/30 hover:bg-[#06010f] rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group min-h-[170px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:scale-110 border border-white/10 flex items-center justify-center transition-transform">
                        <Sparkles className="w-5 h-5 text-white/40 group-hover:text-white" />
                      </div>
                      <p className="text-xs font-bold text-white/60 group-hover:text-white">
                        {isRtl ? "رفع إطار النهاية (اختياري)" : "Upload End Frame (Optional)"}
                      </p>
                      <p className="text-[10px] text-white/30">
                        {isRtl ? "لإنهاء الحركة عند هذه اللقطة" : "Smooth transition destination"}
                      </p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center h-[170px] group">
                      <img src={endFramePreview} alt="End Frame" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => endFrameInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-bold"
                        >
                          {isRtl ? "تغيير" : "Change"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Optional Motion Prompt Box */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md relative overflow-hidden group focus-within:border-violet-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Wand2 className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "وصف التحريك (Motion Prompt) - اختياري" : "Motion Prompt (Optional)"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "صف حركة الكاميرا أو العناصر ليتولى الذكاء الاصطناعي تحريكها بدقة" : "Describe camera motion or actions to guide AI animation"}
                  </span>
                </div>
              </div>

              {/* Quick Actions in Header */}
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
                    ? "صف كيف تريد تحريك المشهد... (مثال: اقتراب بطيء للكاميرا نحو الشخصية مع هبوب نسيم خفيف يحرك الشعر، إضاءة سينمائية دافئة)" 
                    : "Describe how to animate the image... (e.g. Slow cinematic zoom in on the subject, hair blowing gently in the wind, soft golden hour rim light)"
                }
                className="w-full bg-[#06010f] border border-white/10 rounded-xl p-4 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 resize-none text-sm md:text-base leading-relaxed transition-all shadow-inner font-sans"
              />
              <div className="absolute bottom-3 end-3 text-[11px] text-white/40 font-mono bg-[#06010f]/90 px-2 py-0.5 rounded border border-white/5">
                {prompt.length} / 2000
              </div>
            </div>

          </div>

          {/* Notifications: Error / Success */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3 backdrop-blur-md">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div className="space-y-0.5">
                <p className="font-bold">{isRtl ? "خطأ في التوليد" : "Generation Error"}</p>
                <p className="text-xs text-red-300/80">{error}</p>
              </div>
            </div>
          )}
          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-start gap-3 backdrop-blur-md">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              <div className="space-y-0.5">
                <p className="font-bold">{isRtl ? "نجاح" : "Success"}</p>
                <p className="text-xs text-emerald-300/80">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Action Bar & Submit CTA */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-start">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-white/50">
                <span>{isRtl ? "الموديل:" : "Model:"}</span>
                <span className="font-bold text-white">{isRtl ? currentModel.nameAr : currentModel.name}</span>
                <span>•</span>
                <span className="text-violet-300 font-bold">{resolution}</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">{aspectRatio}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-white/50">{isRtl ? "التكلفة:" : "Cost:"}</span>
                <span className="text-xl font-black text-amber-300 font-mono">{estimatedCost ?? "—"}</span>
                <span className="text-xs text-amber-300/70 font-semibold">
                  {currentModel.isPerSecond ? (isRtl ? `نقطة (${duration} ثواني)` : `Credits (${duration}s)`) : (isRtl ? "نقطة / فيديو" : "Credits / Video")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !isUploadValid || !hasSufficientCredits}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isLoading || !isUploadValid || !hasSufficientCredits
                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-violet-900/40 hover:shadow-violet-800/70 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span>{isRtl ? `جاري المعالجة والتحريك (${elapsedSeconds} ثانية)...` : `Animating Video (${elapsedSeconds}s)...`}</span>
                </>
              ) : !hasSufficientCredits ? (
                <>
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">{isRtl ? "رصيد غير كافٍ" : "Insufficient Balance"}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{isRtl ? `توليد الفيديو (${estimatedCost ?? "—"} نقطة)` : `Generate Video (${estimatedCost ?? "—"} Credits)`}</span>
                </>
              )}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 3. Live Studio Result Canvas & Interactive Showcase                       */}
          {/* ========================================================================= */}
          <div ref={resultCanvasRef} className="space-y-4 pt-2">
            {/* When Rendering */}
            {isLoading && (
              <div className="bg-[#0b0416]/95 border border-violet-500/30 rounded-2xl p-8 md:p-12 shadow-2xl text-center space-y-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/10 to-indigo-500/5 animate-pulse pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 animate-bounce">
                      <Film className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -inset-2 bg-violet-500/20 blur-xl rounded-full animate-ping pointer-events-none" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-extrabold text-white">
                      {isRtl ? "جاري تحريك ورندر الصورة بالذكاء الاصطناعي..." : "AI Image Animation in Progress..."}
                    </h3>
                    <p className="text-xs text-white/50 max-w-md mx-auto">
                      {isRtl 
                        ? `يتم الآن معالجة الحركة عبر محرك ${currentModel.nameAr} بدقة ${resolution}`
                        : `Processing animation with ${currentModel.name} at ${resolution}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono text-violet-400">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>{isRtl ? `الوقت المستغرق: ${elapsedSeconds} ثانية` : `Elapsed: ${elapsedSeconds}s`}</span>
                  </div>
                </div>
              </div>
            )}

            {/* When Result Ready */}
            {generatedVideo && !isLoading && (
              <div className="bg-[#0b0416]/95 border border-violet-500/30 rounded-2xl p-5 md:p-6 shadow-2xl space-y-5 backdrop-blur-md">
                
                {/* Result Header Bar */}
                <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {isRtl ? "الفيديو النهائي (جاهز للمشاهدة والتحميل)" : "Final Animated Video"}
                      </h3>
                      <span className="text-[11px] text-white/40">
                        {generatedVideo.createdAt} • {generatedVideo.resolution} • {generatedVideo.aspectRatio} • {generatedVideo.model}
                      </span>
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadVideo(generatedVideo.url, `animated_${generatedVideo.id.slice(0, 8)}.mp4`)}
                      className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-violet-900/30 transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isRtl ? "تحميل HD" : "Download HD"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLightboxVideoUrl(generatedVideo.url)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all"
                      title={isRtl ? "تكبير بملء الشاشة" : "Fullscreen"}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Video Player */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                  <video
                    src={generatedVideo.url}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="max-h-[550px] w-full object-contain rounded-lg"
                  />
                </div>

                {/* Video Prompt details & copy */}
                {generatedVideo.prompt && (
                  <div className="bg-[#06010f] border border-white/5 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span className="font-semibold">{isRtl ? "الوصف المستخدم:" : "Prompt Used:"}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedVideo.prompt);
                          setCopiedResultPrompt(true);
                          setTimeout(() => setCopiedResultPrompt(false), 2000);
                        }}
                        className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        {copiedResultPrompt ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedResultPrompt ? (isRtl ? "تم النسخ!" : "Copied!") : (isRtl ? "نسخ الوصف" : "Copy Prompt")}</span>
                      </button>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed font-sans" dir="auto">
                      {generatedVideo.prompt}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Session Gallery (Recent Videos in this session) */}
            {recentVideos.length > 1 && (
              <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md">
                <h4 className="text-xs font-bold text-white/70 flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-violet-400" />
                  <span>{isRtl ? "معرض فيديوهات هذه الجلسة" : "Session Generated Videos Gallery"}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {recentVideos.map((vid) => {
                    const isSelected = generatedVideo?.id === vid.id;
                    return (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => setGeneratedVideo(vid)}
                        className={`relative aspect-video rounded-xl overflow-hidden border transition-all group bg-black ${
                          isSelected ? "border-violet-500 ring-2 ring-violet-500/50 scale-105" : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <video src={vid.url} className="w-full h-full object-cover pointer-events-none" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. Side Settings Panel: Dropdowns & Parameters Controls                    */}
        {/* ========================================================================= */}
        <div className="order-1 lg:order-2 lg:col-span-4 space-y-5">
          <div className="sticky top-20 bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                <span>{isRtl ? "إعدادات التحريك" : "Animation Settings"}</span>
              </h2>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Options</span>
            </div>

            {/* 1. Model Dropdown Select */}
            <div className="space-y-1.5 relative" ref={modelRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                <span>{isRtl ? "محرك الذكاء الاصطناعي" : "AI Animation Model"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-violet-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all group"
              >
                <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                  <ModelBrandIcon modelId={currentModel.id} className="w-5 h-5 shrink-0" />
                  <div className="space-y-0.5 truncate flex-1 min-w-0">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-xs md:text-sm text-white truncate">
                        {isRtl ? currentModel.nameAr : currentModel.name}
                      </span>
                      {currentModel.discount && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded shrink-0">
                          {currentModel.discount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/40 truncate">
                      {isRtl ? currentModel.descAr : currentModel.desc}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 shrink-0 ${isModelDropdownOpen ? "rotate-180 text-violet-400" : ""}`} />
              </button>

              {/* Model Dropdown Menu — Desktop only */}
              {isModelDropdownOpen && (
                <div className="hidden lg:block absolute z-50 top-full mt-1.5 w-full bg-[#0d041c] border border-violet-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {modelOptions.map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <button key={m.id} type="button" onClick={() => handleModelSelect(m.id)}
                        className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected ? "bg-violet-600/25 text-white border border-violet-500/40" : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}>
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <ModelBrandIcon modelId={m.id} className="w-4 h-4 shrink-0" />
                          <div className="space-y-0.5 truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-white">{isRtl ? m.nameAr : m.name}</span>
                              {m.discount && <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded">{m.discount}</span>}
                            </div>
                            <p className="text-[10px] text-white/40">{isRtl ? m.badgeAr : m.badge}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Model Dropdown — Mobile Bottom Sheet */}
              <BottomSheetSelect isOpen={isModelDropdownOpen} onClose={() => setIsModelDropdownOpen(false)} title={isRtl ? "محرك الذكاء الاصطناعي" : "AI Animation Model"}>
                {modelOptions.map((m) => {
                  const isSelected = selectedModelId === m.id;
                  return (
                    <button key={m.id} type="button" onClick={() => handleModelSelect(m.id)}
                      className={`w-full text-start p-3 rounded-xl transition-all flex items-center justify-between gap-2 ${
                        isSelected ? "bg-violet-600/25 text-white border border-violet-500/40" : "hover:bg-white/5 text-white/70 hover:text-white"
                      }`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <ModelBrandIcon modelId={m.id} className="w-5 h-5 shrink-0" />
                        <div className="space-y-0.5 truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white">{isRtl ? m.nameAr : m.name}</span>
                            {m.discount && <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{m.discount}</span>}
                          </div>
                          <p className="text-xs text-white/40">{isRtl ? m.descAr : m.desc}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-violet-400 shrink-0" />}
                    </button>
                  );
                })}
              </BottomSheetSelect>
            </div>

            {/* 2. Resolution Dropdown Select */}
            <div className="space-y-1.5 relative" ref={resRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isRtl ? "دقة الفيديو (Resolution)" : "Resolution"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsResDropdownOpen(!isResDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-indigo-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div>
                  <span className="font-bold text-xs md:text-sm text-white block">
                    {RESOLUTIONS.find(r => r.id === resolution)?.label || resolution}
                  </span>
                  <span className="text-[10px] text-white/40 block">
                    {isRtl ? RESOLUTIONS.find(r => r.id === resolution)?.descAr : RESOLUTIONS.find(r => r.id === resolution)?.desc}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isResDropdownOpen ? "rotate-180 text-indigo-400" : ""}`} />
              </button>

              {/* Resolution Dropdown Menu — Desktop only */}
              {isResDropdownOpen && (
                <div className="hidden lg:block absolute z-40 top-full mt-1.5 w-full bg-[#0d041c] border border-indigo-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {RESOLUTIONS.filter(r => currentModel.supportedResolutions.includes(r.id)).map((r) => {
                    const isSelected = resolution === r.id;
                    return (
                      <button key={r.id} type="button" onClick={() => { setResolution(r.id); setIsResDropdownOpen(false); }}
                        className={`w-full text-start p-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected ? "bg-indigo-600/25 text-white border border-indigo-500/40" : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}>
                        <div>
                          <span className="font-bold text-xs text-white block">{r.label}</span>
                          <span className="text-[10px] text-white/40">{isRtl ? r.descAr : r.desc}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Resolution — Mobile Bottom Sheet */}
              <BottomSheetSelect isOpen={isResDropdownOpen} onClose={() => setIsResDropdownOpen(false)} title={isRtl ? "دقة الفيديو" : "Video Resolution"}>
                {RESOLUTIONS.filter(r => currentModel.supportedResolutions.includes(r.id)).map((r) => {
                  const isSelected = resolution === r.id;
                  return (
                    <button key={r.id} type="button" onClick={() => { setResolution(r.id); setIsResDropdownOpen(false); }}
                      className={`w-full text-start p-3 rounded-xl transition-all flex items-center justify-between gap-2 ${
                        isSelected ? "bg-indigo-600/25 text-white border border-indigo-500/40" : "hover:bg-white/5 text-white/70 hover:text-white"
                      }`}>
                      <div>
                        <span className="font-bold text-sm text-white block">{r.label}</span>
                        <span className="text-xs text-white/40">{isRtl ? r.descAr : r.desc}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </BottomSheetSelect>
            </div>

            {/* 3. Aspect Ratio Dropdown Select */}
            <div className="space-y-1.5 relative" ref={aspectRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? "أبعاد الفيديو (Aspect Ratio)" : "Aspect Ratio"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsAspectDropdownOpen(!isAspectDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-amber-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  {(() => {
                    const IconComp = ASPECT_RATIOS.find(a => a.id === aspectRatio)?.icon || Monitor;
                    return <IconComp className="w-4 h-4 text-amber-400" />;
                  })()}
                  <div>
                    <span className="font-bold text-xs md:text-sm text-white block">
                      {aspectRatio}
                    </span>
                    <span className="text-[10px] text-white/40 block">
                      {isRtl 
                        ? ASPECT_RATIOS.find(a => a.id === aspectRatio)?.descAr 
                        : ASPECT_RATIOS.find(a => a.id === aspectRatio)?.desc}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isAspectDropdownOpen ? "rotate-180 text-amber-400" : ""}`} />
              </button>

              {/* Aspect Ratio Dropdown Menu — Desktop only */}
              {isAspectDropdownOpen && (
                <div className="hidden lg:block absolute z-30 top-full mt-1.5 w-full bg-[#0d041c] border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {availableAspectRatios.map((a) => {
                    const isSelected = aspectRatio === a.id;
                    const IconComp = a.icon;
                    return (
                      <button key={a.id} type="button" onClick={() => { setAspectRatio(a.id); setIsAspectDropdownOpen(false); }}
                        className={`w-full text-start p-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected ? "bg-amber-500/20 text-white border border-amber-500/40" : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}>
                        <div className="flex items-center gap-2.5">
                          <IconComp className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-bold text-xs text-white block">{a.label}</span>
                            <span className="text-[10px] text-white/40">{isRtl ? a.descAr : a.desc}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Aspect Ratio — Mobile Bottom Sheet */}
              <BottomSheetSelect isOpen={isAspectDropdownOpen} onClose={() => setIsAspectDropdownOpen(false)} title={isRtl ? "أبعاد الفيديو" : "Aspect Ratio"}>
                {availableAspectRatios.map((a) => {
                  const isSelected = aspectRatio === a.id;
                  const IconComp = a.icon;
                  return (
                    <button key={a.id} type="button" onClick={() => { setAspectRatio(a.id); setIsAspectDropdownOpen(false); }}
                      className={`w-full text-start p-3 rounded-xl transition-all flex items-center justify-between gap-2 ${
                        isSelected ? "bg-amber-500/20 text-white border border-amber-500/40" : "hover:bg-white/5 text-white/70 hover:text-white"
                      }`}>
                      <div className="flex items-center gap-3">
                        <IconComp className="w-5 h-5 text-amber-400" />
                        <div>
                          <span className="font-bold text-sm text-white block">{a.label}</span>
                          <span className="text-xs text-white/40">{isRtl ? a.descAr : a.desc}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </BottomSheetSelect>
            </div>

            {/* 4. Duration Slider for Grok & Seedance */}
            {currentModel.isPerSecond && (
              <div className="space-y-3 pt-2 border-t border-white/5">
                {currentModel.family === "grok" && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-white/80 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isRtl ? "نمط الحركة (Motion Mode):" : "Creative Mode:"}</span>
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "normal", labelAr: "واقعي", labelEn: "Normal" },
                        { id: "fun", labelAr: "مرح", labelEn: "Fun" },
                        { id: "spicy", labelAr: "سينمائي", labelEn: "Spicy" }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMode(m.id)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                            mode === m.id
                              ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
                              : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                          }`}
                        >
                          {isRtl ? m.labelAr : m.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seedance Synchronized Audio Toggle */}
                {currentModel.id === "seedance-2.0-mini" && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-xs font-bold text-white">{isRtl ? "توليد صوت متزامن:" : "Generate Audio:"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        audioEnabled ? "bg-violet-600 text-white shadow-md shadow-violet-900/40" : "bg-white/10 text-white/50"
                      }`}
                    >
                      {audioEnabled ? (isRtl ? "مفعل" : "Enabled") : (isRtl ? "معطل" : "Disabled")}
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white/80 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-400" />
                      <span>{isRtl ? "مدة الفيديو:" : "Duration:"}</span>
                    </span>
                    <span className="font-bold text-amber-400 font-mono text-sm">{duration} {isRtl ? "ثواني" : "seconds"}</span>
                  </div>
                  <input
                    type="range"
                    min={currentModel.id === "seedance-2.0-mini" ? "4" : "6"}
                    max={currentModel.id === "seedance-2.0-mini" ? "15" : "30"}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer bg-white/10 rounded-lg h-2"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>{currentModel.id === "seedance-2.0-mini" ? "4s" : "6s"}</span>
                    <span>15s</span>
                    {currentModel.id !== "seedance-2.0-mini" && <span>30s</span>}
                  </div>
                </div>
              </div>
            )}
            {/* Live Summary & Wallet Widget removed */}

          </div>
        </div>

      </div>

      {/* Lightbox Video Modal */}
      {lightboxVideoUrl && (
        <div 
          onClick={() => setLightboxVideoUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setLightboxVideoUrl(null)}
            className="absolute top-5 end-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-5xl max-h-[90vh] w-full relative" onClick={e => e.stopPropagation()}>
            <video 
              src={lightboxVideoUrl} 
              controls 
              autoPlay 
              playsInline 
              className="max-w-full max-h-[85vh] w-full object-contain rounded-2xl shadow-2xl border border-white/10 bg-black"
            />
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => handleDownloadVideo(lightboxVideoUrl)}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-violet-950/50"
              >
                <Download className="w-4 h-4" />
                <span>{isRtl ? "تحميل الفيديو بدقة أصلية" : "Download Original Video"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
