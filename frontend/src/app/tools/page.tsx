"use client";

import Link from "next/link";
import { useLanguageStore } from "../../store/useLanguageStore";

export default function ToolsPage() {
  const { language } = useLanguageStore();

  const tools = [
    {
      id: "voice-to-text",
      href: "/voice-to-text",
      icon: "fa-microphone-alt",
      color: "text-green-400",
      bgHover: "group-hover:bg-green-500/10",
      titleAr: "تحويل الصوت إلى نص",
      titleEn: "Voice to Text",
      descAr: "قم بتحويل ملفاتك الصوتية إلى نصوص مكتوبة بدقة عالية باستخدام الذكاء الاصطناعي.",
      descEn: "Convert your audio files into highly accurate written text using AI.",
      isNew: false
    },
    {
      id: "text-to-voice",
      href: "/text-to-voice",
      icon: "fa-wave-square",
      color: "text-purple-400",
      bgHover: "group-hover:bg-purple-500/10",
      titleAr: "تحويل النص إلى صوت",
      titleEn: "Text to Voice",
      descAr: "حوّل نصوصك إلى تعليق صوتي طبيعي واحترافي يدعم لغات متعددة.",
      descEn: "Turn your texts into natural and professional voiceovers supporting multiple languages.",
      isNew: false
    },
    {
      id: "image-gen",
      href: "#",
      icon: "fa-image",
      color: "text-blue-400",
      bgHover: "group-hover:bg-blue-500/10",
      titleAr: "توليد الصور",
      titleEn: "Image Generation",
      descAr: "صمم صوراً إبداعية من الوصف النصي بجودة فائقة.",
      descEn: "Design creative images from text descriptions in high quality.",
      isNew: true
    },
    {
      id: "video-gen",
      href: "#",
      icon: "fa-video",
      color: "text-pink-400",
      bgHover: "group-hover:bg-pink-500/10",
      titleAr: "توليد الفيديو",
      titleEn: "Video Generation",
      descAr: "قم بإنشاء مقاطع فيديو قصيرة ومتحركة بناءً على الأوامر النصية.",
      descEn: "Create short animated videos based on text prompts.",
      isNew: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header Section */}
      <div className="mb-12 text-center md:text-start relative">
        <div className="absolute top-[-50px] left-1/4 w-96 h-96 bg-[var(--color-bento-accent)] rounded-full blur-[120px] opacity-[0.15] pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-bento-text)] tracking-tight mb-4 relative z-10">
          {language === 'ar' ? 'أدوات الذكاء الاصطناعي' : 'AI Tools'}
        </h1>
        <p className="text-[var(--color-bento-muted)] text-lg max-w-2xl relative z-10">
          {language === 'ar' 
            ? 'مجموعة متكاملة من أدوات الذكاء الاصطناعي المصممة لمساعدتك على إنجاز مهامك الإبداعية والعملية بسرعة واحترافية.' 
            : 'A complete suite of AI tools designed to help you accomplish your creative and professional tasks quickly.'}
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {tools.map((tool) => (
          <Link 
            key={tool.id} 
            href={tool.href}
            className={`bento-card p-6 flex flex-col group cursor-pointer h-full
              ${tool.href === '#' ? 'opacity-70 pointer-events-none' : ''}
            `}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-[var(--color-bento-bg)] flex items-center justify-center border border-[var(--color-bento-border)] transition-colors duration-300 ${tool.bgHover}`}>
                <i className={`fas ${tool.icon} text-2xl ${tool.color}`}></i>
              </div>
              
              {tool.isNew && (
                <span className="bg-[var(--color-bento-accent)] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(100,100,250,0.3)]">
                  {language === 'ar' ? 'قريباً' : 'Soon'}
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-[var(--color-bento-text)] mb-3 transition-colors group-hover:text-[var(--color-bento-accent)]">
              {language === 'ar' ? tool.titleAr : tool.titleEn}
            </h3>
            
            <p className="text-sm text-[var(--color-bento-muted)] leading-relaxed flex-1">
              {language === 'ar' ? tool.descAr : tool.descEn}
            </p>

            <div className="mt-6 pt-4 border-t border-[var(--color-bento-border)] flex items-center text-sm font-bold text-[var(--color-bento-muted)] group-hover:text-[var(--color-bento-text)] transition-colors">
              <span>{language === 'ar' ? 'استخدم الأداة' : 'Use Tool'}</span>
              <i className={`fas ${language === 'ar' ? 'fa-arrow-left mr-2' : 'fa-arrow-right ml-2'} text-[10px] transform transition-transform group-hover:${language === 'ar' ? '-translate-x-1' : 'translate-x-1'}`}></i>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
