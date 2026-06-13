"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type GenerationMode = 'text' | 'image' | 'hybrid';

export default function ThreeDStudio() {
  const [mode, setMode] = useState<GenerationMode>('text');
  const [prompt, setPrompt] = useState("");
  const [imageRef, setImageRef] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  
  const [generatedModel, setGeneratedModel] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImageRef(url);
      if (mode === 'text') setMode('hybrid');
    }
  };

  const startGeneration = () => {
    if ((mode === 'text' || mode === 'hybrid') && !prompt) return;
    if ((mode === 'image' || mode === 'hybrid') && !imageRef) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedModel(null);
    setStatusText("Initializing AI Core...");

    // Mock AI Generation Sequence
    let currentProg = 0;
    progressIntervalRef.current = setInterval(() => {
      currentProg += Math.random() * 5 + 2;
      
      if (currentProg >= 100) {
        currentProg = 100;
        clearInterval(progressIntervalRef.current!);
        setStatusText("Generation Complete!");
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratedModel("mock_cube_001");
        }, 1000);
      } else if (currentProg > 80) {
        setStatusText("Refining Geometry & Textures...");
      } else if (currentProg > 50) {
        setStatusText("Generating 3D Mesh...");
      } else if (currentProg > 20) {
        setStatusText("Analyzing Prompt & Reference...");
      }
      
      setProgress(Math.min(100, currentProg));
    }, 400);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] p-2 md:p-4 md:space-y-4 space-y-2 text-white font-sans overflow-hidden animate-fade-in">
      
      {/* Header */}
      <header className="flex justify-between items-center h-12 shrink-0 border-b border-[#262626] pb-2">
        <div className="flex items-center space-x-4">
          <Link href="/" className="bento-btn w-10 h-10 flex items-center justify-center text-[#a1a1aa] hover:text-white">
            <i className="fas fa-arrow-left text-sm"></i>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold flex items-center">
              Nexus_3D_Studio <i className="fas fa-cube ml-2 text-[10px] text-purple-400"></i>
            </h1>
            <span className="text-[10px] text-purple-400 font-bold hidden md:block">AI Generative Engine</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#a1a1aa] font-mono mr-4"><i className="fas fa-coins text-yellow-500 mr-1"></i> 140 Credits</span>
          <button className="bento-btn-accent px-4 py-1 text-xs"><i className="fas fa-download mr-2"></i> Export .glb</button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 min-h-0 relative">
        
        {/* Left: Input Panel */}
        <aside className="w-full md:w-80 bento-card flex flex-col shrink-0 bg-[#0a0a0a]">
          <div className="p-4 border-b border-[#262626]">
            <h2 className="text-sm font-bold mb-4 flex items-center"><i className="fas fa-magic text-purple-400 mr-2"></i> Generation Mode</h2>
            <div className="flex bg-[#141414] rounded-lg p-1 border border-[#262626]">
              <button onClick={() => setMode('text')} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${mode === 'text' ? 'bg-purple-600 shadow-md text-white' : 'text-[#a1a1aa] hover:text-white'}`}>Text</button>
              <button onClick={() => setMode('image')} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${mode === 'image' ? 'bg-purple-600 shadow-md text-white' : 'text-[#a1a1aa] hover:text-white'}`}>Image</button>
              <button onClick={() => setMode('hybrid')} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${mode === 'hybrid' ? 'bg-purple-600 shadow-md text-white' : 'text-[#a1a1aa] hover:text-white'}`}>Hybrid</button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-6">
            
            {/* Text Input */}
            {(mode === 'text' || mode === 'hybrid') && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#a1a1aa] flex justify-between">
                  <span>Prompt Description</span>
                  <span className="text-[10px] font-mono text-purple-400">High Quality</span>
                </label>
                <textarea 
                  className="w-full h-32 bg-[#141414] border border-[#262626] rounded-xl p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none transition-all"
                  placeholder="Describe your 3D model in detail... (e.g., A futuristic cyberpunk motorcycle, glowing neon wheels, realistic metallic textures)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            )}

            {/* Image Input */}
            {(mode === 'image' || mode === 'hybrid') && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#a1a1aa]">Reference Image</label>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                {!imageRef ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-[#3f3f46] rounded-xl flex flex-col items-center justify-center text-[#a1a1aa] hover:border-purple-500 hover:text-purple-400 transition-colors cursor-pointer bg-[#141414]"
                  >
                    <i className="fas fa-image text-2xl mb-2"></i>
                    <span className="text-xs font-bold">Click or Drag to Upload</span>
                  </div>
                ) : (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#262626] group">
                    <img src={imageRef} alt="Reference" className="w-full h-full object-cover opacity-80" />
                    <button 
                      onClick={() => setImageRef(null)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-times text-[10px]"></i>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Advanced Settings (Visual only) */}
            <div className="space-y-3 pt-4 border-t border-[#262626]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#a1a1aa] font-bold">Negative Prompt</span>
                <i className="fas fa-chevron-down text-[#3f3f46]"></i>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#a1a1aa] font-bold">Topology Density</span>
                <span className="font-mono text-purple-400">Quad (High)</span>
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-[#262626]">
            <button 
              onClick={startGeneration}
              disabled={isGenerating || ((mode === 'text' || mode === 'hybrid') && !prompt) || ((mode === 'image' || mode === 'hybrid') && !imageRef)}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center group"
            >
              {isGenerating ? (
                <><i className="fas fa-circle-notch fa-spin mr-2"></i> Generating...</>
              ) : (
                <><i className="fas fa-cube mr-2 group-hover:rotate-180 transition-transform duration-500"></i> Generate 3D Model</>
              )}
            </button>
          </div>
        </aside>

        {/* Center: 3D Viewer */}
        <main className="flex-1 bento-card flex flex-col relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-[#262626] shadow-inner">
          
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#262626 1px, transparent 1px), linear-gradient(90deg, #262626 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(3)' }}></div>

          {/* Viewport Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            
            {/* State 1: Empty */}
            {!isGenerating && !generatedModel && (
              <div className="text-center text-[#3f3f46] animate-pulse">
                <i className="fas fa-cubes text-6xl mb-4 opacity-50"></i>
                <p className="font-mono text-sm">Awaiting Generation Input</p>
              </div>
            )}

            {/* State 2: Generating (Loading Animation) */}
            {isGenerating && (
              <div className="flex flex-col items-center z-10 w-full max-w-md px-8">
                {/* Holographic scanning effect placeholder */}
                <div className="w-32 h-32 mb-8 relative">
                   <div className="absolute inset-0 border-4 border-purple-500/30 rounded-lg animate-spin-slow"></div>
                   <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-lg animate-spin"></div>
                   <i className="fas fa-brain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-pulse"></i>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{statusText}</h3>
                <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#262626]">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="font-mono text-xs text-[#a1a1aa] mt-2 text-right w-full">{progress.toFixed(0)}%</p>
              </div>
            )}

            {/* State 3: Generated (Mock CSS 3D Cube) */}
            {generatedModel && !isGenerating && (
              <div className="relative z-10 flex flex-col items-center cursor-move">
                <div className="scene">
                  <div className="cube animate-float-spin">
                    <div className="cube-face front bg-purple-500/20 border border-purple-500 backdrop-blur-sm flex items-center justify-center"><i className="fas fa-robot text-purple-400 text-4xl"></i></div>
                    <div className="cube-face back bg-indigo-500/20 border border-indigo-500 backdrop-blur-sm"></div>
                    <div className="cube-face right bg-blue-500/20 border border-blue-500 backdrop-blur-sm"></div>
                    <div className="cube-face left bg-pink-500/20 border border-pink-500 backdrop-blur-sm"></div>
                    <div className="cube-face top bg-purple-400/20 border border-purple-400 backdrop-blur-sm"></div>
                    <div className="cube-face bottom bg-indigo-600/20 border border-indigo-600 backdrop-blur-sm shadow-[0_0_100px_rgba(168,85,247,0.5)]"></div>
                  </div>
                </div>
                <div className="absolute -bottom-24 bg-[#141414]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#262626] flex items-center space-x-4 shadow-xl">
                   <button className="text-[#a1a1aa] hover:text-white"><i className="fas fa-undo"></i></button>
                   <button className="text-[#a1a1aa] hover:text-white"><i className="fas fa-search-plus"></i></button>
                   <button className="text-[#a1a1aa] hover:text-white"><i className="fas fa-cube"></i> Wireframe</button>
                </div>
              </div>
            )}
          </div>

          {/* Viewport Overlay UI */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-[#3f3f46] text-left pointer-events-none">
             <p>X: 0.00 Y: 0.00 Z: 0.00</p>
             <p>Polygons: {generatedModel ? '12,450' : '0'}</p>
             <p>Engine: Nexus.AI.3D_v2</p>
          </div>
        </main>

        {/* Right: Library Panel */}
        <aside className="w-full md:w-64 bento-card flex flex-col shrink-0 bg-[#0a0a0a] hidden md:flex">
          <div className="p-4 border-b border-[#262626]">
            <h2 className="text-sm font-bold flex items-center"><i className="fas fa-layer-group text-blue-400 mr-2"></i> Asset Library</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
             {/* Mock History Items */}
             {generatedModel && (
                <div className="bg-[#141414] rounded-lg border border-purple-500/50 p-2 relative group cursor-pointer overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="h-24 bg-[#050505] rounded mb-2 flex items-center justify-center border border-[#262626]">
                     <i className="fas fa-cube text-purple-400 text-3xl"></i>
                   </div>
                   <p className="text-[10px] font-bold truncate">Cyberpunk Element</p>
                   <p className="text-[9px] text-[#a1a1aa]">Just now</p>
                </div>
             )}
             
             <div className="bg-[#141414] rounded-lg border border-[#262626] p-2 relative group cursor-pointer hover:border-[#3f3f46] transition-colors">
                <div className="h-24 bg-[#050505] rounded mb-2 flex items-center justify-center border border-[#262626]">
                  <i className="fas fa-car text-[#a1a1aa] text-3xl"></i>
                </div>
                <p className="text-[10px] font-bold truncate">Retro Vehicle</p>
                <p className="text-[9px] text-[#a1a1aa]">2 days ago</p>
             </div>
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scene {
          width: 200px;
          height: 200px;
          perspective: 600px;
        }
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transform: translateZ(-100px) rotateX(-20deg) rotateY(-45deg);
        }
        .cube-face {
          position: absolute;
          width: 200px;
          height: 200px;
        }
        .front  { transform: rotateY(  0deg) translateZ(100px); }
        .right  { transform: rotateY( 90deg) translateZ(100px); }
        .back   { transform: rotateY(180deg) translateZ(100px); }
        .left   { transform: rotateY(-90deg) translateZ(100px); }
        .top    { transform: rotateX( 90deg) translateZ(100px); }
        .bottom { transform: rotateX(-90deg) translateZ(100px); }
        
        @keyframes float-spin {
          0% { transform: translateZ(-100px) rotateX(-20deg) rotateY(0deg) translateY(0px); }
          50% { transform: translateZ(-100px) rotateX(-25deg) rotateY(180deg) translateY(-20px); }
          100% { transform: translateZ(-100px) rotateX(-20deg) rotateY(360deg) translateY(0px); }
        }
        .animate-float-spin {
          animation: float-spin 10s infinite linear;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}} />
    </div>
  );
}
