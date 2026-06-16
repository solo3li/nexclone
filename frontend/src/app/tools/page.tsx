"use client";

import Link from "next/link";
import { useLanguageStore } from "../../store/useLanguageStore";

const tools = [
  {
    href: "/voice-to-text",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    color: "text-emerald-400",
    glowColor: "rgba(52,211,153,0.20)",
    borderColor: "rgba(52,211,153,0.25)",
    titleAr: "تحويل الصوت إلى نص",
    titleEn: "Voice to Text",
    descAr: "دقة عالية — يدعم العربية والإنجليزية و30+ لغة.",
    descEn: "High accuracy — Arabic, English, and 30+ languages.",
    tag: null,
  },
  {
    href: "/text-to-voice",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
    color: "text-violet-400",
    glowColor: "rgba(167,139,250,0.20)",
    borderColor: "rgba(167,139,250,0.25)",
    titleAr: "تحويل النص إلى صوت",
    titleEn: "Text to Voice",
    descAr: "أصوات طبيعية بالذكاء الاصطناعي — تعليق صوتي احترافي.",
    descEn: "Neural voices — natural, professional voiceovers.",
    tag: null,
  },
  {
    href: "#",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    color: "text-cyan-400",
    glowColor: "rgba(34,211,238,0.15)",
    borderColor: "rgba(34,211,238,0.20)",
    titleAr: "توليد الصور",
    titleEn: "Image Generation",
    descAr: "صور إبداعية من نص — جودة 4K.",
    descEn: "Creative images from text — 4K quality.",
    tag: { ar: "قريباً", en: "Soon" },
  },
  {
    href: "#",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    color: "text-rose-400",
    glowColor: "rgba(248,113,113,0.15)",
    borderColor: "rgba(248,113,113,0.20)",
    titleAr: "توليد الفيديو",
    titleEn: "Video Generation",
    descAr: "مقاطع متحركة من نص — سريع وقابل للتعديل.",
    descEn: "Animated clips from prompts — fast & editable.",
    tag: { ar: "قريباً", en: "Soon" },
  },
];

export default function ToolsPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-14 animate-fade-up" dir={isAr ? "rtl" : "ltr"}>

      {/* Header */}
      <div className="mb-12 relative">
        <div className="absolute -top-10 start-0 w-80 h-40 rounded-full bg-[var(--brand)] blur-[100px] opacity-15 pointer-events-none" />
        <p className="text-xs font-semibold text-[var(--brand-bright)] uppercase tracking-widest mb-3">
          {isAr ? "مجموعة الأدوات" : "Toolkit"}
        </p>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
          {isAr ? "أدوات الذكاء الاصطناعي" : "AI Tools"}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg">
          {isAr
            ? "مجموعة متكاملة من أدوات الذكاء الاصطناعي لإنجاز مهامك الإبداعية باحترافية."
            : "A complete suite of AI tools for your creative workflow."}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {tools.map((t) => {
          const disabled = t.href === "#";
          return (
            <Link
              key={t.titleEn}
              href={t.href}
              className={`group glass-card p-6 flex flex-col gap-5 relative overflow-hidden
                ${disabled ? "pointer-events-none opacity-60" : ""}`}
            >
              {/* Subtle glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 30% 30%, ${t.glowColor} 0%, transparent 70%)` }}
              />

              {/* Tag */}
              {t.tag && (
                <span className="absolute top-5 end-5 badge badge-accent text-[9px]">
                  {isAr ? t.tag.ar : t.tag.en}
                </span>
              )}

              {/* Icon */}
              <div
                className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center ${t.color}`}
                style={{ background: t.glowColor, border: `1px solid ${t.borderColor}` }}
              >
                {t.icon}
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1">
                <h3 className={`font-semibold text-[var(--text-primary)] mb-1.5 transition-colors ${disabled ? "" : "group-hover:" + t.color}`}>
                  {isAr ? t.titleAr : t.titleEn}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {isAr ? t.descAr : t.descEn}
                </p>
              </div>

              {!disabled && (
                <div className={`relative z-10 flex items-center gap-1.5 text-xs font-semibold text-[var(--text-tertiary)] group-hover:text-[var(--brand-bright)] transition-colors`}>
                  <span>{isAr ? "استخدم الأداة" : "Open tool"}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`w-3 h-3 transition-transform group-hover:${isAr ? "-translate-x-0.5" : "translate-x-0.5"}`}>
                    {isAr ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
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
