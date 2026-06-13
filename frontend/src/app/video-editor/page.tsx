"use client";

import { useState } from "react";
import Link from "next/link";

export default function VideoEditor() {
  const [activeAssetTab, setActiveAssetTab] = useState("media");

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
              Untitled_Project_01 <i className="fas fa-edit ml-2 text-[10px] text-[var(--color-bento-muted)]"></i>
            </h1>
            <span className="text-[10px] text-[var(--color-bento-muted)]">Auto-saved 2 mins ago</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="bento-btn px-4 py-2 text-xs font-bold flex items-center space-x-2">
            <i className="fas fa-users text-[10px]"></i>
            <span>Share</span>
          </button>
          <button className="bento-btn-accent px-6 py-2 text-xs flex items-center space-x-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <i className="fas fa-download text-[10px]"></i>
            <span>Export</span>
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
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "media" ? "bg-[#262626] text-white" : "text-[var(--color-bento-muted)] hover:text-white"}`}
            >
              <i className="fas fa-folder-open mr-1 block mb-1 text-sm"></i> Media
            </button>
            <button 
              onClick={() => setActiveAssetTab("text")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "text" ? "bg-[#262626] text-white" : "text-[var(--color-bento-muted)] hover:text-white"}`}
            >
              <i className="fas fa-font mr-1 block mb-1 text-sm"></i> Text
            </button>
            <button 
              onClick={() => setActiveAssetTab("ai")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeAssetTab === "ai" ? "bg-[#262626] text-blue-400" : "text-[var(--color-bento-muted)] hover:text-blue-400"}`}
            >
              <i className="fas fa-magic mr-1 block mb-1 text-sm"></i> Gen AI
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {activeAssetTab === "media" && (
              <div className="space-y-4">
                <button className="w-full py-8 border-2 border-dashed border-[#3f3f46] rounded-xl flex flex-col items-center justify-center text-[var(--color-bento-muted)] hover:border-blue-500 hover:text-blue-400 transition-colors bg-[#0a0a0a]">
                  <i className="fas fa-cloud-upload-alt text-xl mb-2"></i>
                  <span className="text-xs font-bold">Import Media</span>
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-video bg-[#1a1a1a] rounded-lg border border-[var(--color-bento-border)] relative group overflow-hidden cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="clip" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[8px]">00:12</span>
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
            
            {activeAssetTab === "ai" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[var(--color-bento-muted)] uppercase">Text to Video</h3>
                <textarea className="bento-input w-full h-24 text-xs resize-none" placeholder="Describe the scene you want to generate..."></textarea>
                <button className="bento-btn-accent w-full py-2 text-xs shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <i className="fas fa-magic mr-2"></i> Generate Video
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Center: Video Player */}
        <main className="flex-1 bento-card flex flex-col p-4 relative min-w-0">
          <div className="flex-1 bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-[#262626] shadow-inner">
            {/* Mockup Video Frame */}
            <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-90" alt="player" />
            
            {/* Overlays */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono border border-white/10">
              1920x1080 • 60 FPS
            </div>
            
            {/* Safe Zones Mockup */}
            <div className="absolute inset-8 border border-white/20 border-dashed pointer-events-none hidden md:block"></div>
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
              <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                <i className="fas fa-play ml-1"></i>
              </button>
              <button className="text-[var(--color-bento-muted)] hover:text-white transition-colors">
                <i className="fas fa-step-forward"></i>
              </button>
            </div>
            
            <div className="flex items-center space-x-3 text-[var(--color-bento-muted)]">
              <button className="hover:text-white"><i className="fas fa-expand"></i></button>
              <button className="hover:text-white"><i className="fas fa-volume-up"></i></button>
            </div>
          </div>
        </main>

        {/* Right: Properties Panel */}
        <aside className="w-80 bento-card flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-[var(--color-bento-border)] sticky top-0 bg-[var(--color-bento-card)] z-10">
            <h2 className="text-sm font-bold">Properties</h2>
          </div>
          
          <div className="p-4 space-y-6">
            
            {/* AI Tools Section */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-[var(--color-bento-muted)] uppercase tracking-wider flex items-center">
                <i className="fas fa-magic text-blue-400 mr-2"></i> AI Magic Tools
              </h3>
              
              <button className="bento-btn w-full p-3 flex items-center justify-between group">
                <span className="text-xs font-semibold">Auto Captions</span>
                <i className="fas fa-closed-captioning text-[var(--color-bento-muted)] group-hover:text-white"></i>
              </button>
              
              <button className="bento-btn w-full p-3 flex items-center justify-between group">
                <span className="text-xs font-semibold">Remove Background</span>
                <i className="fas fa-user-slash text-[var(--color-bento-muted)] group-hover:text-white"></i>
              </button>
              
              <button className="bento-btn w-full p-3 flex items-center justify-between group">
                <span className="text-xs font-semibold">Enhance Audio</span>
                <i className="fas fa-wave-square text-[var(--color-bento-muted)] group-hover:text-white"></i>
              </button>
            </div>

            {/* Transform */}
            <div className="space-y-3 border-t border-[var(--color-bento-border)] pt-6">
              <h3 className="text-[10px] font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Transform</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--color-bento-muted)]">Scale</label>
                  <div className="relative">
                    <input type="text" className="bento-input w-full text-xs py-1.5 pl-2 pr-6" defaultValue="100%" />
                    <i className="fas fa-percent absolute right-2 top-2 text-[10px] text-[var(--color-bento-muted)]"></i>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--color-bento-muted)]">Rotation</label>
                  <div className="relative">
                    <input type="text" className="bento-input w-full text-xs py-1.5 pl-2 pr-6" defaultValue="0°" />
                    <i className="fas fa-undo absolute right-2 top-2 text-[10px] text-[var(--color-bento-muted)]"></i>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 mt-2">
                <label className="text-[10px] text-[var(--color-bento-muted)]">Opacity</label>
                <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-white h-1 bg-[#262626] rounded-lg appearance-none" />
              </div>
            </div>

          </div>
        </aside>
      </div>

      {/* 3. Bottom Timeline */}
      <div className="h-64 bento-card shrink-0 flex flex-col relative overflow-hidden">
        
        {/* Timeline Tools */}
        <div className="h-10 border-b border-[var(--color-bento-border)] flex items-center justify-between px-4 bg-[#141414]">
          <div className="flex space-x-2">
            <button className="w-6 h-6 rounded hover:bg-[#262626] text-[var(--color-bento-muted)] hover:text-white text-[10px] flex items-center justify-center"><i className="fas fa-undo"></i></button>
            <button className="w-6 h-6 rounded hover:bg-[#262626] text-[var(--color-bento-muted)] hover:text-white text-[10px] flex items-center justify-center"><i className="fas fa-redo"></i></button>
            <div className="w-px h-4 bg-[#3f3f46] mx-1 self-center"></div>
            <button className="w-6 h-6 rounded hover:bg-[#262626] text-[var(--color-bento-muted)] hover:text-white text-[10px] flex items-center justify-center"><i className="fas fa-cut"></i></button>
            <button className="w-6 h-6 rounded hover:bg-[#262626] text-[var(--color-bento-muted)] hover:text-white text-[10px] flex items-center justify-center"><i className="fas fa-trash"></i></button>
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
          <div className="w-32 bg-[#0a0a0a] border-r border-[var(--color-bento-border)] z-10 flex flex-col divide-y divide-[#262626]">
            {/* Timecode Header Space */}
            <div className="h-6 bg-[#141414]"></div>
            
            {/* Tracks */}
            <div className="h-16 flex items-center px-2 text-[10px] font-bold text-[var(--color-bento-muted)] space-x-2">
              <i className="fas fa-video w-3 text-center"></i> <span>V1</span>
            </div>
            <div className="h-16 flex items-center px-2 text-[10px] font-bold text-[var(--color-bento-muted)] space-x-2">
              <i className="fas fa-music w-3 text-center"></i> <span>A1</span>
            </div>
            <div className="h-10 flex items-center px-2 text-[10px] font-bold text-[var(--color-bento-muted)] space-x-2">
              <i className="fas fa-font w-3 text-center"></i> <span>T1</span>
            </div>
          </div>

          {/* Tracks Content Grid */}
          <div className="flex-1 bg-[#0f0f0f] relative overflow-x-auto overflow-y-hidden" style={{ backgroundImage: 'linear-gradient(90deg, #1f1f1f 1px, transparent 1px)', backgroundSize: '100px 100%' }}>
            
            {/* Playhead Marker */}
            <div className="absolute top-0 bottom-0 left-[250px] w-px bg-red-500 z-20 pointer-events-none">
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-transparent border-t-red-500 absolute -top-0 -translate-x-1/2"></div>
            </div>

            {/* Track 1: Video */}
            <div className="absolute top-6 left-0 right-0 h-16 border-b border-[#262626] flex items-center pt-1 pb-1">
              <div className="absolute left-[50px] w-[200px] h-12 bg-blue-600/80 rounded-md border border-blue-400 flex items-center px-2 overflow-hidden shadow-sm">
                <span className="text-[10px] font-bold text-white truncate shadow-black">001_intro.mp4</span>
              </div>
              <div className="absolute left-[260px] w-[350px] h-12 bg-blue-600/50 rounded-md border border-blue-500/50 flex items-center px-2 overflow-hidden">
                <span className="text-[10px] font-bold text-white truncate">002_main_clip.mp4</span>
              </div>
            </div>

            {/* Track 2: Audio */}
            <div className="absolute top-[88px] left-0 right-0 h-16 border-b border-[#262626] flex items-center pt-1 pb-1">
              <div className="absolute left-[50px] w-[560px] h-12 bg-green-600/30 rounded-md border border-green-500/50 flex items-center px-2 overflow-hidden">
                <i className="fas fa-wave-square text-[10px] text-green-400 mr-2 opacity-50"></i>
                <span className="text-[10px] font-bold text-green-100 truncate">background_music_01.mp3</span>
                {/* Fake Waveform */}
                <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                  <path d="M0,24 Q10,5 20,24 T40,24 T60,10 T80,24 T100,24 T120,40 T140,24 T160,24 T180,5 T200,24" stroke="#4ade80" fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                </svg>
              </div>
            </div>

            {/* Track 3: Text/Subtitles */}
            <div className="absolute top-[152px] left-0 right-0 h-10 flex items-center pt-1 pb-1">
              <div className="absolute left-[280px] w-[120px] h-6 bg-purple-600/80 rounded-md border border-purple-400 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] font-bold text-white truncate">"Hello world"</span>
              </div>
              <div className="absolute left-[410px] w-[150px] h-6 bg-purple-600/40 rounded-md border border-purple-500/50 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] font-bold text-white/70 truncate">"Welcome to..."</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
