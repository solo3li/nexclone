"use client";

import { useState, useRef } from "react";

export default function VoiceToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Voice to Text</h1>
        <p className="text-slate-500 mt-2">Transcribe audio into highly accurate text using advanced AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Section */}
        <div className="clay-card p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-2xl mb-6">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Upload Audio File</h3>
          <p className="text-sm text-slate-500 mb-6">MP3, WAV, M4A up to 50MB</p>
          
          <input 
            type="file" 
            id="audio-upload" 
            className="hidden" 
            accept="audio/*"
            onChange={handleFileUpload}
          />
          <label 
            htmlFor="audio-upload" 
            className="clay-btn-primary px-8 py-3 cursor-pointer font-bold inline-block"
          >
            Select File
          </label>
          
          {file && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 font-medium flex items-center">
              <i className="fas fa-file-audio text-slate-400 mr-2"></i>
              {file.name}
            </div>
          )}
        </div>

        {/* Record Section */}
        <div className="clay-card p-8 flex flex-col items-center justify-center text-center">
          <div className="mb-8 relative">
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all
                ${isRecording ? 'bg-red-500 text-white shadow-lg' : 'clay-btn text-slate-700 hover:text-slate-900'}`}
            >
              <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            {isRecording ? "Recording..." : "Record Live Audio"}
          </h3>
          <p className="text-2xl font-mono text-slate-600 font-bold tracking-widest">
            {formatTime(recordingTime)}
          </p>
        </div>

      </div>

      {/* Settings Section */}
      <div className="clay-card p-8">
        <h3 className="text-lg font-bold text-slate-700 mb-6">Transcription Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Audio Language</label>
            <div className="relative">
              <select className="clay-input w-full appearance-none">
                <option>Auto-Detect</option>
                <option>English</option>
                <option>Arabic</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 pointer-events-none"></i>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Model Output</label>
            <div className="relative">
              <select className="clay-input w-full appearance-none">
                <option>Standard Text</option>
                <option>Subtitles (SRT)</option>
                <option>Subtitles (VTT)</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-4 text-slate-400 pointer-events-none"></i>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="clay-btn-primary px-10 py-3 font-bold flex items-center">
            <i className="fas fa-magic mr-2"></i> Start Transcription
          </button>
        </div>
      </div>

    </div>
  );
}
