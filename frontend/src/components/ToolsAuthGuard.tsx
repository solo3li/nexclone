"use client";

import { useEffect } from "react";
import { useRouter } from "../i18n/routing";
import { useAppStore } from "../store/useAppStore";

export default function ToolsAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasPhoneNumber } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !hasPhoneNumber) {
      router.push("/complete-profile");
    }
  }, [isAuthenticated, hasPhoneNumber, router]);

  return <>{children}</>;
}
