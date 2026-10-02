"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, pushDataLayer } from "../utils/gtm";
import { useAppStore } from "../store/useAppStore";

function GTMRouteTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAppStore();
  const lastPathRef = useRef<string>("");
  const lastUserIdRef = useRef<string | null>(null);

  // Track virtual pageviews on route changes
  useEffect(() => {
    if (!pathname) return;
    const queryString = searchParams?.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    if (fullPath !== lastPathRef.current) {
      lastPathRef.current = fullPath;
      trackPageView(fullPath, typeof document !== "undefined" ? document.title : "");
    }
  }, [pathname, searchParams]);

  // Track user identification when logged in
  useEffect(() => {
    if (user?.id && String(user.id) !== lastUserIdRef.current) {
      lastUserIdRef.current = String(user.id);
      pushDataLayer({
        event: "user_identified",
        user_id: String(user.id),
      });
    }
  }, [user?.id]);

  return null;
}

export default function GTMRouteTracker() {
  return (
    <Suspense fallback={null}>
      <GTMRouteTrackerInner />
    </Suspense>
  );
}
