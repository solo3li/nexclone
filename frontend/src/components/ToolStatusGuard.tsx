"use client";

import { useEffect, useState } from "react";
import { usePathname } from "../i18n/routing";
import { useLocale } from "next-intl";
import { Loader2, Settings, Clock, Sparkles } from "lucide-react";
import api from "../utils/api";

type ToolConfig = {
  isActive: boolean;
  isMaintenanceMode: boolean;
  isComingSoon: boolean;
};

export default function ToolStatusGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [config, setConfig] = useState<ToolConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract the tool name from the pathname. e.g. /tools/image-to-video -> image-to-video
    const segments = pathname.split('/').filter(Boolean);
    const toolNameIndex = segments.indexOf('tools') + 1;
    const currentTool = toolNameIndex < segments.length ? segments[toolNameIndex] : null;

    if (!currentTool) {
      setIsLoading(false);
      return;
    }

    const fetchConfig = async () => {
      try {
        const res = await api.get('/api/platform/tools-config');
        const allConfigs = res.data;
        
        // Map frontend route names to database tool names
        const routeMapping: Record<string, string[]> = {
          "image-to-video": ["kling_avatar_image2video"],
          "advanced-lip-sync": ["kling_advanced_lip_sync", "vidu_advanced_lip_sync"],
          "text-to-voice": ["text-to-voice"],
          "voice-to-text": ["voice-to-text"],
          "motion-control": ["motion-control"]
        };

        let mappedKeys = routeMapping[currentTool];
        
        // Fallback fuzzy match if not in map
        if (!mappedKeys) {
          const fuzzyKey = Object.keys(allConfigs).find(k => k.includes(currentTool.replace(/-/g, '_')));
          if (fuzzyKey) mappedKeys = [fuzzyKey];
        }

        if (mappedKeys && mappedKeys.length > 0) {
          const relevantConfigs = mappedKeys.map(k => allConfigs[k]).filter(Boolean);
          
          if (relevantConfigs.length > 0) {
            // Priority: Maintenance > Coming Soon > Active
            const maintenanceConfig = relevantConfigs.find(c => c.isMaintenanceMode);
            const comingSoonConfig = relevantConfigs.find(c => c.isComingSoon);
            
            if (maintenanceConfig) {
              setConfig(maintenanceConfig);
            } else if (comingSoonConfig) {
              setConfig(comingSoonConfig);
            } else {
              setConfig(relevantConfigs[0]);
            }
          }
        } else if (allConfigs[currentTool]) {
          setConfig(allConfigs[currentTool]);
        }
      } catch (err) {
        console.error("Failed to fetch tool config:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex items-center justify-center w-full">
        <Loader2 className="w-10 h-10 animate-spin text-fuchsia-500" />
      </div>
    );
  }

  if (config?.isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex items-center justify-center p-6 relative overflow-hidden w-full" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-[#0d001a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center relative z-10 shadow-2xl shadow-fuchsia-900/20">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center rounded-2xl mb-6 border border-orange-500/30">
            <Settings className="w-10 h-10 text-orange-400 animate-[spin_4s_linear_infinite]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
            {isRtl ? "تحديث النظام" : "System Update"}
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-8">
            {isRtl 
              ? "نحن نقوم حالياً بتحديث هذه الأداة لتقديم تجربة أفضل لك. ستعود للعمل خلال وقت قصير جداً!" 
              : "We are currently updating this tool to bring you a better experience. It will be back online shortly!"}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/70">
            <Clock className="w-4 h-4 text-orange-400" />
            {isRtl ? "نعتذر عن هذا الإزعاج المؤقت" : "Sorry for the temporary inconvenience"}
          </div>
        </div>
      </div>
    );
  }

  if (config?.isComingSoon) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex items-center justify-center p-6 relative overflow-hidden w-full" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Decorative elements */}
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-[#0d001a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center relative z-10 shadow-2xl shadow-cyan-900/20">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center rounded-2xl mb-6 border border-cyan-500/30 relative">
            <Sparkles className="w-10 h-10 text-cyan-400 absolute animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {isRtl ? "قريباً جداً!" : "Coming Soon!"}
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-8">
            {isRtl 
              ? "نحن نضع اللمسات الأخيرة على هذه الأداة. استعد لتجربة إبداعية جديدة قريباً جداً!" 
              : "We are putting the final touches on this tool. Get ready for a new creative experience very soon!"}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-sm font-medium text-cyan-300">
            <Sparkles className="w-4 h-4" />
            {isRtl ? "ترقبوا الإطلاق الرسمي" : "Stay tuned for the launch"}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
