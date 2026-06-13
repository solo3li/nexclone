"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex overflow-x-hidden">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 transition-all duration-300 flex flex-col w-full min-h-screen">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--color-bento-border)] bg-[var(--color-bento-bg)]">
          <Link href="/" className="font-extrabold text-xl text-white tracking-tight flex items-center">
            <div className="w-8 h-8 mr-2">
              <img src="/static/home/img/logo.png" alt="Logo" className="w-full h-full object-contain filter invert" />
            </div>
            NeuroBento
          </Link>
          <button 
            className="bento-btn w-10 h-10 flex items-center justify-center text-white"
            onClick={toggleSidebar}
          >
            <i className={`fas ${isSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}
