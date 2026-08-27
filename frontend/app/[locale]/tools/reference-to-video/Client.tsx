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
  name: string;
  nameAr: string;
  badge: string;
  badgeAr: string;
  desc: string;
  descAr: string;
  discount?: string;
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
    name: "Google Veo 3.1 Fast",
    nameAr: "جوجل فيو 3.1 فاست (سريع)",
    badge: "Fast & 4K",
    badgeAr: "سريع • حتى 4K",
    desc: "Ultra fast 8-second multi-frame reference interpolation",
    descAr: "توليد فائق السرعة لمدة 8 ثواني مع تحول سينمائي واقعي",
    discount: "-83%",
    supportedResolutions: ["720p", "1080p", "4k"],
    prices: { "720p": 30, "1080p": 37.5, "4k": 90 }
  },
  {
    id: "veo-3.1-lite",
    name: "Google Veo 3.1 Lite",
    nameAr: "جوجل فيو 3.1 لايت (اقتصادي)",
    badge: "Budget Friendly",
    badgeAr: "اقتصادي وموفر",
    desc: "Lowest credit consumption for fast scene sequencing",
    descAr: "أقل استهلاك للنقاط ومثالي للتجارب وتتابع المشاهد السريع",
    discount: "-84%",
    supportedResolutions: ["720p", "1080p", "4k"],
    prices: { "720p": 15, "1080p": 22.5, "4k": 75 }
  },
  {
    id: "seedance-2.0-mini",
    name: "Seedance 2.0 Mini",
    nameAr: "سيدانس 2.0 ميني",
    badge: "Dynamic Motion",
    badgeAr: "حركة ديناميكية",
    desc: "Advanced video generation with dynamic pricing and duration control",
    descAr: "توليد فيديو متقدم مع تسعير ديناميكي وتحكم في المدة",
    discount: "Flexible",
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

const ASPECT_RATIOS = [
  { id: "16:9", label: "16:9", desc: "YouTube / Desktop", descAr: "عرضي (يوتيوب وكمبيوتر)", icon: Monitor },
  { id: "9:16", label: "9:16", desc: "TikTok / Reels / Shorts", descAr: "طولي (تيك توك وريلز)", icon: Smartphone },
  { id: "1:1", label: "1:1", desc: "Instagram / Square", descAr: "مربع (انستغرام وبوستات)", icon: Square }
];

const SAMPLE_REFERENCE_PROMPTS = {
  ar: [
    { title: "تحول زمني من النهار لليل", text: "تحول سينمائي سلس وتدريجي من مشهد النهار المشمس في الصورة الأولى إلى لقطة المساء المضاءة بالنيون والنجوم، مع حركة كاميرا بطيئة وتأثيرات إضاءة غنية." },
    { title: "تطور حركة الشخصية", text: "حركة انسيابية ديناميكية تحافظ على ملامح الشخصية المرجعية بدقة متناهية، مع انتقال سلس بين الإطار الابتدائي والنهائي وإضاءة سينمائية محيطية." },
    { title: "تحول طبيعي سحري", text: "تلاشي وانتقال مورفينغ سحري فائق النعومة بين البيئتين، تمايل أوراق الشجر وانعكاسات ضوئية مائية واقعية مع ثبات هوية العناصر المرجعية." },
    { title: "حركة كاميرا سينمائية مقربة", text: "لقطة كاميرا زوم سلسة تقترب ببطء من العنصر المرجعي مع الحفاظ على كل التفاصيل الدقيقة للأقمشة والملامح والألوان بدقة 4K." }
  ],
  en: [
    { title: "Day to Night Morph", text: "Seamless cinematic time-lapse transition from the sunny daytime reference to the neon-lit twilight scene, volumetric lighting and smooth camera dolly." },
    { title: "Character Motion Continuity", text: "Fluid character animation perfectly preserving the identity, clothing, and facial features across frames with realistic physics and natural motion blur." },
    { title: "Magical Landscape Transition", text: "Ultra-smooth morphing transition bridging the first and final environments with soft atmospheric particles and cinematic color harmony." },
    { title: "Cinematic Zoom & Pan", text: "Smooth camera push-in focusing closely on the reference character with hyper-realistic textures, accurate depth of field, and 4k clarity." }
  ]
};

const FRAME_SLOTS = [
  { key: 0, titleAr: "إطار البداية (Start Frame)", titleEn: "Start Frame", descAr: "اللقطة التي يبدأ منها الفيديو", descEn: "Starting visual shot" },
  { key: 1, titleAr: "مرجع النمط / الشخصية (Style Ref)", titleEn: "Style / Character Ref", descAr: "توجيه هوية الشخصية أو البيئة", descEn: "Character or style guide" },
  { key: 2, titleAr: "إطار النهاية (End Frame)", titleEn: "End Frame", descAr: "اللقطة التي يستقر عندها المشهد", descEn: "Target ending scene" }
];

export default function ReferenceToVideoPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user, setUser } = useAppStore();

  // Selected Options (Google Veo 3.1 only)
  const [selectedModelId, setSelectedModelId] = useState<string>("veo-3.1-fast");
  const [resolution, setResolution] = useState<string>("1080p");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [duration, setDuration] = useState<number>(6); // For Seedance (6-15s)
  const [mode, setMode] = useState<string>("normal"); // For Mode/Audio
  const [prompt, setPrompt] = useState<string>("");

  // Reference Images Slots (Up to 3 distinct frames)
  const [slotFiles, setSlotFiles] = useState<{ [key: number]: File | null }>({ 0: null, 1: null, 2: null });
  const [slotPreviews, setSlotPreviews] = useState<{ [key: number]: string | null }>({ 0: null, 1: null, 2: null });
  const [dragActiveSlot, setDragActiveSlot] = useState<number | null>(null);

  // Dropdown UI Open States
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isResDropdownOpen, setIsResDropdownOpen] = useState(false);
  const [isAspectDropdownOpen, setIsAspectDropdownOpen] = useState(false);

  // Status and Notifications
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
  const fileInputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Dynamic model pricing state loaded from backend
  const [modelOptions, setModelOptions] = useState<ModelOption[]>(MODELS);

  useEffect(() => {
    let active = true;
    const loadPricing = async () => {
      try {
        const res = await api.get('/api/video/pricing/reference-to-video');
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
              return {
                ...m,
                prices: {
                  ...m.prices,
                  "720p": found.fixedCost_720p ?? m.prices["720p"],
                  "1080p": found.fixedCost_1080p ?? m.prices["1080p"],
                  "4k": found.fixedCost_4k ?? m.prices["4k"],
                }
              };
            }
            return m;
          }));
        }
      } catch (err) {}
    };
    loadPricing();
    return () => { active = false; };
  }, []);

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

  // Find active model object
  const currentModel = useMemo(() => {
    return modelOptions.find(m => m.id === selectedModelId) || modelOptions[0];
  }, [modelOptions, selectedModelId]);

  // Adjust resolution if not supported by newly selected model
  const handleModelSelect = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    if (model) {
      setSelectedModelId(modelId);
      if (!model.supportedResolutions.includes(resolution)) {
        setResolution(model.supportedResolutions.includes("1080p") ? "1080p" : model.supportedResolutions[0]);
      }
      
      const isNewModelSeedance = modelId.includes("seedance");
      if (!isNewModelSeedance) {
        let cleared = false;
        setSlotFiles(prevFiles => {
          const newSlotFiles = { ...prevFiles };
          setSlotPreviews(prevPreviews => {
            const newSlotPreviews = { ...prevPreviews };
            Object.keys(newSlotFiles).forEach((key) => {
              const k = Number(key);
              const file = newSlotFiles[k];
              if (file && !file.type.startsWith("image/")) {
                 newSlotFiles[k] = null;
                 newSlotPreviews[k] = null;
                 if (fileInputs[k]?.current) fileInputs[k].current!.value = '';
                 cleared = true;
              }
            });
            if (cleared) {
              setError(isRtl ? "تمت إزالة الملفات غير المدعومة لأن الموديل المختار يدعم الصور فقط" : "Unsupported files were removed because the selected model only supports images");
            }
            return newSlotPreviews;
          });
          return newSlotFiles;
        });
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
        const res = await api.get(`/api/video/estimate-tool/reference-to-video?model=${currentModel.id}&resolution=${resolution}&duration=8`);
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
  }, [currentModel, resolution]);

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
                prompt: data.prompt || prompt || (isRtl ? "فيديو مرجعي" : "Reference Video"),
                model: currentModel.name,
                resolution: resolution,
                aspectRatio: aspectRatio,
                createdAt: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
              };

              setGeneratedVideo(newVidItem);
              setRecentVideos(prev => [newVidItem, ...prev.filter(x => x.id !== newVidItem.id)]);
              setActiveTaskId(null);
              setIsLoading(false);
              setSuccessMessage(isRtl ? "🎉 تم رندر وتوليد الفيديو المرجعي بنجاح!" : "🎉 Reference video generated successfully!");

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
            setError(data.error || (isRtl ? "فشلت عملية توليد الفيديو المرجعي" : "Reference video generation failed"));
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

  const isSeedance = currentModel.id.includes("seedance");
  const acceptedFileTypes = isSeedance ? "image/*,video/*,audio/*" : "image/*";

  // Image Upload handler for specific slot
  const handleSlotImageChange = (index: number, file: File | null) => {
    if (file) {
      if (!isSeedance && !file.type.startsWith("image/")) {
        setError(isRtl ? "هذا الموديل يدعم رفع الصور فقط" : "This model only supports image uploads");
        if (fileInputs[index].current) fileInputs[index].current!.value = '';
        return;
      }
      setSlotFiles(prev => ({ ...prev, [index]: file }));
      const url = URL.createObjectURL(file);
      setSlotPreviews(prev => ({ ...prev, [index]: url }));
      setError(null);
    }
  };

  const handleRemoveSlot = (index: number) => {
    setSlotFiles(prev => ({ ...prev, [index]: null }));
    setSlotPreviews(prev => ({ ...prev, [index]: null }));
    if (fileInputs[index].current) fileInputs[index].current!.value = '';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragActiveSlot(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActiveSlot(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragActiveSlot(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSlotImageChange(index, e.dataTransfer.files[0]);
    }
  };

  const totalUploadedImagesCount = Object.values(slotFiles).filter(Boolean).length;


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
      link.download = filename || `reference_video_${Date.now()}.mp4`;
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
    if (totalUploadedImagesCount === 0) {
      setError(isRtl ? "يرجى رفع صورة مرجعية واحدة على الأقل في الستوري بورد" : "Please upload at least one reference frame");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      
      // Append valid slot files in sequence under both keys
      [0, 1, 2].forEach(idx => {
        const file = slotFiles[idx];
        if (file) {
          formData.append("images", file);
          formData.append("image", file);
        }
      });

      if (prompt.trim()) formData.append("prompt", prompt.trim());
      formData.append("model", currentModel.id);
      formData.append("resolution", resolution);
      formData.append("aspectRatio", aspectRatio);
      
      if (currentModel.id.includes("seedance")) {
        formData.append("duration", duration.toString());
        formData.append("audio", mode.includes("audio_on") ? "true" : "false");
        formData.append("mode", mode);
      } else {
        formData.append("duration", "8"); // Veo 8s standard
      }

      const res = await api.post("/api/video/start-tool/reference-to-video", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data?.taskId) {
        setActiveTaskId(res.data.taskId);
        setSuccessMessage(
          isRtl 
            ? "⚡ جاري معالجة وتوليد الفيديو المرجعي عبر محرك الذكاء الاصطناعي..." 
            : "⚡ Generating reference video with AI engine..."
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.error || (isRtl ? "حدث خطأ أثناء إرسال طلب التوليد" : "Error submitting reference video task"));
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 pt-2" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Main Studio 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* 1. Main Area: Visual Storyboard Slots & Prompt Studio                     */}
        {/* ========================================================================= */}
        <div className="order-2 lg:order-1 lg:col-span-8 space-y-5">
          
          {/* Storyboard Reference Frames Grid */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "الستوري بورد المرجعي (Multi-Frame Storyboard)" : "Reference Storyboard Slots"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "ارفع حتى 3 صور لتوجيه بداية المشهد ونهايته وأسلوب الشخصية" : "Upload up to 3 frames to interpolate sequence and style"}
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-400">
                {totalUploadedImagesCount} / 3 {isRtl ? "صور" : "frames"}
              </span>
            </div>

            {/* 3 Storyboard Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {FRAME_SLOTS.map((slot) => {
                const preview = slotPreviews[slot.key];
                const inputRef = fileInputs[slot.key];

                return (
                  <div key={slot.key} className="space-y-1.5">
                    <input
                      ref={inputRef}
                      type="file"
                      accept={acceptedFileTypes}
                      onChange={(e) => handleSlotImageChange(slot.key, e.target.files?.[0] || null)}
                      className="hidden"
                    />

                    <div className="flex justify-between items-center text-[11px] px-1">
                      <span className="font-bold text-white/80">{isRtl ? slot.titleAr : slot.titleEn}</span>
                      {preview && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slot.key)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {!preview ? (
                      <div
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => handleDragOver(e, slot.key)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, slot.key)}
                        className={`border-2 border-dashed ${dragActiveSlot === slot.key ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/15 bg-[#06010f]/80 hover:border-emerald-500/50 hover:bg-[#06010f]'} rounded-xl p-4 aspect-[4/3] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group text-center`}
                      >
                        <div className={`w-9 h-9 rounded-xl ${dragActiveSlot === slot.key ? 'bg-emerald-400/20 scale-110' : 'bg-emerald-500/10 group-hover:scale-110'} border border-emerald-500/20 flex items-center justify-center transition-transform`}>
                          <Upload className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-[10px] text-white/50 group-hover:text-white transition-colors">
                          {isRtl ? slot.descAr : slot.descEn}
                        </span>
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-[4/3] group">
                        {slotFiles[slot.key]?.type.startsWith('video/') ? (
                          <video
                            src={preview}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : slotFiles[slot.key]?.type.startsWith('audio/') ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            <audio src={preview} controls className="w-11/12" />
                          </div>
                        ) : (
                          <img
                            src={preview}
                            alt={`Slot ${slot.key}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold backdrop-blur-md transition-all flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>{isRtl ? "تغيير" : "Change"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Optional Prompt Box */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md relative overflow-hidden group focus-within:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "وصف التحول والقصة (Story & Transition Prompt)" : "Story & Transition Prompt"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "صف كيف تريد أن تندمج وتتحول اللقطات المرجعية زمنياً" : "Describe the morphing and narrative linking these frames"}
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
                    ? "صف قصة التحول بين الصور... (مثال: تحول سينمائي سلس من الإطار الأول إلى الأخير مع حركة كاميرا بطيئة وثبات للشخصية)" 
                    : "Describe the transition story between frames... (e.g. Smooth cinematic morph from start to end with volumetric lighting)"
                }
                className="w-full bg-[#06010f] border border-white/10 rounded-xl p-4 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 resize-none text-sm md:text-base leading-relaxed transition-all shadow-inner font-sans"
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
                <span className="text-emerald-300 font-bold">{resolution}</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">{aspectRatio}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-white/50">{isRtl ? "التكلفة:" : "Cost:"}</span>
                <span className="text-xl font-black text-amber-300 font-mono">{estimatedCost ?? "—"}</span>
                <span className="text-xs text-amber-300/70 font-semibold">{isRtl ? "نقطة / فيديو" : "Credits / Video"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || totalUploadedImagesCount === 0 || !hasSufficientCredits}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isLoading || totalUploadedImagesCount === 0 || !hasSufficientCredits
                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-emerald-900/40 hover:shadow-emerald-800/70 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span>{isRtl ? `جاري المعالجة والرندر (${elapsedSeconds} ثانية)...` : `Rendering Video (${elapsedSeconds}s)...`}</span>
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
              <div className="bg-[#0b0416]/95 border border-emerald-500/30 rounded-2xl p-8 md:p-12 shadow-2xl text-center space-y-5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/10 to-cyan-500/5 animate-pulse pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
                      <Film className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full animate-ping pointer-events-none" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-extrabold text-white">
                      {isRtl ? "جاري رندر وتوليد الفيديو المرجعي بالذكاء الاصطناعي..." : "AI Reference Video Rendering..."}
                    </h3>
                    <p className="text-xs text-white/50 max-w-md mx-auto">
                      {isRtl 
                        ? `يتم الآن دمج الإطارات المرجعية عبر محرك ${currentModel.nameAr} بدقة ${resolution}`
                        : `Processing reference sequence with ${currentModel.name} at ${resolution}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-400">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>{isRtl ? `الوقت المستغرق: ${elapsedSeconds} ثانية` : `Elapsed: ${elapsedSeconds}s`}</span>
                  </div>
                </div>
              </div>
            )}

            {/* When Result Ready */}
            {generatedVideo && !isLoading && (
              <div className="bg-[#0b0416]/95 border border-emerald-500/30 rounded-2xl p-5 md:p-6 shadow-2xl space-y-5 backdrop-blur-md">
                
                {/* Result Header Bar */}
                <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {isRtl ? "الفيديو المرجعي النهائي (جاهز للمشاهدة والتحميل)" : "Final Reference Video"}
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
                      onClick={() => handleDownloadVideo(generatedVideo.url, `reference_${generatedVideo.id.slice(0, 8)}.mp4`)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
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
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
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
                  <Film className="w-3.5 h-3.5 text-emerald-400" />
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
                          isSelected ? "border-emerald-500 ring-2 ring-emerald-500/50 scale-105" : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
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
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? "إعدادات الفيديو المرجعي" : "Settings"}</span>
              </h2>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Options</span>
            </div>

            {/* 1. Model Dropdown Select */}
            <div className="space-y-1.5 relative" ref={modelRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? "محرك الذكاء الاصطناعي" : "AI Model"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-emerald-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all group"
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
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 shrink-0 ${isModelDropdownOpen ? "rotate-180 text-emerald-400" : ""}`} />
              </button>

              {/* Model Dropdown Menu */}
              {isModelDropdownOpen && (
                <div className="absolute z-50 top-full mt-1.5 w-full bg-[#0d041c] border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {modelOptions.map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleModelSelect(m.id)}
                        className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-emerald-600/25 text-white border border-emerald-500/40" 
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
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Resolution Dropdown Select */}
            <div className="space-y-1.5 relative" ref={resRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-teal-400" />
                <span>{isRtl ? "دقة الفيديو (Resolution)" : "Resolution"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsResDropdownOpen(!isResDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-teal-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div>
                  <span className="font-bold text-xs md:text-sm text-white block">
                    {RESOLUTIONS.find(r => r.id === resolution)?.label || resolution}
                  </span>
                  <span className="text-[10px] text-white/40 block">
                    {isRtl ? RESOLUTIONS.find(r => r.id === resolution)?.descAr : RESOLUTIONS.find(r => r.id === resolution)?.desc}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isResDropdownOpen ? "rotate-180 text-teal-400" : ""}`} />
              </button>

              {/* Resolution Dropdown Menu */}
              {isResDropdownOpen && (
                <div className="absolute z-40 top-full mt-1.5 w-full bg-[#0d041c] border border-teal-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {RESOLUTIONS.filter(r => currentModel.supportedResolutions.includes(r.id)).map((r) => {
                    const isSelected = resolution === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => { setResolution(r.id); setIsResDropdownOpen(false); }}
                        className={`w-full text-start p-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-teal-600/25 text-white border border-teal-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        <div>
                          <span className="font-bold text-xs text-white block">{r.label}</span>
                          <span className="text-[10px] text-white/40">{isRtl ? r.descAr : r.desc}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
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

            {/* 4. Duration Slider for Seedance */}
            {currentModel.id.includes("seedance") && (
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="space-y-1.5">
                  <span className="font-bold text-white/80 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isRtl ? "إعدادات الصوت (Audio Settings):" : "Audio Settings:"}</span>
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "audio_off", labelAr: "بدون صوت", labelEn: "Audio Off" },
                      { id: "audio_on", labelAr: "مع الصوت", labelEn: "Audio On" }
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
                    max="15"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer bg-white/10 rounded-lg h-2"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>6s</span>
                    <span>15s</span>
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
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-950/50"
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
