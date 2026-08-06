"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { AlertTriangle } from "lucide-react";
import { Link } from "../i18n/routing";

export function FreezeWarningBanner() {
  const { user } = useAppStore();
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  // Determine if banner should be shown
  const hasActivePlan = user?.activeSubscriptions?.some(s => s.status === "active");
  const frozenPlan = user?.activeSubscriptions?.find(s => s.status === "freeze");
  const shouldShow = frozenPlan && !hasActivePlan;

  useEffect(() => {
    if (!shouldShow || !frozenPlan?.freezeEndDate) return;

    const endDate = new Date(frozenPlan.freezeEndDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance < 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [shouldShow, frozenPlan?.freezeEndDate]);

  if (!shouldShow || !timeLeft) return null;

  return (
    <div className="bg-gradient-to-r from-red-600/90 to-orange-500/90 text-white px-4 py-3 shadow-lg flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 z-50 relative top-0 w-full">
      <div className="flex items-center gap-2 text-sm md:text-base font-medium">
        <AlertTriangle className="w-5 h-5 text-yellow-200 animate-pulse shrink-0" />
        <p>
          حسابك في فترة التجميد! يتبقى لك 
          <span className="inline-block bg-black/30 px-2 py-0.5 rounded mx-2 font-bold tabular-nums" dir="ltr">
            {timeLeft.d}d : {timeLeft.h}h : {timeLeft.m}m : {timeLeft.s}s
          </span>
          قبل تصفير الرصيد.
        </p>
      </div>
      <Link 
        href="/pricing"
        className="bg-white text-red-600 hover:bg-red-50 font-bold px-4 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap shadow-sm"
      >
        جدد اشتراكك الآن
      </Link>
    </div>
  );
}
