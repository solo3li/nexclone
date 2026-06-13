"use client";

import { useState } from "react";

export default function VoiceToText() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResultText("This is a mock transcription of the uploaded audio file. NexMedia AI effectively transcribes audio accurately and quickly, supporting multiple languages and dialects.");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Voice to Text</h1>
        <p className="text-slate-400">Upload an audio file (MP3, WAV, etc.) to transcribe it to text.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        {!resultText ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-purple-500/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 text-3xl">
              🎙️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload your audio</h3>
            <p className="text-slate-400 mb-6 max-w-sm">Drag and drop your audio file here, or click to browse. Max size 20MB.</p>
            
            <input 
              type="file" 
              id="audio-upload" 
              className="hidden" 
              accept="audio/*"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="audio-upload"
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium cursor-pointer transition-colors shadow-lg shadow-purple-500/25"
            >
              {file ? file.name : "Select Audio File"}
            </label>

            {file && (
              <button 
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 px-8 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold disabled:opacity-50 transition-all"
              >
                {loading ? "Transcribing..." : "Transcribe"}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl p-6 border border-white/10 bg-black/50 text-slate-200 leading-relaxed min-h-[200px]">
              {resultText}
            </div>
            <div className="flex justify-between items-center">
              <button 
                onClick={() => { setFile(null); setResultText(""); }}
                className="text-slate-400 hover:text-white font-medium transition-colors"
              >
                Transcribe another
              </button>
              <button 
                onClick={() => navigator.clipboard.writeText(resultText)}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors shadow-lg shadow-purple-500/25"
              >
                Copy Text
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
