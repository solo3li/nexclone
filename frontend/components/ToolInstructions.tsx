"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, Info } from "lucide-react";
import { useLocale } from "next-intl";

interface ToolInstructionsProps {
  toolId: string;
  title: string;
  instructions: string[];
}

export default function ToolInstructions({ toolId, title, instructions }: ToolInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const isRtl = locale === 'ar';

  useEffect(() => {
    const hasSeen = localStorage.getItem(`tool_onboard_${toolId}`);
    if (!hasSeen) {
      setIsOpen(true);
      localStorage.setItem(`tool_onboard_${toolId}`, "true");
    }
  }, [toolId]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 z-40 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white p-3 rounded-full shadow-lg shadow-fuchsia-500/30 transition-transform hover:scale-110 flex items-center justify-center group ${isRtl ? 'left-6' : 'right-6'}`}
        title={isRtl ? "كيف تستخدم الأداة؟" : "How to use?"}
      >
        <HelpCircle className="w-6 h-6" />
        <span className={`absolute ${isRtl ? 'left-full ml-3' : 'right-full mr-3'} whitespace-nowrap bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}>
          {isRtl ? "كيف تستخدم الأداة؟" : "How to use?"}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0f0024] border border-fuchsia-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                style={isRtl ? { left: '1rem', right: 'auto' } : { right: '1rem', left: 'auto' }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center border border-fuchsia-500/30">
                  <Info className="w-6 h-6 text-fuchsia-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">{title}</h3>
                  <p className="text-fuchsia-300/70 text-sm">{isRtl ? "دليل الاستخدام السريع" : "Quick Usage Guide"}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {instructions.map((inst, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5"
                  >
                    <div className="w-6 h-6 rounded-full bg-fuchsia-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">{inst}</p>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-xl font-bold shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:scale-[1.02] transition-all"
              >
                {isRtl ? "حسناً، فهمت" : "Got it, thanks"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
