"use client";

import Link from "next/link";
import { useI18n } from "../lib/useI18n";
import { useAuthStore } from "../store/useAuthStore";

export default function LandingPage() {
  const { t, isAr, dir } = useI18n();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="w-full flex flex-col" dir={dir}>
      
      {/* ─── Hero Section ─── */}
      <section className="relative w-full overflow-hidden flex flex-col items-center justify-center pt-24 pb-32 px-5">
        {/* Deep ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand)] opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600 opacity-[0.06] blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center animate-fade-up">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand-bright)] text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-bright)] animate-pulse" />
            {t("landing.hero_badge")}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] tracking-tight leading-[1.1] mb-6">
            {t("landing.hero_title")} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-bright)] to-violet-400 drop-shadow-lg">
              {t("landing.hero_title_hl")}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("landing.hero_sub")}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link 
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--brand)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.4), inset 0 1px 1px rgba(255,255,255,0.2)",
              }}
            >
              {t("landing.cta_primary")}
            </Link>
            <Link 
              href="/tools"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-[var(--text-primary)] transition-all hover:bg-white/5 border border-white/10 hover:border-white/20"
              style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(10px)",
              }}
            >
              {t("landing.cta_secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Social Proof / Trusted By ─── */}
      <section className="w-full border-y border-[var(--border-glass)] bg-white/[0.01] py-8 overflow-hidden">
        <p className="text-center text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-6">
          {t("landing.trusted")}
        </p>
        <div className="flex items-center justify-center gap-8 md:gap-16 opacity-40 grayscale">
          {/* Fictional brand logos as SVGs */}
          <div className="h-6 w-24 bg-[currentColor]" style={{ maskImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 30\"><path d=\"M10 20 L20 10 L30 20\" stroke=\"black\" stroke-width=\"4\" fill=\"none\"/><circle cx=\"50\" cy=\"15\" r=\"8\" stroke=\"black\" stroke-width=\"4\" fill=\"none\"/><rect x=\"70\" y=\"8\" width=\"20\" height=\"14\" stroke=\"black\" stroke-width=\"4\" fill=\"none\"/></svg>')", WebkitMaskImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 30\"><path d=\"M10 20 L20 10 L30 20\" stroke=\"black\" stroke-width=\"4\" fill=\"none\"/><circle cx=\"50\" cy=\"15\" r=\"8\" stroke=\"black\" stroke-width=\"4\" fill=\"none\"/><rect x=\"70\" y=\"8\" width=\"20\" height=\"14\" stroke=\"black\" stroke-width=\"4\" fill=\"none\"/></svg>')", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }} />
          <div className="h-6 w-24 bg-[currentColor] hidden sm:block" style={{ maskImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 30\"><path d=\"M5 25 Q 50 -10 95 25\" stroke=\"black\" stroke-width=\"5\" fill=\"none\"/></svg>')", WebkitMaskImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 30\"><path d=\"M5 25 Q 50 -10 95 25\" stroke=\"black\" stroke-width=\"5\" fill=\"none\"/></svg>')", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }} />
          <div className="h-6 w-24 bg-[currentColor]" style={{ maskImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 30\"><rect x=\"10\" y=\"5\" width=\"80\" height=\"20\" rx=\"10\" stroke=\"black\" stroke-width=\"4\" fill=\"none\"/></svg>')", WebkitMaskImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 30\"><rect x=\"10\" y=\"5\" width=\"80\" height=\"20\" rx=\"10\" stroke=\"black\" stroke-width=\"4\" fill=\"none\"/></svg>')", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }} />
        </div>
      </section>

      {/* ─── Bento Grid Features ─── */}
      <section className="max-w-[1200px] mx-auto px-5 py-24 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            {t("landing.feat_title")}
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            {t("landing.feat_sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          
          {/* Card 1: Voice to Text (Large) */}
          <Link href="/voice-to-text" className="md:col-span-2 glass-card p-8 group relative overflow-hidden flex flex-col justify-end transition-all duration-300 hover:border-[var(--brand)]/40 hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-8 w-full h-full bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none" />
            <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 relative z-10">{t("landing.bento_voice")}</h3>
            <p className="text-[var(--text-secondary)] relative z-10">{t("landing.bento_voice_d")}</p>
          </Link>

          {/* Card 2: Stats */}
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/10 to-transparent pointer-events-none" />
            <h3 className="text-5xl font-black text-[var(--brand-bright)] mb-2 drop-shadow-md">{t("landing.stats_speed")}</h3>
            <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest font-semibold">{t("landing.stats_speed_d")}</p>
          </div>

          {/* Card 3: Text to Voice */}
          <Link href="/text-to-voice" className="glass-card p-8 group relative overflow-hidden flex flex-col justify-end transition-all duration-300 hover:border-[var(--brand)]/40 hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-8 w-full h-full bg-gradient-to-bl from-violet-500/10 to-transparent pointer-events-none" />
            <div className="absolute top-8 right-8 w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 relative z-10">{t("landing.bento_text")}</h3>
            <p className="text-sm text-[var(--text-secondary)] relative z-10">{t("landing.bento_text_d")}</p>
          </Link>

          {/* Card 4: Image Gen */}
          <Link href="/tools" className="glass-card p-8 group relative overflow-hidden flex flex-col justify-end transition-all duration-300 hover:border-[var(--brand)]/40 hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-8 w-full h-full bg-gradient-to-bl from-pink-500/10 to-transparent pointer-events-none" />
            <div className="absolute top-8 right-8 w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 relative z-10">{t("landing.bento_img")}</h3>
            <p className="text-sm text-[var(--text-secondary)] relative z-10">{t("landing.bento_img_d")}</p>
          </Link>

          {/* Card 5: Stats */}
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-white/5">
            <h3 className="text-5xl font-black text-white mb-2">{t("landing.stats_acc")}</h3>
            <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest font-semibold">{t("landing.stats_acc_d")}</p>
          </div>

        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="max-w-[1000px] mx-auto px-5 w-full pb-32">
        <div className="glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--brand)]/5 pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 relative z-10">
            {t("landing.ready")}
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 relative z-10">
            {t("landing.ready_sub")}
          </p>
          <Link 
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="inline-flex px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 relative z-10"
            style={{
              background: "var(--brand)",
              boxShadow: "0 8px 32px rgba(99,102,241,0.4), inset 0 1px 1px rgba(255,255,255,0.2)",
            }}
          >
            {t("landing.cta_primary")}
          </Link>
        </div>
      </section>

    </div>
  );
}
