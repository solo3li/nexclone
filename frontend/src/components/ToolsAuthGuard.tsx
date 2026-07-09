"use client";

import { useEffect, useState } from "react";
import { useRouter } from "../i18n/routing";
import { useAppStore } from "../store/useAppStore";
import api from "../utils/api";
import { Loader2 } from "lucide-react";

export default function ToolsAuthGuard({ children }: { children: React.ReactNode }) {
  const { setUser } = useAppStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data);
        if (!res.data.hasPhoneNumber) {
          router.push("/complete-profile");
        } else {
          setIsChecking(false);
        }
      } catch (err) {
        // Not authenticated
        router.push("/login");
      }
    };
    
    checkAccess();
  }, [router, setUser]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-fuchsia-500" />
      </div>
    );
  }

  return <>{children}</>;
}
