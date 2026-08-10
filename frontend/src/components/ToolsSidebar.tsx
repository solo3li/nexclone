"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "../i18n/routing";
import { Mic, FileAudio, Video, Menu, X, Home, LogOut, Wallet, ChevronDown, Bell, Zap, Settings2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import api from "../utils/api";
import { signalRNotificationService } from "../../lib/signalr-client";

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
      labelEn: "Avatar to Video",
      labelAr: "افتار الى فيديو",
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
    },
    {
      id: "motion-control",
      href: "/tools/motion-control",
      icon: Video,
      labelEn: "Motion Transfer",
      labelAr: "نسخ الحركة",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      activeBorder: "border-cyan-500/30",
    }
  ];

  const { user, setUser, logout } = useAppStore();

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch { }
    logout();
    router.push('/login');
  };

  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [walletsExpanded, setWalletsExpanded] = useState(false);
  const [toolConfigs, setToolConfigs] = useState<any>(null);

  useEffect(() => {
    // Fetch tool configs for badges
    api.get('/api/platform/tools-config')
      .then(res => setToolConfigs(res.data))
      .catch(err => console.error("Failed to fetch tool configs:", err));
  }, []);

  const [notifications, setNotifications] = useState<Array<{ id: number, title: string, message: string, type: string, url: string, time: Date }>>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);

  /**
   * Sanitize a notification URL from the backend into a clean relative path
   * that next-intl's router can navigate to correctly.
   *
   * The backend may send:
   *   - A full URL:           "http://example.com/ar/history/123"
   *   - A locale-prefixed path:  "/ar/history/123"  or  "/en/history/123"
   *   - A clean relative path:  "/history/123"
   *   - An empty / null value
   */
  const sanitizeNotifUrl = (url: string): string => {
    if (!url) return '/';
    try {
      // Strip domain if it's a full URL
      let path = url;
      if (/^https?:\/\//i.test(url)) {
        path = new URL(url).pathname;
      }
      // Remove leading locale segment  (/ar/... or /en/...)
      path = path.replace(/^\/(ar|en)(\/|$)/, '/');
      // Ensure it starts with /
      if (!path.startsWith('/')) path = '/' + path;
      return path || '/';
    } catch {
      return '/';
    }
  };

  useEffect(() => {
    // Start SignalR
    signalRNotificationService.startConnection();
    signalRNotificationService.onNotification((title, message, type, url) => {
      setNotifications(prev => [{ id: Date.now(), title, message, type, url, time: new Date() }, ...prev]);
      setHasUnread(true);
    });

    signalRNotificationService.onWalletUpdate(async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch updated wallet details", err);
      }
    });

    // Click outside to close notifications
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

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotificationsOpen(!notificationsOpen); setHasUnread(false); }}
                className="relative w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                title={isRtl ? 'الإشعارات' : 'Notifications'}
              >
                <Bell className="w-4 h-4" />
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
                    className={`absolute top-full mt-2 w-72 bg-[#0d001a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden ${isRtl ? 'left-0' : 'right-0'}`}
                  >
                    <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                      <h3 className="font-bold text-sm text-white">{isRtl ? 'الإشعارات' : 'Notifications'}</h3>
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
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'error' ? 'bg-red-500' : 'bg-fuchsia-500'}`} />
                                <div>
                                  <h4 className="text-sm font-semibold text-white/90 group-hover:text-white">{notif.title}</h4>
                                  <p className="text-xs text-white/50 mt-1 leading-relaxed">{notif.message}</p>
                                  <span className="text-[10px] text-white/30 mt-2 block">
                                    {notif.time.toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
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
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Credits Badge */}
        {user && (
          <div className="px-4 py-3 border-b border-white/5" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex flex-col gap-2">
              <Link
                href="/profile"
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-fuchsia-900/20">
                    <span className="text-white text-xs font-bold">
                      {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-white/80 group-hover:text-white text-xs font-semibold truncate max-w-[90px] transition-colors">
                    {user.fullName || user.email}
                  </span>
                </div>
              </Link>
            
            {/* Credits / Wallet */}
            <div className="relative" ref={walletRef}>
              <div 
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group"
                onClick={() => setWalletsExpanded(!walletsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Zap className="w-4 h-4 text-fuchsia-400" />
                  </div>
                  <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                    {isRtl ? 'الرصيد' : 'Credits'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 group-hover:bg-fuchsia-500/20 transition-colors">
                    <Wallet className="w-3 h-3 text-fuchsia-400" />
                    <span className="text-fuchsia-300 text-[11px] font-bold">
                      {Number(user.standardCredits || 0).toFixed(0)}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-all duration-300 ${walletsExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              <AnimatePresence>
                {walletsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute bottom-full mb-2 w-full bg-[#0d001a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden ${isRtl ? 'left-0' : 'right-0'}`}
                  >
                    <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                      <h3 className="font-bold text-sm text-white">{isRtl ? 'المحافظ' : 'Wallets'}</h3>
                    </div>
                    <div className="flex flex-col gap-1.5 p-2 max-h-80 overflow-y-auto">
                        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/wallet relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/0 to-fuchsia-500/[0.05] opacity-0 group-hover/wallet:opacity-100 transition-opacity" />
                          <div className="flex items-center gap-2 relative z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/50 group-hover/wallet:bg-fuchsia-400 group-hover/wallet:shadow-[0_0_8px_rgba(232,121,249,0.8)] transition-all" />
                            <span className="text-white/60 group-hover/wallet:text-white/90 text-[11px] font-medium tracking-wide transition-colors">{isRtl ? 'الرصيد العادي' : 'Standard Credits'}</span>
                          </div>
                          <div className="flex items-center gap-1 relative z-10">
                            <span className="text-white/90 group-hover/wallet:text-white text-[12px] font-bold transition-colors">{Number(user.standardCredits || 0).toFixed(1)}</span>
                            <span className="text-fuchsia-400/50 text-[9px] font-bold uppercase tracking-wider">CR</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/wallet relative overflow-hidden mt-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/[0.05] opacity-0 group-hover/wallet:opacity-100 transition-opacity" />
                          <div className="flex items-center gap-2 relative z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover/wallet:bg-amber-400 group-hover/wallet:shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all" />
                            <span className="text-white/60 group-hover/wallet:text-white/90 text-[11px] font-medium tracking-wide transition-colors">{isRtl ? 'الرصيد المميز' : 'Premium Credits'}</span>
                          </div>
                          <div className="flex items-center gap-1 relative z-10">
                            <span className="text-white/90 group-hover/wallet:text-white text-[12px] font-bold transition-colors">{Number(user.premiumCredits || 0).toFixed(1)}</span>
                            <span className="text-amber-400/50 text-[9px] font-bold uppercase tracking-wider">CR</span>
                          </div>
                        </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              
              // Determine status
              let status = 'active';
              if (toolConfigs) {
                const routeMapping: Record<string, string[]> = {
                  "image-to-video": ["kling_avatar_image2video"],
                  "advanced-lip-sync": ["kling_advanced_lip_sync", "vidu_advanced_lip_sync"],
                  "text-to-voice": ["text-to-voice"],
                  "voice-to-text": ["voice-to-text"],
                  "motion-control": ["motion-control"]
                };
                let mappedKeys = routeMapping[tool.id];
                if (!mappedKeys) {
                  const fuzzyKey = Object.keys(toolConfigs).find(k => k.includes(tool.id.replace(/-/g, '_')));
                  if (fuzzyKey) mappedKeys = [fuzzyKey];
                }
                if (mappedKeys && mappedKeys.length > 0) {
                  const relevantConfigs = mappedKeys.map(k => toolConfigs[k]).filter(Boolean);
                  if (relevantConfigs.length > 0) {
                    if (relevantConfigs.some(c => c.isMaintenanceMode)) status = 'maintenance';
                    else if (relevantConfigs.some(c => c.isComingSoon)) status = 'coming_soon';
                  }
                }
              }

              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group border relative overflow-hidden ${isActive
                      ? `bg-white/8 text-white ${tool.activeBorder}`
                      : 'text-white/50 hover:bg-white/5 hover:text-white border-transparent'
                    }`}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? tool.bg : 'bg-white/5 group-hover:bg-white/8'
                    }`}>
                    <Icon className={`w-4.5 h-4.5 ${isActive ? tool.color : 'text-white/40 group-hover:text-white/70'}`} />
                  </div>
                  <span className="font-medium text-sm leading-tight flex-1">
                    {isRtl ? tool.labelAr : tool.labelEn}
                  </span>
                  
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

                  {isActive && status === 'active' && (
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
