"use client";

import { useState } from "react";

export default function VideoCaption() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultVideo, setResultVideo] = useState<string | null>(null);

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
      // Mock video URL
      setResultVideo("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Video Captioning</h1>
        <p className="text-slate-400">Automatically generate and burn high-quality subtitles into your videos.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        {!resultVideo ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-pink-500/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6 text-3xl">
              🎬
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload your video</h3>
            <p className="text-slate-400 mb-6 max-w-sm">Drag and drop your video file here (MP4, MOV). Max size 50MB.</p>
            
            <input 
              type="file" 
              id="video-upload" 
              className="hidden" 
              accept="video/*"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="video-upload"
              className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium cursor-pointer transition-colors shadow-lg shadow-pink-500/25"
            >
              {file ? file.name : "Select Video File"}
            </label>

            {file && (
              <button 
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 px-8 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold disabled:opacity-50 transition-all"
              >
                {loading ? "Processing Video..." : "Generate Captions"}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video">
              <video controls className="w-full h-full" src={resultVideo}>
                Your browser does not support the video element.
              </video>
            </div>
            <div className="flex justify-between items-center">
              <button 
                onClick={() => { setFile(null); setResultVideo(null); }}
                className="text-slate-400 hover:text-white font-medium transition-colors"
              >
                Caption another
              </button>
              <a 
                href={resultVideo} 
                download="captioned_video.mp4"
                className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium transition-colors shadow-lg shadow-pink-500/25"
              >
                Download Video
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
