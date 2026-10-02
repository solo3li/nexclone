"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import api from "../utils/api";

export default function FloatingWhatsApp() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [link, setLink] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await api.get("/api/platform/public-settings");
        if (isMounted && res.data) {
          if (res.data.whatsAppLink) {
            setLink(res.data.whatsAppLink);
          }
          if (res.data.whatsAppEnabled !== undefined) {
            setEnabled(Boolean(res.data.whatsAppEnabled));
          }
        }
      } catch (err) {
        // Fallback: check social links
        try {
          const resSocial = await api.get("/api/platform/social-links");
          if (isMounted && resSocial.data?.WhatsApp) {
            setLink(resSocial.data.WhatsApp);
            setEnabled(true);
          }
        } catch {
          // Ignore
        }
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!enabled || !link) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    let url = link.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <aside
      aria-label={isRtl ? "تواصل معنا عبر واتساب" : "Chat on WhatsApp"}
      className={`fixed z-50 ${isRtl ? "left-6 sm:left-8" : "right-6 sm:right-8"} bottom-20 md:bottom-8 select-none pointer-events-auto`}
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring animation */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none duration-1000" />
        <span className="absolute -inset-2 rounded-full bg-emerald-500/15 animate-pulse pointer-events-none" />

        {/* Tooltip on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ duration: 0.15 }}
              className={`absolute bottom-full mb-3 whitespace-nowrap bg-black/85 backdrop-blur-md text-white text-xs font-medium py-1.5 px-3 rounded-xl border border-emerald-500/30 shadow-xl shadow-black/40 flex items-center gap-1.5 pointer-events-none ${
                isRtl ? "left-0" : "right-0"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isRtl ? "تواصل معنا عبر واتساب" : "Chat on WhatsApp"}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Button */}
        <motion.button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isRtl ? "تواصل معنا عبر واتساب" : "Chat on WhatsApp"}
          className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center transition-shadow cursor-pointer group border border-white/20"
        >
          <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-green-500">
            {/* WhatsApp SVG Icon */}
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 fill-white drop-shadow group-hover:rotate-6 transition-transform duration-300"
              viewBox="0 0 24 24"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.15.57 4.167 1.564 5.912l-1.564 5.728 5.864-1.538c1.705.932 3.659 1.469 5.736 1.469 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
        </motion.button>
      </div>
    </aside>
  );
}
