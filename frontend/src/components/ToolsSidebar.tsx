"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "../i18n/routing";
import { Mic, FileAudio, Video, Menu, X, Home, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import api from "../utils/api";

export default function ToolsSidebar() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const pathname = usePathname();
  const router = useRouter();
  
  const tools = [
    {
      id: "text-to-voice",
      href: "/tools/text-to-voice",
      icon: Mic,
      labelEn: "Text to Voice",
      labelAr: "تحويل النص لصوت",
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-500/10",
      activeBorder: "border-fuchsia-500/30",
    },
    {
      id: "voice-to-text",
      href: "/tools/voice-to-text",
      icon: FileAudio,
      labelEn: "Voice to Text",
      labelAr: "تحويل الصوت لنص",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      activeBorder: "border-emerald-500/30",
    },
    {
      id: "image-to-video",
      href: "/tools/image-to-video",
      icon: Video,
      labelEn: "Image to Video",
      labelAr: "تحويل الصورة لفيديو",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      activeBorder: "border-blue-500/30",
    },
    {
      id: "advanced-lip-sync",
      href: "/tools/advanced-lip-sync",
      icon: Video,
      labelEn: "Advanced Lip Sync",
      labelAr: "مزامنة الشفاه (متقدم)",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      activeBorder: "border-amber-500/30",
    }
  ];

  const { user, logout } = useAppStore();
  
  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {}
    logout();
    router.push('/login');
  };

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

      {/* Sidebar Content - Full height from top-0 */}
      <div
        className={`fixed top-0 bottom-0 z-[60] lg:z-10 w-72 bg-[#0a0015]/95 lg:bg-[#080012] backdrop-blur-xl transition-transform duration-300 flex flex-col
          ${isRtl ? 'right-0 border-l border-white/5' : 'left-0 border-r border-white/5'}
          ${isOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
        `}
      >
        {/* Studio Top Brand Bar */}
        <div className={`flex items-center justify-between px-4 py-4 border-b border-white/5`} dir={isRtl ? 'rtl' : 'ltr'}>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-900/30">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="font-bold text-white/90 text-sm tracking-tight group-hover:text-white transition-colors">
              NexMedia
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Go to Home */}
            <Link 
              href="/"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
              title={isRtl ? 'الرئيسية' : 'Home'}
            >
              <Home className="w-4 h-4" />
            </Link>
            {/* Mobile close */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Credits Badge */}
        {user && (
          <div className="px-4 py-3 border-b border-white/5" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-white/70 text-xs font-medium truncate max-w-[100px]">
                  {user.fullName || user.email}
                </span>
              </div>
              
              <div className="flex flex-col gap-1.5">
                {user.wallets?.map((wallet: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/50 text-[10px] font-bold tracking-wider">{wallet.code}</span>
                    <div className="flex items-center gap-1.5">
                      <Wallet className="w-3 h-3 text-fuchsia-400" />
                      <span className="text-white/90 text-xs font-bold">{wallet.balance}</span>
                    </div>
                  </div>
                ))}
                {(!user.wallets || user.wallets.length === 0) && (
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20">
                    <span className="text-fuchsia-300/70 text-[10px] font-bold tracking-wider">GENERAL</span>
                    <div className="flex items-center gap-1.5">
                      <Wallet className="w-3 h-3 text-fuchsia-400" />
                      <span className="text-fuchsia-300 text-xs font-bold">{user.availableCredits || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tools List */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-white/25 uppercase tracking-widest mb-4 px-2">
            {isRtl ? 'أدوات الاستوديو' : 'Studio Tools'}
          </div>
          
          <div className="flex flex-col gap-1.5">
            {tools.map((tool) => {
              const isActive = pathname.includes(tool.id);
              const Icon = tool.icon;
              
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group border ${
                    isActive 
                      ? `bg-white/8 text-white ${tool.activeBorder}` 
                      : 'text-white/50 hover:bg-white/5 hover:text-white border-transparent'
                  }`}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? tool.bg : 'bg-white/5 group-hover:bg-white/8'
                  }`}>
                    <Icon className={`w-4.5 h-4.5 ${isActive ? tool.color : 'text-white/40 group-hover:text-white/70'}`} />
                  </div>
                  <span className="font-medium text-sm leading-tight">
                    {isRtl ? tool.labelAr : tool.labelEn}
                  </span>
                  {isActive && (
                    <div className={`w-1.5 h-1.5 rounded-full ${tool.color.replace('text-', 'bg-')} ${isRtl ? 'mr-auto' : 'ml-auto'} opacity-80`} />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom: Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all group"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-red-500/10 flex items-center justify-center flex-shrink-0 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </>
  );
}
