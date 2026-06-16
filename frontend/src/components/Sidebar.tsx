"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const links = [
    { href: "/", label: "Dashboard", icon: "fa-home" },
    { href: "/voice-to-text", label: "Voice AI", icon: "fa-microphone" },
    { href: "/text-to-voice", label: "Speech AI", icon: "fa-volume-up" },
    { href: "/history", label: "History", icon: "fa-history" },
    { href: "/settings", label: "Settings", icon: "fa-cog" },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 h-screen w-64 border-r border-[var(--color-bento-border)] bg-[var(--color-bento-bg)] transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className="w-full h-full p-6 flex flex-col">
        
        <div className="flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
               <img src="/static/home/img/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-extrabold tracking-tight text-xl text-white">NexMedia AI</span>
          </div>

          {/* User Profile Mini Card */}
          <div className="bento-card p-3 flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#262626]">
              <img src="/static/img/avatar.jpg" alt="Profile" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-sm text-white leading-tight truncate">
                {isAuthenticated ? user?.email : "Guest"}
              </h3>
              <span className="text-[10px] text-[var(--color-bento-muted)] uppercase tracking-wider font-bold">Pro Plan</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 pb-4">
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                    ${isActive 
                      ? "bg-white text-black font-bold shadow-[0_4px_12px_rgba(255,255,255,0.1)]" 
                      : "text-[var(--color-bento-muted)] hover:text-white hover:bg-[#1a1a1a]"}`}
                >
                  <i className={`fas ${link.icon} w-5 text-center ${isActive ? "text-black" : "text-[#52525b]"}`}></i>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="flex-shrink-0 space-y-4 pt-6 border-t border-[var(--color-bento-border)]">
          <Link href="/#pricing" className="bento-btn-primary block w-full text-center py-3 text-sm flex items-center justify-center">
            <i className="fas fa-bolt mr-2 text-yellow-500"></i> Upgrade
          </Link>

          {isAuthenticated && (
            <button 
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="bento-btn w-full px-4 py-2 text-xs flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-950/30"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
