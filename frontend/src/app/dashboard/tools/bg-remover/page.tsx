"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAiStore } from "../../../../store/useAiStore";
import { useAuthStore } from "../../../../store/useAuthStore";

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { removeBackground } = useAiStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to use this tool.");
      router.push("/login");
      return;
    }
    if (!file) return;
    setLoading(true);
    
    try {
      const url = await removeBackground(file);
      setResultImage(url);
    } catch (err: any) {
      alert("Error processing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Background Remover</h1>
        <p className="text-[var(--color-bento-muted)] mt-2">Upload an image to remove its background instantly.</p>
      </div>

      <div className="bento-card p-8">
        {!resultImage ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#3f3f46] rounded-2xl p-12 text-center transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] text-indigo-400 flex items-center justify-center mb-6 text-2xl shadow-inner">
              <i className="fas fa-image"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload your image</h3>
            <p className="text-sm text-[var(--color-bento-muted)] mb-6 max-w-sm">Drag and drop your image here, or click to browse. Max size 10MB.</p>
            
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="file-upload"
              className="bento-btn-primary px-8 py-3 cursor-pointer"
            >
              {file ? file.name : "Select Image"}
            </label>

            {file && (
              <button 
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 px-8 py-3 bento-btn-accent rounded-xl font-bold disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              >
                {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Processing...</> : "Remove Background"}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border border-[#262626] bg-[#0a0a0a] aspect-video flex items-center justify-center relative shadow-inner">
              {/* Checkerboard background for transparency visibility */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
              <img src={resultImage} alt="Result" className="relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl" />
            </div>
            <div className="flex justify-between items-center">
              <button 
                onClick={() => { setFile(null); setResultImage(null); }}
                className="bento-btn px-6 py-3 font-medium text-[var(--color-bento-muted)] hover:text-white"
              >
                <i className="fas fa-undo mr-2"></i> Upload another
              </button>
              <a 
                href={resultImage} 
                download="result.png"
                className="bento-btn-accent px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center"
              >
                <i className="fas fa-download mr-2"></i> Download Result
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
