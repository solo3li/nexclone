"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Zap, X, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "../../i18n/routing";

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("nexmedia_tour_seen");
    if (!hasSeenTour) {
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
      title: isRtl ? "مرحباً بك في المنصة! 🎉" : "Welcome! 🎉",
      desc: isRtl ? "ابدأ تجربتك المجانية الآن واكتشف أدوات الذكاء الاصطناعي." : "Start your free trial now and discover AI tools.",
      icon: Sparkles,
      color: "text-violet-400"
    },
    {
      title: isRtl ? "رصيدك الحالي 💰" : "Your Current Balance 💰",
      desc: isRtl ? "ستجد رصيدك دائماً في الأعلى. يمكنك دائماً شحنه!" : "You'll always find your balance at the top.",
      icon: Coins,
      color: "text-amber-400"
    },
    {
      title: isRtl ? "ترقية الباقة 🚀" : "Upgrade Plan 🚀",
      desc: isRtl ? "إذا احتجت ميزات احترافية يمكنك ترقية باقتك." : "If you need pro features, you can easily upgrade your plan.",
      icon: Zap,
      color: "text-fuchsia-400"
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative w-full max-w-md bg-[#0f0524] border border-violet-500/30 rounded-3xl shadow-2xl overflow-hidden p-8"
        >
          <button
            onClick={closeTour}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="mb-6 flex justify-center">
            <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${currentStep.color}`}>
              <Icon className="w-8 h-8" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-3">{currentStep.title}</h3>
            <p className="text-white/60 leading-relaxed">
              {currentStep.desc}
            </p>
          </div>
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-violet-500" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-4">
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-bold transition-colors"
              >
                {isRtl ? 'التالي' : 'Next'}
              </button>
            ) : (
              <button
                onClick={closeTour}
                className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-bold transition-colors"
              >
                {isRtl ? 'هيا نبدأ!' : 'Lets Start!'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
