"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { 
  Film, 
  Zap, 
  Wand2, 
  Settings2, 
  Sparkles, 
  Layers, 
  Clock, 
  Monitor, 
  Smartphone, 
  Square,
  CheckCircle2,
  Coins,
  Flame,
  Info
} from "lucide-react";
import api from "../../../../src/utils/api";
import { useAppStore } from "../../../../src/store/useAppStore";

interface VeoTier {
  id: string;
  name: string;
  nameAr: string;
  badge: string;
  badgeAr: string;
  tagline: string;
  taglineAr: string;
  discount: string;
  prices: { [resolution: string]: number };
}

const VEO_TIERS: VeoTier[] = [
  {
    id: "veo-3.1-fast",
    name: "Veo 3.1 Fast",
    nameAr: "فيو 3.1 فاست (سريع)",
    badge: "Fast & High Quality",
    badgeAr: "توليد سريع وعالي الدقة",
    tagline: "Ultra fast generation with stunning 8-second realism",
    taglineAr: "سرعة توليد فائقة مع واقعية سينمائية لمدة 8 ثواني",
    discount: "-83%",
    prices: {
      "720p": 30,
      "1080p": 37.5,
      "4k": 90
    }
  },
  {
    id: "veo-3.1-lite",
    name: "Veo 3.1 Lite",
    nameAr: "فيو 3.1 لايت (اقتصادي)",
    badge: "Budget Friendly",
    badgeAr: "اقتصادي ومثالي للمسودات",
    tagline: "Cost-effective generation ideal for rapid prototyping",
    taglineAr: "أقل استهلاك للرصيد مع جودة ممتازة للمشاريع السريعة",
    discount: "-84%",
    prices: {
      "720p": 15,
      "1080p": 22.5,
      "4k": 75
    }
  },
  {
    id: "veo-3.1-quality",
    name: "Veo 3.1 Quality",
    nameAr: "فيو 3.1 كواليتي (سينمائي)",
    badge: "Studio Grade",
    badgeAr: "أعلى دقة سينمائية نقية",
    tagline: "Maximum visual fidelity and camera movement precision",
    taglineAr: "أقصى درجات النقاء البصري وتفاصيل حركة الكاميرا الاحترافية",
    discount: "-69%",
    prices: {
      "720p": 225,
      "1080p": 232.5,
      "4k": 285
    }
  }
];

const GROK_PRICING: { [resolution: string]: { rate: number; usd: number; discount: string } } = {
  "480p": { rate: 2.4, usd: 0.0107, discount: "-79%" },
  "720p": { rate: 4.5, usd: 0.0201, discount: "-71%" },
  "1080p": { rate: 8.0, usd: 0.0357, discount: "Dynamic" }
};

const SAMPLE_PROMPTS = {
  ar: [
    "مشهد سينمائي بطيء لمدينة مستقبلية سايبربانك تتلألأ فيها أضواء النيون تحت المطر الكثيف بدقة 4K",
    "لقطة درون جوية تسحر الأبصار لجزيرة استوائية مياهها فيروزية ورمالها بيضاء عاجية مع شمس الغروب",
    "فراشة ميكانيكية روبوتية مصنوعة من الذهب والكريستال ترفرف فوق زهرة متوهجة في غابة سحرية",
    "سيارة رياضية فائقة تنطلق بسرعة فائقة على طريق ساحلي متعرج بين الجبال وقت الشفق"
  ],
  en: [
    "Cinematic slow-motion shot of a futuristic cyberpunk city with neon reflections in heavy rain, 4K quality",
    "Stunning aerial drone footage gliding over tropical island turquoise waters and white sand at golden hour",
    "Macro close-up of an intricate golden mechanical robotic butterfly fluttering over a glowing crystal flower",
    "Hypercar drifting at high speed along a dramatic mountain coastal highway during vibrant twilight"
  ]
};

