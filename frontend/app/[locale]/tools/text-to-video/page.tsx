"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Film, Zap, Wand2, Settings2 } from "lucide-react";
import api from "../../../../src/utils/api";
import { useAppStore } from "../../../../src/store/useAppStore";

export default function TextToVideoPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("grok"); // grok or veo
  const [resolution, setResolution] = useState("1080p"); // 480p, 720p, 1080p, 4k
  const [duration, setDuration] = useState(6); // 6 to 30 for grok
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    if (newModel === 'veo' && resolution === '480p') {
      setResolution('1080p');
    }
    if (newModel === 'grok' && resolution === '4k') {
      setResolution('1080p');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(isRtl ? "يرجى كتابة نص" : "Please enter a prompt");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("model", model);
      formData.append("resolution", resolution);
      if (model === "grok") {
        formData.append("duration", duration.toString());
      }
      
      const res = await api.post("/api/video/start-tool/text-to-video", formData);
      // Assuming success returns taskId and we might navigate or show success message
      // and let the signalR hub handle completion.
      alert(isRtl ? "تمت إضافة الفيديو إلى الطابور!" : "Video added to queue!");
      setPrompt("");
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
          <Film className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isRtl ? "تحويل النص إلى فيديو" : "Text to Video"}
            </h1>
            <p className="text-white/60 text-sm">
              {isRtl 
                ? "اكتب مشهداً وسيقوم الذكاء الاصطناعي بتحويله إلى فيديو سينمائي." 
                : "Describe a scene and let AI turn it into a cinematic video."}
            </p>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              {isRtl ? "النص (Prompt)" : "Prompt"}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#080012] border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 resize-none h-32"
              placeholder={isRtl ? "قطة ترتدي نظارة شمسية في الفضاء..." : "A cat wearing sunglasses in space..."}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-fuchsia-400" />
                {isRtl ? "الموديل (Model)" : "Model"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleModelChange('grok')}
                  className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${model === 'grok' ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-100' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                >
                  <span className="font-bold text-sm">Grok</span>
                  <span className="text-[10px] opacity-70">{isRtl ? "سريع وديناميكي" : "Fast & Dynamic"}</span>
                </button>
                <button
                  onClick={() => handleModelChange('veo')}
                  className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${model === 'veo' ? 'bg-violet-500/20 border-violet-500/50 text-violet-100' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                >
                  <span className="font-bold text-sm">Veo</span>
                  <span className="text-[10px] opacity-70">{isRtl ? "جودة سينمائية" : "Cinematic Quality"}</span>
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

          {/* Grok Duration Slider */}
          {model === 'grok' && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white/80">
                  {isRtl ? "مدة الفيديو (ثواني)" : "Video Duration (Seconds)"}
                </label>
                <span className="text-fuchsia-400 font-bold bg-fuchsia-500/10 px-2 py-1 rounded-md text-xs">{duration}s</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="30" 
                step="1" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-fuchsia-500"
              />
              <div className="flex justify-between text-[10px] text-white/40">
                <span>6s</span>
                <span>30s</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isLoading ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-90 shadow-lg shadow-fuchsia-900/50'}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isRtl ? "جاري التوليد..." : "Generating..."}
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {isRtl ? "توليد الفيديو" : "Generate Video"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
