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
  Image as ImageIcon
} from "lucide-react";
import api from "../../../../src/utils/api";
import { useAppStore } from "../../../../src/store/useAppStore";

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
  const { user } = useAppStore();

  // Selected Options
  const [selectedModelId, setSelectedModelId] = useState<string>("veo-3.1-fast");
  const [resolution, setResolution] = useState<string>("1080p");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [duration, setDuration] = useState<number>(6); // For Grok (1-30s)
  const [prompt, setPrompt] = useState<string>("");

  // Source Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdown UI Open States
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isResDropdownOpen, setIsResDropdownOpen] = useState(false);
  const [isAspectDropdownOpen, setIsAspectDropdownOpen] = useState(false);

  // Status and Notifications
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Refs for dropdown clicks
  const modelRef = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const aspectRef = useRef<HTMLDivElement>(null);

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
    return MODELS.find(m => m.id === selectedModelId) || MODELS[0];
  }, [selectedModelId]);

  // Adjust resolution if not supported by newly selected model
  const handleModelSelect = (modelId: string) => {
    const model = MODELS.find(m => m.id === modelId);
    if (model) {
      setSelectedModelId(modelId);
      if (!model.supportedResolutions.includes(resolution)) {
        setResolution(model.supportedResolutions.includes("1080p") ? "1080p" : model.supportedResolutions[0]);
      }
    }
    setIsModelDropdownOpen(false);
  };

  // Calculate live estimated cost
  const estimatedCost = useMemo(() => {
    if (currentModel.isPerSecond) {
      const rate = currentModel.prices[resolution] || 4.5;
      return +(rate * duration).toFixed(2);
    } else {
      return currentModel.prices[resolution] || currentModel.prices["1080p"] || 37.5;
    }
  }, [currentModel, resolution, duration]);

  // Total balance & check sufficiency
  const totalUserCredits = (user?.standardCredits || 0) + (user?.premiumCredits || 0);
  const hasSufficientCredits = totalUserCredits >= estimatedCost;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // AI Prompt Enhancer Action
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      setPrompt(isRtl ? SAMPLE_ANIMATION_PROMPTS.ar[0].text : SAMPLE_ANIMATION_PROMPTS.en[0].text);
      return;
    }
    const cinematicAddon = isRtl 
      ? "، حركة كاميرا سينمائية انسيابية، ثبات الملامح، إضاءة واقعية وتفاصيل بصرية عالية الدقة 4K."
      : ", fluid cinematic camera motion, subject preservation, volumetric lighting, photorealistic 4K render.";
    if (!prompt.includes("cinematic") && !prompt.includes("سينمائي")) {
      setPrompt(prev => prev.trim() + cinematicAddon);
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
      formData.append("images", imageFile);
      if (prompt) formData.append("prompt", prompt);
      formData.append("model", currentModel.id);
      formData.append("resolution", resolution);
      formData.append("aspectRatio", aspectRatio);

      if (currentModel.family === "grok") {
        formData.append("duration", duration.toString());
      } else {
        formData.append("duration", "8"); // Veo 8s standard
      }

      const res = await api.post("/api/video/start-tool/image-to-video", formData);
      setSuccessMessage(
        isRtl 
          ? "🎉 تمت إضافة الفيديو إلى طابور المعالجة بنجاح! سيصلك إشعار فوري عند اكتمال التحريك."
          : "🎉 Animation added to generation queue! You will be notified once rendering completes."
      );
      setPrompt("");
    } catch (err: any) {
      setError(err.response?.data?.error || (isRtl ? "حدث خطأ أثناء إرسال طلب التوليد" : "Error submitting animation task"));
    } finally {
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
        <div className="lg:col-span-8 space-y-5">
          
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
                    {isRtl ? "ارفع صورة لتحويلها إلى فيديو متحرك عالي الجودة" : "Upload any image to animate it into a fluid cinematic video"}
                  </span>
                </div>
              </div>

              {imageFile && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? "حذف الصورة" : "Remove"}</span>
                </button>
              )}
            </div>

            <div 
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className={`relative w-full h-56 rounded-xl border transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer group ${
                imagePreview 
                  ? "border-blue-500/40 bg-black/40" 
                  : "border-white/10 border-dashed bg-[#06010f] hover:border-blue-500/50 hover:bg-white/5"
              }`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <span className="text-xs text-white/80 font-medium truncate">
                      {imageFile?.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="p-1.5 rounded-lg bg-red-500 text-white transition-colors"
                      title={isRtl ? "حذف" : "Remove"}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-blue-500/15 border border-white/5 group-hover:border-blue-500/30 flex items-center justify-center transition-colors">
                    <Upload className="w-5 h-5 text-white/40 group-hover:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white/70 group-hover:text-white block">
                      {isRtl ? "اضغط لرفع الصورة أو اسحبها إلى هنا" : "Click to upload image or drag & drop"}
                    </span>
                    <span className="text-[11px] text-white/30 block mt-1">
                      {isRtl ? "يدعم صيغ JPG, PNG, WEBP بدقة عالية" : "Supports high-resolution JPG, PNG, WEBP"}
                    </span>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Prompt Studio Box */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md relative overflow-hidden group focus-within:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Wand2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "وصف التحريك (Motion Prompt) - اختياري" : "Motion Prompt (Optional)"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "صف حركة الكاميرا أو العناصر ليتولى الذكاء الاصطناعي تحريكها بدقة" : "Describe camera trajectory, subject action, or atmospheric movement"}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  title={isRtl ? "تحسين البرومت تلقائياً" : "Enhance with AI"}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isRtl ? "تحسين ذكي ✨" : "Enhance AI ✨"}</span>
                </button>

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
                    ? "اكتب كيف تريد تحريك الصورة... (مثال: لقطة تقريب سينمائية بطيئة، نسيم خفيف يحرك الشعر، إضاءة ناعمة متحركة بدقة 4K)" 
                    : "Describe how you want to animate the image... (e.g. Smooth cinematic slow zoom-in with gentle hair breeze and subtle volumetric lighting)"
                }
                className="w-full bg-[#06010f] border border-white/10 rounded-xl p-4 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 resize-none text-sm md:text-base leading-relaxed transition-all shadow-inner font-sans"
              />
              <div className="absolute bottom-3 end-3 text-[11px] text-white/40 font-mono bg-[#06010f]/90 px-2 py-0.5 rounded border border-white/5">
                {prompt.length} / 2000
              </div>
            </div>

            {/* Inspiration Pills */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? "أفكار حركية جاهزة للإلهام:" : "Quick Animation Presets:"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(isRtl ? SAMPLE_ANIMATION_PROMPTS.ar : SAMPLE_ANIMATION_PROMPTS.en).map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sample.text)}
                    className="text-xs bg-white/5 hover:bg-blue-600/20 text-white/70 hover:text-white border border-white/10 hover:border-blue-500/40 rounded-lg px-3 py-1.5 transition-all text-start flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span>{sample.title}</span>
                  </button>
                ))}
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
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-start gap-3 backdrop-blur-md">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              <div className="space-y-0.5">
                <p className="font-bold">{isRtl ? "تم إرسال الطلب بنجاح" : "Task Submitted Successfully"}</p>
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
                <span className="text-cyan-300 font-bold">{resolution}</span>
                <span>•</span>
                <span className="text-white/80">{aspectRatio}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-white/50">{isRtl ? "التكلفة:" : "Cost:"}</span>
                <span className="text-xl font-black text-amber-300 font-mono">{estimatedCost}</span>
                <span className="text-xs text-amber-300/70 font-semibold">{isRtl ? "نقطة" : "Credits"}</span>
                {currentModel.discount && currentModel.discount !== "Flexible" && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    {currentModel.discount} {isRtl ? "خصم" : "OFF"}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !imageFile || !hasSufficientCredits}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isLoading || !imageFile || !hasSufficientCredits
                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-blue-900/40 hover:shadow-blue-800/70 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isRtl ? "جاري المعالجة والإرسال..." : "Processing & Queuing..."}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{isRtl ? `توليد الفيديو (${estimatedCost} نقطة)` : `Generate Video (${estimatedCost} Credits)`}</span>
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
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? "إعدادات تحريك الصورة" : "Animation Settings"}</span>
              </h2>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Options</span>
            </div>

            {/* 1. Model & Tier Dropdown Select */}
            <div className="space-y-1.5 relative" ref={modelRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>{isRtl ? "الموديل والمحرك" : "Model & Tier"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-blue-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all group"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-xs md:text-sm text-white truncate">
                      {isRtl ? currentModel.nameAr : currentModel.name}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded shrink-0">
                      {currentModel.discount}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 truncate">
                    {isRtl ? currentModel.descAr : currentModel.desc}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 shrink-0 ${isModelDropdownOpen ? "rotate-180 text-blue-400" : ""}`} />
              </button>

              {/* Model Dropdown Menu */}
              {isModelDropdownOpen && (
                <div className="absolute z-50 top-full mt-1.5 w-full bg-[#0d041c] border border-blue-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-400/70 border-b border-white/5">
                    {isRtl ? "نماذج Google Veo 3.1" : "Google Veo 3.1 Models"}
                  </div>

                  {MODELS.filter(m => m.family === "veo").map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleModelSelect(m.id)}
                        className={`w-full text-start p-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-blue-600/25 text-white border border-blue-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{isRtl ? m.nameAr : m.name}</span>
                            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded font-mono">{m.discount}</span>
                          </div>
                          <p className="text-[10px] text-white/40">{isRtl ? m.badgeAr : m.badge}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                      </button>
                    );
                  })}

                  <div className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-fuchsia-400/70 border-b border-white/5 pt-2">
                    {isRtl ? "نماذج xAI Grok" : "xAI Grok Models"}
                  </div>

                  {MODELS.filter(m => m.family === "grok").map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleModelSelect(m.id)}
                        className={`w-full text-start p-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-fuchsia-600/25 text-white border border-fuchsia-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{isRtl ? m.nameAr : m.name}</span>
                          </div>
                          <p className="text-[10px] text-white/40">{isRtl ? m.badgeAr : m.badge}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Resolution Dropdown Select */}
            <div className="space-y-1.5 relative" ref={resRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? "دقة الفيديو" : "Resolution"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsResDropdownOpen(!isResDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-amber-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div>
                  <span className="font-bold text-xs md:text-sm text-white block">
                    {RESOLUTIONS.find(r => r.id === resolution)?.label || resolution}
                  </span>
                  <span className="text-[10px] text-white/40 block">
                    {isRtl 
                      ? RESOLUTIONS.find(r => r.id === resolution)?.descAr 
                      : RESOLUTIONS.find(r => r.id === resolution)?.desc}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isResDropdownOpen ? "rotate-180 text-amber-400" : ""}`} />
              </button>

              {/* Resolution Dropdown Menu */}
              {isResDropdownOpen && (
                <div className="absolute z-40 top-full mt-1.5 w-full bg-[#0d041c] border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {RESOLUTIONS.filter(r => currentModel.supportedResolutions.includes(r.id)).map((r) => {
                    const isSelected = resolution === r.id;
                    const priceTag = currentModel.isPerSecond
                      ? `${currentModel.prices[r.id]} Cr/s`
                      : `${currentModel.prices[r.id]} Cr (8s)`;

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => { setResolution(r.id); setIsResDropdownOpen(false); }}
                        className={`w-full text-start p-2 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-amber-500/20 text-white border border-amber-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        <div>
                          <span className="font-bold text-xs text-white block">{r.label}</span>
                          <span className="text-[10px] text-white/40">{isRtl ? r.descAr : r.desc}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-300">{priceTag}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Aspect Ratio Dropdown Select */}
            <div className="space-y-1.5 relative" ref={aspectRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isRtl ? "أبعاد الفيديو (Aspect Ratio)" : "Aspect Ratio"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsAspectDropdownOpen(!isAspectDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-cyan-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  {(() => {
                    const IconComp = ASPECT_RATIOS.find(a => a.id === aspectRatio)?.icon || Monitor;
                    return <IconComp className="w-4 h-4 text-cyan-400" />;
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
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isAspectDropdownOpen ? "rotate-180 text-cyan-400" : ""}`} />
              </button>

              {/* Aspect Ratio Dropdown Menu */}
              {isAspectDropdownOpen && (
                <div className="absolute z-30 top-full mt-1.5 w-full bg-[#0d041c] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
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
                            ? "bg-cyan-500/20 text-white border border-cyan-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp className="w-4 h-4 text-cyan-400" />
                          <div>
                            <span className="font-bold text-xs text-white block">{a.label}</span>
                            <span className="text-[10px] text-white/40">{isRtl ? a.descAr : a.desc}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Grok Duration Slider (Shown only when Grok is active) */}
            {currentModel.isPerSecond && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>{isRtl ? "مدة الفيديو" : "Duration"}</span>
                  </label>
                  <span className="text-xs font-mono font-extrabold text-fuchsia-300 bg-fuchsia-500/15 border border-fuchsia-500/30 px-2 py-0.5 rounded">
                    {duration}s
                  </span>
                </div>

                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1" 
                  value={duration} 
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />

                <div className="flex justify-between text-[10px] text-white/40 font-mono">
                  <span>1s</span>
                  <span>15s</span>
                  <span>30s</span>
                </div>
              </div>
            )}

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
