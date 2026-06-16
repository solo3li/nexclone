"use client";

import { useEffect } from "react";
import { useLanguageStore } from "../store/useLanguageStore";

export default function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { language, direction } = useLanguageStore();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  return <>{children}</>;
}
