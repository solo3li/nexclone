"use client";

import { useState } from "react";
import { useAiStore } from "../../../../store/useAiStore";

export default function ImageToText() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const { extractText } = useAiStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      const text = await extractText(file);
      setResultText(text);
    } catch (err: any) {
      alert("Error extracting text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Image to Text (OCR)</h1>
        <p className="text-slate-400">Extract text, tables, and data from images and scanned documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Side */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-colors h-full min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 text-3xl">
              📄
            </div>
            
            <input 
              type="file" 
              id="image-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            
            {file ? (
              <div className="w-full">
                <p className="text-white font-medium mb-4 truncate">{file.name}</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    {loading ? "Extracting..." : "Extract Text"}
                  </button>
                  <label 
                    htmlFor="image-upload"
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium cursor-pointer transition-colors"
                  >
                    Change Image
                  </label>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Upload Image</h3>
                <p className="text-slate-400 mb-6 text-sm">Upload a receipt, document, or any image containing text.</p>
                <label 
                  htmlFor="image-upload"
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium cursor-pointer transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Browse Files
                </label>
              </>
            )}
          </div>
        </div>

        {/* Result Side */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
            Extracted Text
            {resultText && (
              <button 
                onClick={() => navigator.clipboard.writeText(resultText)}
                className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                Copy
              </button>
            )}
          </h3>
          
          <div className={`flex-1 rounded-2xl border border-white/10 bg-black/50 p-4 ${!resultText ? 'flex items-center justify-center' : ''}`}>
            {resultText ? (
              <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm">
                {resultText}
              </pre>
            ) : (
              <p className="text-slate-500 text-center">Your extracted text will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
