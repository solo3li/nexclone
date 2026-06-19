"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Navbar from "../../../../src/components/Navbar";
import Footer from "../../../../src/components/Footer";
import { Play, Download, Loader2, Volume2, Sparkles, Wand2, Mic } from "lucide-react";
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

const LANGUAGES = [
  { code: 'arabic', name: 'Arabic - العربية' },
  { code: 'other', name: 'Other Languages' },
];

export default function TextToVoicePage() {
  const t = useTranslations("TextToVoice");

  const [text, setText] = useState("");
  const [language, setLanguage] = useState("arabic");
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [styleInstruction, setStyleInstruction] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const currentlyPlayingRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch voices on mount
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
    fetchVoices();
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
    if (!text.trim()) return;
    setIsProcessing(true);
    setError("");
    setAudioUrl(null);

    try {
      const response = await api.post("/api/ai/text-to-voice/generate", {
        text: text,
        language: language,
        voiceName: selectedVoice,
        styleInstruction: styleInstruction
      }, {
        responseType: 'blob' // Important to receive binary data
      });

      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
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

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col">
      <div className="fixed top-1/4 left-1/4 w-[60%] h-[500px] bg-violet-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />
      
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('title')}</h1>
          <p className="text-lg text-white/60">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls & Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6">
              
              {/* Text Input */}
              <div dir={t('title') === 'تحويل النص إلى صوت' ? 'rtl' : 'ltr'}>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('textPlaceholder')}
                  className="w-full bg-[#0a0015]/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none min-h-[250px] placeholder:text-white/30 text-lg leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir={t('title') === 'تحويل النص إلى صوت' ? 'rtl' : 'ltr'}>
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">{t('language')}</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#0a0015] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                {/* Style Instruction */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                    {t('style')}
                  </label>
                  <input
                    type="text"
                    value={styleInstruction}
                    onChange={(e) => setStyleInstruction(e.target.value)}
                    placeholder={t('stylePlaceholder')}
                    className="w-full bg-[#0a0015] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}

              {/* Action Button */}
              <button
                onClick={generateAudio}
                disabled={isProcessing || !text.trim()}
                className="mt-2 w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6" />
                    {t('process')}
                  </>
                )}
              </button>

              {/* Output Audio Player */}
              {audioUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4"
                  dir={t('title') === 'تحويل النص إلى صوت' ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-violet-400" />
                      {t('result')}
                    </h3>
                    <button onClick={downloadAudio} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all">
                      <Download className="w-4 h-4" />
                      {t('download')}
                    </button>
                  </div>
                  <audio controls src={audioUrl} className="w-full mt-2" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Voice Selection Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col" dir={t('title') === 'تحويل النص إلى صوت' ? 'rtl' : 'ltr'}>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Mic className="w-5 h-5 text-fuchsia-400" />
                {t('voice')}
              </h2>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {voices.length === 0 ? (
                  <div className="text-center text-white/40 py-10">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading voices...
                  </div>
                ) : (
                  voices.map(voice => (
                    <div 
                      key={voice.voiceName}
                      onClick={() => setSelectedVoice(voice.voiceName)}
                      className={`relative cursor-pointer p-4 rounded-2xl border transition-all ${
                        selectedVoice === voice.voiceName 
                          ? 'bg-violet-600/20 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                          : 'bg-[#0a0015]/50 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-bold">{voice.name}</h4>
                          <p className="text-xs text-white/50">{voice.accent} • {voice.gender}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {voice.isPremium && (
                            <span className="text-[10px] uppercase font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-black px-2 py-0.5 rounded-full">
                              PRO
                            </span>
                          )}
                          {voice.demoAudio && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); playDemo(voice.demoAudio); }}
                              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all"
                            >
                              <Play className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
