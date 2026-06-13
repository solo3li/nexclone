"use client";

import { useState } from "react";
import Link from "next/link";

export default function VideoEditor() {
  const [activeAssetTab, setActiveAssetTab] = useState("media");
  const [activePropertyTab, setActivePropertyTab] = useState("color");

  return (
    <div className="h-screen w-full flex flex-col bg-[var(--color-bento-bg)] p-4 space-y-4 text-white font-sans overflow-hidden animate-fade-in">
      
      {/* 1. Header Navbar */}
      <header className="flex justify-between items-center h-12 shrink-0">
        <div className="flex items-center space-x-4">
          <Link href="/" className="bento-btn w-10 h-10 flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white">
            <i className="fas fa-arrow-left text-sm"></i>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold flex items-center">
              Product_Launch_V3 <i className="fas fa-edit ml-2 text-[10px] text-[var(--color-bento-muted)]"></i>
            </h1>
            <span className="text-[10px] text-[var(--color-bento-muted)]">Auto-saved just now</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="bento-btn px-4 py-2 text-xs font-bold flex items-center space-x-2 text-[var(--color-bento-muted)] hover:text-white">
            <i className="fas fa-cog text-[10px]"></i>
            <span>Project Settings</span>
          </button>
          <button className="bento-btn px-4 py-2 text-xs font-bold flex items-center space-x-2">
            <i className="fas fa-users text-[10px]"></i>
            <span>Collaborate</span>
          </button>
          <button className="bento-btn-accent px-6 py-2 text-xs flex items-center space-x-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <i className="fas fa-download text-[10px]"></i>
            <span>Export (4K)</span>
          </button>
        </div>
      </header>

      {/* 2. Main Workspace (Assets, Player, Properties) */}
      <div className="flex-1 flex space-x-4 min-h-0">
        
        {/* Left: Asset Library */}
        <aside className="w-72 bento-card flex flex-col shrink-0">
          <div className="flex border-b border-[var(--color-bento-border)] p-2 space-x-1">
            <button 
              onClick={() => setActiveAssetTab("media")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "media" ? "bg-[#262626] text-white shadow-sm" : "text-[var(--color-bento-muted)] hover:text-white"}`}
            >
              <i className="fas fa-folder-open mr-1 block mb-1 text-sm"></i> Media
            </button>
            <button 
              onClick={() => setActiveAssetTab("text")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "text" ? "bg-[#262626] text-white shadow-sm" : "text-[var(--color-bento-muted)] hover:text-white"}`}
            >
              <i className="fas fa-font mr-1 block mb-1 text-sm"></i> Titles
            </button>
            <button 
              onClick={() => setActiveAssetTab("effects")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "effects" ? "bg-[#262626] text-white shadow-sm" : "text-[var(--color-bento-muted)] hover:text-white"}`}
            >
              <i className="fas fa-sparkles mr-1 block mb-1 text-sm"></i> FX
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {activeAssetTab === "media" && (
              <div className="space-y-4">
                <button className="w-full py-6 border-2 border-dashed border-[#3f3f46] rounded-xl flex flex-col items-center justify-center text-[var(--color-bento-muted)] hover:border-blue-500 hover:text-blue-400 transition-colors bg-[#0a0a0a]">
                  <i className="fas fa-cloud-upload-alt text-xl mb-2"></i>
                  <span className="text-xs font-bold">Import Media</span>
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-video bg-[#1a1a1a] rounded-lg border border-blue-500 relative group overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="clip" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[8px]">00:12</span>
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="aspect-video bg-[#1a1a1a] rounded-lg border border-[var(--color-bento-border)] relative group overflow-hidden cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="clip" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[8px]">00:08</span>
                  </div>
                  <div className="aspect-video bg-[#1a1a1a] rounded-lg border border-[var(--color-bento-border)] relative flex items-center justify-center group cursor-pointer">
                    <i className="fas fa-music text-[var(--color-bento-muted)] group-hover:text-white"></i>
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[8px]">03:45</span>
                  </div>
                </div>
              </div>
            )}

            {activeAssetTab === "effects" && (
              <div className="space-y-4">
                 <div className="bento-input flex items-center space-x-2 py-2">
                   <i className="fas fa-search text-[var(--color-bento-muted)] text-xs"></i>
                   <input type="text" placeholder="Search LUTs & FX..." className="bg-transparent outline-none text-xs w-full" />
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <div className="h-16 rounded-lg bg-gradient-to-tr from-purple-500 to-orange-400 p-1 cursor-pointer">
                      <div className="w-full h-full bg-black/60 rounded flex items-center justify-center backdrop-blur-sm">
                        <span className="text-[10px] font-bold shadow-black drop-shadow-md">Cinematic 1</span>
                      </div>
                   </div>
                   <div className="h-16 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-400 p-1 cursor-pointer">
                      <div className="w-full h-full bg-black/60 rounded flex items-center justify-center backdrop-blur-sm">
                        <span className="text-[10px] font-bold shadow-black drop-shadow-md">Teal & Orange</span>
                      </div>
                   </div>
                   <div className="h-16 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-400 p-1 cursor-pointer border-2 border-blue-500">
                      <div className="w-full h-full bg-black/20 rounded flex items-center justify-center backdrop-blur-sm">
                        <span className="text-[10px] font-bold shadow-black drop-shadow-md">B&W Noir</span>
                      </div>
                   </div>
                 </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center: Video Player */}
        <main className="flex-1 bento-card flex flex-col p-4 relative min-w-0">
          <div className="flex-1 bg-[#050505] rounded-xl overflow-hidden relative flex items-center justify-center border border-[#262626] shadow-inner">
            {/* Mockup Video Frame (Color Graded) */}
            <div className="w-full h-full relative" style={{ filter: 'contrast(1.1) saturate(0.8) sepia(0.2) hue-rotate(-10deg)' }}>
              <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" alt="player" />
            </div>
            
            {/* Overlays */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono border border-white/10 text-yellow-500">
                <i className="fas fa-eye mr-1"></i> B&W Noir (Preview)
              </div>
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono border border-white/10">
                1920x1080 • 60 FPS
              </div>
            </div>
            
            {/* Safe Zones & Vectorscope mockups */}
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-black/80 rounded-full border border-[#3f3f46] p-2 flex items-center justify-center pointer-events-none opacity-50">
              <div className="w-full h-full rounded-full border border-green-500/30 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-px bg-white/20"></div>
                {/* Fake vectorscope plot */}
                <div className="absolute top-[40%] left-[45%] w-4 h-6 bg-orange-400/80 rounded-full blur-[2px]"></div>
                <div className="absolute top-[60%] left-[30%] w-3 h-5 bg-teal-400/80 rounded-full blur-[2px]"></div>
              </div>
            </div>
          </div>
          
          {/* Player Transport Controls */}
          <div className="h-16 shrink-0 mt-4 flex items-center justify-between px-2">
            <div className="font-mono text-sm tracking-wider text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
              00:01:24:15
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-[var(--color-bento-muted)] hover:text-white transition-colors">
                <i className="fas fa-step-backward"></i>
              </button>
              <button className="text-[var(--color-bento-muted)] hover:text-white transition-colors">
                <i className="fas fa-play reverse text-xs transform -scale-x-100"></i>
              </button>
              <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                <i className="fas fa-play ml-1"></i>
              </button>
              <button className="text-[var(--color-bento-muted)] hover:text-white transition-colors">
                <i className="fas fa-step-forward"></i>
              </button>
            </div>
            
            <div className="flex items-center space-x-3 text-[var(--color-bento-muted)]">
              <button className="hover:text-blue-400" title="Vectorscope"><i className="fas fa-chart-pie"></i></button>
              <button className="hover:text-white"><i className="fas fa-expand"></i></button>
              <button className="hover:text-white"><i className="fas fa-volume-up"></i></button>
            </div>
          </div>
        </main>

        {/* Right: Advanced Properties Panel */}
        <aside className="w-80 bento-card flex flex-col shrink-0 overflow-hidden">
          {/* Property Tabs */}
          <div className="flex border-b border-[var(--color-bento-border)] p-2 space-x-1 bg-[#141414]">
            <button 
              onClick={() => setActivePropertyTab("video")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activePropertyTab === "video" ? "bg-[#262626] text-white" : "text-[var(--color-bento-muted)] hover:text-white"}`}
            >
              Video
            </button>
            <button 
              onClick={() => setActivePropertyTab("color")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activePropertyTab === "color" ? "bg-[#262626] text-blue-400 shadow-[inset_0_-2px_0_rgba(59,130,246,1)]" : "text-[var(--color-bento-muted)] hover:text-white"}`}
            >
              Color
            </button>
            <button 
              onClick={() => setActivePropertyTab("audio")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activePropertyTab === "audio" ? "bg-[#262626] text-white" : "text-[var(--color-bento-muted)] hover:text-white"}`}
            >
              Audio
            </button>
            <button 
              onClick={() => setActivePropertyTab("ai")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activePropertyTab === "ai" ? "bg-[#262626] text-purple-400" : "text-[var(--color-bento-muted)] hover:text-purple-400"}`}
            >
              AI
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {activePropertyTab === "color" && (
              <>
                {/* LUT Selection */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Input LUT</h3>
                  <div className="relative">
                    <select className="bento-input w-full text-xs appearance-none font-bold">
                      <option>None</option>
                      <option>Alexa LogC to Rec709</option>
                      <option selected>B&W Noir Custom</option>
                      <option>S-Log3 to Rec709</option>
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-3 text-[10px] text-[var(--color-bento-muted)] pointer-events-none"></i>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-[var(--color-bento-muted)]">Intensity</span>
                    <span className="font-mono text-blue-400">85%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="85" className="w-full accent-blue-500 bg-[#262626] rounded-lg h-1.5 appearance-none" />
                </div>

                {/* Basic Correction */}
                <div className="space-y-4 border-t border-[var(--color-bento-border)] pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Basic Correction</h3>
                    <button className="text-[10px] text-blue-400 hover:text-blue-300">Auto</button>
                  </div>
                  
                  {/* Temperature & Tint */}
                  <div className="space-y-3">
                    <div className="group">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[var(--color-bento-muted)] group-hover:text-white transition-colors">Temperature</span>
                        <span className="font-mono font-bold text-white cursor-ew-resize">-12</span>
                      </div>
                      <div className="relative h-1.5 rounded-lg bg-gradient-to-r from-blue-500 via-[#262626] to-orange-500">
                        <div className="absolute top-1/2 left-[38%] w-3 h-3 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-md"></div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[var(--color-bento-muted)] group-hover:text-white transition-colors">Tint</span>
                        <span className="font-mono font-bold text-white cursor-ew-resize">+5</span>
                      </div>
                      <div className="relative h-1.5 rounded-lg bg-gradient-to-r from-green-500 via-[#262626] to-pink-500">
                        <div className="absolute top-1/2 left-[55%] w-3 h-3 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-md"></div>
                      </div>
                    </div>
                  </div>

                  {/* Light controls */}
                  <div className="space-y-3 pt-2">
                    {[
                      { label: "Exposure", val: "+0.4" },
                      { label: "Contrast", val: "1.2" },
                      { label: "Highlights", val: "-15" },
                      { label: "Shadows", val: "+8" },
                      { label: "Whites", val: "0" },
                      { label: "Blacks", val: "-5" },
                    ].map(ctrl => (
                      <div key={ctrl.label} className="group">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-[var(--color-bento-muted)] group-hover:text-white flex items-center">
                            {ctrl.label}
                            {/* Keyframe Icon mockup */}
                            <i className="fas fa-diamond text-[8px] ml-2 opacity-0 group-hover:opacity-100 hover:text-blue-400 cursor-pointer"></i>
                          </span>
                          <span className="font-mono font-bold text-white cursor-ew-resize">{ctrl.val}</span>
                        </div>
                        <input type="range" min="-100" max="100" defaultValue={parseInt(ctrl.val)*10} className="w-full accent-white bg-[#262626] rounded-lg h-1 appearance-none" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Wheels Mockup */}
                <div className="space-y-4 border-t border-[var(--color-bento-border)] pt-4">
                  <h3 className="text-[10px] font-bold text-[var(--color-bento-muted)] uppercase tracking-wider mb-2">Color Wheels</h3>
                  <div className="flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 relative p-[1px]">
                        <div className="w-full h-full rounded-full bg-[#1a1a1a] relative">
                           <div className="absolute top-[40%] left-[30%] w-2 h-2 rounded-full border border-white bg-white/50"></div>
                        </div>
                      </div>
                      <span className="text-[8px] text-[var(--color-bento-muted)] mt-1 uppercase">Shadows</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 relative p-[1px]">
                        <div className="w-full h-full rounded-full bg-[#1a1a1a] relative">
                           <div className="absolute top-[50%] left-[50%] w-2 h-2 rounded-full border border-white bg-white/50"></div>
                        </div>
                      </div>
                      <span className="text-[8px] text-[var(--color-bento-muted)] mt-1 uppercase">Midtones</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 relative p-[1px]">
                        <div className="w-full h-full rounded-full bg-[#1a1a1a] relative">
                           <div className="absolute top-[60%] left-[70%] w-2 h-2 rounded-full border border-white bg-white/50"></div>
                        </div>
                      </div>
                      <span className="text-[8px] text-[var(--color-bento-muted)] mt-1 uppercase">Highlights</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activePropertyTab === "video" && (
               <div className="p-4 text-center text-[var(--color-bento-muted)] text-xs">Video transform properties (Scale, Rotation, Position) are here.</div>
            )}
            {activePropertyTab === "audio" && (
               <div className="p-4 text-center text-[var(--color-bento-muted)] text-xs">Audio EQ and Volume controls are here.</div>
            )}
            {activePropertyTab === "ai" && (
               <div className="p-4 text-center text-[var(--color-bento-muted)] text-xs">AI Auto-tracking and Rotoscope tools are here.</div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. Bottom Timeline */}
      <div className="h-72 bento-card shrink-0 flex flex-col relative overflow-hidden">
        
        {/* Timeline Tools */}
        <div className="h-10 border-b border-[var(--color-bento-border)] flex items-center justify-between px-4 bg-[#141414]">
          <div className="flex space-x-2">
            <button className="w-6 h-6 rounded hover:bg-[#262626] text-[var(--color-bento-muted)] hover:text-white text-[10px] flex items-center justify-center"><i className="fas fa-mouse-pointer text-blue-400"></i></button>
            <button className="w-6 h-6 rounded hover:bg-[#262626] text-[var(--color-bento-muted)] hover:text-white text-[10px] flex items-center justify-center"><i className="fas fa-cut"></i></button>
            <div className="w-px h-4 bg-[#3f3f46] mx-1 self-center"></div>
            <button className="w-6 h-6 rounded hover:bg-[#262626] text-[var(--color-bento-muted)] hover:text-white text-[10px] flex items-center justify-center" title="Snapping"><i className="fas fa-magnet text-blue-400"></i></button>
            <button className="w-6 h-6 rounded hover:bg-[#262626] text-[var(--color-bento-muted)] hover:text-white text-[10px] flex items-center justify-center" title="Linked Selection"><i className="fas fa-link text-white"></i></button>
          </div>
          
          <div className="flex items-center space-x-2 w-48">
            <i className="fas fa-search-minus text-[10px] text-[var(--color-bento-muted)]"></i>
            <input type="range" className="w-full h-1 accent-[#52525b] bg-[#262626] rounded-lg" defaultValue="50" />
            <i className="fas fa-search-plus text-[10px] text-[var(--color-bento-muted)]"></i>
          </div>
        </div>

        {/* Timeline Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Track Headers */}
          <div className="w-32 bg-[#0a0a0a] border-r border-[var(--color-bento-border)] z-30 flex flex-col divide-y divide-[#262626] shadow-[4px_0_15px_rgba(0,0,0,0.5)]">
            <div className="h-6 bg-[#141414]"></div>
            
            <div className="h-16 flex items-center justify-between px-2 text-[10px] font-bold text-[var(--color-bento-muted)]">
              <div className="flex items-center space-x-2"><i className="fas fa-video w-3 text-center text-blue-400"></i> <span>V1</span></div>
              <div className="flex space-x-1"><i className="fas fa-eye hover:text-white cursor-pointer"></i><i className="fas fa-lock hover:text-white cursor-pointer"></i></div>
            </div>
            <div className="h-16 flex items-center justify-between px-2 text-[10px] font-bold text-[var(--color-bento-muted)]">
              <div className="flex items-center space-x-2"><i className="fas fa-music w-3 text-center text-green-400"></i> <span>A1</span></div>
              <div className="flex space-x-1"><i className="fas fa-volume-mute hover:text-white cursor-pointer"></i><i className="fas fa-lock hover:text-white cursor-pointer"></i></div>
            </div>
            <div className="h-10 flex items-center justify-between px-2 text-[10px] font-bold text-[var(--color-bento-muted)]">
              <div className="flex items-center space-x-2"><i className="fas fa-font w-3 text-center text-purple-400"></i> <span>T1</span></div>
              <div className="flex space-x-1"><i className="fas fa-eye hover:text-white cursor-pointer"></i><i className="fas fa-lock hover:text-white cursor-pointer"></i></div>
            </div>
          </div>

          {/* Tracks Content Grid */}
          <div className="flex-1 bg-[#0f0f0f] relative overflow-x-auto overflow-y-hidden" style={{ backgroundImage: 'linear-gradient(90deg, #1f1f1f 1px, transparent 1px)', backgroundSize: '100px 100%' }}>
            
            {/* Playhead */}
            <div className="absolute top-0 bottom-0 left-[250px] w-[2px] bg-red-500 z-20 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.8)]">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-red-500 absolute -top-0 -translate-x-1/2"></div>
            </div>

            {/* Track 1: Video */}
            <div className="absolute top-6 left-0 right-0 h-16 border-b border-[#262626] flex items-center pt-1 pb-1">
              <div className="absolute left-[50px] w-[200px] h-14 bg-blue-600/80 rounded border border-blue-400 flex items-center px-2 overflow-hidden shadow-sm relative group cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize"></div>
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize"></div>
                <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=100&q=80" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" alt="" />
                <span className="text-[10px] font-bold text-white truncate shadow-black drop-shadow-md relative z-10">001_intro.mp4</span>
              </div>
              <div className="absolute left-[250px] w-[350px] h-14 bg-[#262626] rounded border-2 border-white flex items-center px-2 overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.2)] relative z-10 cursor-pointer">
                {/* Selected Clip */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white cursor-ew-resize"></div>
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white cursor-ew-resize"></div>
                {/* FX Badge */}
                <div className="absolute top-0 right-0 bg-purple-500 text-[8px] font-bold px-1 rounded-bl">FX</div>
                <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=100&q=80" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none filter sepia" alt="" />
                <span className="text-[10px] font-bold text-white truncate drop-shadow-md relative z-10">002_main_clip.mp4 [B&W Noir]</span>
              </div>
            </div>

            {/* Track 2: Audio */}
            <div className="absolute top-[88px] left-0 right-0 h-16 border-b border-[#262626] flex items-center pt-1 pb-1">
              <div className="absolute left-[50px] w-[550px] h-14 bg-green-600/30 rounded border border-green-500/50 flex flex-col justify-center px-2 overflow-hidden cursor-pointer relative group">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-green-500/50">
                   {/* Volume Keyframes */}
                   <div className="absolute top-1/2 left-[10%] w-2 h-2 rounded-full border border-white bg-green-400 transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-pointer"></div>
                   <div className="absolute top-1/2 left-[90%] w-2 h-2 rounded-full border border-white bg-green-400 transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-pointer"></div>
                </div>
                <div className="flex items-center relative z-10">
                  <i className="fas fa-wave-square text-[10px] text-green-400 mr-2 opacity-80"></i>
                  <span className="text-[10px] font-bold text-green-100 truncate">background_music_01.mp3</span>
                </div>
              </div>
            </div>

            {/* Track 3: Text/Subtitles */}
            <div className="absolute top-[152px] left-0 right-0 h-10 flex items-center pt-1 pb-1">
              <div className="absolute left-[280px] w-[120px] h-8 bg-purple-600/80 rounded border border-purple-400 flex items-center justify-center overflow-hidden cursor-pointer">
                <span className="text-[10px] font-bold text-white truncate">"Hello world"</span>
              </div>
              <div className="absolute left-[410px] w-[150px] h-8 bg-purple-600/40 rounded border border-purple-500/50 flex items-center justify-center overflow-hidden cursor-pointer">
                <span className="text-[10px] font-bold text-white/70 truncate">"Welcome to..."</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
