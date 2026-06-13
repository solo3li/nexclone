"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: "fa-home" },
    { href: "/voice-to-text", label: "AI Tools", icon: "fa-magic" },
    { href: "/history", label: "Projects", icon: "fa-folder" },
    { href: "#", label: "Analytics", icon: "fa-chart-pie" },
    { href: "/profile", label: "Settings", icon: "fa-cog" },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 h-screen w-64 pt-6 pb-6 transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className="clay-sidebar w-full h-full p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-10 justify-center">
          <div className="text-xl font-extrabold text-slate-800 flex items-center flex-col">
            <div className="w-16 h-16 mb-2">
              <img src="/static/home/img/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-md" />
            </div>
            <span>NeuroClay</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-4 flex-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.label} 
                href={link.href}
                className={`flex items-center space-x-4 px-4 py-3 clay-pill transition-all
                  ${isActive ? "clay-btn-peach text-slate-900 font-bold" : "text-slate-700 hover:bg-white/20 font-semibold"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white/40' : 'clay-btn bg-clay-card'}`}>
                  <i className={`fas ${link.icon} text-sm ${isActive ? "text-orange-600" : "text-slate-500"}`}></i>
                </div>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
