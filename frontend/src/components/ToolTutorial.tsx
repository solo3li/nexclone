"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, HelpCircle } from "lucide-react";
import { useLocale } from "next-intl";

export interface TutorialStep {
  title: string;
  description: string;
}

export interface ToolTutorialProps {
  toolKey: string;
  steps: TutorialStep[];
}

export function ToolTutorialButton({ onClick }: { onClick: () => void }) {
  const locale = useLocale();
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border border-violet-500/30"
    >
      <HelpCircle className="w-4 h-4" />
      {locale === 'ar' ? 'كيف تستخدم الأداة؟' : 'How to use?'}
    </button>
  );
}

export function ToolTutorialModal({
  toolKey,
  steps,
  isOpen,
  onClose
}: ToolTutorialProps & { isOpen: boolean; onClose: () => void }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem(`has_seen_tutorial_${toolKey}`, "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0f0024] border border-fuchsia-500/30 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(236,72,153,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 mt-2">
          <h3 className="text-xl font-bold text-white mb-2">{steps[currentStep].title}</h3>
          <p className="text-white/70 text-sm leading-relaxed">{steps[currentStep].description}</p>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? "w-6 bg-fuchsia-500" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-all"
            >
              {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center gap-1"
            >
              {currentStep === steps.length - 1 ? (
                isRtl ? 'إنهاء' : 'Finish'
              ) : (
                isRtl ? 'التالي' : 'Next'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
