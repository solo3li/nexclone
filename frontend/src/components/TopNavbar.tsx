"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "../store/useLanguageStore";
import { useAuthStore } from "../store/useAuthStore";

export default function TopNavbar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguageStore();
  const { isAuthenticated, logout } = useAuthStore();

  const links = [
    { href: "/voice-to-text", icon: "fa-microphone-alt", labelAr: "صوت لنص", labelEn: "Voice to Text" },
    { href: "/text-to-voice", icon: "fa-wave-square", labelAr: "نص لصوت", labelEn: "Text to Voice" },
    { href: "/history", icon: "fa-history", labelAr: "السجل", labelEn: "History" },
    { href: "/settings", icon: "fa-cog", labelAr: "الإعدادات", labelEn: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-bento-card)] border-b border-[var(--color-bento-border)] shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="font-extrabold text-xl text-[var(--color-bento-text)] tracking-tight flex items-center">
            <div className="w-8 h-8 ml-2">
              <img src="/static/home/img/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            NexMedia
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center space-x-2 space-x-reverse text-sm font-bold transition-all px-3 py-2 rounded-lg
                  ${isActive 
                    ? 'text-[var(--color-bento-accent)] bg-blue-500/10' 
                    : 'text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)] hover:bg-[#F0F0F0]'
                  }`}
              >
                <i className={`fas ${link.icon}`}></i>
                <span>{language === 'ar' ? link.labelAr : link.labelEn}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 space-x-reverse">
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-bento-border)] hover:bg-[#F0F0F0] text-[var(--color-bento-text)] font-bold transition-all"
            title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            {language === 'ar' ? 'EN' : 'ع'}
          </button>

          {isAuthenticated ? (
            <button 
              onClick={logout}
              className="hidden md:flex bento-btn-primary px-4 py-2 text-sm"
            >
              {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </button>
          ) : (
            <Link 
              href="/login"
              className="hidden md:flex bento-btn-primary px-4 py-2 text-sm"
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden flex items-center justify-center w-10 h-10 text-[var(--color-bento-text)]">
            <i className="fas fa-bars text-lg"></i>
          </button>
        </div>

      </div>
    </header>
  );
}
