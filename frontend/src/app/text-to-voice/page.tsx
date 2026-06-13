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
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Text to Speech 🗣️</h1>
        <p className="text-gray-500 mt-2">Generate ultra-realistic human voices from text.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="clay-card p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-700">Voice Settings</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">Language</label>
              <div className="relative">
                <select className="clay-input w-full appearance-none">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Arabic</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-4 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">Voice Model</label>
              <div className="relative">
                <select className="clay-input w-full appearance-none">
                  <option>Aurora (Female, Calm)</option>
                  <option>Atlas (Male, Deep)</option>
                  <option>Nova (Female, Energetic)</option>
                  <option>Orion (Male, Professional)</option>
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-4 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 flex justify-between">
                <span>Speed</span>
                <span className="text-blue-500">1.0x</span>
              </label>
              <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full accent-blue-500" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 flex justify-between">
                <span>Emotion / Tone</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button className="clay-btn-active text-blue-600 py-2 rounded-xl text-sm font-bold">Neutral</button>
                <button className="clay-btn py-2 rounded-xl text-sm font-bold text-gray-500">Excited</button>
                <button className="clay-btn py-2 rounded-xl text-sm font-bold text-gray-500">Sad</button>
                <button className="clay-btn py-2 rounded-xl text-sm font-bold text-gray-500">Angry</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Text Input & Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="clay-card p-6 flex flex-col h-full min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700">Script</h3>
              <span className="text-sm text-gray-400 font-bold">{text.length} / 5000 chars</span>
            </div>
            
            <textarea 
              className="clay-input w-full flex-1 resize-none mb-6 text-gray-700 placeholder-gray-400 leading-relaxed"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>

            <div className="flex justify-end">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || text.length === 0}
                className={`px-8 py-3 font-bold text-lg flex items-center transition-all
                  ${text.length === 0 ? 'clay-btn text-gray-400 cursor-not-allowed' : 'clay-btn-primary shadow-blue-500/50'}
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
            <div className="clay-card-green p-6 animate-fade-in flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <button className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl shadow-lg shadow-green-500/40">
                  <i className="fas fa-play ml-1"></i>
                </button>
                <div className="flex-1 mr-6">
                  <div className="h-2 bg-green-200 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-green-500 w-1/3 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-green-700 mt-2">
                    <span>0:00</span>
                    <span>1:24</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="clay-btn w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500">
                  <i className="fas fa-download"></i>
                </button>
                <button className="clay-btn w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500">
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
