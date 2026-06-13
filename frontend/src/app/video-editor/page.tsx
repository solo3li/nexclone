"use client";

import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, PointerEvent } from "react";
import Link from "next/link";

interface LocalMedia { id: string; name: string; url: string; type: string; }
type TrackID = 'V1' | 'A1' | 'T1';
interface TimelineItem { id: string; trackId: TrackID; mediaId?: string; url?: string; name?: string; text?: string; startTime: number; duration: number; sourceOffset: number; filter?: string; x?: number; y?: number; fontSize?: number; color?: string; fontFamily?: string; rotation?: number; }
type TransformMode = 'none' | 'drag' | 'scale' | 'rotate';
type HwProfile = { ram: number; cores: number; tier: 'Pro' | 'Standard' | 'Limited'; showModal: boolean; maxRes: string; maxDur: number; isMobile: boolean };

export default function VideoEditor() {
  const [activeAssetTab, setActiveAssetTab] = useState("media");
  const [activePropertyTab, setActivePropertyTab] = useState("color");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const [hwProfile, setHwProfile] = useState<HwProfile | null>(null);

  const [localMediaFiles, setLocalMediaFiles] = useState<LocalMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [timelineZoom, setTimelineZoom] = useState(50); 

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>('none');
  const [dragState, setDragState] = useState({ startX: 0, startY: 0, initX: 0, initY: 0, initSize: 0, initRot: 0, centerX: 0, centerY: 0 });

  const [timelineDrag, setTimelineDrag] = useState<{ active: boolean, itemId: string | null, startX: number, startY: number, initStartTime: number, initTrack: TrackID | null }>({ active: false, itemId: null, startX: 0, startY: 0, initStartTime: 0, initTrack: null });
  const timelineRef = useRef<HTMLDivElement>(null);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playheadIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Render Engine State
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const totalTimelineDurationRef = useRef<number>(0);

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
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({ id: Math.random().toString(36).substr(2, 9), name: file.name, url: URL.createObjectURL(file), type: file.type.split('/')[0] }));
      setLocalMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const addToTimeline = (media: LocalMedia) => {
    const trackId: TrackID = media.type === 'audio' ? 'A1' : 'V1';
    const trackItems = timelineItems.filter(i => i.trackId === trackId);
    let start = 0;
    if (trackItems.length > 0) {
      const lastItem = trackItems.reduce((prev, current) => (prev.startTime + prev.duration > current.startTime + current.duration) ? prev : current);
      start = lastItem.startTime + lastItem.duration;
    }
    const newItem: TimelineItem = { id: Math.random().toString(36).substr(2, 9), trackId, mediaId: media.id, url: media.url, name: media.name, startTime: start, duration: 10, sourceOffset: 0 };
    setTimelineItems(prev => [...prev, newItem]);
    const el = document.createElement(media.type === 'audio' ? 'audio' : 'video');
    el.src = media.url;
    el.onloadedmetadata = () => setTimelineItems(prev => prev.map(i => i.id === newItem.id ? { ...i, duration: el.duration } : i));
  };

  const addTextToTimeline = () => {
    const newItem: TimelineItem = { id: Math.random().toString(36).substr(2, 9), trackId: 'T1', text: "Double Click to Edit", startTime: currentTime, duration: 5, sourceOffset: 0, x: 50, y: 50, fontSize: 64, color: "#ffffff", fontFamily: "Inter", rotation: 0 };
    setTimelineItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);
    setActivePropertyTab("text");
    if (hwProfile?.isMobile) setShowMobileSidebar(false);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying) playheadIntervalRef.current = setInterval(() => setCurrentTime(prev => prev + 0.05), 50);
    else { if (playheadIntervalRef.current) clearInterval(playheadIntervalRef.current); if (videoPlayerRef.current) videoPlayerRef.current.pause(); }
    return () => { if (playheadIntervalRef.current) clearInterval(playheadIntervalRef.current); };
  }, [isPlaying]);

  useEffect(() => {
    const activeVideo = timelineItems.find(i => i.trackId === 'V1' && currentTime >= i.startTime && currentTime < i.startTime + i.duration);
    if (videoPlayerRef.current) {
      if (activeVideo) {
        if (videoPlayerRef.current.src !== activeVideo.url) videoPlayerRef.current.src = activeVideo.url || '';
        const expectedTime = (currentTime - activeVideo.startTime) + activeVideo.sourceOffset;
        if (Math.abs(videoPlayerRef.current.currentTime - expectedTime) > 0.2) videoPlayerRef.current.currentTime = expectedTime;
        if (isPlaying && videoPlayerRef.current.paused) videoPlayerRef.current.play().catch(() => {});
        else if (!isPlaying && !videoPlayerRef.current.paused) videoPlayerRef.current.pause();
      } else { videoPlayerRef.current.pause(); videoPlayerRef.current.src = ""; }
    }
  }, [currentTime, timelineItems, isPlaying]);

  // --- CANVAS RENDERING ENGINE ---
  const activeTextItems = timelineItems.filter(i => i.trackId === 'T1' && currentTime >= i.startTime && currentTime < i.startTime + i.duration);
  const activeVideoItem = timelineItems.find(i => i.trackId === 'V1' && currentTime >= i.startTime && currentTime < i.startTime + i.duration);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const container = playerContainerRef.current;
    
    if (canvas && ctx && container) {
      const rect = container.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) { canvas.width = rect.width; canvas.height = rect.height; }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (activeVideoItem && videoPlayerRef.current && videoPlayerRef.current.readyState >= 2) {
        const videoRatio = videoPlayerRef.current.videoWidth / videoPlayerRef.current.videoHeight;
        const canvasRatio = canvas.width / canvas.height;
        let drawW = canvas.width, drawH = canvas.height, drawX = 0, drawY = 0;
        if (videoRatio > canvasRatio) { drawH = canvas.width / videoRatio; drawY = (canvas.height - drawH) / 2; }
        else { drawW = canvas.height * videoRatio; drawX = (canvas.width - drawW) / 2; }

        ctx.filter = activeVideoItem.filter || 'none';
        ctx.drawImage(videoPlayerRef.current, drawX, drawY, drawW, drawH);
        ctx.filter = 'none'; 
      }

      activeTextItems.forEach(textItem => {
        if (!textItem.text) return;
        ctx.save();
        const pxX = (textItem.x || 50) * canvas.width / 100;
        const pxY = (textItem.y || 50) * canvas.height / 100;
        ctx.translate(pxX, pxY);
        ctx.rotate(((textItem.rotation || 0) * Math.PI) / 180);
        ctx.font = `bold ${textItem.fontSize || 64}px ${textItem.fontFamily || 'Inter'}`;
        ctx.fillStyle = textItem.color || '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (textItem.filter) ctx.filter = textItem.filter;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        ctx.fillText(textItem.text, 0, 0);
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
    
    // 1. Calculate Total Duration
    const maxEnd = Math.max(...timelineItems.map(i => i.startTime + i.duration));
    if (maxEnd <= 0) return;
    totalTimelineDurationRef.current = maxEnd;
    
    // 2. Reset State
    setSelectedItemId(null);
    setCurrentTime(0);
    setRenderProgress(0);
    setIsRendering(true);
    recordedChunksRef.current = [];

    // 3. Initialize MediaRecorder (Capture 60fps Canvas Stream)
    const stream = canvasRef.current.captureStream(60);
    let options = { mimeType: 'video/webm; codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { mimeType: 'video/webm' };
    
    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rendered_video_${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setIsRendering(false);
      setRenderProgress(0);
    };

    // Give the video elements a tiny moment to seek to 0 before starting recording
    setTimeout(() => {
      mediaRecorder.start(100); // chunk every 100ms
      setIsPlaying(true); // Auto-play the timeline
    }, 500);
  };

  // Monitor Render Progress
  useEffect(() => {
    if (isRendering) {
      const progress = Math.min(100, (currentTime / totalTimelineDurationRef.current) * 100);
      setRenderProgress(progress);

      if (currentTime >= totalTimelineDurationRef.current) {
        setIsPlaying(false);
        mediaRecorderRef.current?.stop();
      }
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
      let newTrackId: TrackID | null = null;
      if (dropY >= 24 && dropY < 88) newTrackId = 'V1';
      else if (dropY >= 88 && dropY < 152) newTrackId = 'A1';
      else if (dropY >= 152) newTrackId = 'T1';

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
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setSelectedItemId(item.id);
    setActivePropertyTab(item.trackId === 'T1' ? "text" : "basic");
    setTimelineDrag({ active: true, itemId: item.id, startX: e.clientX, startY: e.clientY, initStartTime: item.startTime, initTrack: item.trackId });
  };

  const handleTimelineClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (timelineDrag.active || isRendering) return; 
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const time = clickX / timelineZoom;
    setCurrentTime(time);
    if (videoPlayerRef.current) videoPlayerRef.current.currentTime = time;
  };

  const deleteItem = () => { if (selectedItemId && !isRendering) { setTimelineItems(prev => prev.filter(i => i.id !== selectedItemId)); setSelectedItemId(null); } };
  
  const removeGaps = () => {
    if (isRendering) return;
    setTimelineItems(prev => {
      const newItems = [...prev];
      ['V1', 'A1', 'T1'].forEach(tId => {
        const itemsInTrack = newItems.filter(i => i.trackId === tId).sort((a, b) => a.startTime - b.startTime);
        let currentEnd = 0;
        itemsInTrack.forEach(item => {
          const originalItem = newItems.find(i => i.id === item.id);
          if (originalItem) { originalItem.startTime = currentEnd; currentEnd += originalItem.duration; }
        });
      });
      return newItems;
    });
  };

  const isCompatibleTrack = (item: TimelineItem, track: TrackID) => {
    if (item.text !== undefined && track === 'T1') return true;
    if (item.mediaId !== undefined && (track === 'V1' || track === 'A1')) return true;
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
           <button onClick={startVideoRender} disabled={isRendering || timelineItems.length === 0} className="bento-btn-accent px-4 py-1 text-xs flex items-center bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] disabled:opacity-50 disabled:shadow-none transition-all"><i className="fas fa-file-export mr-2"></i> Export Video</button>
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
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
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
            {/* The Hidden Source Video */}
            <video ref={videoPlayerRef} className="hidden opacity-0 pointer-events-none" muted={true} crossOrigin="anonymous" />
            
            {/* The Master Output Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-black pointer-events-none" />

            {!activeVideoItem && <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none"><i className="fas fa-film text-4xl md:text-6xl mb-4"></i></div>}

            {/* Transform Controls Overlay (Invisible bounds, handles only) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {activeTextItems.map(textItem => {
                const isSelected = selectedItemId === textItem.id && !isRendering; // Hide controls while rendering
                return (
                  <div 
                    key={textItem.id} 
                    className={`absolute inline-block pointer-events-auto select-none touch-none ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''}`}
                    style={{ left: `${textItem.x}%`, top: `${textItem.y}%`, transform: `translate(-50%, -50%) rotate(${textItem.rotation}deg)`, cursor: isSelected ? (transformMode === 'drag' ? 'grabbing' : 'grab') : 'pointer' }}
                    onPointerDown={(e) => { if (!isRendering) startTransform(e, 'drag', textItem.id); }}
                  >
                    <div style={{ fontSize: `${textItem.fontSize}px`, color: 'transparent', fontFamily: textItem.fontFamily, whiteSpace: 'nowrap' }}>{textItem.text}</div>
                    
                    {isSelected && (
                      <>
                        <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg" onPointerDown={(e) => startTransform(e, 'rotate', textItem.id)}></div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-blue-500 pointer-events-none"></div>
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 shadow-sm" onPointerDown={(e) => startTransform(e, 'scale', textItem.id)}></div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 shadow-sm" onPointerDown={(e) => startTransform(e, 'scale', textItem.id)}></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 shadow-sm" onPointerDown={(e) => startTransform(e, 'scale', textItem.id)}></div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 shadow-sm" onPointerDown={(e) => startTransform(e, 'scale', textItem.id)}></div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rendering Overlay */}
            {isRendering && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <i className="fas fa-cog fa-spin text-4xl text-green-400 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]"></i>
                <h3 className="text-xl font-bold text-white mb-2">Rendering Video...</h3>
                <div className="w-64 h-2 bg-[#262626] rounded-full overflow-hidden border border-[#3f3f46]">
                  <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${renderProgress}%` }}></div>
                </div>
                <p className="font-mono text-xs text-[var(--color-bento-muted)] mt-2">{renderProgress.toFixed(1)}%</p>
                <p className="text-[10px] text-red-400 mt-4 animate-pulse">Do not close this tab. Recording real-time stream.</p>
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
            {!selectedItem ? <div className="text-center text-[10px] text-[var(--color-bento-muted)] mt-10">Select a clip</div> : (
              <div className="space-y-4">
                {activePropertyTab === "text" && selectedItem.trackId === 'T1' && (
                  <div className="space-y-4">
                    <textarea className="bento-input w-full text-xs h-16 resize-none font-bold" value={selectedItem.text || ''} onChange={(e) => updateSelectedProperty('text', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <select className="bento-input text-xs" value={selectedItem.fontFamily} onChange={(e) => updateSelectedProperty('fontFamily', e.target.value)}><option value="Inter">Inter</option><option value="Arial">Arial</option></select>
                      <input type="color" value={selectedItem.color} onChange={(e) => updateSelectedProperty('color', e.target.value)} className="w-full h-8 rounded border-none bg-transparent" />
                    </div>
                  </div>
                )}
                {activePropertyTab === "basic" && (
                   <div className="space-y-2">
                     <p className="text-xs text-[var(--color-bento-muted)]">Edit properties visually on canvas.</p>
                     <button onClick={() => setSelectedItemId(null)} className="md:hidden w-full bento-btn py-2 text-xs">Done Editing</button>
                   </div>
                )}
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
          <div className="w-16 md:w-32 bg-[#0a0a0a] border-r border-[var(--color-bento-border)] z-30 flex flex-col divide-y divide-[#262626]">
            <div className="h-6 bg-[#141414]"></div>
            <div className="h-10 md:h-16 flex items-center justify-center md:justify-start md:px-4 text-[10px] font-bold text-blue-400"><i className="fas fa-video md:mr-3"></i> <span className="hidden md:inline">V1</span></div>
            <div className="h-10 md:h-16 flex items-center justify-center md:justify-start md:px-4 text-[10px] font-bold text-green-400"><i className="fas fa-music md:mr-3"></i> <span className="hidden md:inline">A1</span></div>
            <div className="h-10 flex items-center justify-center md:justify-start md:px-4 text-[10px] font-bold text-purple-400"><i className="fas fa-font md:mr-3"></i> <span className="hidden md:inline">T1</span></div>
          </div>

          <div ref={timelineRef} className="flex-1 bg-[#0f0f0f] relative overflow-x-auto overflow-y-hidden" style={{ backgroundImage: 'linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: `${timelineZoom}px 100%` }} onClick={(e) => { if (e.target === e.currentTarget) handleTimelineClick(e); }}>
            <div className="absolute top-[24px] left-0 right-0 h-10 md:h-16 pointer-events-none">
              {timelineItems.filter(i => i.trackId === 'V1').map(clip => (
                <div key={clip.id} onPointerDown={(e) => handleTimelinePointerDown(e, clip)} className={`absolute h-8 md:h-14 bg-blue-600/80 rounded border pointer-events-auto flex items-center px-2 overflow-hidden shadow-sm touch-none ${selectedItemId === clip.id ? 'border-white ring-2 ring-white/50 z-20' : 'border-blue-400 z-10'} ${timelineDrag.itemId === clip.id ? 'opacity-50 scale-105' : 'opacity-100'}`} style={{ left: clip.startTime * timelineZoom, width: Math.max(10, clip.duration * timelineZoom) }}>
                  <span className="text-[10px] font-bold text-white truncate">{clip.name || 'Video'}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-[64px] md:top-[88px] left-0 right-0 h-10 md:h-16 pointer-events-none">
              {timelineItems.filter(i => i.trackId === 'T1').map(clip => (
                <div key={clip.id} onPointerDown={(e) => handleTimelinePointerDown(e, clip)} className={`absolute h-8 md:h-10 bg-purple-600/80 rounded border pointer-events-auto flex items-center justify-center overflow-hidden shadow-sm touch-none ${selectedItemId === clip.id ? 'border-white ring-2 ring-white/50 z-20' : 'border-purple-400 z-10'} ${timelineDrag.itemId === clip.id ? 'opacity-50 scale-105' : 'opacity-100'}`} style={{ left: clip.startTime * timelineZoom, width: Math.max(10, clip.duration * timelineZoom) }}>
                  <span className="text-[10px] font-bold text-white truncate">"{clip.text}"</span>
                </div>
              ))}
            </div>

            <div className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-40 pointer-events-none" style={{ left: currentTime * timelineZoom }}>
               <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-red-500 absolute -top-0 -translate-x-1/2"></div>
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
            <button onClick={() => setHwProfile({ ...hwProfile, showModal: false })} className="w-full bento-btn-accent py-3 font-bold mt-4">Acknowledge & Start Editing</button>
          </div>
        </div>
      )}
    </div>
  );
}
