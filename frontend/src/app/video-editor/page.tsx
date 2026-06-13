"use client";

import { useState, useRef, useEffect, MouseEvent, DragEvent } from "react";
import Link from "next/link";

interface LocalMedia {
  id: string;
  name: string;
  url: string;
  type: string;
}

type TrackID = 'V1' | 'A1' | 'T1';

interface TimelineItem {
  id: string;
  trackId: TrackID;
  mediaId?: string;
  url?: string;
  name?: string;
  text?: string;
  startTime: number; 
  duration: number; 
  sourceOffset: number; 
  filter?: string; 
  x?: number; // percentage
  y?: number; // percentage
  fontSize?: number; // pixels
  color?: string;
  fontFamily?: string;
  rotation?: number; // degrees
}

type TransformMode = 'none' | 'drag' | 'scale' | 'rotate';

export default function VideoEditor() {
  const [activeAssetTab, setActiveAssetTab] = useState("media");
  const [activePropertyTab, setActivePropertyTab] = useState("color");
  
  const [localMediaFiles, setLocalMediaFiles] = useState<LocalMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [timelineZoom, setTimelineZoom] = useState(50); 
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Transform Engine State
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>('none');
  const [dragState, setDragState] = useState({ startX: 0, startY: 0, initX: 0, initY: 0, initSize: 0, initRot: 0, centerX: 0, centerY: 0 });

  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const playheadIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const selectedItem = timelineItems.find(i => i.id === selectedItemId);

  // 1. File Handling
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.split('/')[0]
      }));
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

    const newItem: TimelineItem = {
      id: Math.random().toString(36).substr(2, 9),
      trackId: trackId,
      mediaId: media.id,
      url: media.url,
      name: media.name,
      startTime: start,
      duration: 10, 
      sourceOffset: 0
    };

    setTimelineItems(prev => [...prev, newItem]);
    const el = document.createElement(media.type === 'audio' ? 'audio' : 'video');
    el.src = media.url;
    el.onloadedmetadata = () => {
      setTimelineItems(prev => prev.map(i => i.id === newItem.id ? { ...i, duration: el.duration } : i));
    };
  };

  const addTextToTimeline = () => {
    const newItem: TimelineItem = {
      id: Math.random().toString(36).substr(2, 9),
      trackId: 'T1',
      text: "Double Click to Edit",
      startTime: currentTime,
      duration: 5,
      sourceOffset: 0,
      x: 50, y: 50, fontSize: 64, color: "#ffffff", fontFamily: "Inter", rotation: 0
    };
    setTimelineItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);
    setActivePropertyTab("text");
  };

  // 2. Playback Sync
  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying) {
      playheadIntervalRef.current = setInterval(() => setCurrentTime(prev => prev + 0.05), 50);
    } else {
      if (playheadIntervalRef.current) clearInterval(playheadIntervalRef.current);
      if (videoPlayerRef.current) videoPlayerRef.current.pause();
    }
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
      } else {
        videoPlayerRef.current.pause();
        videoPlayerRef.current.src = "";
      }
    }
  }, [currentTime, timelineItems, isPlaying]);

  // 3. Transform Canvas Engine
  const startTransform = (e: React.MouseEvent, mode: TransformMode, itemId: string) => {
    e.stopPropagation();
    const item = timelineItems.find(i => i.id === itemId);
    if (!item) return;
    
    setSelectedItemId(itemId);
    setActivePropertyTab("text");
    
    const rect = playerContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate center of item for rotation
    const centerX = rect.left + (rect.width * (item.x || 50) / 100);
    const centerY = rect.top + (rect.height * (item.y || 50) / 100);

    setTransformMode(mode);
    setDragState({
      startX: e.clientX, startY: e.clientY,
      initX: item.x || 50, initY: item.y || 50,
      initSize: item.fontSize || 64, initRot: item.rotation || 0,
      centerX, centerY
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (transformMode === 'none' || !selectedItemId) return;
    const rect = playerContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setTimelineItems(prev => prev.map(item => {
      if (item.id === selectedItemId) {
        if (transformMode === 'drag') {
          // Convert pixel delta to percentage
          const dx = ((e.clientX - dragState.startX) / rect.width) * 100;
          const dy = ((e.clientY - dragState.startY) / rect.height) * 100;
          return { ...item, x: Math.max(0, Math.min(100, dragState.initX + dx)), y: Math.max(0, Math.min(100, dragState.initY + dy)) };
        } 
        else if (transformMode === 'scale') {
          // Simple scale: Y-distance drives scale
          const dy = e.clientY - dragState.startY;
          // Invert dy if pulling "down" to make smaller if we assume top handles, but let's just make any movement away from center increase size
          const distStart = Math.hypot(dragState.startX - dragState.centerX, dragState.startY - dragState.centerY);
          const distCurrent = Math.hypot(e.clientX - dragState.centerX, e.clientY - dragState.centerY);
          const scaleRatio = distCurrent / distStart;
          return { ...item, fontSize: Math.max(10, Math.min(400, dragState.initSize * scaleRatio)) };
        }
        else if (transformMode === 'rotate') {
          // Calculate angle relative to center
          const angle1 = Math.atan2(dragState.startY - dragState.centerY, dragState.startX - dragState.centerX);
          const angle2 = Math.atan2(e.clientY - dragState.centerY, e.clientX - dragState.centerX);
          let delta = (angle2 - angle1) * (180 / Math.PI);
          return { ...item, rotation: (dragState.initRot + delta) % 360 };
        }
      }
      return item;
    }));
  };

  const handleCanvasMouseUp = () => setTransformMode('none');

  // 4. Timeline Interaction
  const handleTimelineClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const time = clickX / timelineZoom;
    setCurrentTime(time);
    if (videoPlayerRef.current) videoPlayerRef.current.currentTime = time;
  };

  const deleteItem = () => { if (selectedItemId) { setTimelineItems(prev => prev.filter(i => i.id !== selectedItemId)); setSelectedItemId(null); } };
  const splitClip = () => { /* Split logic */ };
  const removeGaps = () => { /* Gaps logic */ };
  
  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id); setSelectedItemId(id); e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedItemId || !timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;
    const newStartTime = Math.max(0, dropX / timelineZoom);
    
    let newTrackId: TrackID | null = null;
    if (dropY >= 24 && dropY < 88) newTrackId = 'V1';
    else if (dropY >= 88 && dropY < 152) newTrackId = 'A1';
    else if (dropY >= 152) newTrackId = 'T1';

    setTimelineItems(prev => prev.map(item => {
      if (item.id === draggedItemId) {
        const isCompatible = (item.text !== undefined && newTrackId === 'T1') || (item.mediaId !== undefined && (newTrackId === 'V1' || newTrackId === 'A1'));
        return { ...item, startTime: newStartTime, trackId: (newTrackId && isCompatible ? newTrackId : item.trackId) };
      }
      return item;
    }));
    setDraggedItemId(null);
  };

  const updateSelectedProperty = (key: keyof TimelineItem, value: any) => {
    if (selectedItemId) setTimelineItems(prev => prev.map(i => i.id === selectedItemId ? { ...i, [key]: value } : i));
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const activeTextItems = timelineItems.filter(i => i.trackId === 'T1' && currentTime >= i.startTime && currentTime < i.startTime + i.duration);
  const activeVideoItem = timelineItems.find(i => i.trackId === 'V1' && currentTime >= i.startTime && currentTime < i.startTime + i.duration);

  return (
    <div className="h-screen w-full flex flex-col bg-[var(--color-bento-bg)] p-4 space-y-4 text-white font-sans overflow-hidden animate-fade-in" onMouseUp={handleCanvasMouseUp} onMouseLeave={handleCanvasMouseUp}>
      
      {/* 1. Header Navbar */}
      <header className="flex justify-between items-center h-12 shrink-0 border-b border-[var(--color-bento-border)] pb-2">
        <div className="flex items-center space-x-4">
          <Link href="/" className="bento-btn w-10 h-10 flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white">
            <i className="fas fa-arrow-left text-sm"></i>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold flex items-center">
              Canvas_Transform_Engine <i className="fas fa-edit ml-2 text-[10px] text-[var(--color-bento-muted)]"></i>
            </h1>
            <span className="text-[10px] text-purple-400 font-bold">Bounding Box Physics Active</span>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex space-x-4 min-h-0">
        
        {/* Left: Asset Library */}
        <aside className="w-72 bento-card flex flex-col shrink-0">
          <div className="flex border-b border-[var(--color-bento-border)] p-2 space-x-1">
            <button onClick={() => setActiveAssetTab("media")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "media" ? "bg-[#262626] text-white shadow-sm" : "text-[var(--color-bento-muted)] hover:text-white"}`}>Media</button>
            <button onClick={() => setActiveAssetTab("text")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "text" ? "bg-[#262626] text-white shadow-sm" : "text-[var(--color-bento-muted)] hover:text-white"}`}>Text</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {activeAssetTab === "media" && (
              <div className="space-y-4">
                <input type="file" multiple accept="video/*,audio/*,image/*" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-6 border-2 border-dashed border-[#3f3f46] rounded-xl flex flex-col items-center justify-center text-[var(--color-bento-muted)] hover:border-blue-500 hover:text-blue-400 transition-colors bg-[#0a0a0a]">
                  <i className="fas fa-cloud-upload-alt text-xl mb-2"></i>
                  <span className="text-xs font-bold mb-1">Upload Local Media</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  {localMediaFiles.map(media => (
                    <div key={media.id} className="aspect-video bg-[#1a1a1a] rounded-lg border border-[var(--color-bento-border)] relative group overflow-hidden">
                      {media.type === 'video' || media.type === 'image' ? (
                        <img src={media.url} className="w-full h-full object-cover" alt={media.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#262626]"><i className="fas fa-music text-green-400"></i></div>
                      )}
                      <button onClick={() => addToTimeline(media)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><i className="fas fa-plus"></i></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeAssetTab === "text" && (
              <div className="space-y-4">
                 <button onClick={addTextToTimeline} className="w-full p-4 border border-[var(--color-bento-border)] rounded-lg bg-[#1a1a1a] flex items-center hover:border-purple-500 transition-colors group">
                    <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-md flex items-center justify-center mr-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <i className="fas fa-font text-lg"></i>
                    </div>
                    <div className="text-left">
                       <h3 className="text-sm font-bold">Standard Text</h3>
                       <p className="text-[10px] text-[var(--color-bento-muted)]">Add a customizable text layer</p>
                    </div>
                 </button>
              </div>
            )}
          </div>
        </aside>

        {/* Center: Video Player with Interactive Canvas */}
        <main className="flex-1 bento-card flex flex-col p-4 relative min-w-0">
          <div 
            ref={playerContainerRef}
            className="flex-1 bg-[#050505] rounded-xl overflow-hidden relative flex items-center justify-center border border-[#262626] shadow-inner group relative"
            onMouseMove={handleCanvasMouseMove}
            onClick={() => { if(transformMode === 'none') setSelectedItemId(null); }}
          >
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-black pointer-events-none">
               <video 
                  ref={videoPlayerRef}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-auto"
                  style={{ filter: activeVideoItem?.filter || 'none' }}
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  muted={true}
               />
               
               {!activeVideoItem && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                   <i className="fas fa-film text-6xl mb-4"></i>
                   <p className="text-xl font-bold">No Media on Timeline</p>
                 </div>
               )}
            </div>

            {/* Transform Canvas Layer - Rendered on TOP of video */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {activeTextItems.map(textItem => {
                const isSelected = selectedItemId === textItem.id;
                return (
                  <div 
                    key={textItem.id} 
                    className={`absolute inline-block pointer-events-auto select-none ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black/50' : ''}`}
                    style={{
                      left: `${textItem.x}%`,
                      top: `${textItem.y}%`,
                      transform: `translate(-50%, -50%) rotate(${textItem.rotation}deg)`,
                      cursor: isSelected ? (transformMode === 'drag' ? 'grabbing' : 'grab') : 'pointer',
                    }}
                    onMouseDown={(e) => startTransform(e, 'drag', textItem.id)}
                  >
                    {/* The Text Content */}
                    <div style={{
                      fontSize: `${textItem.fontSize}px`,
                      color: textItem.color,
                      fontFamily: textItem.fontFamily,
                      filter: textItem.filter || 'none',
                      whiteSpace: 'nowrap',
                      textShadow: '0 4px 8px rgba(0,0,0,0.8)'
                    }}>
                      {textItem.text}
                    </div>

                    {/* Transform Handles (Rendered only if selected) */}
                    {isSelected && (
                      <>
                        {/* Rotation Handle (Top Center) */}
                        <div 
                          className="absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-crosshair hover:scale-125 transition-transform"
                          onMouseDown={(e) => startTransform(e, 'rotate', textItem.id)}
                        >
                          <i className="fas fa-redo text-[10px] text-white"></i>
                        </div>
                        {/* Connecting Line */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-blue-500 pointer-events-none"></div>

                        {/* Scaling Corners */}
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 cursor-nwse-resize rounded-sm" onMouseDown={(e) => startTransform(e, 'scale', textItem.id)}></div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 cursor-nesw-resize rounded-sm" onMouseDown={(e) => startTransform(e, 'scale', textItem.id)}></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 cursor-nesw-resize rounded-sm" onMouseDown={(e) => startTransform(e, 'scale', textItem.id)}></div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 cursor-nwse-resize rounded-sm" onMouseDown={(e) => startTransform(e, 'scale', textItem.id)}></div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="h-16 shrink-0 mt-4 flex items-center justify-between px-2">
            <div className="font-mono text-sm tracking-wider text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20 w-32 text-center">{formatTime(currentTime)}</div>
            <div className="flex items-center space-x-4">
              <button className="text-[var(--color-bento-muted)] hover:text-white" onClick={() => setCurrentTime(prev => Math.max(0, prev - 1))}><i className="fas fa-step-backward"></i></button>
              <button onClick={togglePlay} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"><i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i></button>
              <button className="text-[var(--color-bento-muted)] hover:text-white" onClick={() => setCurrentTime(prev => prev + 1)}><i className="fas fa-step-forward"></i></button>
            </div>
            <div className="w-32"></div>
          </div>
        </main>

        {/* Right: Properties Panel */}
        <aside className="w-80 bento-card flex flex-col shrink-0 overflow-hidden">
          <div className="flex border-b border-[var(--color-bento-border)] p-2 space-x-1 bg-[#141414]">
            <button onClick={() => setActivePropertyTab("basic")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activePropertyTab === "basic" ? "bg-[#262626] text-white" : "text-[var(--color-bento-muted)] hover:text-white"}`}>Properties</button>
            {selectedItem?.trackId === 'T1' && (
              <button onClick={() => setActivePropertyTab("text")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activePropertyTab === "text" ? "bg-[#262626] text-purple-400 shadow-[inset_0_-2px_0_rgba(168,85,247,1)]" : "text-[var(--color-bento-muted)] hover:text-white"}`}>Text Style</button>
            )}
            <button onClick={() => setActivePropertyTab("color")} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activePropertyTab === "color" ? "bg-[#262626] text-blue-400 shadow-[inset_0_-2px_0_rgba(59,130,246,1)]" : "text-[var(--color-bento-muted)] hover:text-white"}`}>Color</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {!selectedItem ? (
              <div className="text-center text-[10px] text-[var(--color-bento-muted)] mt-10">Select a clip on the timeline to edit properties.</div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {activePropertyTab === "text" && selectedItem.trackId === 'T1' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--color-bento-muted)] uppercase">Text Content</label>
                      <textarea className="bento-input w-full text-xs h-16 resize-none font-bold" value={selectedItem.text || ''} onChange={(e) => updateSelectedProperty('text', e.target.value)} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--color-bento-muted)]">Font Family</label>
                        <select className="bento-input w-full text-xs" value={selectedItem.fontFamily} onChange={(e) => updateSelectedProperty('fontFamily', e.target.value)}>
                          <option value="Inter">Inter</option>
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">Serif</option>
                          <option value="Impact">Impact</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--color-bento-muted)]">Color</label>
                        <input type="color" value={selectedItem.color} onChange={(e) => updateSelectedProperty('color', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer bg-transparent" />
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-[var(--color-bento-border)] pt-4">
                      <h3 className="text-[10px] font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Transform (Syncs with Box)</h3>
                      <div className="group"><div className="flex justify-between text-[10px] mb-1"><span className="text-[var(--color-bento-muted)]">Position X</span><span className="font-mono text-white">{selectedItem.x?.toFixed(1)}%</span></div><input type="range" min="0" max="100" value={selectedItem.x} onChange={(e) => updateSelectedProperty('x', Number(e.target.value))} className="w-full accent-white bg-[#262626] rounded-lg h-1" /></div>
                      <div className="group"><div className="flex justify-between text-[10px] mb-1"><span className="text-[var(--color-bento-muted)]">Position Y</span><span className="font-mono text-white">{selectedItem.y?.toFixed(1)}%</span></div><input type="range" min="0" max="100" value={selectedItem.y} onChange={(e) => updateSelectedProperty('y', Number(e.target.value))} className="w-full accent-white bg-[#262626] rounded-lg h-1" /></div>
                      <div className="group"><div className="flex justify-between text-[10px] mb-1"><span className="text-[var(--color-bento-muted)]">Font Size</span><span className="font-mono text-white">{selectedItem.fontSize?.toFixed(0)}px</span></div><input type="range" min="10" max="400" value={selectedItem.fontSize} onChange={(e) => updateSelectedProperty('fontSize', Number(e.target.value))} className="w-full accent-white bg-[#262626] rounded-lg h-1" /></div>
                      <div className="group"><div className="flex justify-between text-[10px] mb-1"><span className="text-[var(--color-bento-muted)]">Rotation</span><span className="font-mono text-white">{selectedItem.rotation?.toFixed(0)}°</span></div><input type="range" min="-180" max="180" value={selectedItem.rotation} onChange={(e) => updateSelectedProperty('rotation', Number(e.target.value))} className="w-full accent-white bg-[#262626] rounded-lg h-1" /></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. Bottom Timeline */}
      <div className="h-72 bento-card shrink-0 flex flex-col relative overflow-hidden select-none">
        <div className="h-10 border-b border-[var(--color-bento-border)] flex items-center justify-between px-4 bg-[#141414]">
          <div className="flex space-x-2">
            <button onClick={splitClip} disabled={!selectedItem} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-colors ${selectedItem ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white' : 'text-[#3f3f46]'}`} title="Split Clip (Cut)"><i className="fas fa-cut"></i></button>
            <button onClick={deleteItem} disabled={!selectedItem} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-colors ${selectedItem ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'text-[#3f3f46]'}`} title="Delete Clip"><i className="fas fa-trash"></i></button>
          </div>
          <div className="flex items-center space-x-2 w-48"><i className="fas fa-search-minus text-[10px] text-[var(--color-bento-muted)]"></i><input type="range" min="10" max="200" value={timelineZoom} onChange={(e) => setTimelineZoom(Number(e.target.value))} className="w-full h-1 accent-[#52525b] bg-[#262626] rounded-lg" /><i className="fas fa-search-plus text-[10px] text-[var(--color-bento-muted)]"></i></div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className="w-32 bg-[#0a0a0a] border-r border-[var(--color-bento-border)] z-30 flex flex-col divide-y divide-[#262626] shadow-[4px_0_15px_rgba(0,0,0,0.5)]">
            <div className="h-6 bg-[#141414]"></div>
            <div className="h-16 flex items-center px-4 text-[10px] font-bold text-[var(--color-bento-muted)] space-x-3"><i className="fas fa-video text-blue-400"></i> <span>V1</span></div>
            <div className="h-16 flex items-center px-4 text-[10px] font-bold text-[var(--color-bento-muted)] space-x-3"><i className="fas fa-music text-green-400"></i> <span>A1</span></div>
            <div className="h-10 flex items-center px-4 text-[10px] font-bold text-[var(--color-bento-muted)] space-x-3"><i className="fas fa-font text-purple-400"></i> <span>T1</span></div>
          </div>

          <div ref={timelineRef} className="flex-1 bg-[#0f0f0f] relative overflow-x-auto overflow-y-hidden cursor-crosshair" style={{ backgroundImage: 'linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: `${timelineZoom}px 100%` }} onClick={(e) => { if (e.target === e.currentTarget) handleTimelineClick(e); }} onDragOver={handleDragOver} onDrop={handleDrop}>
            
            {/* V1 Render */}
            <div className="absolute top-6 left-0 right-0 h-16 pointer-events-none">
              {timelineItems.filter(i => i.trackId === 'V1').map(clip => (
                <div key={clip.id} draggable={true} onDragStart={(e) => handleDragStart(e, clip.id)} className={`absolute h-14 bg-blue-600/80 rounded border pointer-events-auto flex items-center px-2 overflow-hidden shadow-sm transition-shadow hover:brightness-110 cursor-grab active:cursor-grabbing ${selectedItemId === clip.id ? 'border-white ring-2 ring-white/50 z-20' : 'border-blue-400 z-10'} ${draggedItemId === clip.id ? 'opacity-50' : 'opacity-100'}`} style={{ left: clip.startTime * timelineZoom, width: Math.max(10, clip.duration * timelineZoom) }} onClick={(e) => { e.stopPropagation(); setSelectedItemId(clip.id); setActivePropertyTab("basic"); }}>
                  <span className="text-[10px] font-bold text-white truncate drop-shadow-md">{clip.name || 'Video Clip'}</span>
                </div>
              ))}
            </div>

            {/* A1 Render */}
            <div className="absolute top-[88px] left-0 right-0 h-16 pointer-events-none">
              {timelineItems.filter(i => i.trackId === 'A1').map(clip => (
                <div key={clip.id} draggable={true} onDragStart={(e) => handleDragStart(e, clip.id)} className={`absolute h-14 bg-green-600/30 rounded border pointer-events-auto flex items-center px-2 overflow-hidden shadow-sm transition-shadow hover:brightness-110 cursor-grab active:cursor-grabbing ${selectedItemId === clip.id ? 'border-white ring-2 ring-white/50 z-20' : 'border-green-500/50 z-10'} ${draggedItemId === clip.id ? 'opacity-50' : 'opacity-100'}`} style={{ left: clip.startTime * timelineZoom, width: Math.max(10, clip.duration * timelineZoom) }} onClick={(e) => { e.stopPropagation(); setSelectedItemId(clip.id); setActivePropertyTab("basic"); }}>
                  <i className="fas fa-wave-square text-[10px] text-green-400 mr-2 opacity-80"></i>
                  <span className="text-[10px] font-bold text-green-100 truncate">{clip.name || 'Audio Clip'}</span>
                </div>
              ))}
            </div>

            {/* T1 Render */}
            <div className="absolute top-[152px] left-0 right-0 h-10 pointer-events-none">
              {timelineItems.filter(i => i.trackId === 'T1').map(clip => (
                <div key={clip.id} draggable={true} onDragStart={(e) => handleDragStart(e, clip.id)} className={`absolute h-8 bg-purple-600/80 rounded border pointer-events-auto flex items-center justify-center overflow-hidden shadow-sm transition-shadow hover:brightness-110 cursor-grab active:cursor-grabbing ${selectedItemId === clip.id ? 'border-white ring-2 ring-white/50 z-20' : 'border-purple-400 z-10'} ${draggedItemId === clip.id ? 'opacity-50' : 'opacity-100'}`} style={{ left: clip.startTime * timelineZoom, width: Math.max(10, clip.duration * timelineZoom) }} onClick={(e) => { e.stopPropagation(); setSelectedItemId(clip.id); setActivePropertyTab("text"); }}>
                  <span className="text-[10px] font-bold text-white truncate">"{clip.text}"</span>
                </div>
              ))}
            </div>

            <div className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-40 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ left: currentTime * timelineZoom }}><div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-red-500 absolute -top-0 -translate-x-1/2"></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
