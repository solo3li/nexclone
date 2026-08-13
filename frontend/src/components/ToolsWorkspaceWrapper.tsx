"use client";

import { useLocale } from "next-intl";
import { useAppStore } from "../store/useAppStore";

export default function ToolsWorkspaceWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { isSidebarCollapsed } = useAppStore();

  const marginClass = isRtl
    ? isSidebarCollapsed
      ? "lg:mr-20"
      : "lg:mr-72"
    : isSidebarCollapsed
      ? "lg:ml-20"
      : "lg:ml-72";

  return (
    <main
      className={`flex-1 transition-all duration-300 w-full lg:w-auto relative ${marginClass}`}
    >
      {children}
    </main>
  );
}
