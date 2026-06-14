"use client";

import { useState, useRef, useEffect } from "react";
import { useAiStore } from "../../store/useAiStore";

export default function TextToVoice() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("English (US)");
  const [voiceName, setVoiceName] = useState("Aurora");
  const [styleInstruction, setStyleInstruction] = useState("Neutral");

  const { isGeneratingAudio, audioUrl, error, generateAudio, clearAudio } = useAiStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    clearAudio();
    await generateAudio(text, language, voiceName, styleInstruction);
  };

  useEffect(() => {
    // Automatically play the audio when it's generated
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Auto-play prevented", e));
    }
  }, [audioUrl]);

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Speech AI</h1>
        <p className="text-[var(--color-bento-muted)] mt-2">Generate ultra-realistic human voices from text.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bento-grid grid-cols-1 lg:grid-cols-3">
        
        {/* Left Column: Settings */}
        <div className="bento-card p-6 space-y-6 lg:col-span-1 h-full">
          <h3 className="font-bold text-white border-b border-[var(--color-bento-border)] pb-4">Voice Settings</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">Language</label>
            <div className="relative">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bento-input w-full appearance-none text-sm"
              >
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
              <select 
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="bento-input w-full appearance-none text-sm"
              >
                <option value="Aurora">Aurora (Female, Calm)</option>
                <option value="Atlas">Atlas (Male, Deep)</option>
                <option value="Nova">Nova (Female, Energetic)</option>
                <option value="Orion">Orion (Male, Professional)</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-4 text-[var(--color-bento-muted)] pointer-events-none text-xs"></i>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider flex justify-between">
              <span>Emotion / Tone</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Neutral', 'Excited', 'Sad', 'Angry'].map(emotion => (
                <button 
                  key={emotion}
                  onClick={() => setStyleInstruction(emotion)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                    styleInstruction === emotion 
                      ? 'bg-white text-black border-white' 
                      : 'bg-[#0a0a0a] border-[var(--color-bento-border)] text-[var(--color-bento-muted)] hover:text-white hover:border-[#3f3f46]'
                  }`}
                >
                  {emotion}
                </button>
              ))}
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
                disabled={isGeneratingAudio || text.length === 0}
                className={`px-8 py-3 text-sm flex items-center transition-all rounded-xl font-bold
                  ${text.length === 0 
                    ? 'bg-[#1a1a1a] text-[#52525b] cursor-not-allowed border border-[var(--color-bento-border)]' 
                    : 'bento-btn-accent shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  }
                `}
              >
                {isGeneratingAudio ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i> Synthesizing...</>
                ) : (
                  <><i className="fas fa-wave-square mr-2"></i> Generate Audio</>
                )}
              </button>
            </div>
          </div>

          {/* Audio Player Result */}
          {audioUrl && (
            <div className="bento-card p-4 animate-fade-in flex items-center justify-between border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center space-x-4 flex-1">
                <audio ref={audioRef} controls src={audioUrl} className="w-full h-10 outline-none" />
              </div>
              <div className="flex space-x-2 ml-4">
                <a 
                  href={audioUrl} 
                  download={`tts_output_${Date.now()}.mp3`}
                  className="bento-btn w-10 h-10 rounded flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white"
                  title="Download Audio"
                >
                  <i className="fas fa-download text-sm"></i>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
