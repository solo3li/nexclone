"use client";

import { useState } from "react";

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/ai/remove-bg", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to process image");
      }

      // If data contains the processed image URL, we use it. For now, we mock the result string if it only returned a filename.
      setResultImage("https://via.placeholder.com/600x400?text=Background+Removed+Successfully!");
      alert("Image processed by backend! Data: " + JSON.stringify(data));
      
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Background Remover</h1>
        <p className="text-slate-400">Upload an image to remove its background instantly.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        {!resultImage ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-indigo-500/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 text-3xl">
              🖼️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload your image</h3>
            <p className="text-slate-400 mb-6 max-w-sm">Drag and drop your image here, or click to browse. Max size 10MB.</p>
            
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="file-upload"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium cursor-pointer transition-colors shadow-lg shadow-indigo-500/25"
            >
              {file ? file.name : "Select Image"}
            </label>

            {file && (
              <button 
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 px-8 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold disabled:opacity-50 transition-all"
              >
                {loading ? "Processing..." : "Remove Background"}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/50 aspect-video flex items-center justify-center">
              <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex justify-between items-center">
              <button 
                onClick={() => { setFile(null); setResultImage(null); }}
                className="text-slate-400 hover:text-white font-medium transition-colors"
              >
                Upload another
              </button>
              <a 
                href={resultImage} 
                download="result.png"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-500/25"
              >
                Download Result
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
