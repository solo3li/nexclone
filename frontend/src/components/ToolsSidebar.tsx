"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "../i18n/routing";
import { 
  Mic, 
  FileAudio, 
  Video, 
  Menu, 
  X, 
  Home, 
  LogOut, 
  Wallet, 
  ChevronDown, 
  Bell, 
  Zap, 
  Image as ImageIcon, 
  Film, 
  Layers, 
  History,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Sparkles,
  Loader2,
  FolderKanban
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import api from "../utils/api";
import { signalRNotificationService } from "../../lib/signalr-client";
import { resolveToolStatus } from "../utils/toolStatus";

export default function ToolsSidebar() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const pathname = usePathname();
  const router = useRouter();

  const { 
    user, 
    setUser, 
    logout, 
    setLogoutModalOpen,
    isSidebarCollapsed, 
    toggleSidebarCollapse,
    toolConfigs,
    fetchToolConfigs
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [walletsExpanded, setWalletsExpanded] = useState(false);
  const [activeTasksCount, setActiveTasksCount] = useState<number>(0);

  const notifRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);

  const toolCategories = [
    {
      id: "audio",
      labelEn: "Audio Studio",
      labelAr: "استوديو الصوت",
      icon: FileAudio,
      accent: "emerald",
      accentBg: "bg-emerald-500/10",
      accentText: "text-emerald-400",
      accentBorder: "border-emerald-500/30",
      accentGlow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
      tools: [
        {
          id: "text-to-voice",
          href: "/tools/text-to-voice",
          icon: Mic,
          labelEn: "Text to Voice",
          labelAr: "تحويل النص لصوت",
          color: "text-emerald-400",
          activeBg: "bg-gradient-to-r from-emerald-600/30 to-teal-600/10",
          activeBorder: "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]",
          dotColor: "bg-emerald-400"
        },
        {
          id: "voice-to-text",
          href: "/tools/voice-to-text",
          icon: FileAudio,
          labelEn: "Voice to Text",
          labelAr: "تحويل الصوت لنص",
          color: "text-teal-400",
          activeBg: "bg-gradient-to-r from-teal-600/30 to-emerald-600/10",
          activeBorder: "border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.25)]",
          dotColor: "bg-teal-400"
        }
      ]
    },
    {
      id: "image",
      labelEn: "Image Studio",
      labelAr: "استوديو الصور",
      icon: ImageIcon,
      accent: "amber",
      accentBg: "bg-amber-500/10",
      accentText: "text-amber-400",
      accentBorder: "border-amber-500/30",
      accentGlow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      tools: [
        {
          id: "text-to-image",
          href: "/tools/text-to-image",
          icon: ImageIcon,
          labelEn: "Text to Image",
          labelAr: "تحويل النص لصورة",
          color: "text-amber-400",
          activeBg: "bg-gradient-to-r from-amber-600/30 to-orange-600/10",
          activeBorder: "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]",
          dotColor: "bg-amber-400"
        }
      ]
    },
    {
      id: "video",
      labelEn: "Video Studio",
      labelAr: "استوديو الفيديو",
      icon: Video,
      accent: "violet",
      accentBg: "bg-violet-500/10",
      accentText: "text-violet-400",
      accentBorder: "border-violet-500/30",
      accentGlow: "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
      tools: [
        {
          id: "text-to-video",
          href: "/tools/text-to-video",
          icon: Film,
          labelEn: "Text to Video",
          labelAr: "تحويل النص لفيديو",
          color: "text-violet-400",
          activeBg: "bg-gradient-to-r from-violet-600/30 to-fuchsia-600/10",
          activeBorder: "border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.25)]",
          dotColor: "bg-violet-400"
        },
        {
          id: "image-to-video",
          href: "/tools/image-to-video",
          icon: Film,
          labelEn: "Image to Video",
          labelAr: "تحويل الصورة لفيديو",
          color: "text-blue-400",
          activeBg: "bg-gradient-to-r from-blue-600/30 to-indigo-600/10",
          activeBorder: "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.25)]",
          dotColor: "bg-blue-400"
        },
        {
          id: "reference-to-video",
          href: "/tools/reference-to-video",
          icon: Layers,
          labelEn: "Reference to Video",
          labelAr: "صور مرجعية لفيديو",
          color: "text-indigo-400",
          activeBg: "bg-gradient-to-r from-indigo-600/30 to-cyan-600/10",
          activeBorder: "border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.25)]",
          dotColor: "bg-indigo-400"
        },
        {
          id: "advanced-lip-sync",
          href: "/tools/advanced-lip-sync",
          icon: Video,
          labelEn: "Lip Sync Studio",
          labelAr: "مزامنة الشفاه (متقدم)",
          color: "text-fuchsia-400",
          activeBg: "bg-gradient-to-r from-fuchsia-600/30 to-pink-600/10",
          activeBorder: "border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.25)]",
          dotColor: "bg-fuchsia-400"
        },
        {
          id: "motion-control",
          href: "/tools/motion-control",
          icon: Video,
          labelEn: "Motion Transfer",
          labelAr: "نسخ والتحكم بالحركة",
          color: "text-cyan-400",
          activeBg: "bg-gradient-to-r from-cyan-600/30 to-blue-600/10",
          activeBorder: "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]",
          dotColor: "bg-cyan-400"
        }
      ]
    }
  ];

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    video: true,
    image: true,
    audio: true
  });

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  // Fetch active history tasks for live queue counter
  const checkActiveTasks = () => {
    if (!user) return;
    api.get('/api/history')
      .then(res => {
        if (Array.isArray(res.data)) {
          const active = res.data.filter((h: any) => h.status === 'pending' || h.status === 'processing');
          setActiveTasksCount(active.length);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!toolConfigs) {
      fetchToolConfigs();
    }

    checkActiveTasks();
    const interval = setInterval(checkActiveTasks, 10000);
    return () => clearInterval(interval);
  }, [user, toolConfigs, fetchToolConfigs]);

  const [notifications, setNotifications] = useState<Array<{ id: number, title: string, message: string, type: string, url: string, time: Date }>>([]);

  const sanitizeNotifUrl = (url: string): string => {
    if (!url) return '/';
    try {
      let path = url;
      if (/^https?:\/\//i.test(url)) {
        path = new URL(url).pathname;
      }
      path = path.replace(/^\/(ar|en)(\/|$)/, '/');
      if (!path.startsWith('/')) path = '/' + path;
      return path || '/';
    } catch {
      return '/';
    }
  };

  useEffect(() => {
    signalRNotificationService.startConnection();
    signalRNotificationService.onNotification((title, message, type, url) => {
      setNotifications(prev => [{ id: Date.now(), title, message, type, url, time: new Date() }, ...prev]);
      setHasUnread(true);
      checkActiveTasks();
    });

    signalRNotificationService.onWalletUpdate(async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch updated wallet details", err);
      }
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (walletRef.current && !walletRef.current.contains(e.target as Node)) {
        setWalletsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      signalRNotificationService.stopConnection();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalCredits = (user?.standardCredits || 0) + (user?.premiumCredits || 0);

  return (
    <>
      {/* Mobile Floating Toggle */}
      <div className="lg:hidden fixed bottom-6 z-[60]" style={{ [isRtl ? 'right' : 'left']: '1.5rem' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-13 h-13 p-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-900/50 flex items-center justify-center hover:opacity-90 transition-transform active:scale-95"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Main Container */}
      <div
        className={`fixed top-0 bottom-0 z-[60] lg:z-10 bg-[#080112]/95 lg:bg-[#070110] backdrop-blur-2xl transition-all duration-300 flex flex-col border-white/5
          ${isRtl ? 'right-0 border-l' : 'left-0 border-r'}
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}
          ${isOpen ? 'translate-x-0 !w-72' : (isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
        `}
      >
        {/* ========================================================================= */}
        {/* 1. Top Header: Icons Bar (Profile, Home, History)                         */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between px-3.5 py-4 border-b border-white/5" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-1.5">
            {user && (
              <Link href="/profile" className="flex items-center group shrink-0" title={user.fullName || user.email}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-900/30 group-hover:scale-105 transition-transform">
                  <span className="text-white text-xs font-black">
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </Link>
            )}
            
            {(!isSidebarCollapsed || isOpen) && (
              <>
                <Link href="/" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all group shrink-0" title={isRtl ? "الرئيسية" : "Home"}>
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </Link>
                <Link href="/history" className="relative w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all group shrink-0" title={isRtl ? "سجل العمليات" : "History"}>
                  <History className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {activeTasksCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)] border-2 border-[#070110]" />
                  )}
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Desktop Collapse / Expand Button */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center text-white/50 hover:text-white transition-all"
              title={isSidebarCollapsed ? (isRtl ? "توسيع القائمة" : "Expand Sidebar") : (isRtl ? "تصغير القائمة" : "Collapse Sidebar")}
            >
              {isRtl ? (
                isSidebarCollapsed ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />
              ) : (
                isSidebarCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />
              )}
            </button>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotificationsOpen(!notificationsOpen); setHasUnread(false); }}
                className="relative w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                title={isRtl ? 'الإشعارات' : 'Notifications'}
              >
                <Bell className="w-3.5 h-3.5" />
                {hasUnread && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute top-full mt-2 w-72 bg-[#0d001a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden ${isRtl ? 'left-0' : 'right-0'}`}
                  >
                    <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                      <h3 className="font-bold text-xs text-white">{isRtl ? 'الإشعارات' : 'Notifications'}</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-white/40 text-xs">
                          {isRtl ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <Link href={sanitizeNotifUrl(notif.url)} key={notif.id} onClick={() => setNotificationsOpen(false)}>
                            <div className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                              <div className="flex items-start gap-2">
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'error' ? 'bg-red-500' : 'bg-violet-500'}`} />
                                <div>
                                  <h4 className="text-xs font-semibold text-white/90 group-hover:text-white">{notif.title}</h4>
                                  <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">{notif.message}</p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile close */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. Compact Wallet Card                                                    */}
        {/* ========================================================================= */}
        {user && (
          <div className="px-3 py-3 border-b border-white/5" dir={isRtl ? 'rtl' : 'ltr'}>
            {!isSidebarCollapsed || isOpen ? (
              <div className="relative" ref={walletRef}>
                <div
                  onClick={() => setWalletsExpanded(!walletsExpanded)}
                  className="p-2 rounded-xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-violet-500/40 shadow-inner cursor-pointer transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-white/40 uppercase tracking-wider leading-none mb-1">{isRtl ? "الرصيد" : "Credits"}</span>
                      <span className="text-sm font-black text-amber-300 font-mono leading-none">
                        {totalCredits.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 hover:from-violet-600/50 hover:to-fuchsia-600/50 text-violet-200 border border-violet-500/30 px-2 py-1.5 rounded-md font-bold flex items-center gap-1 transition-all"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-violet-300" />
                    <span>{isRtl ? "ترقية" : "Upgrade"}</span>
                  </Link>
                </div>

                {/* Expanded Wallet Breakdown */}
                <AnimatePresence>
                  {walletsExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-[#0c0218] border border-white/10 rounded-xl space-y-1.5 text-xs shadow-xl z-10"
                    >
                      <div className="flex justify-between items-center px-1 text-white/60">
                        <span>{isRtl ? "رصيد قياسي:" : "Standard Credits:"}</span>
                        <span className="font-bold text-violet-300 font-mono">{Number(user.standardCredits || 0).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center px-1 text-white/60">
                        <span>{isRtl ? "رصيد مميز:" : "Premium Credits:"}</span>
                        <span className="font-bold text-amber-300 font-mono">{Number(user.premiumCredits || 0).toFixed(1)}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Link href="/pricing" title={`${totalCredits} Credits`} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-violet-500/20 border border-white/10 flex items-center justify-center text-amber-300">
                  <Wallet className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. Categorized Studio Tools Navigation                                    */}
        {/* ========================================================================= */}
        <div className="p-3 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
          {toolCategories.map((category) => {
            const isExpanded = expandedCategories[category.id];
            const CategoryIcon = category.icon;

            return (
              <div key={category.id} className="space-y-1">
                {/* Category Header */}
                {(!isSidebarCollapsed || isOpen) ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full px-2 py-1 text-white/40 hover:text-white/80 transition-colors group text-start"
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon className={`w-3.5 h-3.5 ${category.accentText}`} />
                      <span className="font-bold text-[11px] uppercase tracking-wider text-white/60">
                        {isRtl ? category.labelAr : category.labelEn}
                      </span>
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <div className="h-px bg-white/5 my-2" />
                )}

                {/* Tools Items */}
                <AnimatePresence initial={false}>
                  {(isExpanded || (isSidebarCollapsed && !isOpen)) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-col gap-1 overflow-hidden"
                    >
                      {category.tools.map((tool) => {
                        const isActive = pathname.includes(tool.id);
                        const Icon = tool.icon;
                        const status = resolveToolStatus(tool.id, toolConfigs).status;

                        return (
                          <Link
                            key={tool.id}
                            href={tool.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all group border relative overflow-hidden ${
                              isActive
                                ? `${tool.activeBg} text-white ${tool.activeBorder}`
                                : 'text-white/50 hover:bg-white/[0.05] hover:text-white border-transparent'
                            } ${isSidebarCollapsed && !isOpen ? 'justify-center !px-0' : ''}`}
                            dir={isRtl ? 'rtl' : 'ltr'}
                            title={isRtl ? tool.labelAr : tool.labelEn}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isActive ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/8'
                            }`}>
                              <Icon className={`w-4 h-4 ${isActive ? tool.color : 'text-white/40 group-hover:text-white/70'}`} />
                            </div>

                            {(!isSidebarCollapsed || isOpen) && (
                              <span className="font-medium text-xs leading-tight flex-1 truncate">
                                {isRtl ? tool.labelAr : tool.labelEn}
                              </span>
                            )}

                            {/* Status Badges */}
                            {(!isSidebarCollapsed || isOpen) && (
                              <>
                                {status === 'maintenance' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 whitespace-nowrap">
                                    {isRtl ? 'صيانة' : 'Maint.'}
                                  </span>
                                )}
                                {status === 'coming_soon' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 whitespace-nowrap">
                                    {isRtl ? 'قريباً' : 'Soon'}
                                  </span>
                                )}
                              </>
                            )}

                            {/* Active Glowing Dot */}
                            {isActive && status === 'active' && (
                              <div className={`w-1.5 h-1.5 rounded-full ${tool.dotColor} shadow-[0_0_8px_currentColor] ${
                                isSidebarCollapsed && !isOpen ? 'absolute top-1.5 right-1.5' : (isRtl ? 'mr-auto' : 'ml-auto')
                              }`} />
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 4. Bottom Footer: Logout                                                  */}
        {/* ========================================================================= */}
        <div className="p-3 border-t border-white/5 flex flex-col gap-1.5" dir={isRtl ? 'rtl' : 'ltr'}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group ${
              isSidebarCollapsed && !isOpen ? 'justify-center !px-0' : ''
            }`}
            title={isRtl ? 'تسجيل الخروج' : 'Logout'}
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-500/10 flex items-center justify-center shrink-0 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            {(!isSidebarCollapsed || isOpen) && (
              <span className="font-medium text-xs">{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
            )}
          </button>
        </div>

      </div>

    </>
  );
}
