"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard Home", href: "/dashboard", icon: "🏠" },
    { name: "GPT Assistant", href: "/dashboard/tools/gpt", icon: "💬" },
    { name: "Background Remover", href: "/dashboard/tools/bg-remover", icon: "🖼️" },
    { name: "Voice to Text", href: "/dashboard/tools/voice-to-text", icon: "🎙️" },
    { name: "Text to Voice", href: "/dashboard/tools/text-to-voice", icon: "🔊" },
    { name: "Image to Text", href: "/dashboard/tools/img-to-txt", icon: "📄" },
    { name: "Video Caption", href: "/dashboard/tools/video-caption", icon: "🎬" },
    { name: "Billing & Plans", href: "/dashboard/billing", icon: "💳" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col backdrop-blur-xl">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/25">
              N
            </div>
            <span className="font-bold tracking-tight">NexMedia AI</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
