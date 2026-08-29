"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface BottomSheetSelectProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  accentColor?: string; // e.g. "teal" | "violet" | "indigo" | "amber"
}

/**
 * On mobile (< lg): renders a fixed bottom sheet with overlay.
 * On desktop (>= lg): renders nothing — the caller renders the absolute dropdown.
 */
export function BottomSheetSelect({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetSelectProps) {
  // Lock body scroll when sheet is open on mobile
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[190]"
        onClick={onClose}
      />

      {/* Sheet — mobile only */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[200] bg-[#0d041c] border-t border-white/10 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-200"
        style={{ maxHeight: "72vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="overflow-y-auto p-3 space-y-1" style={{ maxHeight: "calc(72vh - 80px)" }}>
          {children}
        </div>
      </div>
    </>
  );
}
