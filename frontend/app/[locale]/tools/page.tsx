"use client";

import { useLocale } from "next-intl";
import { Link } from "../../../src/i18n/routing";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ToolsPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const tools = [
    {
      href: "/tools/text-to-voice",
      image: "/images/tool-tts.png",
      labelEn: "Text to Voice",
      labelAr: "تحويل النص لصوت",
      descEn: "Generate ultra-realistic human voices from text",
      descAr: "قم بتحويل النصوص إلى أصوات بشرية واقعية بضغطة زر",
      border: "hover:border-fuchsia-500/50",
      glow: "hover:shadow-fuchsia-900/20"
    },
    {
      href: "/tools/voice-to-text",
      image: "/images/tool-vtt.png",
      labelEn: "Voice to Text",
      labelAr: "تحويل الصوت لنص",
      descEn: "Transcribe and translate your audio files with high accuracy",
      descAr: "قم بتفريغ وترجمة ملفاتك الصوتية بدقة عالية جداً",
      border: "hover:border-cyan-500/50",
      glow: "hover:shadow-cyan-900/20"
    },
    {
      href: "/tools/image-to-video",
      image: "/images/tool-img2avatar.png",
      labelEn: "Avatar to Video",
      labelAr: "افتار الى فيديو",
      descEn: "Animate your static images into stunning videos",
      descAr: "حوّل صورك الثابتة إلى فيديوهات متحركة ومذهلة",
      border: "hover:border-emerald-500/50",
      glow: "hover:shadow-emerald-900/20"
    },
    {
      href: "/tools/advanced-lip-sync",
      image: "/images/tool-lipsync.png",
      labelEn: "Advanced Lip Sync",
      labelAr: "مزامنة الشفاه المتقدمة",
      descEn: "Sync audio flawlessly with video avatars",
      descAr: "مزامنة الصوت بدقة مع الفيديو الخاص بك",
      border: "hover:border-rose-500/50",
      glow: "hover:shadow-rose-900/20"
    }
  ];

  return (
    <>
      <div className="absolute top-1/4 left-1/4 w-[60%] h-[500px] bg-violet-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />
      
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {isRtl ? 'مرحباً بك في ' : 'Welcome to '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              {isRtl ? 'استوديو الأدوات' : 'Tools Studio'}
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            {isRtl 
              ? 'أهلاً بك في مساحة عملك الإبداعية! اختر الأداة التي تناسب احتياجاتك من القائمة أدناه أو من الشريط الجانبي وابدأ في الإبداع مع تقنيات الذكاء الاصطناعي.' 
              : 'Welcome to your creative workspace! Choose the tool that fits your needs from the list below or the sidebar and start creating with AI technologies.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={tool.href}
                className={`block h-full bg-[#120822]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${tool.border} group shadow-xl hover:shadow-2xl ${tool.glow}`}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {/* Tool Image */}
                <div className="relative w-full h-52 overflow-hidden">
                  <Image
                    src={tool.image}
                    alt={isRtl ? tool.labelAr : tool.labelEn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120822] via-transparent to-transparent" />
                </div>
                {/* Tool Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                    {isRtl ? tool.labelAr : tool.labelEn}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {isRtl ? tool.descAr : tool.descEn}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

