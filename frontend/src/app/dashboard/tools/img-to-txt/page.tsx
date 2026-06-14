"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAiStore } from "../../../../store/useAiStore";
import { useAuthStore } from "../../../../store/useAuthStore";

export default function ImageToText() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const { extractText } = useAiStore();
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
      const text = await extractText(file);
      setResultText(text);
    } catch (err: any) {
      alert("Error extracting text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Image to Text (OCR)</h1>
        <p className="text-[var(--color-bento-muted)] mt-2">Extract text, tables, and data from images and scanned documents.</p>
      </div>

      <div className="bento-grid grid-cols-1 md:grid-cols-2">
        {/* Upload Side */}
        <div className="bento-card p-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#3f3f46] rounded-2xl p-8 text-center transition-colors h-full min-h-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] text-cyan-400 flex items-center justify-center mb-6 text-2xl shadow-inner">
              <i className="fas fa-file-alt"></i>
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
                <p className="text-white font-medium mb-4 truncate text-sm bg-[#0a0a0a] p-3 rounded-lg border border-[#262626]">
                  <i className="fas fa-image text-cyan-400 mr-2"></i> {file.name}
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bento-btn-accent font-bold disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Extracting...</> : <><i className="fas fa-magic mr-2"></i> Extract Text</>}
                  </button>
                  <label 
                    htmlFor="image-upload"
                    className="w-full py-3 rounded-xl bento-btn text-[var(--color-bento-muted)] font-medium cursor-pointer transition-colors text-center"
                  >
                    Change Image
                  </label>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Upload Image</h3>
                <p className="text-[var(--color-bento-muted)] mb-6 text-sm">Upload a receipt, document, or any image containing text.</p>
                <label 
                  htmlFor="image-upload"
                  className="bento-btn-primary px-8 py-3 cursor-pointer"
                >
                  Browse Files
                </label>
              </>
            )}
          </div>
        </div>

        {/* Result Side */}
        <div className="bento-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
            <span><i className="fas fa-align-left text-cyan-400 mr-2"></i> Extracted Text</span>
            {resultText && (
              <button 
                onClick={() => navigator.clipboard.writeText(resultText)}
                className="bento-btn text-xs px-3 py-1.5 rounded-lg text-[var(--color-bento-muted)] hover:text-white transition-colors"
              >
                <i className="far fa-copy mr-1"></i> Copy
              </button>
            )}
          </h3>
          
          <div className={`flex-1 rounded-2xl border border-[#262626] bg-[#0a0a0a] p-4 ${!resultText ? 'flex items-center justify-center' : 'overflow-y-auto'}`}>
            {resultText ? (
              <pre className="whitespace-pre-wrap text-[var(--color-bento-text)] font-mono text-sm leading-relaxed">
                {resultText}
              </pre>
            ) : (
              <p className="text-[var(--color-bento-muted)] text-center text-sm italic">Your extracted text will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
