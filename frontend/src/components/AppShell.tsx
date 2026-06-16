"use client";

import TopNavbar from "./TopNavbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isFullScreenApp = false;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[var(--color-bento-bg)]">
      
      {/* Top Navigation */}
      {!isFullScreenApp && <TopNavbar />}
      
      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col">
        {/* Dynamic Page Content */}
        <main className={`flex-1 w-full mx-auto ${isFullScreenApp ? 'p-0 max-w-full h-screen overflow-hidden' : 'p-4 md:p-8 max-w-[1600px]'}`}>
          {children}
        </main>
      </div>
      
    </div>
  );
}
