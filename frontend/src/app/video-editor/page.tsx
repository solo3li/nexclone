"use client";

import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, PointerEvent } from "react";
import Link from "next/link";

interface LocalMedia { id: string; name: string; url: string; type: string; }
type TrackType = 'video' | 'audio' | 'text';
interface TimelineTrack { id: string; type: TrackType; name: string; isHidden?: boolean; isMuted?: boolean; isLocked?: boolean; }
interface TimelineItem { id: string; trackId: string; mediaId?: string; url?: string; name?: string; text?: string; startTime: number; duration: number; sourceOffset: number; filter?: string; x?: number; y?: number; width?: number; height?: number; fontSize?: number; color?: string; fontFamily?: string; rotation?: number; mediaType?: 'video' | 'audio' | 'image'; opacity?: number; blendMode?: string; volume?: number; }
type TransformMode = 'none' | 'drag' | 'scale' | 'rotate';
type HwProfile = { ram: number; cores: number; tier: 'Pro' | 'Standard' | 'Limited'; showModal: boolean; maxRes: string; maxDur: number; isMobile: boolean };

type ExportResolution = '720p' | '1080p' | '4K';
type ExportFPS = 24 | 30 | 60;
type ExportQuality = 'low' | 'medium' | 'high';
type ExportFormat = 'webm' | 'mp4';

