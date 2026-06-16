"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "../store/useLanguageStore";
import { useAuthStore } from "../store/useAuthStore";

export default function TopNavbar() {
  const pathname   = usePathname();
  const { language, toggleLanguage } = useLanguageStore();
  const { isAuthenticated, logout }  = useAuthStore();
  const [toolsOpen,  setToolsOpen]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef  = useRef<HTMLDivElement>(null);
  const isAr     = language === "ar";

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setToolsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isToolsActive = ["/voice-to-text", "/text-to-voice", "/tools"].includes(pathname);

  return (
    <>
      {/* ─── Main bar ─── */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(8,11,20,0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="max-w-[1400px] mx-auto px-6"
          style={{ height: "60px", display: "flex", alignItems: "center", gap: "32px" }}
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2.5 font-bold text-[17px] tracking-tight"
            style={{ color: "var(--text-primary)", textDecoration: "none" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--brand) 0%, #818CF8 100%)",
                boxShadow: "0 0 16px var(--brand-glow)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
              </svg>
            </div>
            <span style={{ letterSpacing: "-0.01em" }}>NexMedia</span>
          </Link>

          {/* ── Separator ── */}
          <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

          {/* ── Center Nav ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1">

            {/* Tools Dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setToolsOpen(v => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.15s ease",
                  background: (isToolsActive || toolsOpen) ? "var(--brand-dim)" : "transparent",
                  color: (isToolsActive || toolsOpen) ? "var(--brand-bright)" : "var(--text-secondary)",
                }}
                onMouseEnter={e => {
                  if (!isToolsActive && !toolsOpen)
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={e => {
                  if (!isToolsActive && !toolsOpen)
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                }}
              >
                <ToolsIcon active={isToolsActive || toolsOpen} />
                {isAr ? "الأدوات" : "Tools"}
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" className="w-3 h-3"
                  style={{ transition: "transform 0.2s", transform: toolsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown panel */}
              {toolsOpen && (
                <div
                  className={`absolute top-[calc(100%+10px)] w-60 py-2 z-50 ${isAr ? "right-0" : "left-0"}`}
                  style={{
                    background: "rgba(10,13,24,0.97)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: "16px",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Section label */}
                  <p style={{ padding: "4px 16px 8px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)" }}>
                    {isAr ? "الأدوات المتاحة" : "Available tools"}
                  </p>

                  <DropItem href="/voice-to-text" active={pathname === "/voice-to-text"} onClick={() => setToolsOpen(false)}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {isAr ? "صوت إلى نص" : "Voice to Text"}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "1px" }}>
                        {isAr ? "نسخ صوتي دقيق" : "Accurate transcription"}
                      </p>
                    </div>
                  </DropItem>

                  <DropItem href="/text-to-voice" active={pathname === "/text-to-voice"} onClick={() => setToolsOpen(false)}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(167,139,250,0.15)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {isAr ? "نص إلى صوت" : "Text to Voice"}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "1px" }}>
                        {isAr ? "أصوات طبيعية بالذكاء" : "Neural AI voices"}
                      </p>
                    </div>
                  </DropItem>

                  <div style={{ margin: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }} />

                  <DropItem href="/tools" active={pathname === "/tools"} onClick={() => setToolsOpen(false)} subtle>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5">
                        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
                      {isAr ? "عرض كل الأدوات" : "Browse all tools"}
                    </p>
                  </DropItem>
                </div>
              )}
            </div>

            <NavLink href="/pricing"  label={isAr ? "الخطط"     : "Plans"}    active={pathname === "/pricing"} />
            <NavLink href="/history"  label={isAr ? "السجل"     : "History"}  active={pathname === "/history"} />
            <NavLink href="/settings" label={isAr ? "الإعدادات" : "Settings"} active={pathname === "/settings"} />
          </nav>

          {/* Spacer on mobile */}
          <div className="flex-1 md:hidden" />

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              title={isAr ? "Switch to English" : "التبديل للعربية"}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.10)";
              }}
            >
              {isAr ? "EN" : "ع"}
            </button>

            {/* Divider */}
            <div className="hidden md:block" style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.08)" }} />

            {/* CTA */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden md:flex"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 18px",
                  borderRadius: "10px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: "1px solid var(--brand)",
                  background: "var(--brand)",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  boxShadow: "0 4px 18px rgba(99,102,241,0.30)",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-bright)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(99,102,241,0.45)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--brand)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 18px rgba(99,102,241,0.30)";
                }}
              >
                {isAr ? "خروج" : "Logout"}
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center"
                style={{
                  gap: "7px",
                  padding: "8px 18px",
                  borderRadius: "10px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  border: "1px solid var(--brand)",
                  background: "var(--brand)",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  boxShadow: "0 4px 18px rgba(99,102,241,0.30)",
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                }}
              >
                {isAr ? "تسجيل الدخول" : "Sign in"}
              </Link>
            )}

            {/* Mobile burger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(v => !v)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.10)",
                background: mobileOpen ? "var(--brand-dim)" : "rgba(255,255,255,0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <span style={{ width: "16px", height: "1.5px", background: mobileOpen ? "var(--brand-bright)" : "var(--text-secondary)", borderRadius: "2px", transition: "all 0.2s", transform: mobileOpen ? "rotate(45deg) translate(4px,4px)" : "none" }} />
              <span style={{ width: "16px", height: "1.5px", background: mobileOpen ? "transparent" : "var(--text-secondary)", borderRadius: "2px", transition: "all 0.2s" }} />
              <span style={{ width: "16px", height: "1.5px", background: mobileOpen ? "var(--brand-bright)" : "var(--text-secondary)", borderRadius: "2px", transition: "all 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "12px 16px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
            dir={isAr ? "rtl" : "ltr"}
          >
            {[
              { href: "/tools",    label: isAr ? "الأدوات"     : "Tools" },
              { href: "/pricing",  label: isAr ? "الخطط"       : "Plans" },
              { href: "/history",  label: isAr ? "السجل"       : "History" },
              { href: "/settings", label: isAr ? "الإعدادات"   : "Settings" },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: pathname === item.href ? "var(--brand-bright)" : "var(--text-secondary)",
                  background: pathname === item.href ? "var(--brand-dim)" : "transparent",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                marginTop: "8px",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#fff",
                background: "var(--brand)",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              {isAr ? "تسجيل الدخول" : "Sign in"}
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

/* ── Nav link ── */
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "7px 14px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 600,
        color: active ? "var(--brand-bright)" : "var(--text-secondary)",
        background: active ? "var(--brand-dim)" : "transparent",
        textDecoration: "none",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
        }
      }}
    >
      {label}
    </Link>
  );
}

/* ── Dropdown item ── */
function DropItem({
  href, active, subtle, onClick, children,
}: {
  href: string; active?: boolean; subtle?: boolean; onClick?: () => void; children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 14px",
        marginInline: "6px",
        borderRadius: "10px",
        cursor: "pointer",
        textDecoration: "none",
        background: active ? "var(--brand-dim)" : "transparent",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      }}
    >
      {children}
    </Link>
  );
}

/* ── Tools icon ── */
function ToolsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={active ? "var(--brand-bright)" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4 shrink-0">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}
