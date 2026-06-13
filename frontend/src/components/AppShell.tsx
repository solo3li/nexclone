"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Hide sidebar completely on the video editor page for full-screen experience
  const isVideoEditor = pathname === "/video-editor";

  return (
    <div className="min-h-screen flex overflow-x-hidden bg-[var(--color-bento-bg)]">
      
      {/* Sidebar Component */}
      {!isVideoEditor && <Sidebar isOpen={isSidebarOpen} />}
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 flex flex-col w-full min-h-screen ${!isVideoEditor ? 'md:ml-64' : ''}`}>
        
        {/* Mobile Header */}
        {!isVideoEditor && (
          <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--color-bento-border)] bg-[var(--color-bento-bg)]">
            <Link href="/" className="font-extrabold text-xl text-white tracking-tight flex items-center">
              <div className="w-8 h-8 mr-2">
                <img src="/static/home/img/logo.png" alt="Logo" className="w-full h-full object-contain filter invert" />
              </div>
              NexBento
            </Link>
            <button 
              className="bento-btn w-10 h-10 flex items-center justify-center text-white"
              onClick={toggleSidebar}
            >
              <i className={`fas ${isSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className={`flex-1 w-full mx-auto ${isVideoEditor ? 'p-0 max-w-full h-screen overflow-hidden' : 'p-4 md:p-8 max-w-[1600px]'}`}>
          {children}
        </main>
        
      </div>
    </div>
  );
}
