"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { Image as ImageIcon, Zap, Wand2, Settings2, Upload, X } from "lucide-react";
import api from "../../../../src/utils/api";

export default function ImageToVideoPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("grok"); // grok or veo
  const [resolution, setResolution] = useState("1080p"); 
  const [duration, setDuration] = useState(6);
  const [mode, setMode] = useState("normal"); // fun, normal, spicy (Grok only)
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    if (newModel === 'veo' && resolution === '480p') setResolution('1080p');
    if (newModel === 'grok' && resolution === '4k') setResolution('1080p');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      setError(isRtl ? "يرجى رفع صورة أولاً" : "Please upload an image");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("images", imageFile);
      if (prompt) formData.append("prompt", prompt);
      formData.append("model", model);
      formData.append("resolution", resolution);
      if (model === "grok") {
        formData.append("duration", duration.toString());
        formData.append("mode", mode);
      }
      
      await api.post("/api/video/start-tool/image-to-video", formData);
      alert(isRtl ? "تمت إضافة الفيديو إلى الطابور!" : "Video added to queue!");
      setPrompt("");
      removeImage();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error generating video");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ImageIcon className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isRtl ? "الصورة إلى فيديو" : "Image to Video"}
            </h1>
            <p className="text-white/60 text-sm">
              {isRtl ? "ارفع صورة وأضف وصفاً لتحويلها إلى فيديو." : "Upload an image and add a prompt to animate it into a video."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Uploader */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80">
                {isRtl ? "الصورة (Image)" : "Image"}
              </label>
              <div 
                className={`relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-transparent' : 'border-white/10 hover:border-blue-500/50 bg-white/5'}`}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full group">
                    <img src={imagePreview} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                    <button onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-white/40 mb-2" />
                    <span className="text-sm text-white/50">{isRtl ? "اضغط لرفع صورة" : "Click to upload image"}</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80">
                {isRtl ? "النص (Prompt) - اختياري" : "Prompt - Optional"}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-[#080012] border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-48"
                placeholder={isRtl ? "صف كيف تريد تحريك الصورة..." : "Describe how you want to animate the image..."}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-blue-400" />
                {isRtl ? "الموديل (Model)" : "Model"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleModelChange('grok')}
                  className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${model === 'grok' ? 'bg-blue-500/20 border-blue-500/50 text-blue-100' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                >
                  <span className="font-bold text-sm">Grok</span>
                </button>
                <button
                  onClick={() => handleModelChange('veo')}
                  className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${model === 'veo' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-100' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                >
                  <span className="font-bold text-sm">Veo</span>
                </button>
              </div>
            </div>

            {/* Resolution Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-400" />
                {isRtl ? "الجودة (Resolution)" : "Resolution"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {model === 'grok' && (
                  <button onClick={() => setResolution('480p')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${resolution === '480p' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'}`}>480p</button>
                )}
                <button onClick={() => setResolution('720p')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${resolution === '720p' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'}`}>720p</button>
                <button onClick={() => setResolution('1080p')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${resolution === '1080p' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'}`}>1080p</button>
                {model === 'veo' && (
                  <button onClick={() => setResolution('4k')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${resolution === '4k' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'}`}>4K</button>
                )}
              </div>
            </div>
          </div>

          {model === 'grok' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              {/* Duration Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white/80">
                    {isRtl ? "مدة الفيديو (ثواني)" : "Video Duration"}
                  </label>
                  <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded-md text-xs">{duration}s</span>
                </div>
                <input type="range" min="6" max="30" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              
              {/* Mode Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/80">
                  {isRtl ? "وضع التحريك (Mode)" : "Animation Mode"}
                </label>
                <div className="flex gap-2">
                  {['fun', 'normal', 'spicy'].map(m => (
                    <button key={m} onClick={() => setMode(m)} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all ${mode === m ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !imageFile}
              className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isLoading || !imageFile ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-blue-900/50'}`}
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isRtl ? "جاري التوليد..." : "Generating..."}</>
              ) : (
                <><Zap className="w-4 h-4" />{isRtl ? "توليد الفيديو" : "Generate Video"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
