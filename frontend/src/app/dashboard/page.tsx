"use client";

import Link from "next/link";
import { useLanguageStore } from "../store/useLanguageStore";

const days = {
  ar: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};
const bars = [38, 65, 48, 92, 58, 28, 44];

export default function Home() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  return (
    <div
      className="max-w-[1300px] mx-auto px-5 py-10 animate-fade-up"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {isAr ? "نظرة عامة" : "Overview"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {isAr
              ? "مراقبة نشاط الذكاء الاصطناعي ومساحة العمل الخاصة بك."
              : "Monitor your AI activity and workspace."}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="btn-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {isAr ? "مشروع جديد" : "New project"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Welcome card — 2 cols */}
        <div className="md:col-span-2 glass-card p-7 relative overflow-hidden">
          {/* glow blob */}
          <div className="absolute -top-16 -end-16 w-56 h-56 rounded-full bg-[var(--brand)] blur-[80px] opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-semibold text-[var(--brand-bright)] uppercase tracking-widest mb-3">
              {isAr ? "مساحة العمل" : "Workspace"}
            </p>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              {isAr ? "مرحباً بعودتك." : "Welcome back."}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md">
              {isAr
                ? "مساحة العمل تعمل بسلاسة. لقد استخدمت 25% من رصيدك هذا الشهر."
                : "Everything is running smoothly. You've used 25% of your monthly credit."}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-glass)]">
              {[
                { ar: "العمليات",    en: "Operations",  val: "12,340",                    sub: null },
                { ar: "الرصيد",      en: "Credits",     val: "4,120",                     sub: "+12%" },
                { ar: "الوقت الموفر", en: "Time saved",  val: isAr ? "45 س" : "45 h",     sub: null },
              ].map((s) => (
                <div key={s.en}>
                  <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-1.5">
                    {isAr ? s.ar : s.en}
                  </p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] flex items-baseline gap-2">
                    {s.val}
                    {s.sub && (
                      <span className="badge badge-success text-[9px]">{s.sub}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick tools */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {isAr ? "الأدوات" : "Tools"}
            </h3>
            <Link href="/tools" className="text-xs text-[var(--brand-bright)] hover:text-[var(--accent)] transition-colors font-medium">
              {isAr ? "الكل" : "All"}
            </Link>
          </div>
          <div className="space-y-2">
            {[
              { href: "/voice-to-text", color: "text-emerald-400", blob: "rgba(52,211,153,0.12)", ar: "صوت إلى نص",  en: "Voice to Text",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg> },
              { href: "/text-to-voice", color: "text-violet-400", blob: "rgba(167,139,250,0.12)", ar: "نص إلى صوت",  en: "Text to Voice",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> },
            ].map((t) => (
              <Link key={t.href} href={t.href}
                className="row-hover flex items-center justify-between p-2.5 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${t.color}`}
                    style={{ background: t.blob }}>
                    {t.icon}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    {isAr ? t.ar : t.en}
                  </span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--brand-bright)] transition-colors">
                  {isAr ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Chart — 2 cols */}
        <div className="md:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {isAr ? "النشاط الأسبوعي" : "Weekly activity"}
            </h3>
            <select className="text-xs">
              <option>{isAr ? "هذا الأسبوع" : "This week"}</option>
              <option>{isAr ? "هذا الشهر" : "This month"}</option>
            </select>
          </div>
          <div className="flex items-end justify-between gap-2 h-28">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                {h === 92 && (
                  <span className="text-[9px] font-bold text-[var(--brand-bright)]">240</span>
                )}
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${h}%`,
                    background: h === 92
                      ? "linear-gradient(180deg, var(--brand-bright) 0%, var(--brand) 100%)"
                      : "rgba(99,102,241,0.18)",
                    boxShadow: h === 92 ? "0 -4px 16px var(--brand-glow)" : "none",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            {(isAr ? days.ar : days.en).map((d) => (
              <span key={d} className="flex-1 text-center text-[9px] text-[var(--text-tertiary)] font-medium">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Plan card */}
        <div className="glass-card p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-[var(--text-primary)]">
                {isAr ? "باقة المحترفين" : "Pro plan"}
              </h3>
              <span className="badge badge-success">{isAr ? "نشط" : "Active"}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {isAr ? "دفع شهري." : "Monthly billing."}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-secondary)]">{isAr ? "التخزين" : "Storage"}</span>
              <span className="text-xs text-[var(--text-primary)] font-medium" dir="ltr">45 / 100 GB</span>
            </div>
            <div className="glass-progress-track">
              <div className="glass-progress-bar" style={{ width: "45%" }} />
            </div>
          </div>
          <Link href="/settings"
            className="btn w-full justify-center text-sm text-[var(--text-secondary)]">
            {isAr ? "إدارة الفوترة" : "Manage billing"}
          </Link>
        </div>
      </div>
    </div>
  );
}
