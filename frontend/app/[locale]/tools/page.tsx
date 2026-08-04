"use client";

import { useLocale } from "next-intl";
import { Link } from "../../../src/i18n/routing";
import { Mic, FileAudio, Video } from "lucide-react";
import { motion } from "framer-motion";

export default function ToolsPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const tools = [
    {
      href: "/tools/text-to-voice",
      icon: Mic,
      labelEn: "Text to Voice",
      labelAr: "تحويل النص لصوت",
      descEn: "Generate ultra-realistic human voices from text",
      descAr: "قم بتحويل النصوص إلى أصوات بشرية واقعية بضغطة زر",
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-500/10",
      border: "hover:border-fuchsia-500/50"
    },
    {
      href: "/tools/voice-to-text",
      icon: FileAudio,
      labelEn: "Voice to Text",
      labelAr: "تحويل الصوت لنص",
      descEn: "Transcribe and translate your audio files with high accuracy",
      descAr: "قم بتفريغ وترجمة ملفاتك الصوتية بدقة عالية جداً",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/50"
    },
    {
      href: "/tools/image-to-video",
      icon: Video,
      labelEn: "Image to Video",
      labelAr: "تحويل الصورة لفيديو",
      descEn: "Animate your static images into stunning videos",
      descAr: "حوّل صورك الثابتة إلى فيديوهات متحركة ومذهلة",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/50"
    },
    {
      href: "/tools/advanced-lip-sync",
      icon: Video, // Reusing Video icon
      labelEn: "Advanced Lip Sync",
      labelAr: "مزامنة الشفاه المتقدمة",
      descEn: "Sync audio flawlessly with video avatars",
      descAr: "مزامنة الصوت بدقة مع الفيديو الخاص بك",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/50"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={tool.href}
                  className={`block h-full bg-[#120822]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 ${tool.border} group shadow-xl hover:shadow-2xl hover:shadow-fuchsia-900/20`}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className={`w-16 h-16 rounded-2xl ${tool.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${tool.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                    {isRtl ? tool.labelAr : tool.labelEn}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {isRtl ? tool.descAr : tool.descEn}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
