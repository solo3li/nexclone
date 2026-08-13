"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { 
  Image as ImageIcon, 
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
  EyeOff,
  Palette,
  Camera,
  Shapes,
  Brush
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
  pricePerImage: number;
}

const MODELS: ModelOption[] = [
  {
    id: "grok",
    name: "xAI Grok Imagine",
    nameAr: "إكس إيه آي جروك إيماجين",
    badge: "Ultra Fast & Creative",
    badgeAr: "توليد إبداعي فائق السرعة",
    desc: "Next-gen dynamic text to image rendering with exceptional realism",
    descAr: "توليد صور إبداعي عالي الدقة وسريع بالذكاء الاصطناعي",
    pricePerImage: 2.0
  }
];

const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1", desc: "Instagram & Square", descAr: "مربع (انستغرام وبوستات)", icon: Square },
  { id: "16:9", label: "16:9", desc: "Landscape & Desktop", descAr: "عرضي (يوتيوب وكمبيوتر)", icon: Monitor },
  { id: "9:16", label: "9:16", desc: "Reels & TikTok", descAr: "طولي (تيك توك وريلز)", icon: Smartphone },
  { id: "4:3", label: "4:3", desc: "Classic Landscape", descAr: "كلاسيكي أفقي", icon: Monitor },
  { id: "3:4", label: "3:4", desc: "Portrait Photo", descAr: "بورتريه عمودي", icon: Smartphone }
];

const STYLE_PRESETS = [
  { id: "photo", labelAr: "📸 واقعي 8K", labelEn: "📸 Photorealistic", suffix: ", 8k resolution, photorealistic, professional photography, natural studio lighting, highly detailed textures, masterwork" },
  { id: "anime", labelAr: "🎨 أنمي ياباني", labelEn: "🎨 Anime Studio", suffix: ", anime aesthetic, makoto shinkai style, vibrant colors, detailed lineart, studio ghibli lighting" },
  { id: "3d", labelAr: "💎 ثلاثي الأبعاد 3D", labelEn: "💎 3D Render", suffix: ", 3d character render, unreal engine 5, octane render, volumetric lighting, raytracing, pixar style" },
  { id: "cyberpunk", labelAr: "🌌 سايبربانك", labelEn: "🌌 Cyberpunk", suffix: ", cyberpunk aesthetic, futuristic neon glow, rainy reflective streets, volumetric fog, high tech" },
  { id: "painting", labelAr: "🖌️ رسم زيتي فني", labelEn: "🖌️ Oil Painting", suffix: ", classical oil painting, textured brush strokes, dramatic chiaroscuro lighting, art gallery masterpiece" },
  { id: "architecture", labelAr: "🏛️ معماري وديكور", labelEn: "🏛️ Architecture", suffix: ", architectural photography, modern luxury interior design, architectural digest style, clean ambient lighting" }
];

const SAMPLE_IMAGE_PROMPTS = {
  ar: [
    { title: "صقر عربي مهيب في الصحراء", text: "لقطة فوتوغرافية فائقة الدقة والجمال لصقر شاهين عربي يقف بشموخ على كثيب رملي ذهبي وقت الغروب، تفاصيل الريش وإضاءة ذهبية ناعمة بدقة 8K." },
    { title: "غرفة ألعاب سايبربانك مستقبلية", text: "تصميم داخلي مستقبلي لغرفة ألعاب تقنية بأسلوب السايبربانك، أضواء نيون بنفسجية وزرقاء، شاشات هولوغرامية متوهجة ونوافذ تطل على مدينة ناطحات سحاب ممطرة." },
    { title: "فتاة أنمي تحت أزهار الكرز", text: "رسم أنمي ياباني ساحر لفتاة ترتدي كيمونو حريري تقليدي تقف تحت شجرة ساكورا تتساقط بتلاتها برقة مع نسيم الربيع وإضاءة سينمائية مشرقة." },
    { title: "سيارة كهربائية خارقة في دبي", text: "سيارة خارقة ذات تصميم انسيابي مستقبلي تتلألأ وتنعكس عليها أضواء برج خليفة ليلاً، جودة تصوير إعلانات السيارات الفاخرة بدقة 8K." }
  ],
  en: [
    { title: "Majestic Falcon at Sunset", text: "Hyper-realistic macro photography of a majestic Arabian falcon perched proudly on golden sand dunes during a dramatic sunset, 8K ultra detail." },
    { title: "Futuristic Cyberpunk Gaming Den", text: "Futuristic neon-lit tech gaming lounge with holographic displays, purple and cyan ambient lighting, large panoramic window looking out to a rainy megacity." },
    { title: "Anime Sakura Bloom", text: "Enchanting anime illustration of a girl in a silk kimono surrounded by falling cherry blossom petals in springtime breeze, vibrant warm lighting." },
    { title: "Luxury Electric Hypercar", text: "Futuristic hypercar parked in front of modern architectural landmark with reflective puddle reflections and sharp studio lighting, 8k render." }
  ]
};

