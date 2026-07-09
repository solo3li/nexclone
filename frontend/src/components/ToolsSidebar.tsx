"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "../i18n/routing";
import { Mic, FileAudio, Video, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ToolsSidebar() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const pathname = usePathname();
  
  const tools = [
    {
      id: "text-to-voice",
      href: "/tools/text-to-voice",
      icon: Mic,
      labelEn: "Text to Voice",
      labelAr: "تحويل النص لصوت",
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-500/10",
    },
    {
      id: "voice-to-text",
      href: "/tools/voice-to-text",
      icon: FileAudio,
      labelEn: "Voice to Text",
      labelAr: "تحويل الصوت لنص",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      id: "image-to-video",
      href: "/tools/image-to-video",
      icon: Video,
      labelEn: "Image to Video",
      labelAr: "تحويل الصورة لفيديو",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    }
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 z-[60]" style={{ [isRtl ? 'right' : 'left']: '1.5rem' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-900/50 flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <div
        className={`fixed top-16 md:top-20 bottom-0 z-[60] lg:z-10 w-72 bg-[#0a0015]/95 lg:bg-[#0a0015]/30 backdrop-blur-xl border-white/5 transition-transform duration-300 flex flex-col
          ${isRtl ? 'right-0 lg:border-l' : 'left-0 lg:border-r'}
          ${isOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
        `}
      >
        <div className="p-4 flex items-center justify-between lg:hidden border-b border-white/5">
          <span className="font-bold text-white text-lg">{isRtl ? 'أدوات الاستوديو' : 'Tools Studio'}</span>
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white p-2 bg-white/5 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-white/30 uppercase tracking-wider mb-4 px-2 hidden lg:block">
            {isRtl ? 'استوديو العمل' : 'Workspace Studio'}
          </div>
          
          <div className="flex flex-col gap-2">
            {tools.map((tool) => {
              const isActive = pathname.includes(tool.href);
              const Icon = tool.icon;
              
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? tool.bg : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? tool.color : 'text-white/50 group-hover:text-white'}`} />
                  </div>
                  <span className="font-medium text-sm">
                    {isRtl ? tool.labelAr : tool.labelEn}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