<style>{`
.stripes-bg {
  background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.3) 5px, rgba(0,0,0,0.3) 10px);
}
`}</style>
export default function VideoEditor() {
  const [activeAssetTab, setActiveAssetTab] = useState("media");
  const [activePropertyTab, setActivePropertyTab] = useState("color");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const [hwProfile, setHwProfile] = useState<HwProfile | null>(null);

  const [localMediaFiles, setLocalMediaFiles] = useState<LocalMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
    const sortTracks = (tList: TimelineTrack[]) => [...tList].sort((a, b) => {
    const aIsVisual = a.type === 'video' || a.type === 'text';
    const bIsVisual = b.type === 'video' || b.type === 'text';
    if (aIsVisual && !bIsVisual) return -1;
    if (!aIsVisual && bIsVisual) return 1;
    return 0;
  });
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    { id: 'V2', type: 'video', name: 'Overlay' },
    { id: 'V1', type: 'video', name: 'Video 1' },
    { id: 'A1', type: 'audio', name: 'Audio 1' },
    { id: 'T1', type: 'text', name: 'Text 1' }
  ]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [timelineZoom, setTimelineZoom] = useState(50); 

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>('none');
  const [dragState, setDragState] = useState({ startX: 0, startY: 0, initX: 0, initY: 0, initSize: 0, initRot: 0, centerX: 0, centerY: 0 });

  const [timelineDrag, setTimelineDrag] = useState<{ active: boolean, itemId: string | null, startX: number, startY: number, initStartTime: number, initTrack: string | null }>({ active: false, itemId: null, startX: 0, startY: 0, initStartTime: 0, initTrack: null });
  const timelineRef = useRef<HTMLDivElement>(null);
  const trackHeadersRef = useRef<HTMLDivElement>(null);

    const imageCacheRef = useRef<{ [url: string]: HTMLImageElement }>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playheadIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Render Engine State
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const totalTimelineDurationRef = useRef<number>(0);

  // Advanced Export Settings State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportConfig, setExportConfig] = useState<{ resolution: ExportResolution, fps: ExportFPS, quality: ExportQuality, format: ExportFormat }>({
    resolution: '1080p',
    fps: 30,
    quality: 'medium',
    format: 'webm'
  });

  const [copilotPrompt, setCopilotPrompt] = useState("");
  const [isCopilotRunning, setIsCopilotRunning] = useState(false);

  const runCopilot = async () => {
    if (!copilotPrompt) return;
    setIsCopilotRunning(true);
    try {
      const res = await fetch("/api/ai-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: copilotPrompt, timeline: timelineItems })
      });
      const data = await res.json();
      if (data.timeline) {
        setTimelineItems(data.timeline);
        setCopilotPrompt("");
      } else {
        alert("Failed to edit timeline: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      alert("Error contacting AI copilot");
    } finally {
      setIsCopilotRunning(false);
    }
  };

  const selectedItem = timelineItems.find(i => i.id === selectedItemId);

  useEffect(() => {
    const nav = navigator as any;
    const ram = nav.deviceMemory || 4; 
    const cores = nav.hardwareConcurrency || 2;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let tier: 'Pro' | 'Standard' | 'Limited' = 'Standard';
    let maxRes = '1080p';
    let maxDur = 10;
    if (ram >= 8 && cores >= 8 && !isMobile) { tier = 'Pro'; maxRes = '4K Uncompressed'; maxDur = 60; }
    else if (ram <= 4 || cores <= 4 || isMobile) { tier = 'Limited'; maxRes = '720p Mobile Proxy'; maxDur = 3; }
    setHwProfile({ ram, cores, tier, showModal: true, maxRes, maxDur, isMobile });
    
    // Auto-adjust default export config based on hardware
    if (tier === 'Limited') setExportConfig({ resolution: '720p', fps: 30, quality: 'low', format: 'webm' });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({ id: Math.random().toString(36).substr(2, 9), name: file.name, url: URL.createObjectURL(file), type: file.type.split('/')[0] }));
      setLocalMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const addToTimeline = (media: LocalMedia) => {
    let targetType: TrackType = media.type === 'audio' ? 'audio' : 'video';
    let track = tracks.find(t => t.type === targetType);
    if (!track) {
       track = { id: Math.random().toString(36).substr(2, 9), type: targetType, name: `${targetType === 'audio' ? 'Audio' : 'Video'} Track` };
       setTracks(prev => sortTracks([...prev, track as TimelineTrack]));
    }
    const trackItems = timelineItems.filter(i => i.trackId === track!.id);
    let start = 0;
    if (trackItems.length > 0) {
      const lastItem = trackItems.reduce((prev, current) => (prev.startTime + prev.duration > current.startTime + current.duration) ? prev : current);
      start = lastItem.startTime + lastItem.duration;
    }
    const newItem: TimelineItem = { id: Math.random().toString(36).substr(2, 9), trackId: track!.id, mediaId: media.id, url: media.url, name: media.name, startTime: start, duration: 10, sourceOffset: 0, mediaType: media.type as any, x: 50, y: 50, width: 100, height: 100 };
    setTimelineItems(prev => [...prev, newItem]);
    if (media.type === 'video' || media.type === 'audio') {
      const el = document.createElement(media.type === 'audio' ? 'audio' : 'video');
      el.src = media.url;
      el.onloadedmetadata = () => setTimelineItems(prev => prev.map(i => i.id === newItem.id ? { ...i, duration: el.duration } : i));
    }
  };

  const addTextToTimeline = () => {
    let track = tracks.find(t => t.type === 'text');
    if (!track) {
       track = { id: Math.random().toString(36).substr(2, 9), type: 'text', name: 'Text Track' };
       setTracks(prev => [...prev, track as TimelineTrack]);
    }
    const newItem: TimelineItem = { id: Math.random().toString(36).substr(2, 9), trackId: track!.id, text: "Double Click to Edit", startTime: currentTime, duration: 5, sourceOffset: 0, x: 50, y: 50, fontSize: 64, color: "#ffffff", fontFamily: "Inter", rotation: 0 };
    setTimelineItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);
    setActivePropertyTab("text");
    if (hwProfile?.isMobile) setShowMobileSidebar(false);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleTrackProperty = (trackId: string, prop: 'isHidden' | 'isMuted' | 'isLocked') => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, [prop]: !t[prop] } : t));
  };
  const renameTrack = (trackId: string, newName: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, name: newName } : t));
  };

  useEffect(() => {
    if (isPlaying) {
      playheadIntervalRef.current = setInterval(() => setCurrentTime(prev => prev + 0.05), 50);
    } else {
      if (playheadIntervalRef.current) clearInterval(playheadIntervalRef.current);
    }
    return () => { if (playheadIntervalRef.current) clearInterval(playheadIntervalRef.current); };
  }, [isPlaying]);

  useEffect(() => {
    const activeItems = timelineItems.filter(i => currentTime >= i.startTime && currentTime < i.startTime + i.duration);
    
    // Play or pause dynamic media elements
    timelineItems.forEach(item => {
      if (item.mediaType === 'video' || item.mediaType === 'audio') {
        const el = document.getElementById(`player-${item.id}`) as HTMLMediaElement;
        const track = tracks.find(t => t.id === item.trackId);
        if (el) {
          el.muted = item.mediaType === 'video' || (track?.isMuted ?? false);
          el.volume = item.volume !== undefined ? item.volume / 100 : 1.0;
          const isActive = activeItems.some(active => active.id === item.id);
          if (isActive) {
            const expectedTime = (currentTime - item.startTime) + item.sourceOffset;
            if (Math.abs(el.currentTime - expectedTime) > 0.2) el.currentTime = expectedTime;
            if (isPlaying && el.paused) el.play().catch(() => {});
            else if (!isPlaying && !el.paused) el.pause();
          } else {
            if (!el.paused) el.pause();
          }
        }
      }
    });
  }, [currentTime, timelineItems, isPlaying]);

  // --- CANVAS RENDERING ENGINE ---
  const activeItems = timelineItems.filter(i => currentTime >= i.startTime && currentTime < i.startTime + i.duration);
  const activeTextItems = activeItems.filter(i => {
    const t = tracks.find(t => t.id === i.trackId);
    return t?.type === 'text' && !t.isHidden;
  });
  
  // Sort visual items by track index so lower tracks are drawn first (background)
  const activeVisualItems = activeItems
    .filter(i => {
      const t = tracks.find(t => t.id === i.trackId);
      return t?.type === 'video' && !t.isHidden;
    })
    .sort((a, b) => {
      const aIndex = tracks.findIndex(t => t.id === a.trackId);
      const bIndex = tracks.findIndex(t => t.id === b.trackId);
      // Wait, top track in UI (index 0) usually means foreground.
      // So index 0 should be drawn LAST. Let's draw in reverse order.
      return bIndex - aIndex;
    });

  const isRenderingRef = useRef(isRendering);
  const exportConfigRef = useRef(exportConfig);
  useEffect(() => { isRenderingRef.current = isRendering; exportConfigRef.current = exportConfig; }, [isRendering, exportConfig]);

  const getClipDOMStyle = (clip: TimelineItem) => {
      if (clip.trackId === 'T1') return { width: 'auto', height: 'auto' };
      
      let elW = 1920; let elH = 1080;
      if (clip.mediaType === 'image' && clip.url && imageCacheRef.current[clip.url]) {
         elW = imageCacheRef.current[clip.url].naturalWidth || elW;
         elH = imageCacheRef.current[clip.url].naturalHeight || elH;
      } else if (clip.mediaType === 'video') {
         const v = document.getElementById(`player-${clip.id}`) as HTMLVideoElement;
         if (v && v.videoWidth) { elW = v.videoWidth; elH = v.videoHeight; }
      }
      
      const canvasW = canvasRef.current?.width || 1920;
      const canvasH = canvasRef.current?.height || 1080;
      
      let baseW = elW;
      let baseH = elH;
      
      if (baseW > canvasW || baseH > canvasH || (clip.trackId === 'V1' && clip.mediaType === 'video' && clip.width === undefined)) {
          const fitScale = Math.min(canvasW / baseW, canvasH / baseH);
          baseW *= fitScale;
          baseH *= fitScale;
      }
      
      const scaleModifier = (clip.width ?? 100) / 100;
      const drawW = baseW * scaleModifier;
      const drawH = baseH * scaleModifier;
      
      return { 
          width: `${(drawW / canvasW) * 100}%`, 
          height: `${(drawH / canvasH) * 100}%` 
      };
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const container = playerContainerRef.current;
    
    if (canvas && ctx && container) {
      // DYNAMIC RESOLUTION FIX: Lock canvas to exact export resolution during render, otherwise use screen size.
      if (isRenderingRef.current) {
         if (exportConfigRef.current.resolution === '720p') { canvas.width = 1280; canvas.height = 720; }
         else if (exportConfigRef.current.resolution === '1080p') { canvas.width = 1920; canvas.height = 1080; }
         else if (exportConfigRef.current.resolution === '4K') { canvas.width = 3840; canvas.height = 2160; }
      } else {
        const rect = container.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) { canvas.width = rect.width; canvas.height = rect.height; }
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      activeVisualItems.forEach(item => {
         const drawScaledElement = (element: any, elWidth: number, elHeight: number) => {
            ctx.save();
            const pxX = (item.x || 50) * canvas.width / 100;
            const pxY = (item.y || 50) * canvas.height / 100;
            ctx.translate(pxX, pxY);
            ctx.rotate(((item.rotation || 0) * Math.PI) / 180);
            
            let baseW = elWidth;
            let baseH = elHeight;
            
            if (baseW > canvas.width || baseH > canvas.height || (item.trackId === 'V1' && item.mediaType === 'video' && item.width === undefined)) {
                const fitScale = Math.min(canvas.width / baseW, canvas.height / baseH);
                baseW *= fitScale;
                baseH *= fitScale;
            }
            
            const scaleModifier = (item.width || 100) / 100;
            const drawW = baseW * scaleModifier;
            const drawH = baseH * scaleModifier;
            
            ctx.globalAlpha = item.opacity !== undefined ? item.opacity / 100 : 1;
            ctx.globalCompositeOperation = (item.blendMode as GlobalCompositeOperation) || 'source-over';
            ctx.filter = item.filter || 'none';
            ctx.drawImage(element, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
         };

         if (item.mediaType === 'image' && item.url) {
            if (!imageCacheRef.current[item.url]) {
               const img = new Image();
               img.crossOrigin = "anonymous";
               img.src = item.url;
               imageCacheRef.current[item.url] = img;
            }
            const img = imageCacheRef.current[item.url];
            if (img.complete && img.naturalWidth) drawScaledElement(img, img.naturalWidth, img.naturalHeight);
         } else if (item.mediaType === 'video') {
            const playerEl = document.getElementById(`player-${item.id}`) as HTMLVideoElement;
            if (playerEl && playerEl.readyState >= 2) {
               drawScaledElement(playerEl, playerEl.videoWidth, playerEl.videoHeight);
            }
         }
      });

      activeTextItems.forEach(textItem => {
        if (!textItem.text) return;
        ctx.save();
        const pxX = (textItem.x || 50) * canvas.width / 100;
        const pxY = (textItem.y || 50) * canvas.height / 100;
        ctx.translate(pxX, pxY);
        ctx.rotate(((textItem.rotation || 0) * Math.PI) / 180);
        
        // Scale font size proportionally to canvas width so it looks identical to DOM preview
        // Assuming DOM preview is based on a standard 1080p wide screen (approx 1920px)
        const scaleFactor = canvas.width / 1920; 
        const renderFontSize = (textItem.fontSize || 64) * scaleFactor;
        
        ctx.globalAlpha = textItem.opacity !== undefined ? textItem.opacity / 100 : 1;
        ctx.globalCompositeOperation = (textItem.blendMode as GlobalCompositeOperation) || 'source-over';
        ctx.font = `bold ${renderFontSize}px ${textItem.fontFamily || 'Inter'}`;
        ctx.fillStyle = textItem.color || '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (textItem.filter) ctx.filter = textItem.filter;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8 * scaleFactor;
        ctx.shadowOffsetY = 4 * scaleFactor;
        ctx.fillText(textItem.text, 0, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
      });
    }
    animationFrameRef.current = requestAnimationFrame(renderCanvas);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(renderCanvas);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  });

  const exportSnapshot = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `exported_frame_${formatTime(currentTime).replace(/:/g, '-')}.png`;
    a.click();
  };

  // --- FINAL VIDEO EXPORT ENGINE ---
  const startVideoRender = () => {
    if (timelineItems.length === 0 || !canvasRef.current) return;
    
    setShowExportModal(false);
    
    const maxEnd = Math.max(...timelineItems.map(i => i.startTime + i.duration));
    if (maxEnd <= 0) return;
    totalTimelineDurationRef.current = maxEnd;
    
    setSelectedItemId(null);
    setCurrentTime(0);
    setRenderProgress(0);
    setIsRendering(true);
    recordedChunksRef.current = [];

    // Capture using configured FPS
    const stream = canvasRef.current.captureStream(exportConfig.fps);
    
    // Calculate Quality (Bitrate)
    let bitrate = 4000000; // Medium (4Mbps)
    if (exportConfig.quality === 'low') bitrate = 2000000;
    if (exportConfig.quality === 'high') bitrate = 8000000;
    if (exportConfig.resolution === '4K') bitrate *= 2.5; // Bump bitrate for 4K
    
    // Format mapping
    let mimeType = 'video/webm; codecs=vp9';
    let fileExt = 'webm';
    
    if (exportConfig.format === 'mp4') {
       // Note: mp4 in MediaRecorder isn't universally supported yet, 
       // but Safari supports 'video/mp4' and Chrome supports it with certain flags.
       mimeType = 'video/mp4; codecs="avc1.424028, mp4a.40.2"';
       fileExt = 'mp4';
    }

    let options = { mimeType, videoBitsPerSecond: bitrate };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
       // Fallback to webm if selected format is not supported by browser
       options = { mimeType: 'video/webm', videoBitsPerSecond: bitrate };
       fileExt = 'webm';
    }
    
    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: options.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rendered_video_${exportConfig.resolution}_${Date.now()}.${fileExt}`;
      a.click();
      URL.revokeObjectURL(url);
      setIsRendering(false);
      setRenderProgress(0);
    };

    setTimeout(() => {
      mediaRecorder.start(100); 
      setIsPlaying(true); 
    }, 500);
  };

  useEffect(() => {
    if (isRendering) {
      const progress = Math.min(100, (currentTime / totalTimelineDurationRef.current) * 100);
      setRenderProgress(progress);
      if (currentTime >= totalTimelineDurationRef.current) { setIsPlaying(false); mediaRecorderRef.current?.stop(); }
    }
  }, [currentTime, isRendering]);
  // ---------------------------------

  const startTransform = (e: PointerEvent, mode: TransformMode, itemId: string) => {
    e.stopPropagation();
    const item = timelineItems.find(i => i.id === itemId);
    if (!item) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setSelectedItemId(itemId);
    setActivePropertyTab("text");
    const rect = playerContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + (rect.width * (item.x || 50) / 100);
    const centerY = rect.top + (rect.height * (item.y || 50) / 100);
    setTransformMode(mode);
    setDragState({ startX: e.clientX, startY: e.clientY, initX: item.x || 50, initY: item.y || 50, initSize: item.fontSize || 64, initRot: item.rotation || 0, centerX, centerY });
  };

  const handleGlobalPointerMove = (e: PointerEvent) => {
    if (transformMode !== 'none' && selectedItemId) {
      const rect = playerContainerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTimelineItems(prev => prev.map(item => {
        if (item.id === selectedItemId) {
          if (transformMode === 'drag') {
            const dx = ((e.clientX - dragState.startX) / rect.width) * 100;
            const dy = ((e.clientY - dragState.startY) / rect.height) * 100;
            return { ...item, x: Math.max(0, Math.min(100, dragState.initX + dx)), y: Math.max(0, Math.min(100, dragState.initY + dy)) };
          } 
          else if (transformMode === 'scale') {
            const distStart = Math.hypot(dragState.startX - dragState.centerX, dragState.startY - dragState.centerY);
            const distCurrent = Math.hypot(e.clientX - dragState.centerX, e.clientY - dragState.centerY);
            const scaleRatio = distCurrent / distStart;
            return { ...item, fontSize: Math.max(10, Math.min(400, dragState.initSize * scaleRatio)) };
          }
          else if (transformMode === 'rotate') {
            const angle1 = Math.atan2(dragState.startY - dragState.centerY, dragState.startX - dragState.centerX);
            const angle2 = Math.atan2(e.clientY - dragState.centerY, e.clientX - dragState.centerX);
            let delta = (angle2 - angle1) * (180 / Math.PI);
            return { ...item, rotation: (dragState.initRot + delta) % 360 };
          }
        }
        return item;
      }));
    }

    if (timelineDrag.active && timelineDrag.itemId && timelineRef.current) {
      const dx = e.clientX - timelineDrag.startX;
      const newStartTime = Math.max(0, timelineDrag.initStartTime + (dx / timelineZoom));
      const rect = timelineRef.current.getBoundingClientRect();
      const dropY = e.clientY - rect.top;
      let newTrackId: string | null = null;
      const headerOffset = 24;
      const rowHeight = hwProfile?.isMobile ? 40 : 48;
      const trackIndex = Math.floor((dropY - headerOffset) / rowHeight);
      if (trackIndex >= 0 && trackIndex < tracks.length) {
         newTrackId = tracks[trackIndex].id;
      }

      setTimelineItems(prev => prev.map(item => {
        if (item.id === timelineDrag.itemId) {
          const finalTrack = newTrackId && isCompatibleTrack(item, newTrackId) ? newTrackId : item.trackId;
          return { ...item, startTime: newStartTime, trackId: finalTrack };
        }
        return item;
      }));
    }
  };

  const handleGlobalPointerUp = (e: PointerEvent) => {
    if (transformMode !== 'none') {
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch(err){}
      setTransformMode('none');
    }
    if (timelineDrag.active) {
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch(err){}
      setTimelineDrag({ active: false, itemId: null, startX: 0, startY: 0, initStartTime: 0, initTrack: null });
    }
  };

  const handleTimelinePointerDown = (e: PointerEvent, item: TimelineItem) => {
    e.stopPropagation();
    const track = tracks.find(t => t.id === item.trackId);
    if (track?.isLocked) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setSelectedItemId(item.id);
    setActivePropertyTab(track?.type === 'text' ? "text" : "basic");
    setTimelineDrag({ active: true, itemId: item.id, startX: e.clientX, startY: e.clientY, initStartTime: item.startTime, initTrack: item.trackId });
  };

  const handleTimelineClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (timelineDrag.active || isRendering) return; 
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const time = clickX / timelineZoom;
    setCurrentTime(time);
  };

  const deleteItem = () => { if (selectedItemId && !isRendering) { setTimelineItems(prev => prev.filter(i => i.id !== selectedItemId)); setSelectedItemId(null); } };
  
  const removeGaps = () => {
    if (isRendering) return;
    setTimelineItems(prev => {
      const newItems = [...prev];
      tracks.forEach(track => {
        const itemsInTrack = newItems.filter(i => i.trackId === track.id).sort((a, b) => a.startTime - b.startTime);
        let currentEnd = 0;
        itemsInTrack.forEach(item => {
          const originalItem = newItems.find(i => i.id === item.id);
          if (originalItem) { originalItem.startTime = currentEnd; currentEnd += originalItem.duration; }
        });
      });
      return newItems;
    });
  };

  const isCompatibleTrack = (item: TimelineItem, trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return false;
    if (item.text !== undefined && track.type === 'text') return true;
    if (item.mediaId !== undefined && (track.type === 'video' || track.type === 'audio')) return true;
    return false;
  };

  const updateSelectedProperty = (key: keyof TimelineItem, value: any) => {
    if (selectedItemId && !isRendering) setTimelineItems(prev => prev.map(i => i.id === selectedItemId ? { ...i, [key]: value } : i));
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div 
      className="h-screen w-full flex flex-col bg-[var(--color-bento-bg)] p-2 md:p-4 md:space-y-4 space-y-2 text-white font-sans overflow-hidden animate-fade-in touch-none"
      onPointerMove={handleGlobalPointerMove}
      onPointerUp={handleGlobalPointerUp}
      onPointerCancel={handleGlobalPointerUp}
    >
      
      {/* 1. Header Navbar */}
      <header className="flex justify-between items-center h-12 shrink-0 border-b border-[var(--color-bento-border)] pb-2">
        <div className="flex items-center space-x-4">
          <Link href="/" className="bento-btn w-10 h-10 flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white">
            <i className="fas fa-arrow-left text-sm"></i>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold flex items-center">
              DaVinci_Web_Engine <i className="fas fa-rocket ml-2 text-[10px] text-green-400"></i>
            </h1>
            <span className="text-[10px] text-green-400 font-bold hidden md:block">Real-time Video Export Active</span>
          </div>
        </div>
        
        {/* Hardware / Export Badges */}
        <div className="flex items-center space-x-2">
           <button onClick={exportSnapshot} disabled={isRendering} className="hidden md:flex bento-btn-accent px-4 py-1 text-xs items-center bg-[#262626] hover:bg-[#3f3f46] text-white disabled:opacity-50"><i className="fas fa-camera mr-2"></i> Snapshot</button>
           <button onClick={() => setShowExportModal(true)} disabled={isRendering || timelineItems.length === 0} className="bento-btn-accent px-4 py-1 text-xs flex items-center bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] disabled:opacity-50 disabled:shadow-none transition-all"><i className="fas fa-sliders-h mr-2"></i> Deliver</button>
           <button className="md:hidden bento-btn w-10 h-10 flex items-center justify-center" onClick={() => setShowMobileSidebar(!showMobileSidebar)}><i className="fas fa-bars"></i></button>
        </div>
      </header>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 min-h-0 relative">
        
        {/* Left: Asset Library */}
        <aside className={`w-full md:w-72 bento-card flex flex-col shrink-0 absolute md:relative z-40 md:z-auto bg-[var(--color-bento-bg)] md:bg-transparent h-full md:h-auto transition-transform ${showMobileSidebar ? 'translate-x-0' : '-translate-x-[110%] md:translate-x-0'}`}>
          <div className="flex border-b border-[var(--color-bento-border)] p-2 space-x-1">
            <button onClick={() => setActiveAssetTab("media")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "media" ? "bg-[#262626] text-white shadow-sm" : "text-[var(--color-bento-muted)] hover:text-white"}`}>Media</button>
            <button onClick={() => setActiveAssetTab("text")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "text" ? "bg-[#262626] text-white shadow-sm" : "text-[var(--color-bento-muted)] hover:text-white"}`}>Text</button>
            <button onClick={() => setActiveAssetTab("stickers")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "stickers" ? "bg-[#262626] text-white shadow-sm" : "text-[var(--color-bento-muted)] hover:text-white"}`}>Stickers</button>
            <button onClick={() => setActiveAssetTab("copilot")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "copilot" ? "bg-blue-500/20 text-blue-400 shadow-sm border border-blue-500/30" : "text-[var(--color-bento-muted)] hover:text-blue-400"}`}><i className="fas fa-robot mr-1"></i> AI</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {activeAssetTab === "copilot" && (
              <div className="space-y-4 flex flex-col h-full">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300 leading-relaxed">
                  <i className="fas fa-sparkles mr-2 text-yellow-400"></i>
                  <strong>AI Copilot</strong><br/>
                  Describe what you want me to do with your timeline, and I'll edit it instantly.
                </div>
                <textarea 
                  value={copilotPrompt} 
                  onChange={(e) => setCopilotPrompt(e.target.value)}
                  placeholder="E.g., Turn all video clips black and white, or add a text layer that says 'Hello World'..."
                  className="w-full h-32 bento-input text-xs resize-none"
                />
                <button 
                  onClick={runCopilot} 
                  disabled={isCopilotRunning || !copilotPrompt}
                  className="w-full bento-btn-accent py-3 font-bold flex items-center justify-center disabled:opacity-50"
                >
                  {isCopilotRunning ? <><i className="fas fa-circle-notch fa-spin mr-2"></i> Thinking...</> : <><i className="fas fa-magic mr-2"></i> Magic Edit</>}
                </button>
              </div>
            )}
            {activeAssetTab === "media" && (
              <div className="space-y-4">
                <input type="file" multiple accept="video/*,audio/*,image/*" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                <button onClick={() => fileInputRef.current?.click()} disabled={isRendering} className="w-full py-6 border-2 border-dashed border-[#3f3f46] rounded-xl flex flex-col items-center justify-center text-[var(--color-bento-muted)] hover:border-blue-500 hover:text-blue-400 transition-colors bg-[#0a0a0a] disabled:opacity-50">
                  <i className="fas fa-cloud-upload-alt text-xl mb-2"></i>
                  <span className="text-xs font-bold mb-1">Upload Media</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  {localMediaFiles.map(media => (
                    <div key={media.id} className="aspect-video bg-[#1a1a1a] rounded-lg border border-[var(--color-bento-border)] relative group overflow-hidden">
                      {media.type === 'video' || media.type === 'image' ? <img src={media.url} className="w-full h-full object-cover" alt={media.name} /> : <div className="w-full h-full flex items-center justify-center bg-[#262626]"><i className="fas fa-music text-green-400"></i></div>}
                      <button onClick={() => { addToTimeline(media); setShowMobileSidebar(false); }} disabled={isRendering} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 md:opacity-100 md:bg-transparent flex items-center justify-center transition-opacity disabled:hidden">
                        <div className="w-8 h-8 rounded-full bg-blue-500/80 text-white flex items-center justify-center shadow-lg hover:scale-110"><i className="fas fa-plus"></i></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeAssetTab === "text" && (
              <div className="space-y-4">
                 <button onClick={addTextToTimeline} disabled={isRendering} className="w-full p-4 border border-[var(--color-bento-border)] rounded-lg bg-[#1a1a1a] flex items-center hover:border-purple-500 transition-colors group disabled:opacity-50">
                    <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-md flex items-center justify-center mr-3 group-hover:bg-purple-500 group-hover:text-white transition-colors"><i className="fas fa-font text-lg"></i></div>
                    <div className="text-left"><h3 className="text-sm font-bold">Standard Text</h3></div>
                 </button>
              </div>
            )}
            {activeAssetTab === "stickers" && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '🔥', name: 'Fire' },
                  { icon: '⭐', name: 'Star' },
                  { icon: '💥', name: 'Boom' },
                  { icon: '❤️', name: 'Heart' },
                  { icon: '🚀', name: 'Rocket' },
                  { icon: '💯', name: '100' }
                ].map((sticker, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      const svgUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><text x="50" y="50" font-size="80" text-anchor="middle" dominant-baseline="central">${sticker.icon}</text></svg>`;
                      addToTimeline({ id: `stk_${idx}`, name: sticker.name, url: svgUri, type: 'image' });
                    }}
                    disabled={isRendering} 
                    className="aspect-square bg-[#1a1a1a] border border-[#262626] rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-[#262626] transition-colors text-4xl"
                  >
                    {sticker.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="md:hidden absolute bottom-4 left-4 right-4 bento-btn-accent py-3 font-bold" onClick={() => setShowMobileSidebar(false)}>Close Library</button>
        </aside>

        {/* Center: True Canvas Compositor Player */}
        <main className="flex-1 bento-card flex flex-col p-2 md:p-4 relative min-w-0">
          <div 
            ref={playerContainerRef}
            className="flex-1 bg-[#050505] rounded-xl overflow-hidden relative border border-[#262626] shadow-inner touch-none cursor-crosshair"
            onClick={() => { if(transformMode === 'none' && !isRendering) setSelectedItemId(null); }}
          >
            <div className="hidden">
      {timelineItems.filter(i => i.mediaType === 'video' || i.mediaType === 'audio').map(item => {
         const El = item.mediaType === 'audio' ? 'audio' : 'video';
         return <El key={item.id} id={`player-${item.id}`} src={item.url} muted={item.mediaType === 'video'} crossOrigin="anonymous" />;
      })}
   </div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-black pointer-events-none" />

            {activeVisualItems.length === 0 && <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none"><i className="fas fa-film text-4xl md:text-6xl mb-4"></i></div>}

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...activeVisualItems, ...activeTextItems].map(clip => {
                const isSelected = selectedItemId === clip.id && !isRendering;
                // If V1 is fullscreen, we only want it clickable if selected or if clicking empty space selects it (handled separately)
                // But let's allow it
                if (clip.trackId === 'V1' && !isSelected && clip.width === 100 && clip.x === 50 && clip.y === 50) return null; // Let background be background until clicked via timeline
                
                return (
                  <div 
                    key={clip.id} 
                    className={`absolute inline-block pointer-events-auto select-none touch-none ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''}`}
                    style={{ left: `${clip.x || 50}%`, top: `${clip.y || 50}%`, transform: `translate(-50%, -50%) rotate(${clip.rotation || 0}deg)`, cursor: isSelected ? (transformMode === 'drag' ? 'grabbing' : 'grab') : 'pointer', ...getClipDOMStyle(clip) }}
                    onPointerDown={(e) => { if (!isRendering) startTransform(e, 'drag', clip.id); }}
                  >
                    {clip.trackId === 'T1' && <div style={{ fontSize: `${clip.fontSize}px`, color: 'transparent', fontFamily: clip.fontFamily, whiteSpace: 'nowrap' }}>{clip.text}</div>}
                    
                    {isSelected && (
                      <>
                        <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg" onPointerDown={(e) => startTransform(e, 'rotate', clip.id)}></div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-blue-500 pointer-events-none"></div>
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 shadow-sm" onPointerDown={(e) => startTransform(e, 'scale', clip.id)}></div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 shadow-sm" onPointerDown={(e) => startTransform(e, 'scale', clip.id)}></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 shadow-sm" onPointerDown={(e) => startTransform(e, 'scale', clip.id)}></div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 shadow-sm" onPointerDown={(e) => startTransform(e, 'scale', clip.id)}></div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rendering Overlay */}
            {isRendering && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
                <i className="fas fa-compact-disc fa-spin text-5xl text-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]"></i>
                <h3 className="text-2xl font-bold text-white mb-2">Rendering {exportConfig.resolution}...</h3>
                <p className="text-sm text-[var(--color-bento-muted)] mb-6">Processing frames at {exportConfig.fps} FPS</p>
                <div className="w-72 h-3 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#3f3f46] shadow-inner">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300" style={{ width: `${renderProgress}%` }}></div>
                </div>
                <div className="flex justify-between w-72 mt-2 font-mono text-xs font-bold text-white">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-green-400">{renderProgress.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-12 md:h-16 shrink-0 mt-2 flex items-center justify-between px-2">
            <div className="font-mono text-xs md:text-sm text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">{formatTime(currentTime)}</div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button disabled={isRendering} className="text-[var(--color-bento-muted)] hover:text-white disabled:opacity-50" onClick={() => setCurrentTime(prev => Math.max(0, prev - 1))}><i className="fas fa-step-backward"></i></button>
              <button disabled={isRendering} onClick={togglePlay} className="w-10 h-10 bg-white text-black rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:shadow-none"><i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i></button>
              <button disabled={isRendering} className="text-[var(--color-bento-muted)] hover:text-white disabled:opacity-50" onClick={() => setCurrentTime(prev => prev + 1)}><i className="fas fa-step-forward"></i></button>
            </div>
            <div className="w-16"></div>
          </div>
        </main>

        {/* Right: Properties Panel */}
        <aside className={`w-full md:w-80 bento-card flex-col shrink-0 overflow-hidden ${selectedItem && hwProfile?.isMobile && !isRendering ? 'flex' : (hwProfile?.isMobile ? 'hidden' : 'flex')} ${isRendering ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex border-b border-[var(--color-bento-border)] p-2 space-x-1 bg-[#141414]">
            <button onClick={() => setActivePropertyTab("basic")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md ${activePropertyTab === "basic" ? "bg-[#262626] text-white" : "text-[var(--color-bento-muted)]"}`}>Props</button>
            {selectedItem?.trackId === 'T1' && <button onClick={() => setActivePropertyTab("text")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md ${activePropertyTab === "text" ? "bg-[#262626] text-purple-400" : "text-[var(--color-bento-muted)]"}`}>Text</button>}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {!selectedItem ? (
              <div className="text-center mt-20 text-[var(--color-bento-muted)] flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4 border border-[#262626]">
                    <i className="fas fa-sliders-h text-2xl opacity-50"></i>
                 </div>
                 <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Inspector</p>
                 <p className="text-[10px] mt-2 leading-relaxed">Select any clip on the timeline<br/>to edit its properties here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Visual Properties (Video, Image, Text) */}
                {activePropertyTab === "basic" && (selectedItem.mediaType !== 'audio') && (
                   <div className="space-y-4">
                      {/* Opacity */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-[#a1a1aa]"><span>Opacity</span> <span>{selectedItem.opacity ?? 100}%</span></div>
                        <input type="range" min="0" max="100" value={selectedItem.opacity ?? 100} onChange={(e) => updateSelectedProperty('opacity', Number(e.target.value))} className="w-full h-1 accent-purple-500 bg-[#262626] rounded-lg" />
                      </div>
                      
                      {/* Scale */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-[#a1a1aa]"><span>Scale</span> <span>{selectedItem.trackId === 'T1' ? selectedItem.fontSize || 64 : selectedItem.width || 100}</span></div>
                        <input type="range" min="10" max="400" value={selectedItem.trackId === 'T1' ? selectedItem.fontSize || 64 : selectedItem.width || 100} onChange={(e) => {
                          const val = Number(e.target.value);
                          if (selectedItem.trackId === 'T1') updateSelectedProperty('fontSize', val);
                          else { updateSelectedProperty('width', val); updateSelectedProperty('height', val); }
                        }} className="w-full h-1 accent-blue-500 bg-[#262626] rounded-lg" />
                      </div>

                      {/* Rotation */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-[#a1a1aa]"><span>Rotation</span> <span>{Math.round(selectedItem.rotation || 0)}°</span></div>
                        <input type="range" min="0" max="360" value={selectedItem.rotation || 0} onChange={(e) => updateSelectedProperty('rotation', Number(e.target.value))} className="w-full h-1 accent-green-500 bg-[#262626] rounded-lg" />
                      </div>

                      {/* Position X/Y */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#a1a1aa]">Position X</label>
                          <input type="number" value={Math.round(selectedItem.x || 50)} onChange={(e) => updateSelectedProperty('x', Number(e.target.value))} className="bento-input text-xs w-full" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#a1a1aa]">Position Y</label>
                          <input type="number" value={Math.round(selectedItem.y || 50)} onChange={(e) => updateSelectedProperty('y', Number(e.target.value))} className="bento-input text-xs w-full" />
                        </div>
                      </div>

                      {/* Blend Mode */}
                      <div className="space-y-1 pt-2 border-t border-[#262626]">
                        <label className="text-xs font-bold text-[#a1a1aa]">Blend Mode</label>
                        <select value={selectedItem.blendMode || 'source-over'} onChange={(e) => updateSelectedProperty('blendMode', e.target.value)} className="bento-input text-xs w-full">
                          <option value="source-over">Normal</option>
                          <option value="multiply">Multiply</option>
                          <option value="screen">Screen</option>
                          <option value="overlay">Overlay</option>
                          <option value="color-dodge">Color Dodge</option>
                          <option value="color-burn">Color Burn</option>
                          <option value="hard-light">Hard Light</option>
                          <option value="difference">Difference</option>
                          <option value="exclusion">Exclusion</option>
                        </select>
                      </div>
                   </div>
                )}

                {/* Audio Properties (Audio, Video) */}
                {activePropertyTab === "basic" && (selectedItem.mediaType === 'audio' || selectedItem.mediaType === 'video') && (
                   <div className="space-y-4 pt-2 border-t border-[#262626]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-[#a1a1aa]"><span>Volume</span> <span>{selectedItem.volume ?? 100}%</span></div>
                        <input type="range" min="0" max="100" value={selectedItem.volume ?? 100} onChange={(e) => updateSelectedProperty('volume', Number(e.target.value))} className="w-full h-1 accent-green-400 bg-[#262626] rounded-lg" />
                      </div>
                   </div>
                )}

                {/* Text Specific Properties */}
                {activePropertyTab === "text" && selectedItem.trackId === 'T1' && (
                  <div className="space-y-4">
                    <textarea className="bento-input w-full text-xs h-24 resize-none font-bold" value={selectedItem.text || ''} onChange={(e) => updateSelectedProperty('text', e.target.value)} placeholder="Type here..." />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#a1a1aa]">Font</label>
                        <select className="bento-input text-xs w-full" value={selectedItem.fontFamily || 'Inter'} onChange={(e) => updateSelectedProperty('fontFamily', e.target.value)}>
                          <option value="Inter">Inter</option>
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#a1a1aa]">Color</label>
                        <input type="color" value={selectedItem.color || '#ffffff'} onChange={(e) => updateSelectedProperty('color', e.target.value)} className="w-full h-8 rounded border-none bg-transparent cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}
                
                <button onClick={() => setSelectedItemId(null)} className="md:hidden w-full bento-btn py-2 text-xs mt-4">Done Editing</button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. Bottom Timeline */}
      <div className={`h-48 md:h-72 bento-card shrink-0 flex flex-col relative overflow-hidden select-none touch-none ${isRendering ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="h-8 md:h-10 border-b border-[var(--color-bento-border)] flex items-center justify-between px-2 md:px-4 bg-[#141414]">
          <div className="flex space-x-2">
            <button onClick={deleteItem} disabled={!selectedItem} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${selectedItem ? 'bg-red-500/20 text-red-400' : 'text-[#3f3f46]'}`}><i className="fas fa-trash"></i></button>
            <button onClick={removeGaps} className="h-6 px-3 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold flex items-center"><i className="fas fa-magnet md:mr-1"></i> <span className="hidden md:inline">Remove Gaps</span></button>
          </div>
          <div className="flex items-center space-x-2 w-32 md:w-48"><input type="range" min="10" max="200" value={timelineZoom} onChange={(e) => setTimelineZoom(Number(e.target.value))} className="w-full h-1 accent-[#52525b] bg-[#262626] rounded-lg" /></div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div ref={trackHeadersRef} className="w-24 md:w-56 bg-[#0a0a0a] border-r border-[var(--color-bento-border)] z-30 flex flex-col shrink-0 overflow-y-hidden custom-scrollbar">
            <div className="h-6 bg-[#141414] shrink-0 border-b border-[#262626] flex items-center justify-center text-[8px] text-gray-600 font-mono tracking-widest sticky top-0 z-40">TRACKS</div>
            {tracks.map(track => (
              <div key={track.id} className="shrink-0 flex items-center justify-between px-2 border-b border-[#262626] group bg-[#111] hover:bg-[#1a1a1a]" style={{ height: hwProfile?.isMobile ? 40 : 48 }}>
                <div className="flex items-center w-full min-w-0">
                  <div className="w-6 h-6 rounded bg-[#222] flex items-center justify-center mr-2 shrink-0 border border-[#333]">
                     {track.type === 'video' ? <i className="fas fa-video text-blue-400 text-[10px]"></i> : track.type === 'audio' ? <i className="fas fa-music text-green-400 text-[10px]"></i> : <i className="fas fa-font text-purple-400 text-[10px]"></i>}
                  </div>
                  <input type="text" value={track.name} onChange={(e) => renameTrack(track.id, e.target.value)} className="bg-transparent text-[10px] font-bold text-gray-400 w-full outline-none focus:text-white truncate" />
                </div>
                <div className="flex space-x-1 shrink-0 ml-2">
                  {(track.type === 'video' || track.type === 'text') && (
                    <button onClick={() => toggleTrackProperty(track.id, 'isHidden')} className={`w-5 h-5 rounded flex items-center justify-center text-[10px] transition-colors ${track.isHidden ? 'bg-red-500/20 text-red-400' : 'hover:bg-[#262626] text-gray-500 hover:text-white'}`} title="Toggle Visibility"><i className={`fas ${track.isHidden ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                  )}
                  {track.type === 'audio' && (
                    <button onClick={() => toggleTrackProperty(track.id, 'isMuted')} className={`w-5 h-5 rounded flex items-center justify-center text-[10px] transition-colors ${track.isMuted ? 'bg-red-500/20 text-red-400' : 'hover:bg-[#262626] text-gray-500 hover:text-white'}`} title="Mute Track"><i className={`fas ${track.isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i></button>
                  )}
                  <button onClick={() => toggleTrackProperty(track.id, 'isLocked')} className={`w-5 h-5 rounded flex items-center justify-center text-[10px] transition-colors ${track.isLocked ? 'bg-red-500/20 text-red-400' : 'hover:bg-[#262626] text-gray-500 hover:text-white'}`} title="Lock Track"><i className={`fas ${track.isLocked ? 'fa-lock' : 'fa-unlock'}`}></i></button>
                </div>
              </div>
            ))}
            <div className="p-2 shrink-0 flex flex-col space-y-1 mt-auto border-t border-[#262626] bg-[#0a0a0a] sticky bottom-0 z-40">
              <button onClick={() => setTracks(sortTracks([...tracks, { id: Math.random().toString(36).substr(2, 9), type: 'video', name: 'Video ' + (tracks.filter(t=>t.type==='video').length + 1) }]))} className="w-full text-[10px] font-bold bg-[#1a1a1a] border border-[#262626] hover:border-blue-500/50 hover:bg-blue-600/10 hover:text-blue-400 text-gray-400 transition-all py-1.5 rounded">+ Video Track</button>
              <button onClick={() => setTracks(sortTracks([...tracks, { id: Math.random().toString(36).substr(2, 9), type: 'audio', name: 'Audio ' + (tracks.filter(t=>t.type==='audio').length + 1) }]))} className="w-full text-[10px] font-bold bg-[#1a1a1a] border border-[#262626] hover:border-green-500/50 hover:bg-green-600/10 hover:text-green-400 text-gray-400 transition-all py-1.5 rounded">+ Audio Track</button>
            </div>
          </div>

          <div 
            ref={timelineRef} 
            className="flex-1 bg-[#0f0f0f] relative overflow-auto custom-scrollbar" 
            style={{ backgroundImage: 'linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: `${timelineZoom}px 100%` }} 
            onClick={(e) => { if (e.target === e.currentTarget) handleTimelineClick(e); }}
            onScroll={(e) => {
              if (trackHeadersRef.current) {
                trackHeadersRef.current.scrollTop = e.currentTarget.scrollTop;
              }
            }}
          >
            <div className="absolute top-0 left-0 h-6 bg-[#141414] border-b border-[#262626] pointer-events-none z-20 opacity-80 sticky-time-ruler" style={{ width: Math.max(3600 * timelineZoom, timelineRef.current?.scrollWidth || 0), backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent calc(100px - 1px), #333 100px)', backgroundSize: '100px 100%' }}></div>
            {tracks.map((track, i) => (
              <div key={track.id} className="absolute left-0 right-0 pointer-events-none transition-all border-b border-[#262626]/50" style={{ top: 24 + i * (hwProfile?.isMobile ? 40 : 48), height: hwProfile?.isMobile ? 40 : 48 }}>
                {timelineItems.filter(item => item.trackId === track.id).map(clip => {
                  let colorClass = 'bg-[#1e3a8a] border-[#3b82f6] text-blue-100'; // Video (Blue)
                  if (track.type === 'audio') colorClass = 'bg-[#14532d] border-[#22c55e] text-green-100'; // Audio (Green)
                  if (track.type === 'text') colorClass = 'bg-[#4c1d95] border-[#8b5cf6] text-purple-100'; // Text (Purple)
                  
                  return (
                    <div key={clip.id} onPointerDown={(e) => handleTimelinePointerDown(e, clip)} className={`absolute rounded-md border pointer-events-auto flex items-center px-2 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.5)] touch-none transition-shadow ${colorClass} ${selectedItemId === clip.id ? 'border-white ring-1 ring-white/50 z-20 scale-[1.02]' : 'z-10'} ${timelineDrag.itemId === clip.id ? 'opacity-50' : 'opacity-100'} ${track.isLocked ? 'stripes-bg grayscale cursor-not-allowed' : ''}`} style={{ left: clip.startTime * timelineZoom, width: Math.max(10, clip.duration * timelineZoom), top: 4, bottom: 4 }}>
                      {track.type === 'video' && <i className="fas fa-film text-[8px] mr-1 opacity-50 shrink-0"></i>}
                      {track.type === 'audio' && <i className="fas fa-waveform text-[8px] mr-1 opacity-50 shrink-0"></i>}
                      {track.type === 'text' && <i className="fas fa-font text-[8px] mr-1 opacity-50 shrink-0"></i>}
                      <span className="text-[10px] font-bold truncate">{clip.text ? `"${clip.text}"` : (clip.name || 'Media')}</span>
                    </div>
                  );
                })}
              </div>
            ))}
            
            {/* Timeline filler to allow horizontal scrolling even when empty */}
            <div className="absolute top-0 h-[1px] pointer-events-none" style={{ width: Math.max(3600 * timelineZoom, timelineRef.current?.scrollWidth || 0) }}></div>
            
            {/* Total height filler to ensure proper vertical scrolling */}
            <div className="absolute left-0 pointer-events-none" style={{ top: 24 + tracks.length * (hwProfile?.isMobile ? 40 : 48) + 60, width: 1, height: 1 }}></div>

            <div className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-40 pointer-events-none transition-all duration-75" style={{ left: currentTime * timelineZoom }}>
               <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-red-500 absolute -top-0 -translate-x-1/2 sticky top-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Profiler Modal */}
      {hwProfile?.showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-[var(--color-bento-border)] rounded-xl max-w-md w-full p-6 text-center space-y-4">
            <i className={`fas fa-microchip text-4xl ${hwProfile.tier === 'Pro' ? 'text-green-500' : hwProfile.tier === 'Standard' ? 'text-blue-500' : 'text-orange-500'}`}></i>
            <h2 className="text-xl font-bold">System Profiler</h2>
            <div className="text-sm text-[var(--color-bento-muted)] space-y-2">
              <p>We analyzed your hardware to configure optimal limits.</p>
              <div className="bg-[#1a1a1a] p-3 rounded text-left font-mono text-[10px] space-y-1 text-white border border-[#262626]">
                <p>Est. RAM: {hwProfile.ram}GB</p>
                <p>CPU Cores: {hwProfile.cores}</p>
                <p>Platform: {hwProfile.isMobile ? 'Mobile/Touch' : 'Desktop'}</p>
              </div>
              <p>Performance Tier: <strong className="text-white">{hwProfile.tier}</strong></p>
              <p>Max Resolution: <strong className="text-white">{hwProfile.maxRes}</strong></p>
            </div>
            <button onClick={() => setHwProfile({ ...hwProfile, showModal: false })} className="w-full bento-btn-accent py-3 font-bold mt-4">Acknowledge</button>
          </div>
        </div>
      )}

      {/* Advanced Export Settings Modal (Deliver Tab) */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-[var(--color-bento-border)] rounded-xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#262626] pb-4">
              <h2 className="text-xl font-bold flex items-center"><i className="fas fa-sliders-h mr-3 text-blue-400"></i> Render Settings</h2>
              <button onClick={() => setShowExportModal(false)} className="text-[var(--color-bento-muted)] hover:text-white"><i className="fas fa-times"></i></button>
            </div>

            <div className="space-y-4">
              {/* Resolution */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Resolution</label>
                <select 
                  className="bento-input w-full"
                  value={exportConfig.resolution}
                  onChange={(e) => setExportConfig({...exportConfig, resolution: e.target.value as ExportResolution})}
                >
                  <option value="720p">1280 × 720 (720p HD)</option>
                  <option value="1080p">1920 × 1080 (1080p FHD)</option>
                  <option value="4K">3840 × 2160 (4K UHD)</option>
                </select>
                {exportConfig.resolution === '4K' && hwProfile?.tier !== 'Pro' && (
                  <p className="text-[10px] text-orange-400 mt-1 flex items-start"><i className="fas fa-exclamation-triangle mt-0.5 mr-1"></i> Warning: Rendering 4K on non-Pro hardware may cause browser instability.</p>
                )}
              </div>

              {/* Framerate */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Framerate (FPS)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[24, 30, 60].map((fps) => (
                    <button 
                      key={fps}
                      onClick={() => setExportConfig({...exportConfig, fps: fps as ExportFPS})}
                      className={`py-2 rounded-lg text-sm font-bold transition-all border ${exportConfig.fps === fps ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#1a1a1a] border-[#262626] text-[var(--color-bento-muted)] hover:text-white'}`}
                    >
                      {fps}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality / Bitrate */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Quality (Bitrate)</label>
                <select 
                  className="bento-input w-full"
                  value={exportConfig.quality}
                  onChange={(e) => setExportConfig({...exportConfig, quality: e.target.value as ExportQuality})}
                >
                  <option value="low">Low (Fast render, small file)</option>
                  <option value="medium">Medium (Standard web delivery)</option>
                  <option value="high">High (Best quality, large file)</option>
                </select>
              </div>

              {/* Format */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Format</label>
                <select 
                  className="bento-input w-full"
                  value={exportConfig.format}
                  onChange={(e) => setExportConfig({...exportConfig, format: e.target.value as ExportFormat})}
                >
                  <option value="webm">WebM (VP9) - Best Web Compatibility</option>
                  <option value="mp4">MP4 (H.264) - Best Universal Compatibility</option>
                </select>
                {exportConfig.format === 'mp4' && (
                  <p className="text-[10px] text-blue-400 mt-1 flex items-start"><i className="fas fa-info-circle mt-0.5 mr-1"></i> If your browser does not support native MP4 recording, it will automatically fallback to WebM.</p>
                )}
              </div>

              {/* Format Summary */}
              <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#262626] text-xs text-[var(--color-bento-muted)] flex justify-between items-center">
                <span>Output File:</span>
                <span className="font-mono text-white bg-[#262626] px-2 py-0.5 rounded">.{exportConfig.format}</span>
              </div>
            </div>

            <button 
              onClick={startVideoRender}
              className="w-full bento-btn-accent py-4 font-bold text-lg bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex justify-center items-center group"
            >
              <i className="fas fa-rocket mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i> Add to Render Queue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
