"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex overflow-x-hidden p-0 md:p-6 lg:p-10 justify-center items-center">
      <div className="w-full max-w-[1400px] bg-white md:bg-transparent rounded-[40px] flex overflow-hidden shadow-2xl md:shadow-none min-h-[90vh] relative clay-card">
        <Sidebar isOpen={isSidebarOpen} />
        
        <div className="flex-1 md:ml-64 transition-all duration-300 flex flex-col w-full bg-[var(--color-clay-card)] md:bg-transparent z-10">
          {/* Top bar for mobile */}
          <div className="md:hidden flex items-center justify-between p-6">
            <Link href="/" className="font-extrabold text-xl text-slate-800 tracking-tight flex items-center">
              <div className="w-8 h-8 mr-2">
                <img src="/static/home/img/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              NeuroClay
            </Link>
            <button 
              className="clay-btn w-12 h-12 flex items-center justify-center rounded-2xl text-slate-600 z-50 relative"
              onClick={toggleSidebar}
            >
              <i className={`fas ${isSidebarOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
            </button>
          </div>

          {/* Content Area */}
          <main className="flex-1 p-6 md:p-10 w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
