"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Image as ImageIcon, Zap, Settings2, Grid } from "lucide-react";
import api from "../../../../src/utils/api";

export default function TextToImagePage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      formData.append("model", "grok");
      formData.append("aspectRatio", aspectRatio);
      
      await api.post("/api/image/start-tool/text-to-image", formData);
      alert(isRtl ? "تمت إضافة الصورة إلى الطابور!" : "Image added to queue!");
      setPrompt("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error generating image");
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
              {isRtl ? "تحويل النص إلى صورة" : "Text to Image"}
            </h1>
            <p className="text-white/60 text-sm">
              {isRtl 
                ? "اكتب وصفاً ليقوم الذكاء الاصطناعي بتوليد صورة إبداعية عالية الدقة." 
                : "Describe an image and let AI generate a high-quality creative masterpiece."}
            </p>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              {isRtl ? "النص (Prompt)" : "Prompt"}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#080012] border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none h-32"
              placeholder={isRtl ? "مدينة مستقبلية ذات إضاءة نيون تحت المطر..." : "A futuristic cyberpunk city in the rain..."}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-orange-400" />
                {isRtl ? "الموديل (Model)" : "Model"}
              </label>
              <div className="px-4 py-3 rounded-xl border bg-orange-500/20 border-orange-500/50 text-orange-100 flex flex-col items-center justify-center gap-1 cursor-default">
                <span className="font-bold text-sm">Grok Imagine</span>
                <span className="text-[10px] opacity-70">{isRtl ? "دقة فائقة" : "High Quality"}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80 flex items-center gap-2">
                <Grid className="w-4 h-4 text-amber-400" />
                {isRtl ? "أبعاد الصورة (Aspect Ratio)" : "Aspect Ratio"}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['16:9', '9:16', '1:1', '4:3'].map(ratio => (
                  <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${aspectRatio === ratio ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'}`}>
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isLoading ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:opacity-90 shadow-lg shadow-orange-900/50'}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isRtl ? "جاري التوليد..." : "Generating..."}
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {isRtl ? "توليد الصورة" : "Generate Image"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
