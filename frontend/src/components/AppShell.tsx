"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#f0f3f8] flex overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 md:ml-64 transition-all duration-300 flex flex-col min-h-screen w-full">
        {/* Top bar for mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#f0f3f8]">
          <Link href="/" className="font-extrabold text-xl text-gray-700 tracking-tight">
            NEX<span className="text-blue-500">MEDIA</span>
          </Link>
          <button 
            className="clay-btn w-12 h-12 flex items-center justify-center rounded-2xl text-gray-600 z-50 relative"
            onClick={toggleSidebar}
          >
            <i className={`fas ${isSidebarOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
