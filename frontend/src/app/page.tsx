"use client";

import Link from "next/link";
import { useLanguageStore } from "../store/useLanguageStore";

const days = {
  ar: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};
const bars = [40, 70, 50, 90, 60, 30, 45]; // heights in %

export default function Home() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-10" dir={isAr ? "rtl" : "ltr"}>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-h1 text-[var(--color-ink)]">
            {isAr ? "نظرة عامة" : "Overview"}
          </h1>
          <p className="text-small text-[var(--color-muted)] mt-1">
            {isAr
              ? "مراقبة نشاط الذكاء الاصطناعي ومساحة العمل الخاصة بك."
              : "Monitor your AI activity and workspace."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="icon-box text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {isAr ? "مشروع جديد" : "New project"}
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-min">

        {/* Welcome card — 2 cols */}
        <div className="md:col-span-2 card p-7 relative overflow-hidden">
          {/* Subtle background accent */}
          <div className="absolute top-0 end-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-50 pointer-events-none" />

          <div className="relative z-10">
            <p className="text-caption text-[var(--color-muted)] mb-2">
              {isAr ? "مرحباً بعودتك" : "Welcome back"}
            </p>
            <h2 className="text-h2 text-[var(--color-ink)] mb-2">
              {isAr ? "مساحة عملك تعمل بسلاسة." : "Your workspace is running smoothly."}
            </h2>
            <p className="text-small text-[var(--color-muted)] mb-8">
              {isAr
                ? "لقد استخدمت 25% من إجمالي رصيدك هذا الشهر."
                : "You've used 25% of your monthly credit."}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[var(--color-border)]">
              {[
                { labelAr: "العمليات", labelEn: "Operations", value: "12,340", sub: null },
                { labelAr: "الرصيد",   labelEn: "Credits",    value: "4,120",  sub: "+12%" },
                { labelAr: "الوقت الموفر", labelEn: "Time saved", value: isAr ? "45 س" : "45 h", sub: null },
              ].map((s) => (
                <div key={s.labelEn}>
                  <p className="text-caption text-[var(--color-muted)] mb-1">
                    {isAr ? s.labelAr : s.labelEn}
                  </p>
                  <p className="text-h2 text-[var(--color-ink)] flex items-baseline gap-2">
                    {s.value}
                    {s.sub && (
                      <span className="badge badge-success text-[9px]">{s.sub}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick tools — 1 col */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-h3 text-[var(--color-ink)]">
              {isAr ? "الأدوات" : "Tools"}
            </h3>
            <Link href="/tools" className="text-small text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors font-medium">
              {isAr ? "الكل" : "All"}
            </Link>
          </div>

          <div className="space-y-2">
            {[
              {
                href: "/voice-to-text",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                ),
                labelAr: "صوت إلى نص",
                labelEn: "Voice to Text",
              },
              {
                href: "/text-to-voice",
                color: "text-violet-600",
                bg: "bg-violet-50",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                ),
                labelAr: "نص إلى صوت",
                labelEn: "Text to Voice",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="row-hover flex items-center justify-between p-2.5 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${t.bg} ${t.color} flex items-center justify-center shrink-0`}>
                    {t.icon}
                  </div>
                  <span className="text-small font-medium text-[var(--color-ink)]">
                    {isAr ? t.labelAr : t.labelEn}
                  </span>
                </div>
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className={`w-3.5 h-3.5 text-[var(--color-subtle)] transition-transform group-hover:${isAr ? "-translate-x-0.5 text-[var(--color-muted)]" : "translate-x-0.5 text-[var(--color-muted)]"}`}
                >
                  {isAr
                    ? <polyline points="15 18 9 12 15 6" />
                    : <polyline points="9 18 15 12 9 6" />}
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Chart — 2 cols */}
        <div className="md:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-h3 text-[var(--color-ink)]">
              {isAr ? "النشاط الأسبوعي" : "Weekly activity"}
            </h3>
            <select className="bento-input !p-1.5 !text-xs !w-auto text-[var(--color-muted)]">
              <option>{isAr ? "هذا الأسبوع" : "This week"}</option>
              <option>{isAr ? "هذا الشهر" : "This month"}</option>
            </select>
          </div>

          {/* Bar chart */}
          <div className="flex items-end justify-between gap-2 h-28 px-1">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                {h === 90 && (
                  <span className="text-[9px] font-bold text-[var(--color-primary)]">240</span>
                )}
                <div
                  className={`w-full rounded-t-md transition-all ${
                    h === 90
                      ? "bg-[var(--color-primary)]"
                      : "bg-[var(--color-surface-2)]"
                  }`}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>

          {/* X axis */}
          <div className="flex justify-between px-1 mt-3">
            {(isAr ? days.ar : days.en).map((d) => (
              <span key={d} className="flex-1 text-center text-[10px] text-[var(--color-subtle)] font-medium">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Plan card — 1 col */}
        <div className="card p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-h3 text-[var(--color-ink)]">
                {isAr ? "باقة المحترفين" : "Pro plan"}
              </h3>
              <span className="badge badge-success">{isAr ? "نشط" : "Active"}</span>
            </div>
            <p className="text-small text-[var(--color-muted)]">
              {isAr ? "دفع شهري." : "Monthly billing."}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-small text-[var(--color-muted)]">
                {isAr ? "التخزين" : "Storage"}
              </span>
              <span className="text-small text-[var(--color-ink)] font-medium" dir="ltr">45 / 100 GB</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-2)] overflow-hidden">
              <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: "45%" }} />
            </div>
          </div>

          <Link
            href="/settings"
            className="btn btn-secondary w-full justify-center text-sm"
          >
            {isAr ? "إدارة الفوترة" : "Manage billing"}
          </Link>
        </div>

      </div>
    </div>
  );
}