export default function TextToImagePage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user } = useAppStore();

  // Selected Options
  const [selectedModelId, setSelectedModelId] = useState<string>("grok");
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [showNegativePrompt, setShowNegativePrompt] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  // Dropdowns UI Open States
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isAspectDropdownOpen, setIsAspectDropdownOpen] = useState(false);

  // Status and Notifications
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Refs for dropdown clicks
  const modelRef = useRef<HTMLDivElement>(null);
  const aspectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
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

  const estimatedCost = currentModel.pricePerImage;
  const totalUserCredits = (user?.standardCredits || 0) + (user?.premiumCredits || 0);
  const hasSufficientCredits = totalUserCredits >= estimatedCost;

  // Apply Artistic Style Preset to prompt
  const handleApplyStyle = (styleId: string) => {
    const style = STYLE_PRESETS.find(s => s.id === styleId);
    if (!style) return;

    if (selectedStyle === styleId) {
      setSelectedStyle(null);
      return;
    }

    setSelectedStyle(styleId);
    if (!prompt.trim()) {
      setPrompt(isRtl ? SAMPLE_IMAGE_PROMPTS.ar[0].text : SAMPLE_IMAGE_PROMPTS.en[0].text);
    } else if (!prompt.includes(style.suffix)) {
      setPrompt(prev => prev.trim() + style.suffix);
    }
  };

  // AI Prompt Enhancer Action
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      setPrompt(isRtl ? SAMPLE_IMAGE_PROMPTS.ar[0].text : SAMPLE_IMAGE_PROMPTS.en[0].text);
      return;
    }
    const addon = isRtl 
      ? "، تفاصيل واقعية فائقة 8K، إضاءة سينمائية محيطية دافئة، ألوان غنية متناسقة وجودة إخراج فنية متقنة."
      : ", 8k resolution, cinematic lighting, photorealistic, intricate textures, masterpiece, high dynamic range, octane render.";
    if (!prompt.includes("8k") && !prompt.includes("واقعية")) {
      setPrompt(prev => prev.trim() + addon);
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
    setSelectedStyle(null);
  };

  // Submission handler
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(isRtl ? "يرجى كتابة وصف الصورة (Prompt) أولاً" : "Please enter an image prompt first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      let fullPrompt = prompt;
      if (negativePrompt.trim()) {
        fullPrompt += ` --no ${negativePrompt.trim()}`;
      }

      formData.append("prompt", fullPrompt);
      formData.append("model", currentModel.id);
      formData.append("aspectRatio", aspectRatio);

      const res = await api.post("/api/image/start-tool/text-to-image", formData);
      setSuccessMessage(
        isRtl 
          ? "🎉 تمت إضافة الصورة إلى طابور المعالجة بنجاح! سيتم إشعارك فور اكتمال التوليد."
          : "🎉 Image added to generation queue! You will be notified once rendering completes."
      );
      setPrompt("");
      setNegativePrompt("");
      setSelectedStyle(null);
    } catch (err: any) {
      setError(err.response?.data?.error || (isRtl ? "حدث خطأ أثناء إرسال طلب التوليد" : "Error submitting image task"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 pt-2" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Main Studio 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* 1. Main Center/Right Area: Studio Prompt Canvas & Styles                  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Main Prompt Box */}
          <div className="bg-[#0b0416]/95 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 backdrop-blur-md relative overflow-hidden group focus-within:border-orange-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Wand2 className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white block">
                    {isRtl ? "وصف الصورة الإبداعية (Prompt)" : "Image Prompt Description"}
                  </label>
                  <span className="text-[11px] text-white/40 block">
                    {isRtl ? "اكتب ما تريد رؤيته بالتفصيل من عناصر وإضاءة وأسلوب فني" : "Describe subjects, lighting, mood, artistic medium, and camera details"}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  title={isRtl ? "تحسين البرومت تلقائياً" : "Enhance with AI"}
                  className="px-3 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
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
                rows={6}
                maxLength={2000}
                placeholder={
                  isRtl 
                    ? "اكتب وصف المشهد بالتفصيل هنا... (مثال: لقطة فوتوغرافية احترافية لصقر عربي على كثيب رملي ذهبي عند الغروب، إضاءة سينمائية دافئة بدقة 8K)" 
                    : "Describe the image scene in rich detail... (e.g. Majestic Arabian falcon perched on golden sand dunes at sunset, warm cinematic lighting, 8k resolution)"
                }
                className="w-full bg-[#06010f] border border-white/10 rounded-xl p-4 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 resize-none text-sm md:text-base leading-relaxed transition-all shadow-inner font-sans"
              />
              <div className="absolute bottom-3 end-3 text-[11px] text-white/40 font-mono bg-[#06010f]/90 px-2 py-0.5 rounded border border-white/5">
                {prompt.length} / 2000
              </div>
            </div>

            {/* Artistic Styles Bar */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                <Palette className="w-3.5 h-3.5 text-orange-400" />
                <span>{isRtl ? "الأنماط الفنية السريعة:" : "Artistic Styles:"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STYLE_PRESETS.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleApplyStyle(style.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                        isSelected 
                          ? "bg-orange-500/25 border-orange-500/50 text-white font-bold shadow-sm" 
                          : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10 hover:border-orange-500/30"
                      }`}
                    >
                      <span>{isRtl ? style.labelAr : style.labelEn}</span>
                      {isSelected && <Check className="w-3 h-3 text-orange-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inspiration Pills */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? "أفكار جاهزة سريعة للإلهام:" : "Quick Inspiration Presets:"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(isRtl ? SAMPLE_IMAGE_PROMPTS.ar : SAMPLE_IMAGE_PROMPTS.en).map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sample.text)}
                    className="text-xs bg-white/5 hover:bg-orange-600/20 text-white/70 hover:text-white border border-white/10 hover:border-orange-500/40 rounded-lg px-3 py-1.5 transition-all text-start flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    <span>{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Prompt Accordion (Optional) */}
            <div className="pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowNegativePrompt(!showNegativePrompt)}
                className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1.5 transition-colors"
              >
                <EyeOff className="w-3.5 h-3.5 text-red-400/80" />
                <span>{isRtl ? "البرومت السلبي (Negative Prompt - ما لا تريده في الصورة)" : "Negative Prompt (What to exclude - Optional)"}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showNegativePrompt ? "rotate-180 text-orange-400" : ""}`} />
              </button>

              {showNegativePrompt && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder={isRtl ? "مثال: تشوهات، ضبابية، علامات مائية، جودة منخفضة، أصابع مشوهة..." : "e.g. blurry, watermark, distorted hands, low quality, oversaturated..."}
                    className="w-full bg-[#06010f] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-red-500/40"
                  />
                </div>
              )}
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
                <span className="text-orange-300 font-bold">{aspectRatio}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-white/50">{isRtl ? "التكلفة:" : "Cost:"}</span>
                <span className="text-xl font-black text-amber-300 font-mono">{estimatedCost}</span>
                <span className="text-xs text-amber-300/70 font-semibold">{isRtl ? "نقطة / صورة" : "Credits / Image"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim() || !hasSufficientCredits}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                isLoading || !prompt.trim() || !hasSufficientCredits
                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-orange-900/40 hover:shadow-orange-800/70 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isRtl ? "جاري التوليد والإرسال..." : "Generating Image..."}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{isRtl ? `توليد الصورة (${estimatedCost} نقطة)` : `Generate Image (${estimatedCost} Credits)`}</span>
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
                <SlidersHorizontal className="w-4 h-4 text-orange-400" />
                <span>{isRtl ? "إعدادات الصورة" : "Image Settings"}</span>
              </h2>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Options</span>
            </div>

            {/* 1. Model & Engine Dropdown Select */}
            <div className="space-y-1.5 relative" ref={modelRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                <span>{isRtl ? "محرك الذكاء الاصطناعي" : "AI Image Engine"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-orange-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all group"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-xs md:text-sm text-white truncate">
                      {isRtl ? currentModel.nameAr : currentModel.name}
                    </span>
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded shrink-0 font-mono">
                      {currentModel.pricePerImage} Cr
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 truncate">
                    {isRtl ? currentModel.descAr : currentModel.desc}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 shrink-0 ${isModelDropdownOpen ? "rotate-180 text-orange-400" : ""}`} />
              </button>

              {/* Model Dropdown Menu */}
              {isModelDropdownOpen && (
                <div className="absolute z-50 top-full mt-1.5 w-full bg-[#0d041c] border border-orange-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {MODELS.map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setSelectedModelId(m.id); setIsModelDropdownOpen(false); }}
                        className={`w-full text-start p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                          isSelected 
                            ? "bg-orange-600/25 text-white border border-orange-500/40" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{isRtl ? m.nameAr : m.name}</span>
                            <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1 rounded font-mono">{m.pricePerImage} Cr</span>
                          </div>
                          <p className="text-[10px] text-white/40">{isRtl ? m.badgeAr : m.badge}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Aspect Ratio Dropdown Select */}
            <div className="space-y-1.5 relative" ref={aspectRef}>
              <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? "أبعاد الصورة (Aspect Ratio)" : "Aspect Ratio"}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsAspectDropdownOpen(!isAspectDropdownOpen)}
                className="w-full bg-[#06010f] border border-white/10 hover:border-amber-500/40 rounded-xl p-3 text-start flex items-center justify-between gap-2.5 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  {(() => {
                    const IconComp = ASPECT_RATIOS.find(a => a.id === aspectRatio)?.icon || Square;
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

            {/* 3. Live Summary & Wallet Widget */}
            <div className="pt-2 border-t border-white/5 space-y-2.5">
              <div className="bg-[#06010f] border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">{isRtl ? "تكلفة الصورة:" : "Image Cost:"}</span>
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
                  <span>{isRtl ? "رصيدك غير كافٍ لتوليد الصورة. يرجى شحن الرصيد." : "Insufficient credits. Please top up."}</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