export default function TextToVideoPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user } = useAppStore();
  
  // Model selection state
  const [modelFamily, setModelFamily] = useState<"veo" | "grok">("veo");
  const [veoTier, setVeoTier] = useState<string>("veo-3.1-fast");
  const [resolution, setResolution] = useState<string>("1080p");
  const [duration, setDuration] = useState<number>(6); // Grok duration (1-30s)
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [prompt, setPrompt] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Switch model family
  const handleModelFamilyChange = (family: "veo" | "grok") => {
    setModelFamily(family);
    if (family === "veo") {
      if (resolution === "480p") setResolution("1080p");
    } else {
      if (resolution === "4k") setResolution("1080p");
    }
  };

  // Calculate live estimated cost
  const estimatedCost = useMemo(() => {
    if (modelFamily === "veo") {
      const selectedTier = VEO_TIERS.find(t => t.id === veoTier) || VEO_TIERS[0];
      return selectedTier.prices[resolution] || selectedTier.prices["1080p"] || 37.5;
    } else {
      const grokRate = GROK_PRICING[resolution]?.rate || 4.5;
      return +(grokRate * duration).toFixed(2);
    }
  }, [modelFamily, veoTier, resolution, duration]);

  const activeModelId = modelFamily === "veo" ? veoTier : "grok-imagine";

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(isRtl ? "يرجى كتابة وصف الفيديو (Prompt) أولاً" : "Please enter a prompt description first");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("model", activeModelId);
      formData.append("resolution", resolution);
      formData.append("aspectRatio", aspectRatio);
      
      if (modelFamily === "grok") {
        formData.append("duration", duration.toString());
      } else {
        formData.append("duration", "8"); // Veo standard
      }
      
      const res = await api.post("/api/video/start-tool/text-to-video", formData);
      setSuccessMessage(
        isRtl 
          ? "🎉 تمت إضافة الفيديو إلى طابور المعالجة بنجاح! ستتلقى إشعاراً فور اكتماله."
          : "🎉 Video successfully queued! You will be notified once processing finishes."
      );
      setPrompt("");
    } catch (err: any) {
      setError(err.response?.data?.error || (isRtl ? "حدث خطأ أثناء توليد الفيديو" : "Error generating video"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950/60 via-[#120726] to-[#0a0217] border border-violet-500/20 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>{isRtl ? "محرك الذكاء الاصطناعي السينمائي 2026" : "Next-Gen AI Video Studio 2026"}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {isRtl ? "تحويل النص إلى فيديو" : "Text to Video Generation"}
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
              {isRtl 
                ? "حوّل أفكارك وسيناريوهاتك المكتوبة إلى مقاطع فيديو فائقة الجودة بتقنيات Google Veo 3.1 و xAI Grok Imagine بأعلى دقة سينمائية تصل إلى 4K."
                : "Generate cinematic, ultra-realistic video scenes from text descriptions using Google Veo 3.1 & xAI Grok Imagine up to 4K resolution."}
            </p>
          </div>

          {/* User Credits Badge */}
          {user && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-violet-500/20 flex items-center justify-center border border-amber-500/30">
                <Coins className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] text-white/50 block font-medium">
                  {isRtl ? "رصيدك المتاح" : "Available Credits"}
                </span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-300">{(user.standardCredits || 0).toLocaleString()}</span>
                  <span className="text-xs text-white/40">Std</span>
                  {user.premiumCredits > 0 && (
                    <>
                      <span className="text-fuchsia-300 font-bold">+{(user.premiumCredits).toLocaleString()}</span>
                      <span className="text-xs text-white/40">Prem</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. Prompt Input Section */}
          <div className="bg-[#0e071e]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-fuchsia-400" />
                {isRtl ? "وصف المشهد (Prompt)" : "Scene Description (Prompt)"}
              </label>
              <span className="text-xs text-white/40 font-mono">
                {prompt.length} / 2000
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder={
                isRtl 
                  ? "صف مشهدك بالتفصيل (مثل: زوايا التصوير، الإضاءة، حركة الكاميرا، الألوان والأسلوب)..." 
                  : "Describe your video scene with detailed lighting, camera movement, style, and cinematic mood..."
              }
              className="w-full bg-[#080214] border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none text-sm leading-relaxed transition-all shadow-inner"
            />

            {/* Prompt Inspiration Chips */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] text-white/50 font-medium flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {isRtl ? "أمثلة مقترحة سريعة:" : "Quick Inspiration Examples:"}
              </span>
              <div className="flex flex-wrap gap-2">
                {(isRtl ? SAMPLE_PROMPTS.ar : SAMPLE_PROMPTS.en).map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sample)}
                    className="text-xs text-white/70 hover:text-white bg-white/5 hover:bg-violet-600/20 border border-white/5 hover:border-violet-500/30 rounded-xl px-3 py-1.5 transition-all text-start line-clamp-1 max-w-full"
                  >
                    "{sample.slice(0, 55)}..."
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Model Family Selector */}
          <div className="bg-[#0e071e]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                {isRtl ? "اختر محرك الذكاء الاصطناعي (Model Family)" : "AI Model Family"}
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Google Veo 3.1 Button */}
              <button
                type="button"
                onClick={() => handleModelFamilyChange("veo")}
                className={`relative rounded-2xl p-5 border text-start transition-all overflow-hidden flex flex-col justify-between gap-3 ${
                  modelFamily === "veo"
                    ? "bg-gradient-to-br from-violet-600/25 to-purple-900/30 border-violet-500 shadow-lg shadow-violet-950/50 ring-1 ring-violet-500/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-lg text-white">Google Veo 3.1</span>
                      <span className="text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">
                        Google DeepMind
                      </span>
                    </div>
                    <p className="text-xs text-white/60">
                      {isRtl ? "دقة سينمائية حتى 4K • مدة 8 ثواني ثابتة" : "Cinematic 4K fidelity • Fixed 8-second clips"}
                    </p>
                  </div>
                  {modelFamily === "veo" && (
                    <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-violet-300 font-medium">
                  <span>Fast / Lite / Quality</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{isRtl ? "خصم حتى 84%" : "Up to 84% OFF"}</span>
                </div>
              </button>

              {/* xAI Grok Imagine Button */}
              <button
                type="button"
                onClick={() => handleModelFamilyChange("grok")}
                className={`relative rounded-2xl p-5 border text-start transition-all overflow-hidden flex flex-col justify-between gap-3 ${
                  modelFamily === "grok"
                    ? "bg-gradient-to-br from-fuchsia-600/25 to-pink-900/30 border-fuchsia-500 shadow-lg shadow-fuchsia-950/50 ring-1 ring-fuchsia-500/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-lg text-white">xAI Grok Imagine</span>
                      <span className="text-[10px] bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 px-2 py-0.5 rounded-full font-bold">
                        xAI
                      </span>
                    </div>
                    <p className="text-xs text-white/60">
                      {isRtl ? "حركة ديناميكية سريعة • مدة مرنة 1-30 ثانية" : "Dynamic fast motion • Flexible 1s - 30s duration"}
                    </p>
                  </div>
                  {modelFamily === "grok" && (
                    <CheckCircle2 className="w-5 h-5 text-fuchsia-400 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-fuchsia-300 font-medium">
                  <span>{isRtl ? "تسعير مرن بالثانية" : "Flexible per-second pricing"}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">2.4 - 8.0 Cr/s</span>
                </div>
              </button>
            </div>

            {/* 3. Sub-model Selection for Veo 3.1 */}
            {modelFamily === "veo" && (
              <div className="space-y-3 pt-3 border-t border-white/5">
                <label className="text-sm font-semibold text-white/90 flex items-center justify-between">
                  <span>{isRtl ? "فئة الموديل (Veo 3.1 Model Tier)" : "Veo 3.1 Model Tier"}</span>
                  <span className="text-xs text-violet-400 font-normal">
                    {isRtl ? "اختر المستوى المناسب لميزانيتك وجودتك" : "Choose according to your budget & quality"}
                  </span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {VEO_TIERS.map((tier) => {
                    const isSelected = veoTier === tier.id;
                    const tierPrice = tier.prices[resolution] || tier.prices["1080p"];
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setVeoTier(tier.id)}
                        className={`rounded-2xl p-4 border text-start transition-all relative flex flex-col justify-between gap-3 ${
                          isSelected 
                            ? "bg-violet-500/20 border-violet-400 text-white shadow-md shadow-violet-900/30"
                            : "bg-white/5 border-white/5 hover:bg-white/10 text-white/70"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-white">
                              {isRtl ? tier.nameAr : tier.name}
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {tier.discount}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/50 line-clamp-2">
                            {isRtl ? tier.taglineAr : tier.tagline}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[11px] text-violet-300 font-medium">
                            {resolution} (8s)
                          </span>
                          <span className="text-xs font-extrabold text-amber-300">
                            {tierPrice} {isRtl ? "نقطة" : "Credits"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Resolution & Aspect Ratio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resolution Selector */}
            <div className="bg-[#0e071e]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-400" />
                {isRtl ? "دقة الفيديو (Resolution)" : "Video Resolution"}
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {modelFamily === "grok" && (
                  <button
                    type="button"
                    onClick={() => setResolution("480p")}
                    className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      resolution === "480p"
                        ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-950/30"
                        : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <span>480p (SD)</span>
                    <span className="text-[10px] font-normal opacity-70">2.4 Cr/s</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setResolution("720p")}
                  className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                    resolution === "720p"
                      ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-950/30"
                      : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <span>720p (HD)</span>
                  <span className="text-[10px] font-normal opacity-70">
                    {modelFamily === "grok" ? "4.5 Cr/s" : isRtl ? "اقتصادي" : "Standard"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setResolution("1080p")}
                  className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                    resolution === "1080p"
                      ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-950/30"
                      : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <span>1080p (FHD)</span>
                  <span className="text-[10px] font-normal opacity-70">
                    {modelFamily === "grok" ? "8.0 Cr/s" : isRtl ? "عالي الدقة" : "Full HD"}
                  </span>
                </button>

                {modelFamily === "veo" && (
                  <button
                    type="button"
                    onClick={() => setResolution("4k")}
                    className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      resolution === "4k"
                        ? "bg-gradient-to-r from-amber-500/30 to-fuchsia-500/30 border-amber-400 text-amber-100 shadow-md shadow-amber-950/30"
                        : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <span>4K (Ultra HD)</span>
                    <span className="text-[10px] text-fuchsia-300 font-bold">Ultra 4K</span>
                  </button>
                )}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="bg-[#0e071e]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                {isRtl ? "أبعاد الفيديو (Aspect Ratio)" : "Aspect Ratio"}
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 ${
                    aspectRatio === "16:9"
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/30"
                      : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>16:9</span>
                  <span className="text-[9px] opacity-60 font-normal">YouTube</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 ${
                    aspectRatio === "9:16"
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/30"
                      : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>9:16</span>
                  <span className="text-[9px] opacity-60 font-normal">TikTok / Shorts</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio("1:1")}
                  className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 ${
                    aspectRatio === "1:1"
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/30"
                      : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <Square className="w-4 h-4" />
                  <span>1:1</span>
                  <span className="text-[9px] opacity-60 font-normal">Instagram</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Grok Duration Slider */}
          {modelFamily === "grok" && (
            <div className="bg-[#0e071e]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-fuchsia-400" />
                  {isRtl ? "مدة الفيديو (ثواني)" : "Video Duration (Seconds)"}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-fuchsia-300 font-extrabold bg-fuchsia-500/15 border border-fuchsia-500/30 px-3 py-1 rounded-xl text-sm font-mono">
                    {duration} {isRtl ? "ثانية" : "seconds"}
                  </span>
                  <span className="text-xs text-white/40">
                    ({+(GROK_PRICING[resolution]?.rate * duration).toFixed(1)} {isRtl ? "نقطة" : "Cr"})
                  </span>
                </div>
              </div>

              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />

              <div className="flex justify-between text-[11px] text-white/40 font-mono">
                <span>1s ({GROK_PRICING[resolution]?.rate} Cr)</span>
                <span>15s</span>
                <span>30s ({+(GROK_PRICING[resolution]?.rate * 30).toFixed(1)} Cr)</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Generation Summary & Order Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 bg-[#0e071e]/90 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-4 border-b border-white/10">
              <Film className="w-5 h-5 text-violet-400" />
              {isRtl ? "ملخص طلب التوليد" : "Generation Summary"}
            </h2>

            {/* Summary Details */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center text-white/70">
                <span>{isRtl ? "المحرك المختار" : "Selected Model"}</span>
                <span className="font-bold text-white">
                  {modelFamily === "veo" 
                    ? VEO_TIERS.find(t => t.id === veoTier)?.name || "Google Veo 3.1"
                    : "xAI Grok Imagine"}
                </span>
              </div>

              <div className="flex justify-between items-center text-white/70">
                <span>{isRtl ? "الدقة والأبعاد" : "Resolution & Ratio"}</span>
                <span className="font-bold text-cyan-300">
                  {resolution} • {aspectRatio}
                </span>
              </div>

              <div className="flex justify-between items-center text-white/70">
                <span>{isRtl ? "مدة الفيديو" : "Clip Duration"}</span>
                <span className="font-bold text-white">
                  {modelFamily === "veo" ? "8s (Google Standard)" : `${duration}s (Flexible)`}
                </span>
              </div>

              {modelFamily === "veo" && (
                <div className="flex justify-between items-center text-white/70">
                  <span>{isRtl ? "نسبة الخصم الرسمية" : "Official Discount"}</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-xs">
                    {VEO_TIERS.find(t => t.id === veoTier)?.discount || "-83%"}
                  </span>
                </div>
              )}
            </div>

            {/* Cost Breakdown Box */}
            <div className="bg-gradient-to-br from-violet-950/40 to-purple-950/40 border border-violet-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-white/60">
                  {isRtl ? "إجمالي التكلفة المقدرة" : "Estimated Total Cost"}
                </span>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  {estimatedCost}
                  <span className="text-xs font-medium text-amber-300/70 ms-1.5">
                    {isRtl ? "نقطة" : "Credits"}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-white/40 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                {isRtl 
                  ? "يتم الخصم تلقائياً من محفظة النقاط لديك فور بدء التوليد."
                  : "Deducted automatically from your credits wallet upon submission."}
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs leading-relaxed">
                {error}
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs leading-relaxed">
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                isLoading || !prompt.trim()
                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-violet-900/50 hover:shadow-violet-800/80 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isRtl ? "جاري الإرسال إلى طابور المعالجة..." : "Submitting to Queue..."}</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-amber-300" />
                  <span>{isRtl ? `توليد الفيديو (${estimatedCost} نقطة)` : `Generate Video (${estimatedCost} Credits)`}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
