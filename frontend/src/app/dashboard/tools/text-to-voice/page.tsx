"use client";

import { useState } from "react";

export default function TextToVoice() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [loading, setLoading] = useState(false);
  const [resultAudio, setResultAudio] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Using a placeholder audio file for mockup
      setResultAudio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Text to Voice</h1>
        <p className="text-slate-400">Generate lifelike speech from text using advanced AI voices.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Select Voice</label>
          <select 
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          >
            <option value="alloy">Alloy (Neutral)</option>
            <option value="echo">Echo (Male)</option>
            <option value="fable">Fable (British)</option>
            <option value="nova">Nova (Female)</option>
            <option value="shimmer">Shimmer (Female)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Your Text</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Type or paste your text here..."
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
          />
        </div>

        {!resultAudio ? (
          <button 
            onClick={handleGenerate}
            disabled={!text.trim() || loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-50"
          >
            {loading ? "Generating Audio..." : "Generate Speech"}
          </button>
        ) : (
          <div className="p-6 rounded-2xl border border-orange-500/30 bg-orange-500/5 space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Generated Audio</h3>
            <audio controls className="w-full" src={resultAudio}>
              Your browser does not support the audio element.
            </audio>
            
            <div className="flex justify-between items-center pt-4">
              <button 
                onClick={() => setResultAudio(null)}
                className="text-slate-400 hover:text-white font-medium transition-colors"
              >
                Generate another
              </button>
              <a 
                href={resultAudio} 
                download="speech.mp3"
                className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Download MP3
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
