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
  Check, 
  Layers, 
  Copy, 
  CheckCheck, 
  Trash2, 
  Flame,
  CheckCircle2,
  AlertCircle,
  Upload,
  X
} from "lucide-react";
import api from "../../../../src/utils/api";
import { useAppStore } from "../../../../src/store/useAppStore";

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
    id: "veo-3.1-quality",
    name: "Google Veo 3.1 Quality",
    nameAr: "جوجل فيو 3.1 كواليتي (سينمائي)",
    badge: "Studio Cinema Grade",
    badgeAr: "أعلى جودة سينمائية",
    desc: "Maximum visual fidelity and seamless transition blending",
    descAr: "أعلى دقة تفاصيل ونقاء بصري مع اندماج سلس بين الصور",
    discount: "-69%",
    supportedResolutions: ["720p", "1080p", "4k"],
    prices: { "720p": 225, "1080p": 232.5, "4k": 285 }
  }
];

const RESOLUTIONS = [
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
  const { user } = useAppStore();

  // Selected Options (Google Veo 3.1 only)
  const [selectedModelId, setSelectedModelId] = useState<string>("veo-3.1-fast");
  const [resolution, setResolution] = useState<string>("1080p");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [prompt, setPrompt] = useState<string>("");

  // Reference Images Slots (Up to 3 distinct frames)
  const [slotFiles, setSlotFiles] = useState<{ [key: number]: File | null }>({ 0: null, 1: null, 2: null });
  const [slotPreviews, setSlotPreviews] = useState<{ [key: number]: string | null }>({ 0: null, 1: null, 2: null });

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
  const fileInputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

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

  // Calculate live estimated cost for Veo (8 seconds)
  const estimatedCost = useMemo(() => {
    return currentModel.prices[resolution] || currentModel.prices["1080p"] || 37.5;
  }, [currentModel, resolution]);

  // Total balance & check sufficiency
  const totalUserCredits = (user?.standardCredits || 0) + (user?.premiumCredits || 0);
  const hasSufficientCredits = totalUserCredits >= estimatedCost;

  // Image Upload handler for specific slot
  const handleSlotImageChange = (index: number, file: File | null) => {
    if (file) {
      setSlotFiles(prev => ({ ...prev, [index]: file }));
      const url = URL.createObjectURL(file);
      setSlotPreviews(prev => ({ ...prev, [index]: url }));
    }
  };

  const handleRemoveSlot = (index: number) => {
    setSlotFiles(prev => ({ ...prev, [index]: null }));
    setSlotPreviews(prev => ({ ...prev, [index]: null }));
    if (fileInputs[index].current) fileInputs[index].current!.value = '';
  };

  const totalUploadedImagesCount = Object.values(slotFiles).filter(Boolean).length;

  // AI Prompt Enhancer Action
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      setPrompt(isRtl ? SAMPLE_REFERENCE_PROMPTS.ar[0].text : SAMPLE_REFERENCE_PROMPTS.en[0].text);
      return;
    }
    const cinematicAddon = isRtl 
      ? "، انتقال سينمائي فائق النعومة، ثبات ملامح الشخصية، إضاءة متجانسة وحركة كاميرا انسيابية بدقة 4K واقعية."
      : ", smooth cinematic morphing, perfect character consistency, coherent volumetric lighting, photorealistic 4K transition.";
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
    if (totalUploadedImagesCount === 0) {
      setError(isRtl ? "يرجى رفع صورة مرجعية واحدة على الأقل في الستوري بورد" : "Please upload at least one reference frame");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      
      // Append valid slot files in sequence
      [0, 1, 2].forEach(idx => {
        const file = slotFiles[idx];
        if (file) {
          formData.append("images", file);
        }
      });

      if (prompt) formData.append("prompt", prompt);
      formData.append("model", currentModel.id);
      formData.append("resolution", resolution);
      formData.append("aspectRatio", aspectRatio);
      formData.append("duration", "8"); // Veo 8s standard

      const res = await api.post("/api/video/start-tool/reference-to-video", formData);
      setSuccessMessage(
        isRtl 
          ? "🎉 تمت إضافة الفيديو المرجعي إلى طابور المعالجة بنجاح! سيصلك إشعار فوري فور اكتماله."
          : "🎉 Reference video added to generation queue! You will be notified once rendering completes."
      );
      setPrompt("");
    } catch (err: any) {
      setError(err.response?.data?.error || (isRtl ? "حدث خطأ أثناء إرسال طلب التوليد" : "Error submitting reference video task"));
    } finally {
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
        <div className="lg:col-span-8 space-y-5">
          
          {/* 1.1 Storyboard Reference Frames Grid */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "شريط الإطارات المرجعية (Storyboard Frames)" : "Storyboard Reference Frames"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "ارفع حتى 3 صور لتوجيه بداية المشهد، الشخصية، ونهايته مع محرك Google Veo" : "Upload up to 3 frames to guide scene progression and character style via Google Veo"}
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60">
                {totalUploadedImagesCount} / 3 {isRtl ? "صور" : "Frames"}
              </div>
            </div>

            {/* 3 Storyboard Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {FRAME_SLOTS.map((slot) => {
                const preview = slotPreviews[slot.key];
                return (
                  <div key={slot.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-white/70 px-1">
                      <span>{isRtl ? slot.titleAr : slot.titleEn}</span>
                      <span className="text-[9px] text-white/30 font-mono">#{slot.key + 1}</span>
                    </div>

                    <div 
                      onClick={() => !preview && fileInputs[slot.key].current?.click()}
                      className={`relative h-44 rounded-xl border transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer group ${
                        preview 
                          ? "border-emerald-500/40 bg-black/40" 
                          : "border-white/10 border-dashed bg-[#06010f] hover:border-emerald-500/50 hover:bg-white/5"
                      }`}
                    >
                      {preview ? (
                        <>
                          <img src={preview} alt={slot.titleEn} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                            <span className="text-[10px] text-white/80 font-medium truncate">
                              {slotFiles[slot.key]?.name}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveSlot(slot.key); }}
                              className="p-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                              title={isRtl ? "حذف" : "Remove"}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                          <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-emerald-500/15 border border-white/5 group-hover:border-emerald-500/30 flex items-center justify-center transition-colors">
                            <Upload className="w-4 h-4 text-white/40 group-hover:text-emerald-400" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white/60 group-hover:text-white block">
                              {isRtl ? "اضغط للرفع" : "Click to upload"}
                            </span>
                            <span className="text-[10px] text-white/30 block mt-0.5">
                              {isRtl ? slot.descAr : slot.descEn}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputs[slot.key]} 
                      onChange={(e) => handleSlotImageChange(slot.key, e.target.files?.[0] || null)} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1.2 Prompt Studio Box */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md relative overflow-hidden group focus-within:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "وصف الحركة والتحول (Motion & Transition Prompt)" : "Motion & Transition Prompt"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "صف ما يحدث بين هذه الصور وكيف تتحرك الكاميرا وتتغير العناصر" : "Describe the movement, pacing, and visual transformation between frames"}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  title={isRtl ? "تحسين البرومت تلقائياً" : "Enhance with AI"}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
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
                rows={5}
                maxLength={2000}
                placeholder={
                  isRtl 
                    ? "اكتب وصف المشهد والانتقال الحركي بين الصور بالتفصيل... (اختياري، مثلاً: تحول سينمائي تدريجي سلس مع حركة كاميرا مقربة وثبات ملامح الشخصية)" 
                    : "Describe the transition and camera motion between the reference images... (e.g. Smooth cinematic zoom-in preserving character details with rich lighting)"
                }
                className="w-full bg-[#06010f] border border-white/10 rounded-xl p-4 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 resize-none text-sm md:text-base leading-relaxed transition-all shadow-inner font-sans"
              />
              <div className="absolute bottom-3 end-3 text-[11px] text-white/40 font-mono bg-[#06010f]/90 px-2 py-0.5 rounded border border-white/5">
                {prompt.length} / 2000
              </div>
            </div>

            {/* Inspiration Pills */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? "أفكار حركية جاهزة للإلهام:" : "Quick Transition Presets:"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(isRtl ? SAMPLE_REFERENCE_PROMPTS.ar : SAMPLE_REFERENCE_PROMPTS.en).map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sample.text)}
                    className="text-xs bg-white/5 hover:bg-emerald-600/20 text-white/70 hover:text-white border border-white/10 hover:border-emerald-500/40 rounded-lg px-3 py-1.5 transition-all text-start flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
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
                <span>•</span>
                <span className="text-emerald-400 font-mono font-bold">8s</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-white/50">{isRtl ? "التكلفة:" : "Cost:"}</span>
                <span className="text-xl font-black text-amber-300 font-mono">{estimatedCost}</span>
                <span className="text-xs text-amber-300/70 font-semibold">{isRtl ? "نقطة" : "Credits"}</span>
                {currentModel.discount && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    {currentModel.discount} {isRtl ? "خصم" : "OFF"}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || totalUploadedImagesCount === 0 || !hasSufficientCredits}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isLoading || totalUploadedImagesCount === 0 || !hasSufficientCredits
                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-emerald-900/40 hover:shadow-emerald-800/70 active:scale-[0.98]"
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
                  <span>{isRtl ? `توليد الفيديو المرجعي (${estimatedCost} نقطة)` : `Generate Reference Video (${estimatedCost} Credits)`}</span>
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
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? "إعدادات Google Veo" : "Google Veo Settings"}</span>
              </h2>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Options</span>
            </div>

            {/* 1. Model & Tier Dropdown Select */}
            <div className="space-y-1.5 relative" ref={modelRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? "موديل Google Veo 3.1" : "Google Veo 3.1 Model"}</span>
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
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded shrink-0">
                      {currentModel.discount}
                    </span>
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
                  <div className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400/70 border-b border-white/5">
                    {isRtl ? "نماذج Google Veo 3.1 المرجعية" : "Google Veo 3.1 Reference Models"}
                  </div>

                  {MODELS.map((m) => {
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
                            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded font-mono">{m.discount}</span>
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
                  {RESOLUTIONS.map((r) => {
                    const isSelected = resolution === r.id;
                    const priceTag = `${currentModel.prices[r.id]} Cr (8s)`;

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => { setResolution(r.id); setIsResDropdownOpen(false); }}
                        className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
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

            {/* 4. Live Summary & Wallet Widget */}
            <div className="pt-2 border-t border-white/5 space-y-2.5">
              <div className="bg-[#06010f] border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">{isRtl ? "تكلفة العملية (8 ثواني):" : "Cost (8 seconds):"}</span>
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
