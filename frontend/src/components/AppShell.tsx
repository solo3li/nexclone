"use client";

import TopNavbar from "./TopNavbar";
import { useLanguageStore } from "../store/useLanguageStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { direction } = useLanguageStore();

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      dir={direction}
    >
      <TopNavbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 py-2">
        {children}
      </main>
    </div>
  );
}
