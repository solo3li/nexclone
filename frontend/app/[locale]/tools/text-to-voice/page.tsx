"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "../../../../src/components/Navbar";
import Footer from "../../../../src/components/Footer";
import { 
  Play, Download, Loader2, Volume2, Wand2, Mic, 
  RefreshCw, Clock, Lock, ChevronDown, User, Users, Info, Edit3, Globe
} from "lucide-react";
import api from "../../../../src/utils/api";

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

  const [text, setText] = useState("");
  const [languageMode, setLanguageMode] = useState("arabic"); // "arabic" | "other"
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [voiceFilter, setVoiceFilter] = useState("all"); // "all" | "male" | "female"
  
  const [dialects, setDialects] = useState<OptionProfile[]>([]);
  const [emotions, setEmotions] = useState<OptionProfile[]>([]);
  const [styles, setStyles] = useState<OptionProfile[]>([]);

  const [selectedDialect, setSelectedDialect] = useState<string>("");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const currentlyPlayingRef = useRef<HTMLAudioElement | null>(null);
  
  const MAX_CHARS = 150; // Dynamic based on user plan in the future

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
        const [dialectsRes, emotionsRes, stylesRes] = await Promise.all([
          api.get("/api/platform/dialects"),
          api.get("/api/platform/emotions"),
          api.get("/api/platform/styles"),
        ]);
        setDialects(dialectsRes.data);
        setEmotions(emotionsRes.data);
        setStyles(stylesRes.data);
      } catch (error) {
        console.error("Failed to load options:", error);
      }
    };

    fetchVoices();
    fetchOptions();
  }, []);

  const playDemo = (demoUrl: string) => {
    if (currentlyPlayingRef.current) {
      currentlyPlayingRef.current.pause();
    }
    const audio = new Audio(demoUrl);
    audio.play();
    currentlyPlayingRef.current = audio;
  };

  const generateAudio = async () => {
    if (!text.trim() || text.length > MAX_CHARS) return;
    setIsProcessing(true);
    setError("");
    setAudioUrl(null);

    let instruction = "";
    if (selectedDialect) instruction += `Accent: ${selectedDialect}. `;
    if (selectedEmotion) instruction += `Emotion: ${selectedEmotion}. `;
    if (selectedStyle) instruction += `Style: ${selectedStyle}. `;

    try {
      const response = await api.post("/api/ai/text-to-voice/generate", {
        text: text,
        language: languageMode,
        voiceName: selectedVoice,
        styleInstruction: instruction.trim()
      });

      if (response.data && response.data.audioUrl) {
        setAudioUrl(response.data.audioUrl);
      } else {
        throw new Error("No audio URL returned");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || t('error'));
    } finally {
      setIsProcessing(false);
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

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col font-sans">
      {/* Animated Orbs for consistent theme */}
      <div className="absolute top-1/4 left-1/4 w-[60%] h-[500px] bg-violet-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />
      
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10 max-w-[1400px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{t('title')}</h1>
          <p className="text-sm text-white/60">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Text Input Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-4"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 flex flex-col gap-4 shadow-xl">
              
              {/* Text Area Header */}
              <div className="flex justify-between items-center px-2" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-fuchsia-400" />
                  <span className="text-white/80 font-semibold text-sm">{t('enterText')}</span>
                </div>
                <div className="flex items-center gap-2 bg-violet-500/10 px-3 py-1 rounded-full text-xs font-medium text-violet-300 border border-violet-500/20">
                  <span>{t('maxChars')} {MAX_CHARS}</span>
                </div>
              </div>

              {/* Text Area */}
              <div dir={isRtl ? 'rtl' : 'ltr'} className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('textPlaceholder')}
                  className="w-full bg-[#0a0015]/60 border border-white/5 rounded-[24px] px-6 py-6 text-white focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 transition-all resize-none min-h-[350px] placeholder:text-white/30 text-base leading-relaxed"
                />
                <div className={`absolute bottom-4 ${isRtl ? 'left-6' : 'right-6'} text-xs text-white/40`}>
                  {t('characters')} {MAX_CHARS} / {text.length}
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-xl border border-red-500/20 mx-2">{error}</div>}

              {/* Generate Button */}
              <button
                onClick={generateAudio}
                disabled={isProcessing || !text.trim() || text.length > MAX_CHARS}
                className="w-full py-4 mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
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
                  className="mt-2 p-6 bg-[#0a0015]/60 border border-white/5 rounded-[24px] flex flex-col gap-4"
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

            {/* Bottom Actions */}
            <div className="flex justify-between items-center mt-2 px-2" dir={isRtl ? 'rtl' : 'ltr'}>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-white/50 hover:text-white/80 transition-colors text-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                {t('refresh')}
              </button>
              
              <div className="flex items-center gap-2 text-white/60 font-medium text-xs">
                <span>{t('recentConversions')}</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-16 opacity-30">
              <Clock className="w-8 h-8 text-white mb-3" />
              <p className="text-white text-xs">{t('noConversions')}</p>
            </div>
          </motion.div>

          {/* Right Column - Voice Settings Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 h-full flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
              
              <div className="flex items-center gap-2 mb-6 px-2">
                <Mic className="w-5 h-5 text-fuchsia-400" />
                <h2 className="text-lg font-bold text-white">{t('voiceSettings')}</h2>
              </div>
              
              <div className="space-y-6">
                
                {/* Language Mode */}
                <div className="bg-[#0a0015]/60 border border-white/5 rounded-[24px] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-violet-600/20 rounded flex items-center justify-center">
                      <span className="text-violet-400 text-xs font-bold">Aa</span>
                    </div>
                    <span className="text-white/80 text-sm font-semibold">{t('languageMode')}</span>
                  </div>
                  
                  <div className="flex bg-white/5 p-1.5 rounded-full border border-white/5">
                    <button 
                      onClick={() => setLanguageMode('arabic')}
                      className={`flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        languageMode === 'arabic' 
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' 
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <span className="text-base">🇸🇦</span> {t('arabic')}
                    </button>
                    <button 
                      onClick={() => setLanguageMode('other')}
                      className={`flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        languageMode === 'other' 
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' 
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" /> {t('otherLangs')}
                    </button>
                  </div>
                </div>

                {/* Free Account Notice */}
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-[20px] p-4 flex flex-col gap-2">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-violet-200/80 leading-relaxed font-medium">{t('freeAccountNotice')}</p>
                      <button className="text-fuchsia-400 text-xs font-bold mt-2 flex items-center gap-1 hover:text-fuchsia-300 transition-colors">
                        {t('upgradeNow')} {isRtl ? '←' : '→'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Choose Voice */}
                <div className="bg-[#0a0015]/60 border border-white/5 rounded-[24px] p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-violet-400" />
                    <span className="text-white/80 text-sm font-semibold">{t('chooseVoice')}</span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setVoiceFilter('all')}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                        voiceFilter === 'all' ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {t('all')}
                    </button>
                    <button 
                      onClick={() => setVoiceFilter('male')}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                        voiceFilter === 'male' ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {t('male')}
                    </button>
                    <button 
                      onClick={() => setVoiceFilter('female')}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                        voiceFilter === 'female' ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {t('female')}
                    </button>
                  </div>

                  {/* Voices Grid */}
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                    {voices.length === 0 ? (
                      <div className="col-span-2 text-center text-white/40 py-8">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      </div>
                    ) : (
                      filteredVoices.map(voice => (
                        <div 
                          key={voice.voiceName}
                          onClick={() => setSelectedVoice(voice.voiceName)}
                          className={`relative cursor-pointer flex flex-col rounded-[16px] overflow-hidden transition-all border ${
                            selectedVoice === voice.voiceName 
                              ? 'border-violet-500 bg-violet-500/20' 
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {/* Top colored bar based on tier */}
                          <div className={`w-full text-center py-1 text-[9px] font-bold ${
                            voice.isPremium 
                              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black' 
                              : 'bg-emerald-500 text-black'
                          }`}>
                            {voice.isPremium ? t('premium') : t('free')}
                          </div>
                          
                          <div className="p-4 flex flex-col items-center text-center gap-1.5">
                            <h4 className="text-white font-bold text-[13px]">{voice.name}</h4>
                            <p className="text-[9px] text-white/50">{voice.accent}</p>
                            <div className="flex items-center gap-1 text-[9px] text-white/40 mt-1">
                              {voice.gender.toLowerCase() === 'ذكر' || voice.gender.toLowerCase() === 'male' ? <User className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />}
                              <span>{voice.gender}</span>
                            </div>
                            
                            {voice.demoAudio && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); playDemo(voice.demoAudio); }}
                                className="absolute bottom-2 left-2 p-1.5 bg-white/10 hover:bg-white/30 rounded-full text-white/60 hover:text-white transition-all"
                              >
                                <Play className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* UI Placeholders for Advanced Settings */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-white/60 px-2">{t('accent')}</label>
                    <div className="relative bg-[#0a0015]/60 border border-white/5 rounded-[16px] text-xs text-white/80 hover:border-white/10 transition-colors">
                      <select 
                        value={selectedDialect}
                        onChange={(e) => setSelectedDialect(e.target.value)}
                        className="w-full bg-transparent outline-none appearance-none cursor-pointer px-4 py-3 relative z-10"
                      >
                        <option value="" className="bg-[#0a0015] text-white/50">-- {t('accent')} --</option>
                        {dialects.map(d => (
                          <option key={d.id} value={d.value} className="bg-[#0a0015] text-white">
                            {d.name} {d.isPremium ? '⭐' : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} pointer-events-none text-white/50 z-0`} />
                    </div>
                  </div>

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
                      <ChevronDown className={`w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} pointer-events-none text-white/50 z-0`} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-white/60 px-2 flex items-center gap-1.5">
                      <Wand2 className="w-3 h-3 text-fuchsia-400" />
                      {t('customInstructions')}
                    </label>
                    <div className="flex flex-col items-center justify-center bg-[#0a0015]/60 border border-fuchsia-500/20 rounded-[16px] px-4 py-4 text-sm text-fuchsia-400/80 cursor-not-allowed hover:bg-fuchsia-500/5 transition-colors">
                      <Lock className="w-4 h-4 mb-1.5 opacity-60" />
                      <span className="text-[9px] uppercase font-bold tracking-widest">{t('premium')}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
