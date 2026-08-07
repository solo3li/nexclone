"use client";

import { motion } from "framer-motion";
import { Wallet, Loader2, AlertCircle, Zap } from "lucide-react";

interface CostEstimateCardProps {
  estimatedCost: number | null;
  chargedWallet: string | null;
  isLoading?: boolean;
  error?: string | null;
  isRtl?: boolean;
  accentColor?: "fuchsia" | "amber" | "violet" | "cyan";
  extraInfo?: string | null; // e.g. "12s → 3 blocks × 5s"
}

const walletIconMap: Record<string, string> = {
  "general wallet": "🏦",
  "محفظة عامة": "🏦",
  "lip sync": "🎭",
  "lipsync": "🎭",
  "مزامنة": "🎭",
  "avatar": "🧑‍💻",
  "افتار": "🧑‍💻",
  "image to video": "🎬",
  "motion": "🎮",
  "تحكم بالحركة": "🎮",
  "voice": "🎙️",
  "صوت": "🎙️",
  "text": "📝",
  "نص": "📝",
};

function getWalletIcon(name: string | null): string {
  if (!name) return "💳";
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(walletIconMap)) {
    if (lower.includes(key)) return icon;
  }
  return "💳";
}

const colors = {
  fuchsia: {
    card: "bg-fuchsia-500/10 border-fuchsia-500/25",
    cost: "text-fuchsia-300",
    wallet: "text-fuchsia-200/70",
    loader: "text-fuchsia-400",
    dot: "bg-fuchsia-500",
    badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  },
  amber: {
    card: "bg-amber-500/10 border-amber-500/25",
    cost: "text-amber-300",
    wallet: "text-amber-200/70",
    loader: "text-amber-400",
    dot: "bg-amber-500",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  violet: {
    card: "bg-violet-500/10 border-violet-500/25",
    cost: "text-violet-300",
    wallet: "text-violet-200/70",
    loader: "text-violet-400",
    dot: "bg-violet-500",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  cyan: {
    card: "bg-cyan-500/10 border-cyan-500/25",
    cost: "text-cyan-300",
    wallet: "text-cyan-200/70",
    loader: "text-cyan-400",
    dot: "bg-cyan-500",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
};

export default function CostEstimateCard({
  estimatedCost,
  chargedWallet,
  isLoading = false,
  error = null,
  isRtl = false,
  accentColor = "fuchsia",
  extraInfo = null,
}: CostEstimateCardProps) {
  const c = colors[accentColor] || colors.fuchsia;
  const walletIcon = getWalletIcon(chargedWallet);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/25 rounded-xl"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        <p className="text-red-300 text-sm">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full flex items-center justify-between gap-3 p-3 border rounded-xl ${c.card}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Left: wallet info */}
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${c.badge} border`}>
          {isLoading ? <Loader2 className={`w-4 h-4 animate-spin ${c.loader}`} /> : walletIcon}
        </div>
        <div className="min-w-0">
          <p className={`text-xs font-medium ${c.wallet} truncate`}>
            {isRtl ? "سيتم الخصم من" : "Charged from"}
          </p>
          <p className="text-white/80 text-sm font-semibold truncate">
            {isLoading ? "—" : (chargedWallet || (isRtl ? "المحفظة العامة" : "General Wallet"))}
          </p>
        </div>
      </div>

      {/* Right: cost */}
      <div className="flex flex-col items-end flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Zap className={`w-3.5 h-3.5 ${c.cost}`} />
          {isLoading ? (
            <div className="w-12 h-5 bg-white/10 rounded animate-pulse" />
          ) : (
            <span className={`text-lg font-bold font-mono ${c.cost}`}>
              {estimatedCost !== null ? estimatedCost.toFixed(2) : "—"}
            </span>
          )}
          <span className="text-white/40 text-xs">{isRtl ? "كريدت" : "credits"}</span>
        </div>
        {extraInfo && !isLoading && (
          <span className="text-white/30 text-[10px] mt-0.5">{extraInfo}</span>
        )}
      </div>
    </motion.div>
  );
}
