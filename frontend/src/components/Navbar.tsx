"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Menu, 
  X, 
  Globe, 
  ChevronDown, 
  Mic, 
  FileAudio, 
  Video, 
  Smile, 
  Film, 
  Layers, 
  Image as ImageIcon, 
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "../i18n/routing";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/api";
import { resolveToolStatus } from "../utils/toolStatus";
import { FreezeWarningBanner } from "./FreezeWarningBanner";

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-white/80 hover:text-white transition-colors px-1 sm:px-2"
    >
      <Globe className="w-4 h-4" />
      <span className="text-xs sm:text-sm font-medium uppercase mt-0.5">{locale === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  );
}

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, setUser, logout, setLogoutModalOpen, toolConfigs, fetchToolConfigs } = useAppStore();
  const { isAuthenticated, isInitializing } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!isInitializing) {
      setInitializing(false);
    }
    
    // Fetch tool configs for badges
    if (!toolConfigs) {
      fetchToolConfigs();
    }
  }, [isAuthenticated, setUser, toolConfigs, fetchToolConfigs]);

  const tools = [
    {
      id: "text-to-video",
      href: "/tools/text-to-video",
      icon: Film,
      labelEn: "Text to Video",
      labelAr: "تحويل النص لفيديو",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      id: "image-to-video",
      href: "/tools/image-to-video",
      icon: Video,
      labelEn: "Image to Video",
      labelAr: "تحويل الصورة لفيديو",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      id: "reference-to-video",
      href: "/tools/reference-to-video",
      icon: Layers,
      labelEn: "Reference to Video",
      labelAr: "صور مرجعية لفيديو",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      id: "advanced-lip-sync",
      href: "/tools/advanced-lip-sync",
      icon: Smile,
      labelEn: "Advanced Lip-Sync",
      labelAr: "مزامنة الشفاه",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      id: "motion-control",
      href: "/tools/motion-control",
      icon: Video,
      labelEn: "Motion Transfer",
      labelAr: "نسخ الحركة",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      id: "text-to-image",
      href: "/tools/text-to-image",
      icon: ImageIcon,
      labelEn: "Text to Image",
      labelAr: "تحويل النص لصورة",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      id: "text-to-voice",
      href: "/tools/text-to-voice",
      icon: Volume2,
      labelEn: "Text to Voice",
      labelAr: "تحويل النص لصوت",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      id: "voice-to-text",
      href: "/tools/voice-to-text",
      icon: FileAudio,
      labelEn: "Voice to Text",
      labelAr: "تحويل الصوت لنص",
      color: "text-teal-400",
      bg: "bg-teal-500/10",
    }
  ];

  const getToolStatus = (id: string) => {
    return resolveToolStatus(id, toolConfigs).status;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex flex-col ${
        scrolled
          ? "bg-[#0a0015]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-900/20"
          : "bg-transparent"
      }`}
    >
      <FreezeWarningBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 md:h-20" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img src="/images/logo.png" alt={t('logo')} className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/60 transition-all duration-300" />
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 opacity-0 group-hover:opacity-30 blur-md transition-all duration-300" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              <span className="text-violet-400">Nex</span>Media
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 relative group">
              {t('home')}
              <span className={`absolute -bottom-0.5 ${locale === 'ar' ? 'right-0' : 'left-0'} w-full h-px bg-gradient-to-r from-violet-500 to-fuchsia-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${locale === 'ar' ? 'origin-right' : 'origin-left'}`} />
            </Link>
            
            <Link href="/blog" className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 relative group">
              {locale === 'ar' ? 'المدونة' : 'Blog'}
              <span className={`absolute -bottom-0.5 ${locale === 'ar' ? 'right-0' : 'left-0'} w-full h-px bg-gradient-to-r from-violet-500 to-fuchsia-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${locale === 'ar' ? 'origin-right' : 'origin-left'}`} />
            </Link>
            
            <div className="relative group">
              <button className="flex items-center gap-1 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 py-2">
                {t('tools')}
                <ChevronDown className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Dropdown 2-Column Mega Menu */}
              <div 
                className="absolute top-full mt-2 w-[480px] rounded-2xl bg-[#0a0015]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-950/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden p-2 z-50" 
                style={{ [locale === 'ar' ? 'right' : 'left']: '-2rem' }}
              >
                <div className="grid grid-cols-2 gap-1.5 p-1">
                  {tools.map(tool => {
                    const status = getToolStatus(tool.id);
                    const Icon = tool.icon;
                    return (
                      <Link 
                        key={tool.id} 
                        href={tool.href} 
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5"
                      >
                        <div className={`w-8 h-8 rounded-lg ${tool.bg} flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform`}>
                          <Icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-semibold text-white/90 truncate group-hover/item:text-white">
                            {locale === 'ar' ? tool.labelAr : tool.labelEn}
                          </span>
                        </div>
                        {status === 'maintenance' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 whitespace-nowrap">
                            {locale === 'ar' ? 'صيانة' : 'Maint.'}
                          </span>
                        )}
                        {status === 'coming_soon' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 whitespace-nowrap">
                            {locale === 'ar' ? 'قريباً' : 'Soon'}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Bottom View All Tools Link */}
                <div className="mt-1 pt-2 border-t border-white/5 px-2 pb-1">
                  <Link 
                    href="/tools" 
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 hover:text-violet-200 text-xs font-semibold transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{locale === 'ar' ? 'استعراض كل الأدوات في الاستوديو' : 'View All Tools Studio'}</span>
                    </span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/pricing" className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 relative group">
              {t('pricing')}
              <span className={`absolute -bottom-0.5 ${locale === 'ar' ? 'right-0' : 'left-0'} w-full h-px bg-gradient-to-r from-violet-500 to-fuchsia-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${locale === 'ar' ? 'origin-right' : 'origin-left'}`} />
            </Link>
          </div>

          {/* CTA & Lang */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white/80 hidden lg:block">
                  {user?.fullName || user?.email}
                </span>
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" title={locale === 'ar' ? 'الرصيد' : 'Credits'}>
                  <Zap className="w-4 h-4 text-fuchsia-400" />
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <span className="text-emerald-400" title={locale === 'ar' ? 'الرصيد العادي' : 'Standard Credits'}>
                      {Number(user?.standardCredits || 0).toFixed(0)}
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="text-amber-400" title={locale === 'ar' ? 'الرصيد المميز' : 'Premium Credits'}>
                      {Number(user?.premiumCredits || 0).toFixed(0)}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/affiliate-program"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  {locale === 'ar' ? 'اربح معنا' : 'Earn With Us'}
                </Link>
                <Link
                  href="/profile"
                  className="relative px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 group-hover:from-violet-500 group-hover:to-fuchsia-500 transition-all duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 blur-sm" />
                  </div>
                  <span className="relative">{locale === 'ar' ? 'حسابي' : 'Profile'}</span>
                </Link>
                <button
                  onClick={() => setLogoutModalOpen(true)}
                  className="text-white/60 hover:text-white/90 text-sm font-medium transition-colors cursor-pointer"
                >
                  {locale === 'ar' ? 'خروج' : 'Logout'}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors px-4 py-2"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="relative px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 group-hover:from-violet-500 group-hover:to-fuchsia-500 transition-all duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 blur-sm" />
                  </div>
                  <span className="relative">{t('startNow')}</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2 sm:gap-4">
            {isAuthenticated && user && (
              <Link href="/profile" className="flex items-center gap-1 px-1.5 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" title={locale === 'ar' ? 'الرصيد' : 'Credits'}>
                <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
                <div className="flex items-center gap-1 text-xs font-bold">
                  <span className="text-emerald-400">{Number(user.standardCredits || 0).toFixed(0)}</span>
                  <span className="text-white/20">|</span>
                  <span className="text-amber-400">{Number(user.premiumCredits || 0).toFixed(0)}</span>
                </div>
              </Link>
            )}
            <LanguageSwitcher />
            <button
              className="text-white/80 hover:text-white transition-colors p-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0d0020]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-base font-medium py-2 border-b border-white/5 transition-colors">
                {t('home')}
              </Link>
              <div className="flex flex-col py-2 border-b border-white/5">
                <button 
                  onClick={() => setToolsOpen(!toolsOpen)} 
                  className="flex items-center justify-between px-1 mb-2 text-white/50 hover:text-white/80 transition-colors w-full"
                >
                  <span className="text-xs font-bold uppercase">{t('tools')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${toolsOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {toolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col overflow-hidden"
                    >
                      {tools.map(tool => {
                        const status = getToolStatus(tool.id);
                        const Icon = tool.icon;
                        return (
                          <Link key={tool.id} href={tool.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-2 text-white/80 hover:text-white transition-colors rounded-xl hover:bg-white/5 group/item">
                            <div className={`w-8 h-8 rounded-lg ${tool.bg} flex items-center justify-center shrink-0`}>
                              <Icon className={`w-4 h-4 ${tool.color}`} />
                            </div>
                            <span className="text-sm font-medium flex-1">{locale === 'ar' ? tool.labelAr : tool.labelEn}</span>
                            {status === 'maintenance' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 whitespace-nowrap">
                                {locale === 'ar' ? 'صيانة' : 'Maint.'}
                              </span>
                            )}
                            {status === 'coming_soon' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 whitespace-nowrap">
                                {locale === 'ar' ? 'قريباً' : 'Soon'}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href="/pricing" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-base font-medium py-2 border-b border-white/5 transition-colors">
                {t('pricing')}
              </Link>
              <Link href="/blog" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-base font-medium py-2 border-b border-white/5 transition-colors">
                {locale === 'ar' ? 'المدونة' : 'Blog'}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 w-full text-center py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold"
                  >
                    {locale === 'ar' ? 'حسابي' : 'Profile'}
                  </Link>
                  <button
                    onClick={() => {
                      setLogoutModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="mt-2 w-full text-center py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold"
                  >
                    {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </button>
                </>
              ) : (
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 w-full text-center py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold"
                >
                  {t('startNow')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

