"use client";

import Link from "next/link";
import { useLanguageStore } from "../../store/useLanguageStore";

const tools = [
  {
    href: "/voice-to-text",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    titleAr: "تحويل الصوت إلى نص",
    titleEn: "Voice to Text",
    descAr: "دقة عالية في النسخ — يدعم العربية والإنجليزية وأكثر من 30 لغة.",
    descEn: "High-accuracy transcription — Arabic, English, and 30+ languages.",
    tag: null,
  },
  {
    href: "/text-to-voice",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    titleAr: "تحويل النص إلى صوت",
    titleEn: "Text to Voice",
    descAr: "أصوات طبيعية بالذكاء الاصطناعي — حوّل نصوصك إلى تعليق صوتي احترافي.",
    descEn: "Neural text-to-speech — turn copy into natural, professional voiceovers.",
    tag: null,
  },
  {
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    titleAr: "توليد الصور",
    titleEn: "Image Generation",
    descAr: "صوراً إبداعية من وصف نصي — بجودة 4K وأسلوب قابل للضبط.",
    descEn: "Creative images from text — 4K quality with adjustable style.",
    tag: { ar: "قريباً", en: "Soon" },
  },
  {
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    titleAr: "توليد الفيديو",
    titleEn: "Video Generation",
    descAr: "مقاطع فيديو متحركة من نص — سريع وقابل للتعديل.",
    descEn: "Animated clips from text prompts — fast and fully editable.",
    tag: { ar: "قريباً", en: "Soon" },
  },
];

export default function ToolsPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-16" dir={isAr ? "rtl" : "ltr"}>

      {/* Header */}
      <div className="mb-12">
        <p className="text-caption text-[var(--color-muted)] mb-3">
          {isAr ? "أدوات الذكاء الاصطناعي" : "AI Tools"}
        </p>
        <h1 className="text-h1 text-[var(--color-ink)] mb-4">
          {isAr ? "كل الأدوات" : "All Tools"}
        </h1>
        <p className="text-body text-[var(--color-muted)] max-w-lg">
          {isAr
            ? "مجموعة متكاملة من أدوات الذكاء الاصطناعي لإنجاز مهامك الإبداعية."
            : "A complete suite of AI tools for your creative workflow."}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {tools.map((t) => {
          const isDisabled = t.href === "#";
          return (
            <Link
              key={t.href + (isAr ? t.titleAr : t.titleEn)}
              href={t.href}
              className={`group card p-6 flex flex-col gap-5 relative
                ${isDisabled ? "pointer-events-none" : ""}`}
            >
              {/* Tag */}
              {t.tag && (
                <span className="absolute top-5 end-5 badge badge-primary text-[10px]">
                  {isAr ? t.tag.ar : t.tag.en}
                </span>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${t.bgColor} ${t.color} flex items-center justify-center`}>
                {t.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-h3 text-[var(--color-ink)] mb-1.5 group-hover:text-[var(--color-primary)] transition-colors">
                  {isAr ? t.titleAr : t.titleEn}
                </h3>
                <p className="text-small text-[var(--color-muted)] leading-relaxed">
                  {isAr ? t.descAr : t.descEn}
                </p>
              </div>

              {/* Arrow */}
              {!isDisabled && (
                <div className={`flex items-center gap-1 text-small text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors font-medium`}>
                  <span>{isAr ? "استخدم الأداة" : "Open tool"}</span>
                  <svg
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className={`w-3.5 h-3.5 transition-transform group-hover:${isAr ? "-translate-x-0.5" : "translate-x-0.5"}`}
                  >
                    {isAr
                      ? <polyline points="15 18 9 12 15 6" />
                      : <polyline points="9 18 15 12 9 6" />}
                  </svg>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
