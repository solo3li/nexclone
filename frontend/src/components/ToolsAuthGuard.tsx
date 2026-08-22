"use client";

import { useEffect, useState } from "react";
import { useRouter } from "../i18n/routing";
import { useLocale } from "next-intl";
import { useAppStore } from "../store/useAppStore";
import api from "../utils/api";
import { Loader2 } from "lucide-react";

export default function ToolsAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAppStore();
  const router = useRouter();
  const locale = useLocale();
  const [isChecking, setIsChecking] = useState(!user);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = setTimeout(() => {
      if (isMounted && isChecking) {
        setIsChecking(false);
      }
    }, 3500);

    const checkAccess = async () => {
      try {
        const res = await api.get('/api/auth/me');

        if (!isMounted) return;
        setUser(res.data);

        if (!res.data?.hasPhoneNumber) {
          router.replace("/complete-profile");
          return;
        }

        setIsChecking(false);
      } catch (err: any) {
        if (!isMounted) return;
        
        console.error("[ToolsAuthGuard] Auth check failed:", err.message, err.response?.status);

        setUser(null);

        router.replace("/login");
      }
    };
    
    checkAccess();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [router, setUser, locale]);

  if (isChecking && !user) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-fuchsia-500" />
        <span className="text-white/40 text-xs font-mono">Loading Studio Workspace...</span>
      </div>
    );
  }

  return <>{children}</>;
}