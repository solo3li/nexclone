"use client";

import { useState } from "react";

export default function TextToVoice() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowPlayer(false);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowPlayer(true);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Speech AI</h1>
        <p className="text-[var(--color-bento-muted)] mt-2">Generate ultra-realistic human voices from text.</p>
      </div>

      <div className="bento-grid grid-cols-1 lg:grid-cols-3">
        
        {/* Left Column: Settings */}
        <div className="bento-card p-6 space-y-6 lg:col-span-1 h-full">
          <h3 className="font-bold text-white border-b border-[var(--color-bento-border)] pb-4">Voice Settings</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Language</label>
            <div className="relative">
              <select className="bento-input w-full appearance-none text-sm">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Arabic</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-4 text-[var(--color-bento-muted)] pointer-events-none text-xs"></i>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Voice Model</label>
            <div className="relative">
              <select className="bento-input w-full appearance-none text-sm">
                <option>Aurora (Female, Calm)</option>
                <option>Atlas (Male, Deep)</option>
                <option>Nova (Female, Energetic)</option>
                <option>Orion (Male, Professional)</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-4 text-[var(--color-bento-muted)] pointer-events-none text-xs"></i>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider flex justify-between">
              <span>Speed</span>
              <span className="text-blue-400">1.0x</span>
            </label>
            <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full accent-blue-500 bg-[#0a0a0a] rounded-lg h-2" />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider flex justify-between">
              <span>Emotion / Tone</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-white text-black py-2 rounded-lg text-xs font-bold transition-all">Neutral</button>
              <button className="bg-[#0a0a0a] border border-[var(--color-bento-border)] text-[var(--color-bento-muted)] hover:text-white hover:border-[#3f3f46] py-2 rounded-lg text-xs font-bold transition-all">Excited</button>
              <button className="bg-[#0a0a0a] border border-[var(--color-bento-border)] text-[var(--color-bento-muted)] hover:text-white hover:border-[#3f3f46] py-2 rounded-lg text-xs font-bold transition-all">Sad</button>
              <button className="bg-[#0a0a0a] border border-[var(--color-bento-border)] text-[var(--color-bento-muted)] hover:text-white hover:border-[#3f3f46] py-2 rounded-lg text-xs font-bold transition-all">Angry</button>
            </div>
          </div>
        </div>

        {/* Right Column: Text Input & Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bento-card p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--color-bento-border)]">
              <h3 className="font-bold text-white">Script</h3>
              <span className="text-xs text-[var(--color-bento-muted)] font-mono">{text.length} / 5000</span>
            </div>
            
            <textarea 
              className="w-full flex-1 resize-none mb-6 bg-transparent text-[var(--color-bento-text)] placeholder-[var(--color-bento-muted)] leading-relaxed outline-none"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>

            <div className="flex justify-end pt-4 border-t border-[var(--color-bento-border)]">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || text.length === 0}
                className={`px-8 py-3 text-sm flex items-center transition-all rounded-xl font-bold
                  ${text.length === 0 
                    ? 'bg-[#1a1a1a] text-[#52525b] cursor-not-allowed border border-[var(--color-bento-border)]' 
                    : 'bento-btn-accent shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  }
                `}
              >
                {isGenerating ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i> Synthesizing...</>
                ) : (
                  <><i className="fas fa-wave-square mr-2"></i> Generate Audio</>
                )}
              </button>
            </div>
          </div>

          {/* Audio Player Result */}
          {showPlayer && (
            <div className="bento-card p-4 animate-fade-in flex items-center justify-between border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center space-x-4 flex-1">
                <button className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                  <i className="fas fa-play ml-1"></i>
                </button>
                <div className="flex-1 mr-6">
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full w-full overflow-hidden border border-[#262626]">
                    <div className="h-full bg-blue-500 w-1/3 rounded-full relative">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[var(--color-bento-muted)] mt-2">
                    <span>0:00</span>
                    <span>1:24</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bento-btn w-8 h-8 rounded flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white">
                  <i className="fas fa-download text-xs"></i>
                </button>
                <button className="bento-btn w-8 h-8 rounded flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white">
                  <i className="fas fa-share-alt text-xs"></i>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
