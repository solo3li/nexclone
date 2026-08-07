"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Scissors, RotateCcw, Check, Loader2 } from "lucide-react";

interface MediaTrimmerProps {
  file: File;
  type: "audio" | "video";
  onTrimmed: (trimmedFile: File) => void;
  onCancel: () => void;
  isRtl?: boolean;
  accentColor?: "fuchsia" | "amber" | "violet";
}

function formatSecs(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 10);
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${ms}`;
}

export default function MediaTrimmer({
  file,
  type,
  onTrimmed,
  onCancel,
  isRtl = false,
  accentColor = "fuchsia",
}: MediaTrimmerProps) {
  const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [objectUrl, setObjectUrl] = useState<string>("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startPct, setStartPct] = useState(0);
  const [endPct, setEndPct] = useState(100);
  const [isTrimming, setIsTrimming] = useState(false);
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);
  const animFrameRef = useRef<number>(0);

  const startTime = (startPct / 100) * duration;
  const endTime   = (endPct   / 100) * duration;
  const trimDuration = endTime - startTime;

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const syncPlayhead = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    setCurrentTime(el.currentTime);
    if (el.currentTime >= endTime) {
      el.pause();
      el.currentTime = startTime;
      setIsPlaying(false);
      return;
    }
    animFrameRef.current = requestAnimationFrame(syncPlayhead);
  }, [endTime, startTime]);

  useEffect(() => {
    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(syncPlayhead);
    } else {
      cancelAnimationFrame(animFrameRef.current);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, syncPlayhead]);

  const togglePlay = () => {
    const el = mediaRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      if (el.currentTime >= endTime || el.currentTime < startTime) {
        el.currentTime = startTime;
      }
      el.play();
      setIsPlaying(true);
    }
  };

  const getPct = (clientX: number): number => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  };

  const handleMouseDown = (handle: "start" | "end") => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(handle);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const pct = getPct(clientX);
      if (dragging === "start") setStartPct(Math.min(pct, endPct - 1));
      else setEndPct(Math.max(pct, startPct + 1));
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, startPct, endPct]);

  const playheadPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTrim = async () => {
    const el = mediaRef.current;
    if (!el || duration === 0) return;
    setIsTrimming(true);
    try {
      el.pause();
      setIsPlaying(false);
      el.currentTime = startTime;
      const stream: MediaStream = (el as any).captureStream();
      const supportedTypes = type === "video"
        ? ["video/webm;codecs=vp8,opus", "video/webm"]
        : ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"];
      const mimeType = supportedTypes.find((t) => MediaRecorder.isTypeSupported(t)) || "";
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || (type === "video" ? "video/webm" : "audio/webm") });
        const ext = type === "video" ? "webm" : "webm";
        const trimmedFile = new File([blob], file.name.replace(/\.[^.]+$/, `_trimmed.${ext}`), { type: blob.type });
        setIsTrimming(false);
        onTrimmed(trimmedFile);
      };
      recorder.start();
      await el.play();
      setTimeout(() => { recorder.stop(); el.pause(); }, trimDuration * 1000);
    } catch (err) {
      console.error("Trim error:", err);
      setIsTrimming(false);
    }
  };

  const handleReset = () => {
    setStartPct(0);
    setEndPct(100);
    const el = mediaRef.current;
    if (el) { el.pause(); el.currentTime = 0; }
    setIsPlaying(false);
  };

  const colors = {
    fuchsia: { bg: "bg-fuchsia-500", border: "border-fuchsia-500", text: "text-fuchsia-400", gradient: "from-fuchsia-600 to-pink-600" },
    amber:   { bg: "bg-amber-500",   border: "border-amber-500",   text: "text-amber-400",   gradient: "from-amber-500 to-orange-500" },
    violet:  { bg: "bg-violet-500",  border: "border-violet-500",  text: "text-violet-400",  gradient: "from-violet-600 to-purple-600" },
  };
  const c = colors[accentColor] || colors.fuchsia;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="w-full bg-[#0d0020]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className={`w-4 h-4 ${c.text}`} />
          <span className="text-white font-semibold text-sm">{isRtl ? "تقطيع الملف" : "Trim File"}</span>
          <span className="text-white/30 text-xs truncate max-w-[120px]">({file.name})</span>
        </div>
        <button onClick={onCancel} className="text-white/40 hover:text-white/80 text-xs transition-colors">
          {isRtl ? "إلغاء" : "Cancel"}
        </button>
      </div>

      {/* Preview */}
      <div className="rounded-xl overflow-hidden bg-black/40 border border-white/5">
        {type === "video" ? (
          <video
            ref={mediaRef}
            src={objectUrl}
            onLoadedMetadata={() => { if (mediaRef.current) setDuration(mediaRef.current.duration); }}
            className="w-full max-h-[200px] object-contain"
            playsInline
          />
        ) : (
          <>
            <audio
              ref={mediaRef}
              src={objectUrl}
              onLoadedMetadata={() => { if (mediaRef.current) setDuration(mediaRef.current.duration); }}
            />
            <div className="flex items-end justify-center h-16 gap-0.5 px-4 py-2">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1 rounded-full ${c.bg} opacity-70`}
                  animate={isPlaying ? { height: [3, Math.random() * 30 + 3, 3] } : { height: 3 }}
                  transition={{ duration: 0.3 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.015 }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-white/40 font-mono px-1">
          <span>{formatSecs(startTime)}</span>
          <span className={`${c.text} font-bold`}>{isRtl ? `${trimDuration.toFixed(1)}s مدة` : `${trimDuration.toFixed(1)}s selected`}</span>
          <span>{formatSecs(endTime)}</span>
        </div>

        <div
          ref={containerRef}
          className="relative h-10 bg-black/40 rounded-lg border border-white/10 select-none cursor-pointer"
          onClick={(e) => {
            if (dragging) return;
            const pct = getPct(e.clientX);
            const t = (pct / 100) * duration;
            if (mediaRef.current) mediaRef.current.currentTime = t;
            setCurrentTime(t);
          }}
        >
          {/* Background */}
          <div className="absolute inset-0 rounded-lg bg-white/5" />
          {/* Selected region fill */}
          <div className={`absolute top-0 bottom-0 ${c.bg} opacity-20`} style={{ left: `${startPct}%`, right: `${100 - endPct}%` }} />
          <div className={`absolute top-0 bottom-0 border-y-2 ${c.border} opacity-50`} style={{ left: `${startPct}%`, right: `${100 - endPct}%` }} />

          {/* Playhead */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-20 pointer-events-none" style={{ left: `${playheadPct}%` }}>
            <div className="w-2.5 h-2.5 rounded-full bg-white -translate-x-1 -translate-y-1 shadow-lg" />
          </div>

          {/* Start handle */}
          <div
            className="absolute top-0 bottom-0 w-5 z-30 -translate-x-1/2 cursor-ew-resize flex items-center justify-center"
            style={{ left: `${startPct}%` }}
            onMouseDown={handleMouseDown("start")}
            onTouchStart={(e) => { e.preventDefault(); setDragging("start"); }}
          >
            <div className={`w-3 h-8 rounded-l-md ${c.bg} flex items-center justify-center shadow-lg`}>
              <div className="w-0.5 h-4 bg-white/70 rounded-full" />
            </div>
          </div>

          {/* End handle */}
          <div
            className="absolute top-0 bottom-0 w-5 z-30 -translate-x-1/2 cursor-ew-resize flex items-center justify-center"
            style={{ left: `${endPct}%` }}
            onMouseDown={handleMouseDown("end")}
            onTouchStart={(e) => { e.preventDefault(); setDragging("end"); }}
          >
            <div className={`w-3 h-8 rounded-r-md ${c.bg} flex items-center justify-center shadow-lg`}>
              <div className="w-0.5 h-4 bg-white/70 rounded-full" />
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] font-mono text-white/30">
          {formatSecs(currentTime)} / {formatSecs(duration)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all flex-shrink-0">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={handleReset} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all flex-shrink-0">
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center text-xs text-white/40">
          {isRtl ? `من ${formatSecs(startTime)} إلى ${formatSecs(endTime)}` : `${formatSecs(startTime)} → ${formatSecs(endTime)}`}
        </div>
        <button
          onClick={handleTrim}
          disabled={isTrimming || trimDuration < 0.5}
          className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${c.gradient} text-white font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all`}
        >
          {isTrimming ? <><Loader2 className="w-4 h-4 animate-spin" />{isRtl ? "جاري..." : "Trimming..."}</> : <><Check className="w-4 h-4" />{isRtl ? "تطبيق" : "Apply Trim"}</>}
        </button>
      </div>

      {trimDuration < 0.5 && (
        <p className="text-amber-400 text-xs text-center">{isRtl ? "اختر نطاقاً أطول" : "Please select a longer range"}</p>
      )}
    </motion.div>
  );
}
