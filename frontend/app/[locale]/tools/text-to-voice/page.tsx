"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "../../../../src/components/Navbar";
import Footer from "../../../../src/components/Footer";
import { 
  Play, Download, Loader2, Volume2, Wand2, Mic, 
  RefreshCw, Clock, Lock, ChevronDown, User, Users, Info, Edit3, Globe, Zap
} from "lucide-react";
import api from "../../../../src/utils/api";
import { useAppStore } from "../../../../src/store/useAppStore";
import { useRouter, Link } from "../../../../src/i18n/routing";
import { ArrowLeft, ArrowRight, Wallet } from "lucide-react";

interface VoiceProfile {
  id: number;
  name: string;
  voiceName: string;
  accent: string;
  gender: string;
  isPremium: boolean;
  demoAudio: string;
}

interface OptionProfile {
  id: number;
  name: string;
  value: string;
  isPremium: boolean;
}

export default function TextToVoicePage() {
  const t = useTranslations("TextToVoice");
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user, isAuthenticated, hasPhoneNumber, setUser } = useAppStore();
  const router = useRouter();
  const ArrowIcon = locale === 'ar' ? ArrowRight : ArrowLeft;

  const [text, setText] = useState("");
  const [languageMode, setLanguageMode] = useState("arabic"); // "arabic" | "other"
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [voiceFilter, setVoiceFilter] = useState("all"); // "all" | "male" | "female"
  const [selectedQuality, setSelectedQuality] = useState<string>("Standard");
  
  const [dialects, setDialects] = useState<OptionProfile[]>([]);
  const [emotions, setEmotions] = useState<OptionProfile[]>([]);
  const [styles, setStyles] = useState<OptionProfile[]>([]);

  const [selectedDialect, setSelectedDialect] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedOtherLanguage, setSelectedOtherLanguage] = useState<string>("English");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingCost, setPendingCost] = useState<number | null>(null);
  const [customInstructionsEnabled, setCustomInstructionsEnabled] = useState(false);
  const [customInstruction, setCustomInstruction] = useState("");
  const [allowedVoices, setAllowedVoices] = useState<string[] | null>(null);

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const currentlyPlayingRef = useRef<HTMLAudioElement | null>(null);
  
  const [maxChars, setMaxChars] = useState(150);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await api.get("/api/platform/voices");
        setVoices(response.data);
        if (response.data.length > 0) {
          setSelectedVoice(response.data[0].voiceName);
        }
      } catch (error) {
        console.error("Failed to load voices:", error);
      }
    };

    const fetchOptions = async () => {
      try {
        const [dialectsRes, emotionsRes, stylesRes, configRes] = await Promise.all([
          api.get("/api/platform/dialects"),
          api.get("/api/platform/emotions"),
          api.get("/api/platform/styles"),
          api.get("/api/platform/tts-config").catch(() => ({ data: { maxChars: 150, customInstructionsEnabled: false } }))
        ]);
        setDialects(dialectsRes.data);
        setEmotions(emotionsRes.data);
        setStyles(stylesRes.data);
        setMaxChars(configRes.data.maxChars || 150);
        setCustomInstructionsEnabled(configRes.data.customInstructionsEnabled || false);
        setIsMaintenanceMode(configRes.data.isMaintenanceMode || false);
        setAllowedVoices(configRes.data.allowedVoices || null);
      } catch (error) {
        console.error("Failed to load options:", error);
      }
    };

    fetchVoices();
    fetchOptions();
  }, []);

  useEffect(() => {
    setEstimatedCost(null);
  }, [text]);

  useEffect(() => {
    if (isAuthenticated && !hasPhoneNumber) {
      router.replace('/complete-profile');
    }
  }, [isAuthenticated, hasPhoneNumber, router]);

  const handleProcessClick = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!text.trim() || text.length > maxChars) return;
    setIsEstimating(true);
    setError("");
    try {
      const response = await api.post("/api/ai/text-to-voice/estimate", { 
        text,
        language: languageMode,
        voiceName: selectedVoice,
        styleInstruction: "",
        quality: selectedQuality
      });
      setPendingCost(response.data.estimatedCost);
      setShowConfirmModal(true);
    } catch (err: any) {
      console.error("Estimation error:", err);
      setError(err.response?.data?.error || t('error'));
    } finally {
      setIsEstimating(false);
    }
  };

  const playDemo = (demoUrl: string) => {
    if (currentlyPlayingRef.current) {
      currentlyPlayingRef.current.pause();
    }
    const audio = new Audio(demoUrl);
    audio.play();
    currentlyPlayingRef.current = audio;
  };

  const confirmGenerate = async () => {
    setShowConfirmModal(false);
    if (!text.trim() || text.length > maxChars) return;
    setIsProcessing(true);
    setError("");
    setAudioUrl(null);

    let instruction = "";
    if (languageMode === 'other') {
      instruction += `Language: ${selectedOtherLanguage}. `;
    } else {
      if (selectedDialect) instruction += `Accent: ${selectedDialect}. `;
    }
    
    if (selectedEmotion) instruction += `Emotion: ${selectedEmotion}. `;
    if (selectedStyle) instruction += `Style: ${selectedStyle}. `;
    if (customInstruction && languageMode !== 'other') instruction += `Additional Context: ${customInstruction}. `;

    try {
      const response = await api.post("/api/ai/text-to-voice/generate", {
        text: text,
        language: languageMode,
        voiceName: selectedVoice,
        styleInstruction: instruction.trim(),
        quality: selectedQuality
      });

      if (response.data && response.data.audioUrl) {
        setAudioUrl(response.data.audioUrl);
        // Refresh user profile to update credits dynamically
        api.get("/api/auth/me").then(res => {
          if (res.data) setUser(res.data);
        }).catch(err => console.error("Failed to update user profile", err));
      } else {
        throw new Error("No audio URL returned");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || t('error'));
    } finally {
      setIsProcessing(false);
      setPendingCost(null);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const element = document.createElement("a");
    element.href = audioUrl;
    element.download = "generated_audio.mp3";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredVoices = voices.filter(v => {
    if (voiceFilter === 'male') return v.gender.toLowerCase() === 'ذكر' || v.gender.toLowerCase() === 'male';
    if (voiceFilter === 'female') return v.gender.toLowerCase() === 'أنثى' || v.gender.toLowerCase() === 'female';
    return true;
  });

  useEffect(() => {
    const isAllowed = (v: string) => allowedVoices === null || allowedVoices.includes(v);
    if (filteredVoices.length > 0) {
      if (!selectedVoice || !isAllowed(selectedVoice) || !filteredVoices.some(v => v.voiceName === selectedVoice)) {
        const allowedInFiltered = filteredVoices.filter(v => isAllowed(v.voiceName));
        if (allowedInFiltered.length > 0) {
          setSelectedVoice(allowedInFiltered[0].voiceName);
        }
      }
    }
  }, [filteredVoices, selectedVoice, allowedVoices]);

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col font-sans">
      {/* Animated Orbs for consistent theme */}
      <div className="absolute top-1/4 left-1/4 w-[60%] h-[500px] bg-violet-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />
      
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0015]/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-4">
          <Link href="/tools" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
            <ArrowIcon className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-white font-bold text-sm lg:text-base hidden sm:block">{t('title')}</h1>
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <Wallet className="w-4 h-4 text-fuchsia-400" />
            <span className="text-white font-bold text-sm">{user?.availableCredits || 0}</span>
            <span className="text-white/50 text-xs ml-1 rtl:mr-1">{isRtl ? 'رصيد' : 'Credits'}</span>
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 pt-20 pb-10 relative z-10 max-w-6xl">
        {isMaintenanceMode ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-20 h-20 bg-violet-600/20 rounded-full flex items-center justify-center mb-6">
              <Wand2 className="w-10 h-10 text-violet-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">هذه الأداة تحت الصيانة مؤقتاً</h1>
            <p className="text-white/60 max-w-md">نحن نقوم بتحديث أداة تحويل النص إلى صوت لتحسين الجودة. يرجى المحاولة لاحقاً. نعتذر عن الإزعاج.</p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative">
          
          {/* Left Column - Text Input Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-4 order-2 lg:order-1"
          >
            <div className="flex-1 bg-[#120822]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-4 flex flex-col relative overflow-hidden group shadow-2xl transition-all duration-500 hover:border-violet-500/30">
              
              {/* Text Area Header */}
              <div className="flex justify-between items-center px-2" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-fuchsia-400" />
                  <span className="text-white/80 font-semibold text-sm">{t('enterText')}</span>
                </div>
                <div className="flex items-center gap-2 bg-violet-500/10 px-3 py-1 rounded-full text-xs font-medium text-violet-300 border border-violet-500/20">
                  <span>{t('maxChars')} {maxChars}</span>
                </div>
              </div>

              {/* Text Area */}
              <div dir={isRtl ? 'rtl' : 'ltr'} className="relative mt-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('textPlaceholder', { maxChars })}
                  className="w-full bg-[#0a0015]/60 border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 transition-all resize-none min-h-[300px] placeholder:text-white/30 text-base leading-relaxed"
                />
                <div className={`absolute bottom-4 ${isRtl ? 'left-6' : 'right-6'} text-xs text-white/40`}>
                  {t('characters')} {maxChars} / {text.length}
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-xl border border-red-500/20 mx-2">{error}</div>}

              {/* Generate Button */}
              <button
                  onClick={handleProcessClick}
                  disabled={isProcessing || isEstimating || !text.trim() || text.length > maxChars}
                  className="w-full mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    {t('process')}
                  </>
                )}
              </button>

              {/* Output Audio Player */}
              {audioUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-[#0a0015]/60 border border-white/5 rounded-xl flex flex-col gap-4"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-violet-400" />
                      {t('result')}
                    </h3>
                    <button onClick={downloadAudio} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-all font-medium">
                      <Download className="w-4 h-4" />
                      {t('download')}
                    </button>
                  </div>
                  <audio controls src={audioUrl} className="w-full mt-2" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Voice Settings Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-4 order-1 lg:order-2"
          >
              <div className="bg-[#120822]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-3 flex-shrink-0">
              <div className="flex items-center gap-2 mb-2 px-1">
                <Mic className="w-4 h-4 text-fuchsia-400" />
                <h2 className="text-base font-bold text-white">{t('voiceSettings')}</h2>
              </div>
              
              <div className="space-y-2">
                
                {/* Language Mode */}
                <div className="bg-[#0a0015]/60 border border-white/5 rounded-xl p-2">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="w-5 h-5 bg-violet-600/20 rounded flex items-center justify-center">
                      <span className="text-violet-400 text-[10px] font-bold">Aa</span>
                    </div>
                    <span className="text-white/80 text-xs font-semibold">{t('languageMode')}</span>
                  </div>
                  
                  <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
                    <button 
                      onClick={() => setLanguageMode('arabic')}
                      className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        languageMode === 'arabic' 
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' 
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">🇸🇦</span> {t('arabic')}
                    </button>
                    <button 
                      onClick={() => setLanguageMode('other')}
                      className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        languageMode === 'other' 
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' 
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <Globe className="w-3 h-3" /> {t('otherLangs')}
                    </button>
                  </div>
                </div>

                {/* Quality Mode */}
                <div className="bg-[#0a0015]/60 border border-white/5 rounded-xl p-2">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="w-5 h-5 bg-violet-600/20 rounded flex items-center justify-center">
                      <Zap className="w-3 h-3 text-violet-400" />
                    </div>
                    <span className="text-white/80 text-xs font-semibold">{isRtl ? 'جودة الصوت' : 'Audio Quality'}</span>
                  </div>
                  
                  <div className="flex bg-white/5 p-1 rounded-full border border-white/5 gap-1">
                    {['Standard', 'High'].map((q) => (
                      <button
                        key={q}
                        onClick={() => setSelectedQuality(q)}
                        className={`flex-1 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                          selectedQuality === q
                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {isRtl ? (q === 'Standard' ? 'عادية' : 'عالية') : q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free Account Notice - Only in Arabic Mode and if on Free/No plan */}
                {languageMode === 'arabic' && (!user?.activePlan || user.activePlan.name?.toLowerCase() === 'free') && (
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-2 flex flex-col gap-1">
                  <div className="flex gap-2 items-start">
                    <Info className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-violet-200/80 leading-snug font-medium">{t('freeAccountNotice', { maxChars })}</p>
                      <button className="text-fuchsia-400 text-[9px] font-bold mt-0.5 flex items-center gap-1 hover:text-fuchsia-300 transition-colors">
                        {t('upgradeNow')} {isRtl ? '←' : '→'}
                      </button>
                    </div>
                  </div>
                </div>
                )}

                {/* Choose Voice - For all modes */}
                <div className="bg-[#0a0015]/60 border border-white/5 rounded-xl p-2 flex flex-col">
                  <div className="flex items-center justify-between mb-2 px-1 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-violet-400" />
                      <span className="text-white/80 text-xs font-semibold">{t('chooseVoice')}</span>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex gap-1.5 mb-2 px-1">
                    <button 
                      onClick={() => setVoiceFilter('all')}
                      className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                        voiceFilter === 'all' ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {t('all')}
                    </button>
                    <button 
                      onClick={() => setVoiceFilter('male')}
                      className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                        voiceFilter === 'male' ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {t('male')}
                    </button>
                    <button 
                      onClick={() => setVoiceFilter('female')}
                      className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                        voiceFilter === 'female' ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {t('female')}
                    </button>
                  </div>

                  {/* Voices Grid */}
                  <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                    {voices.length === 0 ? (
                      <div className="col-span-2 text-center text-white/40 py-8">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      </div>
                    ) : (
                      filteredVoices.map(voice => {
                        const isAllowed = allowedVoices === null || allowedVoices.includes(voice.voiceName);
                        return (
                        <div 
                          key={voice.voiceName}
                          onClick={() => {
                            if (isAllowed) setSelectedVoice(voice.voiceName);
                          }}
                          className={`relative flex items-center p-1.5 rounded-lg border transition-all ${
                            !isAllowed 
                              ? 'border-white/5 bg-white/5 opacity-60 cursor-not-allowed'
                              : selectedVoice === voice.voiceName 
                                ? 'border-violet-500 bg-violet-500/20 cursor-pointer' 
                                : 'border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer'
                          }`}
                          dir={isRtl ? 'rtl' : 'ltr'}
                        >
                          {!isAllowed && (
                            <div className="absolute inset-0 bg-[#0a0015]/80 z-10 flex items-center justify-center backdrop-blur-[1px] rounded-lg">
                              <Lock className="w-3.5 h-3.5 text-white/50" />
                            </div>
                          )}
                          
                          {/* Play Button */}
                          {voice.demoAudio ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); playDemo(voice.demoAudio); }}
                              className={`shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center ${isRtl ? 'ml-2' : 'mr-2'} transition-colors z-20`}
                            >
                              <Play className="w-2.5 h-2.5 text-white/80" />
                            </button>
                          ) : (
                            <div className={`shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center ${isRtl ? 'ml-2' : 'mr-2'}`}>
                              <User className="w-2.5 h-2.5 text-white/30" />
                            </div>
                          )}
                          
                          {/* Info */}
                          <div className="flex flex-col flex-1 min-w-0 justify-center">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] font-bold text-white truncate">{voice.name}</span>
                              <span className={`text-[7px] px-1 py-0.5 rounded-sm font-bold ml-1 shrink-0 ${
                                voice.isPremium ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {voice.isPremium ? t('premium') : t('free')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[8px] text-white/50 truncate">
                              <span className="truncate">{voice.accent}</span>
                              <span>•</span>
                              <span>{voice.gender}</span>
                            </div>
                          </div>
                          
                        </div>
                      )})
                    )}
                  </div>
                </div>

                {/* Target Language Selection - Only in Other Languages Mode */}
                {languageMode === 'other' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-white/60 px-2">{isRtl ? 'اللغة المطلوبة' : 'Target Language'}</label>
                    <div className="relative bg-[#0a0015]/60 border border-white/5 rounded-[16px] text-xs text-white/80 hover:border-white/10 transition-colors">
                      <select 
                        value={selectedOtherLanguage}
                        onChange={(e) => setSelectedOtherLanguage(e.target.value)}
                        className="w-full bg-transparent outline-none appearance-none cursor-pointer px-4 py-3 relative z-10"
                      >
                        <option value="English" className="bg-[#0a0015] text-white">English (الإنجليزية)</option>
                        <option value="French" className="bg-[#0a0015] text-white">French (الفرنسية)</option>
                        <option value="Spanish" className="bg-[#0a0015] text-white">Spanish (الإسبانية)</option>
                        <option value="German" className="bg-[#0a0015] text-white">German (الألمانية)</option>
                        <option value="Italian" className="bg-[#0a0015] text-white">Italian (الإيطالية)</option>
                        <option value="Turkish" className="bg-[#0a0015] text-white">Turkish (التركية)</option>
                        <option value="Russian" className="bg-[#0a0015] text-white">Russian (الروسية)</option>
                        <option value="Portuguese" className="bg-[#0a0015] text-white">Portuguese (البرتغالية)</option>
                        <option value="Japanese" className="bg-[#0a0015] text-white">Japanese (اليابانية)</option>
                        <option value="Korean" className="bg-[#0a0015] text-white">Korean (الكورية)</option>
                        <option value="Chinese" className="bg-[#0a0015] text-white">Chinese (الصينية)</option>
                        <option value="Hindi" className="bg-[#0a0015] text-white">Hindi (الهندية)</option>
                        <option value="Dutch" className="bg-[#0a0015] text-white">Dutch (الهولندية)</option>
                        <option value="Polish" className="bg-[#0a0015] text-white">Polish (البولندية)</option>
                        <option value="Swedish" className="bg-[#0a0015] text-white">Swedish (السويدية)</option>
                        <option value="Indonesian" className="bg-[#0a0015] text-white">Indonesian (الإندونيسية)</option>
                        <option value="Vietnamese" className="bg-[#0a0015] text-white">Vietnamese (الفيتنامية)</option>
                        <option value="Thai" className="bg-[#0a0015] text-white">Thai (التايلاندية)</option>
                        <option value="Greek" className="bg-[#0a0015] text-white">Greek (اليونانية)</option>
                        <option value="Hebrew" className="bg-[#0a0015] text-white">Hebrew (العبرية)</option>
                        <option value="Finnish" className="bg-[#0a0015] text-white">Finnish (الفنلندية)</option>
                        <option value="Danish" className="bg-[#0a0015] text-white">Danish (الدنماركية)</option>
                        <option value="Norwegian" className="bg-[#0a0015] text-white">Norwegian (النرويجية)</option>
                        <option value="Czech" className="bg-[#0a0015] text-white">Czech (التشيكية)</option>
                        <option value="Hungarian" className="bg-[#0a0015] text-white">Hungarian (المجرية)</option>
                        <option value="Romanian" className="bg-[#0a0015] text-white">Romanian (الرومانية)</option>
                        <option value="Ukrainian" className="bg-[#0a0015] text-white">Ukrainian (الأوكرانية)</option>
                        <option value="Bengali" className="bg-[#0a0015] text-white">Bengali (البنغالية)</option>
                        <option value="Urdu" className="bg-[#0a0015] text-white">Urdu (الأردية)</option>
                        <option value="Persian" className="bg-[#0a0015] text-white">Persian (الفارسية)</option>
                        <option value="Malay" className="bg-[#0a0015] text-white">Malay (الماليزية)</option>
                      </select>
                      <ChevronDown className={`w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} pointer-events-none text-white/50 z-0`} />
                    </div>
                  </div>
                )}

                {/* UI Placeholders for Advanced Settings */}
                <div className="grid grid-cols-2 gap-2">
                  
                  {languageMode === 'arabic' && (
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] font-semibold text-white/60 px-1">{t('accent')}</label>
                    <div className="relative bg-[#0a0015]/60 border border-white/5 rounded-lg text-[10px] text-white/80 hover:border-white/10 transition-colors">
                      <select 
                        value={selectedDialect}
                        onChange={(e) => setSelectedDialect(e.target.value)}
                        className="w-full bg-transparent outline-none appearance-none cursor-pointer px-2 py-1.5 relative z-10"
                      >
                        <option value="" className="bg-[#0a0015] text-white/50">-- {t('accent')} --</option>
                        {dialects.map(d => (
                          <option key={d.id} value={d.value} className="bg-[#0a0015] text-white">
                            {d.name} {d.isPremium ? '⭐' : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`w-3 h-3 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-2' : 'right-2'} pointer-events-none text-white/50 z-0`} />
                    </div>
                  </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-white/60 px-2">{t('emotion')}</label>
                    <div className="relative bg-[#0a0015]/60 border border-white/5 rounded-[16px] text-xs text-white/80 hover:border-white/10 transition-colors">
                      <select 
                        value={selectedEmotion}
                        onChange={(e) => setSelectedEmotion(e.target.value)}
                        className="w-full bg-transparent outline-none appearance-none cursor-pointer px-4 py-3 relative z-10"
                      >
                        <option value="" className="bg-[#0a0015] text-white/50">-- {t('emotion')} --</option>
                        {emotions.map(e => (
                          <option key={e.id} value={e.value} className="bg-[#0a0015] text-white">
                            {e.name} {e.isPremium ? '⭐' : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} pointer-events-none text-white/50 z-0`} />
                    </div>
                  </div>


                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-white/60 px-2">{t('performanceStyle')}</label>
                    <div className="relative bg-[#0a0015]/60 border border-white/5 rounded-[16px] text-xs text-white/80 hover:border-white/10 transition-colors">
                      <select 
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="w-full bg-transparent outline-none appearance-none cursor-pointer px-4 py-3 relative z-10"
                      >
                        <option value="" className="bg-[#0a0015] text-white/50">-- {t('performanceStyle')} --</option>
                        {styles.map(s => (
                          <option key={s.id} value={s.value} className="bg-[#0a0015] text-white">
                            {s.name} {s.isPremium ? '⭐' : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`w-3 h-3 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-2' : 'right-2'} pointer-events-none text-white/50 z-0`} />
                    </div>
                  </div>

                  {languageMode === 'arabic' && (
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] font-semibold text-white/60 px-1 flex items-center gap-1">
                      <Wand2 className="w-2.5 h-2.5 text-fuchsia-400" />
                      {t('customInstructions')}
                    </label>
                    {customInstructionsEnabled ? (
                      <textarea
                        value={customInstruction}
                        onChange={(e) => setCustomInstruction(e.target.value)}
                        placeholder={t('customInstructionsPlaceholder') || "Enter custom voice directions..."}
                        className="w-full bg-[#0a0015]/60 border border-white/5 rounded-[16px] px-4 py-3 text-white text-xs focus:outline-none focus:border-fuchsia-500/50 transition-colors resize-none h-20 placeholder:text-white/30"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center bg-[#0a0015]/60 border border-fuchsia-500/20 rounded-[16px] px-4 py-4 text-sm text-fuchsia-400/80 cursor-not-allowed hover:bg-fuchsia-500/5 transition-colors">
                        <Lock className="w-4 h-4 mb-1.5 opacity-60" />
                        <span className="text-[9px] uppercase font-bold tracking-widest">{t('premium')}</span>
                      </div>
                    )}
                  </div>
                  )}
                </div>

              </div>
            </div>
          </motion.div>

        </div>
        </>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f0024] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{isRtl ? "تأكيد العملية" : "Confirm Action"}</h3>
                <p className="text-white/50 text-sm">{isRtl ? "سيتم خصم رصيد من حسابك" : "Credits will be deducted"}</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 mb-6 flex justify-between items-center">
              <span className="text-white/70 font-medium">{isRtl ? "التكلفة المتوقعة:" : "Estimated Cost:"}</span>
              <span className="text-fuchsia-400 font-bold text-xl">{pendingCost} {isRtl ? "كريدت" : "Credits"}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={confirmGenerate}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                {isRtl ? "تأكيد" : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      

    </div>
  );
}
