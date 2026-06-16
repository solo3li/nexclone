"use client";

import Link from "next/link";
import { useI18n } from "../lib/useI18n";
import { useAuthStore } from "../store/useAuthStore";

export default function LandingPage() {
  const { t, isAr, dir } = useI18n();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-5 min-h-[calc(100vh-80px)]" dir={dir}>
      
      {/* Deep ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--brand)] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600 opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />
      
      {/* ─── Massive Bento Grid Layout ─── */}
      <div className="w-full max-w-[1300px] grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px] animate-fade-up relative z-10">
        
        {/* 1. Hero Block (Spans 2x2) */}
        <div className="md:col-span-2 md:row-span-2 glass-card p-10 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[var(--brand)]/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand-bright)] text-xs font-bold uppercase tracking-wider mb-6 w-fit">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-bright)] animate-pulse" />
            {t("landing.hero_badge")}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
            {t("landing.hero_title")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-bright)] to-violet-400 drop-shadow-lg">
              {t("landing.hero_title_hl")}
            </span>
          </h1>

          <p className="text-[var(--text-secondary)] text-lg max-w-md mb-8 leading-relaxed">
            {t("landing.hero_sub")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={isAuthenticated ? "/dashboard" : "/login"}
              className="inline-flex justify-center items-center px-6 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
              style={{
                background: "var(--brand)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.4), inset 0 1px 1px rgba(255,255,255,0.2)",
              }}>
              {t("landing.cta_primary")}
            </Link>
          </div>
        </div>

        {/* 2. Voice to Text Feature (Spans 2 cols) */}
        <Link href="/voice-to-text" className="md:col-span-2 glass-card p-8 relative overflow-hidden group transition-all duration-500 hover:border-emerald-500/40 flex items-center gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="w-20 h-20 shrink-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500 shadow-[0_0_30px_rgba(52,211,153,0.1)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{t("landing.bento_voice")}</h3>
            <p className="text-[var(--text-secondary)] text-sm">{t("landing.bento_voice_d")}</p>
          </div>
        </Link>

        {/* 3. Stats Block (1 col, 1 row) */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand)]/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-4xl lg:text-5xl font-black text-[var(--brand-bright)] mb-2 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            {t("landing.stats_speed")}
          </h3>
          <p className="text-[var(--text-secondary)] text-[11px] uppercase tracking-[0.2em] font-bold">
            {t("landing.stats_speed_d")}
          </p>
        </div>

        {/* 4. Text to Voice Block (1 col, 1 row) */}
        <Link href="/text-to-voice" className="glass-card p-6 relative overflow-hidden group transition-all duration-500 hover:border-violet-500/40 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">{t("landing.bento_text")}</h3>
            <p className="text-[var(--text-tertiary)] text-xs">{t("landing.bento_text_d")}</p>
          </div>
        </Link>

        {/* 5. Image Gen (1 col, 1 row) */}
        <Link href="/tools" className="glass-card p-6 relative overflow-hidden group transition-all duration-500 hover:border-pink-500/40 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">{t("landing.bento_img")}</h3>
            <p className="text-[var(--text-tertiary)] text-xs">{t("landing.bento_img_d")}</p>
          </div>
        </Link>

        {/* 6. Explore Tools CTA (1 col, 1 row) */}
        <Link href="/tools" className="glass-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group border border-white/5 hover:border-white/20 transition-colors">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-white"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white">{t("landing.cta_secondary")}</h3>
        </Link>

        {/* 7. Bottom Wide Stats (Spans 2 cols) */}
        <div className="md:col-span-2 glass-card p-8 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{t("landing.trusted")}</h3>
            <p className="text-[var(--text-secondary)] text-sm">Join thousands of creators using NexMedia.</p>
          </div>
          <div className="relative z-10 hidden sm:flex -space-x-3 rtl:space-x-reverse">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] bg-[var(--brand)] flex items-center justify-center text-white text-xs font-bold z-10">
              10k+
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
