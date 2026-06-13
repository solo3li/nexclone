"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: "fa-home" },
    { href: "/voice-to-text", label: "Voice to Text", icon: "fa-microphone" },
    { href: "/text-to-voice", label: "Text to Speech", icon: "fa-volume-up" },
    { href: "/history", label: "History", icon: "fa-history" },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 h-screen w-64 p-6 transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className="clay-card w-full h-full p-6 flex flex-col justify-between">
        <div>
          {/* Logo & Profile */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-12 h-12 rounded-full clay-btn flex items-center justify-center overflow-hidden">
              <img src="/static/img/avatar.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Guest</h3>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Free Plan</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all
                    ${isActive ? "clay-btn-active text-blue-600 font-bold" : "text-gray-600 hover:bg-white hover:bg-opacity-50"}`}
                >
                  <i className={`fas ${link.icon} w-5 text-center ${isActive ? "text-blue-500" : ""}`}></i>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-4">
          <Link href="/#pricing" className="clay-btn-primary block w-full text-center py-3 font-bold text-sm">
            <i className="fas fa-rocket mr-2"></i> Upgrade
          </Link>
          
          <button className="clay-btn w-full flex items-center justify-between px-4 py-3 text-gray-600 text-sm">
            <div className="flex items-center space-x-2">
              <i className="fas fa-globe"></i>
              <span>English</span>
            </div>
            <i className="fas fa-chevron-down text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
