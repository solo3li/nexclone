"use client";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import { AnimatedText, GlowPulse } from "./AnimatedText";
import Scene from "./Scene";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "../i18n/routing";
import { useAppStore } from "../store/useAppStore";

export default function HeroSection() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;
  const router = useRouter();
  const { user, isAuthenticated, hasPhoneNumber } = useAppStore();

  const handleStartForFree = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const isDesktop = window.innerWidth >= 768;
    
    if (isDesktop) {
      if (isAuthenticated && !hasPhoneNumber) {
        router.push("/complete-profile");
      } else {
        router.push("/tools/text-to-voice");
      }
    } else {
      // Mobile: scroll to tools section
      const toolsElement = document.getElementById("tools");
      if (toolsElement) {
        toolsElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Base */}
      <div className="absolute inset-0 bg-[#0a0015]" />
      
      {/* 3D Interactive Scene */}
      <Scene />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0015]/40 to-[#0a0015] pointer-events-none" />

      {/* Animated Orbs - Desktop only, mobile uses MobileBackground */}
      <GlowPulse className="hidden md:block w-96 h-96 bg-violet-600/10 blur-3xl top-1/4 right-1/4" />
      <GlowPulse className="hidden md:block w-72 h-72 bg-fuchsia-600/5 blur-3xl bottom-1/3 left-1/4" />
      <GlowPulse className="hidden md:block w-64 h-64 bg-purple-700/10 blur-3xl top-1/3 left-1/3" />


      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-20 text-center flex flex-col justify-center min-h-screen">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className={`text-4xl sm:text-5xl ${locale === 'ar' ? 'md:text-7xl' : 'md:text-6xl'} font-extrabold text-white leading-tight mb-4 max-w-4xl mx-auto`}
        >
          {locale === 'ar' ? (
            <>
              قوة الذكاء في خدمة{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                إبداعك
              </span>
            </>
          ) : (
            <>
              The Power of AI at{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Your Service
              </span>
            </>
          )}
        </motion.h1>


        {/* Subtitle */}
        <AnimatedText
          text={t('subtitle')}
          as="p"
          delay={0.5}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        />

        {/* Visual Wow Factor: Animated Audio Wave to AI Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="mx-auto mb-12 relative w-full max-w-md h-24 flex items-center justify-center gap-1"
        >
          {/* Animated bars representing audio */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`bar-${i}`}
              className="w-1.5 bg-violet-400 rounded-full"
              animate={{
                height: ["10px", "40px", "10px"],
                opacity: [0.3, 1, 0.3],
                backgroundColor: ["#8b5cf6", "#d946ef", "#8b5cf6"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
          
          <div className="mx-4 text-violet-400/50">
            <ArrowIcon className={`w-6 h-6 animate-pulse ${locale === 'ar' ? 'rotate-180' : ''}`} />
          </div>

          <motion.div
            className="px-4 py-2 bg-white/5 border border-violet-500/30 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white font-medium flex items-center gap-2"
            animate={{
              boxShadow: ["0 0 20px rgba(139,92,246,0.3)", "0 0 40px rgba(217,70,239,0.6)", "0 0 20px rgba(139,92,246,0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xl">✨</span> {locale === 'ar' ? 'نص ذكي بضغطة زر' : 'AI Magic Instantly'}
          </motion.div>
        </motion.div>

        {/* Gradient word highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            {t('highlights')}
          </span>
        </motion.div>

        {/* Interactive Demo (Micro-interaction) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="max-w-md mx-auto mb-10 bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-sm flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={locale === 'ar' ? "اكتب كلمة لتسمع السحر..." : "Type a word to hear the magic..."}
            className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder:text-white/40"
            maxLength={30}
            id="demo-input"
          />
          <button
            onClick={() => {
              // Mock audio playback for demo
              const audio = new Audio('/beep_short.ogg');
              audio.play();
            }}
            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            {locale === 'ar' ? 'استماع' : 'Listen'}
          </button>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
        >
          <a
            href="#tools"
            onClick={handleStartForFree}
            className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 group-hover:from-violet-500 group-hover:to-fuchsia-500 transition-all duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300" />
            <span className="relative">{locale === 'ar' ? 'ابدأ تجربتك المجانية' : 'Start Free Trial'}</span>
            <ArrowIcon className={`w-5 h-5 relative transition-transform duration-300 ${locale === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </a>
        </motion.div>
        
        {/* Social Proof Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="text-white/50 text-sm font-medium mb-12"
        >
          {locale === 'ar' ? '✨ انضم لأكثر من 50,000 صانع محتوى يعتمدون على NexMedia' : '✨ Join over 50,000 creators using NexMedia'}
        </motion.p>

        {/* Hero Video Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0015] via-transparent to-transparent z-10" />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto object-cover opacity-80 mix-blend-screen"
            poster="/dummy.jpg"
          >
            <source src="/dummy.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-white/30 text-xs">{t('scrollDown')}</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-violet-500 to-transparent"
          animate={{ scaleY: [0, 1], opacity: [1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

