"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { ArrowRight, ArrowLeft, Sparkles, Video, Mic, Image as ImageIcon, Play, Sparkle, Film, Fingerprint } from 'lucide-react';

export default function HeroSection() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleStartForFree = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector('#tools');
    if (target) {
      const offset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toolsMarquee = [
    'Lip Sync', 'Image Animation', 'Creative Text', 'Cinematic Video', 'Human Voiceover', 'Precision Avatars'
  ];

  const modelsMarquee = [
    '🚀 Google Veo 3.1', '🔥 xAI Grok', '✨ NexMedia Sync Pro', '🎙️ NexMedia Voice', '🤖 NexMedia AI'
  ];

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#0a0015]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-violet-600/20 rounded-full blur-[100px] md:blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-fuchsia-600/20 rounded-full blur-[100px] md:blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-16 md:pt-20 pb-8 text-center flex flex-col justify-center h-full">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-4"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] md:text-xs font-medium text-white/80 shadow-[0_0_15px_rgba(217,70,239,0.15)]">
            <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-fuchsia-400 animate-pulse" />
            {isRtl ? 'أحدث نماذج الذكاء الاصطناعي العالمية بين يديك' : 'The latest global AI models at your fingertips'}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-tight md:leading-[1.15] mb-3 md:mb-4 max-w-3xl mx-auto tracking-tight"
        >
          {isRtl ? (
            <>
              قوة الذكاء الاصطناعي في <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">خدمتك</span>
            </>
          ) : (
            <>
              The Power of AI at <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Your Service</span>
            </>
          )}
        </motion.h1>

        {/* Subtitle - Short & Punchy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sm sm:text-base text-white/60 max-w-xl mx-auto mb-6 md:mb-8 leading-relaxed font-medium px-2"
        >
          {isRtl 
            ? 'حوّل أفكارك إلى واقع مذهل. منصة واحدة تمنحك أقوى أدوات الذكاء الاصطناعي عالمياً لإنشاء المحتوى المرئي والمسموع باحترافية.'
            : 'Turn your ideas into stunning reality. A single platform giving you the world\'s most powerful AI tools for visual and audio content creation.'}
        </motion.p>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12 w-full px-4"
        >
          <a
            href="#tools"
            onClick={handleStartForFree}
            className="group relative flex items-center justify-center gap-2 px-6 sm:px-7 py-3 md:py-3.5 rounded-xl text-white font-bold text-base sm:text-lg overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.25)] hover:shadow-[0_0_50px_rgba(217,70,239,0.4)] transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 group-hover:from-violet-500 group-hover:to-fuchsia-500 transition-all duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300" />
            <span className="relative">{isRtl ? '🚀 ابدأ تجربتك المجانية الآن' : '🚀 Start Your Free Trial Now'}</span>
            <ArrowIcon className={`w-4 h-4 md:w-5 md:h-5 relative transition-transform duration-300 ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </a>
          
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2 text-[11px] md:text-xs font-medium text-white/50 w-full">
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 md:px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
              <span className="text-fuchsia-400 text-xs md:text-sm">🎁</span> {isRtl ? 'رصيد 10 كريدت مجاني للتجربة' : '10 Free Credits for Trial'}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 md:px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
              <span className="text-emerald-400 text-xs md:text-sm">💳</span> {isRtl ? 'لا يتطلب بطاقة ائتمان' : 'No Credit Card Required'}
            </span>
          </div>
        </motion.div>

        {/* Infinite Marquee Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative w-full max-w-4xl mx-auto overflow-hidden mt-auto [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          dir="ltr"
        >
          {/* Row 1: Tools (Scrolling Left) */}
          <div className="flex whitespace-nowrap mb-3 md:mb-4">
            <motion.div
              className="flex gap-3 md:gap-4 shrink-0 px-2 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...toolsMarquee, ...toolsMarquee, ...toolsMarquee, ...toolsMarquee, ...toolsMarquee, ...toolsMarquee].map((item, i) => (
                <div key={`tool-${i}`} className="px-4 py-2 md:px-5 md:py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/90 text-xs md:text-sm font-medium backdrop-blur-md shadow-sm">
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2: Models (Scrolling Right) */}
          <div className="flex whitespace-nowrap pb-4 md:pb-6">
            <motion.div
              className="flex gap-3 md:gap-4 shrink-0 px-2 w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {[...modelsMarquee, ...modelsMarquee, ...modelsMarquee, ...modelsMarquee, ...modelsMarquee, ...modelsMarquee].map((item, i) => (
                <div key={`model-${i}`} className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 border border-violet-500/20 rounded-xl text-violet-100 text-xs md:text-sm font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
