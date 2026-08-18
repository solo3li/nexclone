"use client";

import { useLocale } from "next-intl";
import { Link } from "../../../src/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { 
  Film, 
  Video, 
  Layers, 
  Smile, 
  Sparkles, 
  Image as ImageIcon, 
  Volume2, 
  Mic, 
  ArrowLeft, 
  ArrowRight,
  Layers as StudioIcon
} from "lucide-react";

export default function ToolsPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", labelEn: "All Tools", labelAr: "جميع الأدوات" },
    { id: "video", labelEn: "Video Studio", labelAr: "استوديو الفيديو", icon: Video },
    { id: "image", labelEn: "Image Studio", labelAr: "استوديو الصور", icon: ImageIcon },
    { id: "audio", labelEn: "Audio Studio", labelAr: "استوديو الصوت", icon: Volume2 }
  ];

  const tools = [
    {
      id: "text-to-video",
      category: "video",
      href: "/tools/text-to-video",
      image: "/images/tool-text2video.jpg",
      icon: Film,
      badgeEn: "Cinematic",
      badgeAr: "سينمائي",
      badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
      labelEn: "Text to Video",
      labelAr: "تحويل النص إلى فيديو",
      descEn: "Generate ultra-high-definition cinematic videos directly from text prompts.",
      descAr: "اصنع فيديوهات سينمائية فائقة الجودة من مجرد وصف نصي باستخدام أحدث نماذج الفيديو.",
      border: "hover:border-violet-500/50",
      glow: "hover:shadow-violet-900/20"
    },
    {
      id: "image-to-video",
      category: "video",
      href: "/tools/image-to-video",
      image: "/images/tool-img2avatar.png",
      icon: Video,
      badgeEn: "Animated",
      badgeAr: "متحرك",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      labelEn: "Image to Video",
      labelAr: "تحويل الصورة إلى فيديو",
      descEn: "Animate your static portraits and images into stunning, dynamic videos.",
      descAr: "حوّل صورك وشخصياتك الثابتة إلى فيديوهات متحركة ومذهلة بضغطة زر.",
      border: "hover:border-blue-500/50",
      glow: "hover:shadow-blue-900/20"
    },
    {
      id: "reference-to-video",
      category: "video",
      href: "/tools/reference-to-video",
      image: "/images/tool-ref2video.jpg",
      icon: Layers,
      badgeEn: "Pro",
      badgeAr: "احترافي",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      labelEn: "Reference to Video",
      labelAr: "صور مرجعية لفيديو",
      descEn: "Generate consistent character video animations matching reference stills.",
      descAr: "أنشئ فيديوهات متناسقة ومطابقة لشخصيتك المرجعية عبر لقطات وحركات سينمائية متعددة.",
      border: "hover:border-indigo-500/50",
      glow: "hover:shadow-indigo-900/20"
    },
    {
      id: "advanced-lip-sync",
      category: "video",
      href: "/tools/advanced-lip-sync",
      image: "/images/tool-lipsync.png",
      icon: Smile,
      badgeEn: "Popular",
      badgeAr: "شائع",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      labelEn: "Advanced Lip Sync",
      labelAr: "مزامنة الشفاه المتقدمة",
      descEn: "Flawlessly synchronize facial and lip movements with any audio track.",
      descAr: "قم بمزامنة حركة الشفاه بدقة متناهية مع أي ملف صوتي أو تعليق صوتي.",
      border: "hover:border-rose-500/50",
      glow: "hover:shadow-rose-900/20"
    },
    {
      id: "motion-control",
      category: "video",
      href: "/tools/motion-control",
      image: "/images/tool-motion-control.png",
      icon: Video,
      badgeEn: "New",
      badgeAr: "جديد",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      labelEn: "Motion Transfer",
      labelAr: "نسخ والتحكم بالحركة",
      descEn: "Transfer complex motion from reference video onto any static character.",
      descAr: "انسخ حركة شخص من فيديو مرجعي وطبقها على أي صورة شخصية أو كرتونية.",
      border: "hover:border-cyan-500/50",
      glow: "hover:shadow-cyan-900/20"
    },
    {
      id: "text-to-image",
      category: "image",
      href: "/tools/text-to-image",
      image: "/images/tool-text2image.jpg",
      icon: ImageIcon,
      badgeEn: "Creative",
      badgeAr: "إبداعي",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      labelEn: "Text to Image",
      labelAr: "توليد الصور من النص",
      descEn: "Transform your creative prompts into photorealistic artworks and visuals.",
      descAr: "حوّل أفكارك وخيالك إلى لوحات فنية وتصميمات فوتوغرافية فائقة الجودة والجمال.",
      border: "hover:border-amber-500/50",
      glow: "hover:shadow-amber-900/20"
    },
    {
      id: "text-to-voice",
      category: "audio",
      href: "/tools/text-to-voice",
      image: "/images/tool-tts.png",
      icon: Volume2,
      badgeEn: "Ultra-Realistic",
      badgeAr: "طبيعي",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      labelEn: "Text to Voice",
      labelAr: "تحويل النص لصوت",
      descEn: "Generate ultra-realistic human voices with varied emotions from text.",
      descAr: "قم بتوليد تعليق صوتي واقعي بنبرات ومشاعر بشرية طبيعية بأكثر من 40 لغة.",
      border: "hover:border-emerald-500/50",
      glow: "hover:shadow-emerald-900/20"
    },
    {
      id: "voice-to-text",
      category: "audio",
      href: "/tools/voice-to-text",
      image: "/images/tool-vtt.png",
      icon: Mic,
      badgeEn: "Accurate",
      badgeAr: "دقة عالية",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      labelEn: "Voice to Text",
      labelAr: "تحويل الصوت لنص",
      descEn: "Transcribe and translate your audio files with exceptional AI precision.",
      descAr: "قم بتفريغ وترجمة ملفاتك الصوتية ومقاطع الفيديو بدقة استثنائية.",
      border: "hover:border-teal-500/50",
      glow: "hover:shadow-teal-900/20"
    }
  ];

  const filteredTools = activeCategory === "all" 
    ? tools 
    : tools.filter(t => t.category === activeCategory);

  return (
    <>
      <div className="absolute top-1/4 left-1/4 w-[60%] h-[500px] bg-violet-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استوديو الذكاء الاصطناعي الشامل' : 'Complete AI Creative Studio'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {isRtl ? 'مرحباً بك في ' : 'Welcome to '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              {isRtl ? 'استوديو الأدوات الإبداعية' : 'AI Tools Studio'}
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {isRtl
              ? 'أهلاً بك في مساحة عملك الإبداعية المتكاملة! اختر الأداة التي تناسب مشروعك وابدأ فوراً في إنتاج المحتوى المرئي والصوتي بأعلى معايير الدقة والجودة.'
              : 'Welcome to your complete creative suite! Select the tool for your project and immediately generate high-fidelity video, image, and voice content.'}
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 border ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-violet-400/50 shadow-lg shadow-violet-500/25 scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10'
                  }`}
                >
                  {cat.icon && <cat.icon className="w-4 h-4" />}
                  <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  layout
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="h-full"
                >
                  <Link
                    href={tool.href}
                    className={`flex flex-col h-full bg-[#120822]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${tool.border} group shadow-xl hover:shadow-2xl ${tool.glow}`}
                    dir={isRtl ? 'rtl' : 'ltr'}
                  >
                    {/* Tool Image */}
                    <div className="relative w-full h-44 overflow-hidden bg-[#0d011a]/50 shrink-0">
                      <Image
                        src={tool.image}
                        alt={isRtl ? tool.labelAr : tool.labelEn}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#120822] via-transparent to-transparent opacity-80" />
                      
                      {/* Top Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${tool.badgeColor}`}>
                          {isRtl ? tool.badgeAr : tool.badgeEn}
                        </span>
                      </div>
                    </div>

                    {/* Tool Info */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-violet-300 group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-200 group-hover:to-white transition-all">
                          {isRtl ? tool.labelAr : tool.labelEn}
                        </h3>
                      </div>

                      <p className="text-white/50 text-xs leading-relaxed mb-4 flex-grow">
                        {isRtl ? tool.descAr : tool.descEn}
                      </p>

                      {/* Action Button */}
                      <div className="flex items-center justify-between text-xs font-semibold text-violet-400 group-hover:text-violet-300 mt-auto pt-3 border-t border-white/5">
                        <span>{isRtl ? 'بدء الاستخدام' : 'Launch Tool'}</span>
                        <ArrowIcon className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
