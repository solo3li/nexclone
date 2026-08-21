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
  Coins, 
  Clock, 
  Check, 
  Layers, 
  Copy, 
  CheckCheck, 
  Trash2, 
  Flame,
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

interface ModelOption {
  id: string;
  family: "veo" | "grok";
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
    id: "veo-3.1-quality",
    family: "veo",
    name: "Google Veo 3.1 Quality",
    nameAr: "جوجل فيو 3.1 كواليتي (سينمائي)",
    badge: "Studio Cinema Grade",
    badgeAr: "أعلى جودة سينمائية",
    desc: "Maximum fidelity, preserving facial details and photo realism",
    descAr: "أقصى دقة للملامح وثبات واقعي لتفاصيل الصورة الأصلية",
    discount: "-69%",
    isPerSecond: false,
    supportedResolutions: ["720p", "1080p", "4k"],
    prices: { "720p": 225, "1080p": 232.5, "4k": 285 }
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
  }
];

const RESOLUTIONS = [
  { id: "480p", label: "480p (SD)", desc: "Standard Definition", descAr: "دقة قياسية خفيفة" },
  { id: "720p", label: "720p (HD)", desc: "High Definition", descAr: "عالي الدقة HD" },
  { id: "1080p", label: "1080p (FHD)", desc: "Full High Definition", descAr: "دقة كاملة Full HD" },
  { id: "4k", label: "4K (UHD)", desc: "Ultra High Definition", descAr: "دقة سينمائية فائقة 4K" }
];

const ASPECT_RATIOS = [
  { id: "16:9", label: "16:9", desc: "YouTube / Desktop", descAr: "عرضي (يوتيوب وكمبيوتر)", icon: Monitor },
  { id: "9:16", label: "9:16", desc: "TikTok / Reels / Shorts", descAr: "طولي (تيك توك وريلز)", icon: Smartphone },
  { id: "1:1", label: "1:1", desc: "Instagram / Square", descAr: "مربع (انستغرام وبوستات)", icon: Square }
];

const SAMPLE_ANIMATION_PROMPTS = {
  ar: [
    { title: "حركة كاميرا زوم سينمائية", text: "حركة كاميرا سلسة تقترب ببطء نحو الشخصية مع هبوب نسيم خفيف يحرك الشعر والملابس وإضاءة سينمائية دافئة." },
    { title: "تحريك الطبيعة والأمطار", text: "تحريك أمواج البحر والمياه بانسيابية واقعية، مع تمايل أوراق الشجر وانعكاسات ضوئية متحركة بدقة 4K." },
    { title: "التفاف كاميرا مداري 360", text: "دوران كاميرا سلس وبطيء بزاوية سينمائية حول العنصر الرئيسي في الصورة مع الحفاظ على كل التفاصيل الأصلية." },
    { title: "حركة إضاءة نيون ديناميكية", text: "توهج وتغير أضواء النيون مع تصاعد دخان ناعم في الخلفية وحركة كاميرا بطيئة تبرز أبعاد المشهد." }
  ],
  en: [
    { title: "Cinematic Slow Zoom", text: "Smooth slow push-in camera movement towards the subject, gentle wind blowing hair and clothes, cinematic warm rim lighting." },
    { title: "Flowing Water & Nature", text: "Realistic fluid motion of ocean waves and ripples, palms swaying gently in the breeze, vibrant reflective lighting in 4k." },
    { title: "Orbital Camera Pan", text: "Smooth orbital 360 degree pan around the main subject with rich depth of field and consistent subject fidelity." },
    { title: "Dynamic Neon Lighting", text: "Pulsating neon light reflections with rising volumetric smoke and atmospheric cinematic slow motion." }
  ]
};

