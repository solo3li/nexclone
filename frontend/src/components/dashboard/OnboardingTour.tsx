"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Zap, X, Sparkles, PlayCircle, Video } from "lucide-react";
import { useLocale } from "next-intl";

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const locale = useLocale();
  const isRtl = locale === 'ar';

  useEffect(() => {
    // Check if the user has seen the tour before
    const hasSeenTour = localStorage.getItem("nexmedia_tour_seen");
    if (!hasSeenTour) {
      // Delay opening the tour slightly for a better UX
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeTour = () => {
    setIsOpen(false);
    localStorage.setItem("nexmedia_tour_seen", "true");
  };

  const steps = [
    {
      title: isRtl ? "مرحباً بك في NexMedia! ✨" : "Welcome to NexMedia! ✨",
      desc: isRtl ? "لقد تم منحك 10 كريدت مجانية كهدية ترحيبية. دعنا نأخذك في جولة سريعة لمعرفة كيف تبدأ." : "You've been granted 10 free credits. Let's take a quick tour to see how to start.",
      icon: Sparkles,
      color: "text-violet-400"
    },
    {
      title: isRtl ? "الرصيد الخاص بك 💰" : "Your Balance 💰",
      desc: isRtl ? "ستجد رصيدك دائماً في أعلى الشاشة. كل عملية توليد (فيديو، صوت، أو صورة) ستستهلك عدداً معيناً من الكريدت." : "You'll always find your balance at the top. Each generation consumes a specific amount of credits.",
      icon: Coins,
      color: "text-amber-400"
    },
    {
      title: isRtl ? "استكشف الأدوات 🎥" : "Explore Tools 🎥",
      desc: isRtl ? "من القائمة الجانبية يمكنك الوصول إلى توليد الفيديو (Veo & Grok)، التعليق الصوتي، ومزامنة الشفاه. ابدأ الإبداع الآن!" : "From the sidebar, access Video Generation (Veo & Grok), Voiceovers, and Lip Sync. Start creating!",
      icon: Video,
      color: "text-blue-400"
    },
    {
      title: isRtl ? "ترقية الباقة ⚡" : "Upgrade Plan ⚡",
      desc: isRtl ? "عندما ينفد رصيدك المجاني أو تحتاج ميزات احترافية أكثر، يمكنك ترقية باقتك بسهولة وبدون شروط معقدة." : "When you run out of credits or need pro features, you can easily upgrade your plan.",
      icon: Zap,
      color: "text-fuchsia-400"
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeTour}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-[#0f0524] border border-violet-500/30 rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden p-8"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <button
            onClick={closeTour}
            className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} text-white/50 hover:text-white transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-6 flex justify-center">
            <motion.div 
              key={step}
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${currentStep.color} shadow-lg`}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
          </div>
          
          <div className="text-center mb-8 h-24 flex flex-col justify-center">
            <motion.h3 
              key={`title-${step}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white mb-2"
            >
              {currentStep.title}
            </motion.h3>
            <motion.p 
              key={`desc-${step}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/70 leading-relaxed text-sm"
            >
              {currentStep.desc}
            </motion.p>
          </div>
          
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-violet-500" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-4">
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-colors"
              >
                {isRtl ? 'التالي' : 'Next'}
              </button>
            ) : (
              <button
                onClick={closeTour}
                className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-violet-500/25"
              >
                {isRtl ? 'يلا نبدأ الإبداع! 🚀' : 'Let\'s Start Creating! 🚀'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
