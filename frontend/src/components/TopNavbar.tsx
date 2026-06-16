"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "../store/useLanguageStore";
import { useAuthStore } from "../store/useAuthStore";

export default function TopNavbar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguageStore();
  const { isAuthenticated, logout } = useAuthStore();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAr = language === "ar";

  useEffect(() => {
    function close(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsToolsOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toolsActive =
    pathname.includes("/voice") ||
    pathname.includes("/text") ||
    pathname === "/tools";

  const navLink = (href: string, labelAr: string, labelEn: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-150
          ${active
            ? "text-[var(--color-ink)] bg-[var(--color-surface)]"
            : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
          }`}
      >
        {isAr ? labelAr : labelEn}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 font-bold text-[17px] tracking-tight text-[var(--color-ink)]"
        >
          <img src="/static/home/img/logo.png" alt="NexMedia" className="w-7 h-7 object-contain" />
          NexMedia
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1">

          {/* Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsToolsOpen((v) => !v)}
              className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-150
                ${toolsActive || isToolsOpen
                  ? "text-[var(--color-ink)] bg-[var(--color-surface)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                }`}
            >
              {isAr ? "الأدوات" : "Tools"}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {isToolsOpen && (
              <div
                className={`absolute top-[calc(100%+8px)] w-56 bg-white border border-[var(--color-border)] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] py-1.5 z-50
                  ${isAr ? "right-0" : "left-0"}`}
              >
                <DropdownItem
                  href="/voice-to-text"
                  icon={<MicIcon />}
                  label={isAr ? "الصوت إلى نص" : "Voice to Text"}
                  active={pathname === "/voice-to-text"}
                  onClick={() => setIsToolsOpen(false)}
                />
                <DropdownItem
                  href="/text-to-voice"
                  icon={<WaveIcon />}
                  label={isAr ? "النص إلى صوت" : "Text to Voice"}
                  active={pathname === "/text-to-voice"}
                  onClick={() => setIsToolsOpen(false)}
                />
                <div className="my-1 border-t border-[var(--color-border)]" />
                <DropdownItem
                  href="/tools"
                  icon={<GridIcon />}
                  label={isAr ? "كل الأدوات" : "All Tools"}
                  active={pathname === "/tools"}
                  onClick={() => setIsToolsOpen(false)}
                  subtle
                />
              </div>
            )}
          </div>

          <div className="divider" />

          {navLink("/pricing", "الخطط", "Plans")}
          {navLink("/history", "السجل", "History")}
          {navLink("/settings", "الإعدادات", "Settings")}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleLanguage}
            className="w-9 h-9 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[#D4D4D8] transition-all"
            title={isAr ? "Switch to English" : "التبديل للعربية"}
          >
            {isAr ? "EN" : "ع"}
          </button>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="btn btn-primary text-sm hidden md:flex"
            >
              {isAr ? "خروج" : "Logout"}
            </button>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary text-sm hidden md:flex"
            >
              {isAr ? "تسجيل الدخول" : "Login"}
            </Link>
          )}

          {/* Mobile burger */}
          <button className="md:hidden w-9 h-9 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] rounded-lg hover:bg-[var(--color-surface)] transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ─── Dropdown item ─── */
function DropdownItem({
  href, icon, label, active, onClick, subtle,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  subtle?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 mx-1.5 rounded-lg text-sm transition-all
        ${active
          ? "bg-[var(--color-surface)] text-[var(--color-ink)] font-semibold"
          : subtle
            ? "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
            : "text-[var(--color-ink)] hover:bg-[var(--color-surface)] font-medium"
        }`}
    >
      <span className="w-5 h-5 flex items-center justify-center text-[var(--color-muted)] shrink-0">
        {icon}
      </span>
      {label}
    </Link>
  );
}

/* ─── Inline SVG icons (no deps) ─── */
const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const WaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M2 12h2l3-8 4 16 3-8 2 4 2-4 2 0" />
  </svg>
);
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
