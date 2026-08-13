"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { Layers, Zap, Wand2, Settings2, Upload, X, Grid } from "lucide-react";
import api from "../../../../src/utils/api";

export default function ReferenceToVideoPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("grok"); // grok or veo
  const [resolution, setResolution] = useState("1080p"); 
  const [aspectRatio, setAspectRatio] = useState("16:9");
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    if (newModel === 'veo' && resolution === '480p') setResolution('1080p');
    if (newModel === 'grok' && resolution === '4k') setResolution('1080p');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const remainingSlots = 3 - imageFiles.length;
      const filesToAdd = files.slice(0, remainingSlots);
      
      setImageFiles(prev => [...prev, ...filesToAdd]);
      
      const newPreviews = filesToAdd.map(f => URL.createObjectURL(f));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (imageFiles.length === 0) {
      setError(isRtl ? "يرجى رفع صورة مرجعية واحدة على الأقل" : "Please upload at least one reference image");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
      if (prompt) formData.append("prompt", prompt);
      formData.append("model", model);
      formData.append("resolution", resolution);
      formData.append("aspectRatio", aspectRatio);
      
      await api.post("/api/video/start-tool/reference-to-video", formData);
      alert(isRtl ? "تمت إضافة الفيديو إلى الطابور!" : "Video added to queue!");
      setPrompt("");
      setImageFiles([]);
      setImagePreviews([]);
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
          <Layers className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isRtl ? "الصور المرجعية إلى فيديو" : "Reference to Video"}
            </h1>
            <p className="text-white/60 text-sm">
              {isRtl ? "ارفع حتى 3 صور لتوجيه المشهد (البداية، النهاية، الشخصية)." : "Upload up to 3 images to guide the scene (Start, End, Character)."}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              {isRtl ? "الصور المرجعية (حتى 3 صور)" : "Reference Images (Up to 3)"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-full h-32 rounded-xl group border border-white/10">
                  <img src={preview} className="w-full h-full object-cover rounded-xl" alt={`Reference ${index + 1}`} />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur text-white text-[10px] rounded-md font-bold">
                    {index === 0 ? "Frame 1" : index === 1 ? "Frame 2" : "Frame 3"}
                  </div>
                  <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {imageFiles.length < 3 && (
                <div 
                  className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all border-white/10 hover:border-emerald-500/50 bg-white/5`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-white/40 mb-2" />
                  <span className="text-xs text-white/50">{isRtl ? "إضافة صورة" : "Add Image"}</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" multiple className="hidden" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              {isRtl ? "النص (Prompt) - اختياري" : "Prompt - Optional"}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#080012] border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none h-24"
              placeholder={isRtl ? "صف ما يحدث بين هذه الصور..." : "Describe what happens between these images..."}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-emerald-400" />
                {isRtl ? "الموديل (Model)" : "Model"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleModelChange('grok')}
                  className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${model === 'grok' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                >
                  <span className="font-bold text-sm">Grok</span>
                </button>
                <button
                  onClick={() => handleModelChange('veo')}
                  className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${model === 'veo' ? 'bg-teal-500/20 border-teal-500/50 text-teal-100' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                >
                  <span className="font-bold text-sm">Veo</span>
                </button>
              </div>
            </div>

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

          <div className="space-y-4 pt-4 border-t border-white/5">
              <label className="block text-sm font-medium text-white/80 flex items-center gap-2">
                <Grid className="w-4 h-4 text-cyan-400" />
                {isRtl ? "أبعاد الفيديو (Aspect Ratio)" : "Aspect Ratio"}
              </label>
              <div className="flex gap-2">
                {['16:9', '9:16', '1:1', '4:3'].map(ratio => (
                  <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${aspectRatio === ratio ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'}`}>
                    {ratio}
                  </button>
                ))}
              </div>
          </div>

          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || imageFiles.length === 0}
              className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isLoading || imageFiles.length === 0 ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90 shadow-lg shadow-emerald-900/50'}`}
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
