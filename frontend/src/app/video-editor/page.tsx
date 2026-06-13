"use client";

import { useState, useRef, useEffect, MouseEvent, DragEvent } from "react";
import Link from "next/link";

interface LocalMedia {
  id: string;
  name: string;
  url: string;
  type: string; // 'video', 'audio', 'image'
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
  // Advanced Text Props
  x?: number; // 0-100 percentage
  y?: number; // 0-100 percentage
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  rotation?: number;
}

export default function VideoEditor() {
  const [activeAssetTab, setActiveAssetTab] = useState("media");
  const [activePropertyTab, setActivePropertyTab] = useState("color");
  
  // Library State
  const [localMediaFiles, setLocalMediaFiles] = useState<LocalMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timeline State
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [timelineZoom, setTimelineZoom] = useState(50); // pixels per second

  // Drag & Drop State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Engine Refs
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

  // 2. Add to Timeline
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
    
    // Attempt to get real duration
    const el = document.createElement(media.type === 'audio' ? 'audio' : 'video');
    el.src = media.url;
    el.onloadedmetadata = () => {
      setTimelineItems(prev => prev.map(i => i.id === newItem.id ? { ...i, duration: el.duration } : i));
    };
  };

  const addTextToTimeline = () => {
    let start = currentTime; 

    const newItem: TimelineItem = {
      id: Math.random().toString(36).substr(2, 9),
      trackId: 'T1',
      text: "Double Click to Edit",
      startTime: start,
      duration: 5,
      sourceOffset: 0,
      x: 50,
      y: 50,
      fontSize: 48,
      color: "#ffffff",
      fontFamily: "Inter",
      rotation: 0
    };
    setTimelineItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);
    setActivePropertyTab("text");
  };

  // 3. Playback Engine
  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying) {
      playheadIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 0.05); 
      }, 50);
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
        if (videoPlayerRef.current.src !== activeVideo.url) {
           videoPlayerRef.current.src = activeVideo.url || '';
        }
        
        const expectedTime = (currentTime - activeVideo.startTime) + activeVideo.sourceOffset;
        if (Math.abs(videoPlayerRef.current.currentTime - expectedTime) > 0.2) {
           videoPlayerRef.current.currentTime = expectedTime;
        }

        if (isPlaying && videoPlayerRef.current.paused) {
           videoPlayerRef.current.play().catch(e => console.error("Video play blocked", e));
        } else if (!isPlaying && !videoPlayerRef.current.paused) {
           videoPlayerRef.current.pause();
        }
      } else {
        videoPlayerRef.current.pause();
        videoPlayerRef.current.src = "";
      }
    }
  }, [currentTime, timelineItems, isPlaying]);


  // 4. Advanced Operations
  const handleTimelineClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const time = clickX / timelineZoom;
    setCurrentTime(time);
    if (videoPlayerRef.current) videoPlayerRef.current.currentTime = time;
  };

  const deleteItem = () => {
    if (selectedItemId) {
      setTimelineItems(prev => prev.filter(i => i.id !== selectedItemId));
      setSelectedItemId(null);
    }
  };

  const splitClip = () => {
    if (!selectedItem) return;
    if (currentTime > selectedItem.startTime && currentTime < selectedItem.startTime + selectedItem.duration) {
      const firstHalfDuration = currentTime - selectedItem.startTime;
      const secondHalfDuration = selectedItem.duration - firstHalfDuration;
      
      const newClip: TimelineItem = {
        ...selectedItem,
        id: Math.random().toString(36).substr(2, 9),
        startTime: currentTime,
        duration: secondHalfDuration,
        sourceOffset: selectedItem.sourceOffset + firstHalfDuration
      };

      setTimelineItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, duration: firstHalfDuration } : i).concat(newClip));
    }
  };

  // Magnetic Timeline (Remove Gaps)
  const removeGaps = () => {
    setTimelineItems(prev => {
      const newItems = [...prev];
      const tracks: TrackID[] = ['V1', 'A1', 'T1'];
      
      tracks.forEach(tId => {
        const itemsInTrack = newItems.filter(i => i.trackId === tId).sort((a, b) => a.startTime - b.startTime);
        let currentEnd = 0;
        itemsInTrack.forEach(item => {
          const originalItem = newItems.find(i => i.id === item.id);
          if (originalItem) {
            originalItem.startTime = currentEnd;
            currentEnd += originalItem.duration;
          }
        });
      });
      return newItems;
    });
  };

  // Drag and Drop Logic
  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    setSelectedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    // Optional: make ghost image transparent
    e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedItemId || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top; // Relative to the tracks container

    const newStartTime = Math.max(0, dropX / timelineZoom);
    
    // Determine target track based on Y position (Rough approximation)
    let newTrackId: TrackID | null = null;
    if (dropY >= 24 && dropY < 88) newTrackId = 'V1'; // Top track (approx 24px header + 64px track)
    else if (dropY >= 88 && dropY < 152) newTrackId = 'A1';
    else if (dropY >= 152) newTrackId = 'T1';

    setTimelineItems(prev => {
      return prev.map(item => {
        if (item.id === draggedItemId) {
          // If changing tracks, ensure type is compatible (e.g. don't put video on text track)
          const finalTrackId = newTrackId && isCompatibleTrack(item, newTrackId) ? newTrackId : item.trackId;
          return { ...item, startTime: newStartTime, trackId: finalTrackId };
        }
        return item;
      });
    });
    setDraggedItemId(null);
  };

  const isCompatibleTrack = (item: TimelineItem, track: TrackID) => {
    if (item.text !== undefined && track === 'T1') return true;
    if (item.mediaId !== undefined && (track === 'V1' || track === 'A1')) return true;
    return false;
  };

  const updateSelectedProperty = (key: keyof TimelineItem, value: any) => {
    if (selectedItemId) {
      setTimelineItems(prev => prev.map(i => i.id === selectedItemId ? { ...i, [key]: value } : i));
    }
  };

  // Helper formatting
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const activeTextItems = timelineItems.filter(i => i.trackId === 'T1' && currentTime >= i.startTime && currentTime < i.startTime + i.duration);
  const activeVideoItem = timelineItems.find(i => i.trackId === 'V1' && currentTime >= i.startTime && currentTime < i.startTime + i.duration);

  return (
    <div className="h-screen w-full flex flex-col bg-[var(--color-bento-bg)] p-4 space-y-4 text-white font-sans overflow-hidden animate-fade-in">
      
      {/* 1. Header Navbar */}
      <header className="flex justify-between items-center h-12 shrink-0 border-b border-[var(--color-bento-border)] pb-2">
        <div className="flex items-center space-x-4">
          <Link href="/" className="bento-btn w-10 h-10 flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white">
            <i className="fas fa-arrow-left text-sm"></i>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold flex items-center">
              Advanced_DragDrop_Project <i className="fas fa-edit ml-2 text-[10px] text-[var(--color-bento-muted)]"></i>
            </h1>
            <span className="text-[10px] text-green-400 font-bold">Pro Engine Online (D&D + Gaps)</span>
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
                      <span className="absolute bottom-1 left-1 right-1 bg-black/80 px-1 rounded text-[8px] truncate">{media.name}</span>
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

        {/* Center: Video Player */}
        <main className="flex-1 bento-card flex flex-col p-4 relative min-w-0">
          <div className="flex-1 bg-[#050505] rounded-xl overflow-hidden relative flex items-center justify-center border border-[#262626] shadow-inner group relative">
            
            {/* Real Interactive Composition Engine Player */}
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-black">
               <video 
                  ref={videoPlayerRef}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ filter: activeVideoItem?.filter || 'none' }}
                  onClick={togglePlay}
                  muted={true}
               />

               {/* Dynamic Text Render Engine */}
               {activeTextItems.map(textItem => (
                  <div 
                    key={textItem.id} 
                    className="absolute pointer-events-none"
                    style={{
                      left: `${textItem.x}%`,
                      top: `${textItem.y}%`,
                      transform: `translate(-50%, -50%) rotate(${textItem.rotation}deg)`,
                      fontSize: `${textItem.fontSize}px`,
                      color: textItem.color,
                      fontFamily: textItem.fontFamily,
                      filter: textItem.filter || 'none',
                      whiteSpace: 'nowrap',
                      textShadow: '0 4px 8px rgba(0,0,0,0.8)'
                    }}
                  >
                     {textItem.text}
                  </div>
               ))}
               
               {!activeVideoItem && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                   <i className="fas fa-film text-6xl mb-4"></i>
                   <p className="text-xl font-bold">No Media on Timeline</p>
                 </div>
               )}
            </div>

          </div>
          
          {/* Player Transport Controls */}
          <div className="h-16 shrink-0 mt-4 flex items-center justify-between px-2">
            <div className="font-mono text-sm tracking-wider text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20 w-32 text-center">
              {formatTime(currentTime)}
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-[var(--color-bento-muted)] hover:text-white transition-colors" onClick={() => setCurrentTime(prev => Math.max(0, prev - 1))}>
                <i className="fas fa-step-backward"></i>
              </button>
              <button onClick={togglePlay} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>
              </button>
              <button className="text-[var(--color-bento-muted)] hover:text-white transition-colors" onClick={() => setCurrentTime(prev => prev + 1)}>
                <i className="fas fa-step-forward"></i>
              </button>
            </div>
            
            <div className="flex items-center space-x-3 text-[var(--color-bento-muted)] w-32 justify-end"></div>
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
                      <textarea 
                        className="bento-input w-full text-xs h-16 resize-none font-bold"
                        value={selectedItem.text || ''}
                        onChange={(e) => updateSelectedProperty('text', e.target.value)}
                      />
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
                      <h3 className="text-[10px] font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Transform</h3>
                      
                      <div className="group">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-[var(--color-bento-muted)]">Position X</span>
                          <span className="font-mono text-white">{selectedItem.x}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={selectedItem.x} onChange={(e) => updateSelectedProperty('x', Number(e.target.value))} className="w-full accent-white bg-[#262626] rounded-lg h-1" />
                      </div>
                      <div className="group">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-[var(--color-bento-muted)]">Position Y</span>
                          <span className="font-mono text-white">{selectedItem.y}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={selectedItem.y} onChange={(e) => updateSelectedProperty('y', Number(e.target.value))} className="w-full accent-white bg-[#262626] rounded-lg h-1" />
                      </div>
                      <div className="group">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-[var(--color-bento-muted)]">Font Size</span>
                          <span className="font-mono text-white">{selectedItem.fontSize}px</span>
                        </div>
                        <input type="range" min="10" max="200" value={selectedItem.fontSize} onChange={(e) => updateSelectedProperty('fontSize', Number(e.target.value))} className="w-full accent-white bg-[#262626] rounded-lg h-1" />
                      </div>
                      <div className="group">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-[var(--color-bento-muted)]">Rotation</span>
                          <span className="font-mono text-white">{selectedItem.rotation}°</span>
                        </div>
                        <input type="range" min="-180" max="180" value={selectedItem.rotation} onChange={(e) => updateSelectedProperty('rotation', Number(e.target.value))} className="w-full accent-white bg-[#262626] rounded-lg h-1" />
                      </div>
                    </div>
                  </div>
                )}

                {activePropertyTab === "color" && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Effects / Filters</h3>
                    <select 
                      className="bento-input w-full text-xs"
                      value={selectedItem.filter || ''}
                      onChange={(e) => updateSelectedProperty('filter', e.target.value)}
                    >
                      <option value="">None</option>
                      <option value="grayscale(100%)">B&W Noir</option>
                      <option value="sepia(100%) hue-rotate(-30deg)">Cinematic Orange</option>
                      <option value="contrast(1.5) saturate(1.5)">High Contrast Pop</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. Bottom Timeline Engine (Drag & Drop + Magnetic) */}
      <div className="h-72 bento-card shrink-0 flex flex-col relative overflow-hidden select-none">
        
        {/* Timeline Toolbar */}
        <div className="h-10 border-b border-[var(--color-bento-border)] flex items-center justify-between px-4 bg-[#141414]">
          <div className="flex space-x-2">
            <button onClick={splitClip} disabled={!selectedItem} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-colors ${selectedItem ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white' : 'text-[#3f3f46]'}`} title="Split Clip (Cut)"><i className="fas fa-cut"></i></button>
            <button onClick={deleteItem} disabled={!selectedItem} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-colors ${selectedItem ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'text-[#3f3f46]'}`} title="Delete Clip"><i className="fas fa-trash"></i></button>
            <div className="w-px h-4 bg-[#3f3f46] mx-1 self-center"></div>
            {/* Magnetic Timeline Button */}
            <button onClick={removeGaps} className="h-6 px-3 rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white text-[10px] font-bold flex items-center transition-colors" title="Snap all clips together">
              <i className="fas fa-magnet mr-1"></i> Remove Gaps
            </button>
          </div>
          
          <div className="flex items-center space-x-2 w-48">
            <i className="fas fa-search-minus text-[10px] text-[var(--color-bento-muted)]"></i>
            <input type="range" min="10" max="200" value={timelineZoom} onChange={(e) => setTimelineZoom(Number(e.target.value))} className="w-full h-1 accent-[#52525b] bg-[#262626] rounded-lg" />
            <i className="fas fa-search-plus text-[10px] text-[var(--color-bento-muted)]"></i>
          </div>
        </div>

        {/* Timeline Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Track Headers */}
          <div className="w-32 bg-[#0a0a0a] border-r border-[var(--color-bento-border)] z-30 flex flex-col divide-y divide-[#262626] shadow-[4px_0_15px_rgba(0,0,0,0.5)]">
            <div className="h-6 bg-[#141414]"></div>
            <div className="h-16 flex items-center px-4 text-[10px] font-bold text-[var(--color-bento-muted)] space-x-3"><i className="fas fa-video text-blue-400"></i> <span>V1</span></div>
            <div className="h-16 flex items-center px-4 text-[10px] font-bold text-[var(--color-bento-muted)] space-x-3"><i className="fas fa-music text-green-400"></i> <span>A1</span></div>
            <div className="h-10 flex items-center px-4 text-[10px] font-bold text-[var(--color-bento-muted)] space-x-3"><i className="fas fa-font text-purple-400"></i> <span>T1</span></div>
          </div>

          {/* Tracks Content Grid (Droppable Area) */}
          <div 
            ref={timelineRef}
            className="flex-1 bg-[#0f0f0f] relative overflow-x-auto overflow-y-hidden cursor-crosshair" 
            style={{ backgroundImage: 'linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: `${timelineZoom}px 100%` }}
            onClick={(e) => { if (e.target === e.currentTarget) handleTimelineClick(e); }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            
            {/* V1 Render */}
            <div className="absolute top-6 left-0 right-0 h-16 pointer-events-none">
              {timelineItems.filter(i => i.trackId === 'V1').map(clip => (
                <div 
                  key={clip.id} 
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, clip.id)}
                  className={`absolute h-14 bg-blue-600/80 rounded border pointer-events-auto flex items-center px-2 overflow-hidden shadow-sm transition-shadow hover:brightness-110 cursor-grab active:cursor-grabbing ${selectedItemId === clip.id ? 'border-white ring-2 ring-white/50 z-20' : 'border-blue-400 z-10'} ${draggedItemId === clip.id ? 'opacity-50' : 'opacity-100'}`}
                  style={{ left: clip.startTime * timelineZoom, width: Math.max(10, clip.duration * timelineZoom) }}
                  onClick={(e) => { e.stopPropagation(); setSelectedItemId(clip.id); setActivePropertyTab("basic"); }}
                >
                  <span className="text-[10px] font-bold text-white truncate drop-shadow-md">{clip.name || 'Video Clip'}</span>
                </div>
              ))}
            </div>

            {/* A1 Render */}
            <div className="absolute top-[88px] left-0 right-0 h-16 pointer-events-none">
              {timelineItems.filter(i => i.trackId === 'A1').map(clip => (
                <div 
                  key={clip.id} 
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, clip.id)}
                  className={`absolute h-14 bg-green-600/30 rounded border pointer-events-auto flex items-center px-2 overflow-hidden shadow-sm transition-shadow hover:brightness-110 cursor-grab active:cursor-grabbing ${selectedItemId === clip.id ? 'border-white ring-2 ring-white/50 z-20' : 'border-green-500/50 z-10'} ${draggedItemId === clip.id ? 'opacity-50' : 'opacity-100'}`}
                  style={{ left: clip.startTime * timelineZoom, width: Math.max(10, clip.duration * timelineZoom) }}
                  onClick={(e) => { e.stopPropagation(); setSelectedItemId(clip.id); setActivePropertyTab("basic"); }}
                >
                  <i className="fas fa-wave-square text-[10px] text-green-400 mr-2 opacity-80"></i>
                  <span className="text-[10px] font-bold text-green-100 truncate">{clip.name || 'Audio Clip'}</span>
                </div>
              ))}
            </div>

            {/* T1 Render */}
            <div className="absolute top-[152px] left-0 right-0 h-10 pointer-events-none">
              {timelineItems.filter(i => i.trackId === 'T1').map(clip => (
                <div 
                  key={clip.id} 
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, clip.id)}
                  className={`absolute h-8 bg-purple-600/80 rounded border pointer-events-auto flex items-center justify-center overflow-hidden shadow-sm transition-shadow hover:brightness-110 cursor-grab active:cursor-grabbing ${selectedItemId === clip.id ? 'border-white ring-2 ring-white/50 z-20' : 'border-purple-400 z-10'} ${draggedItemId === clip.id ? 'opacity-50' : 'opacity-100'}`}
                  style={{ left: clip.startTime * timelineZoom, width: Math.max(10, clip.duration * timelineZoom) }}
                  onClick={(e) => { e.stopPropagation(); setSelectedItemId(clip.id); setActivePropertyTab("text"); }}
                >
                  <span className="text-[10px] font-bold text-white truncate">"{clip.text}"</span>
                </div>
              ))}
            </div>

            {/* Playhead Line */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-40 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ left: currentTime * timelineZoom }}>
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-red-500 absolute -top-0 -translate-x-1/2"></div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
