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
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const isAr = language === "ar";

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setToolsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toolsActive = ["/voice-to-text", "/text-to-voice", "/tools"].includes(pathname);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--border-glass)]"
      style={{
        background: "rgba(8,11,20,0.80)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-5 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 font-bold text-[17px] text-[var(--text-primary)] tracking-tight hover:opacity-90 transition-opacity">
          <img src="/static/home/img/logo.png" alt="NexMedia" className="w-7 h-7 object-contain" />
          NexMedia
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">

          {/* Tools dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setToolsOpen((v) => !v)}
              className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-150
                ${toolsActive || toolsOpen
                  ? "text-[var(--brand-bright)] bg-[var(--brand-dim)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]"
                }`}
            >
              {isAr ? "الأدوات" : "Tools"}
              <svg className={`w-3 h-3 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {toolsOpen && (
              <div
                className={`absolute top-[calc(100%+10px)] w-56 rounded-2xl py-1.5 z-50
                  ${isAr ? "right-0" : "left-0"}`}
                style={{
                  background: "rgba(13,17,32,0.96)",
                  border: "1px solid var(--border-glass)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px var(--border-glass)",
                }}
              >
                <DropItem href="/voice-to-text" label={isAr ? "صوت إلى نص" : "Voice to Text"} active={pathname === "/voice-to-text"} onClick={() => setToolsOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4 text-emerald-400">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  </svg>
                </DropItem>
                <DropItem href="/text-to-voice" label={isAr ? "نص إلى صوت" : "Text to Voice"} active={pathname === "/text-to-voice"} onClick={() => setToolsOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4 text-violet-400">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                </DropItem>
                <div className="my-1.5 mx-3 border-t border-[var(--border-glass)]" />
                <DropItem href="/tools" label={isAr ? "كل الأدوات" : "All tools"} active={pathname === "/tools"} onClick={() => setToolsOpen(false)} muted>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4 text-[var(--text-tertiary)]">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </DropItem>
              </div>
            )}
          </div>

          <div className="divider" />

          <NavLink href="/pricing"  label={isAr ? "الخطط"       : "Plans"}    active={pathname === "/pricing"} />
          <NavLink href="/history"  label={isAr ? "السجل"       : "History"}  active={pathname === "/history"} />
          <NavLink href="/settings" label={isAr ? "الإعدادات"   : "Settings"} active={pathname === "/settings"} />
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={toggleLanguage}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            style={{ background: "var(--bg-glass)", border: "1px solid var(--border-glass)" }}
          >
            {isAr ? "EN" : "ع"}
          </button>

          {isAuthenticated ? (
            <button onClick={logout} className="btn-brand hidden md:flex text-sm">
              {isAr ? "خروج" : "Logout"}
            </button>
          ) : (
            <Link href="/login" className="btn-brand hidden md:flex text-sm">
              {isAr ? "تسجيل الدخول" : "Login"}
            </Link>
          )}

          <button className="md:hidden icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4.5 h-4.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-150
        ${active
          ? "text-[var(--brand-bright)] bg-[var(--brand-dim)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]"
        }`}
    >
      {label}
    </Link>
  );
}

function DropItem({ href, label, active, muted, children, onClick }: {
  href: string; label: string; active?: boolean; muted?: boolean; children: React.ReactNode; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 mx-1.5 rounded-xl text-sm transition-all
        ${active
          ? "bg-[var(--brand-dim)] text-[var(--brand-bright)]"
          : muted
            ? "text-[var(--text-tertiary)] hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-secondary)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]"
        } font-medium`}
    >
      <span className="shrink-0 w-4 h-4 flex items-center justify-center">{children}</span>
      {label}
    </Link>
  );
}