export default function ImageToVideoPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user, setUser } = useAppStore();

  // Selected Options
  const [selectedModelId, setSelectedModelId] = useState<string>("veo-3.1-fast");
  const [resolution, setResolution] = useState<string>("1080p");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [duration, setDuration] = useState<number>(6); // For Grok (1-30s)
  const [mode, setMode] = useState<string>("normal"); // For Grok (normal, fun, spicy)
  const [prompt, setPrompt] = useState<string>("");

  // Source Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            const normM = m.id.toLowerCase().replace(/[-_ .]/g, '');
            let found = pricings.find((p: any) => {
              const normP = (p.modelName || '').toLowerCase().replace(/[-_ .]/g, '');
              return normP === normM;
            });
            if (!found) {
              found = pricings.find((p: any) => {
                const normP = (p.modelName || '').toLowerCase().replace(/[-_ .]/g, '');
                return normP.includes(normM) || normM.includes(normP);
              });
            }
            if (found) {
              if (found.billingType === 'PerSecond') {
                return {
                  ...m,
                  prices: {
                    "480p": found.costPerSecond_480p ?? m.prices["480p"],
                    "720p": found.costPerSecond_720p ?? m.prices["720p"],
                    "1080p": found.costPerSecond_1080p ?? m.prices["1080p"],
                  }
                };
              } else {
                return {
                  ...m,
                  prices: {
                    "720p": found.fixedCost_720p ?? m.prices["720p"],
                    "1080p": found.fixedCost_1080p ?? m.prices["1080p"],
                    "4k": found.fixedCost_4k ?? m.prices["4k"],
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
      if (!model.supportedResolutions.includes(resolution)) {
        setResolution(model.supportedResolutions.includes("1080p") ? "1080p" : model.supportedResolutions[0]);
      }
    }
    setIsModelDropdownOpen(false);
  };

  // Calculate live estimated cost dynamically from backend
  const [estimatedCost, setEstimatedCost] = useState<number>(37.5);
  useEffect(() => {
    let active = true;
    const fetchCost = async () => {
      try {
        const res = await api.get(`/api/video/estimate-tool/image-to-video?model=${currentModel.id}&resolution=${resolution}&duration=${duration}`);
        if (active && res.data?.estimatedCost !== undefined) {
          setEstimatedCost(res.data.estimatedCost);
        }
      } catch (err) {}
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
  const hasSufficientCredits = totalUserCredits >= estimatedCost;

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

  // Submission handler
  const handleGenerate = async () => {
    if (!imageFile) {
      setError(isRtl ? "يرجى رفع الصورة المراد تحريكها أولاً" : "Please upload an image to animate first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      // Append under multiple standard keys to guarantee binding
      formData.append("images", imageFile);
      formData.append("image", imageFile);
      if (prompt.trim()) formData.append("prompt", prompt.trim());
      formData.append("model", currentModel.id);
      formData.append("resolution", resolution);
      formData.append("aspectRatio", aspectRatio);

      if (currentModel.family === "grok") {
        formData.append("duration", duration.toString());
        formData.append("mode", mode);
      } else {
        formData.append("duration", "8"); // Veo 8s standard
      }

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
      setError(err.response?.data?.error || (isRtl ? "حدث خطأ أثناء إرسال طلب التوليد" : "Error submitting animation task"));
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
          
          {/* Image Upload Zone */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "الصورة الأصلية (Source Image)" : "Source Image"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "ارفع صورة واضحة لتحويلها إلى فيديو متحرك" : "Upload an image to bring into life with cinematic motion"}
                  </span>
                </div>
              </div>

              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? "حذف الصورة" : "Remove"}</span>
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
                className="border-2 border-dashed border-white/15 hover:border-violet-500/50 bg-[#06010f]/80 hover:bg-[#06010f] rounded-xl p-8 md:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-violet-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    {isRtl ? "اضغط لرفع الصورة أو اسحبها إلى هنا" : "Click to upload or drag & drop"}
                  </p>
                  <p className="text-xs text-white/40 font-mono">
                    PNG, JPG, WEBP • Max 25MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center max-h-[360px] group">
                <img
                  src={imagePreview}
                  alt="Source Preview"
                  className="max-h-[360px] w-full object-contain"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isRtl ? "تغيير الصورة" : "Change Image"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

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
                <span className="text-xl font-black text-amber-300 font-mono">{estimatedCost}</span>
                <span className="text-xs text-amber-300/70 font-semibold">
                  {currentModel.isPerSecond ? (isRtl ? `نقطة (${duration} ثواني)` : `Credits (${duration}s)`) : (isRtl ? "نقطة / فيديو" : "Credits / Video")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !imageFile || !hasSufficientCredits}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isLoading || !imageFile || !hasSufficientCredits
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
                  <span>{isRtl ? `توليد الفيديو (${estimatedCost} نقطة)` : `Generate Video (${estimatedCost} Credits)`}</span>
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
                <div className="space-y-0.5 truncate">
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
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 shrink-0 ${isModelDropdownOpen ? "rotate-180 text-violet-400" : ""}`} />
              </button>

              {/* Model Dropdown Menu */}
              {isModelDropdownOpen && (
                <div className="absolute z-50 top-full mt-1.5 w-full bg-[#0d041c] border border-violet-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {modelOptions.map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleModelSelect(m.id)}
                        className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-violet-600/25 text-white border border-violet-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{isRtl ? m.nameAr : m.name}</span>
                            {m.discount && (
                              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded">{m.discount}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/40">{isRtl ? m.badgeAr : m.badge}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
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

              {/* Resolution Dropdown Menu */}
              {isResDropdownOpen && (
                <div className="absolute z-40 top-full mt-1.5 w-full bg-[#0d041c] border border-indigo-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {RESOLUTIONS.filter(r => currentModel.supportedResolutions.includes(r.id)).map((r) => {
                    const isSelected = resolution === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => { setResolution(r.id); setIsResDropdownOpen(false); }}
                        className={`w-full text-start p-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-indigo-600/25 text-white border border-indigo-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
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

              {/* Aspect Ratio Dropdown Menu */}
              {isAspectDropdownOpen && (
                <div className="absolute z-30 top-full mt-1.5 w-full bg-[#0d041c] border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {ASPECT_RATIOS.map((a) => {
                    const isSelected = aspectRatio === a.id;
                    const IconComp = a.icon;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => { setAspectRatio(a.id); setIsAspectDropdownOpen(false); }}
                        className={`w-full text-start p-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-amber-500/20 text-white border border-amber-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
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
            </div>

            {/* 4. Duration Slider for Grok only */}
            {currentModel.isPerSecond && (
              <div className="space-y-3 pt-2 border-t border-white/5">
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
                    min="6"
                    max="30"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer bg-white/10 rounded-lg h-2"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>6s</span>
                    <span>15s</span>
                    <span>30s</span>
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
