"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Navbar from "../../../../src/components/Navbar";
import Footer from "../../../../src/components/Footer";
import { UploadCloud, Mic, Square, Play, Copy, Download, Loader2 } from "lucide-react";
import { uploadDirectToMinio } from "../../../../src/utils/upload";
import api from "../../../../src/utils/api";

const LANGUAGES = [
  { code: 'auto', name: 'Auto-Detect' },
  { code: 'ar', name: 'Arabic - العربية' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish - Español' },
  { code: 'fr', name: 'French - Français' },
  { code: 'de', name: 'German - Deutsch' },
  { code: 'it', name: 'Italian - Italiano' },
  { code: 'pt', name: 'Portuguese - Português' },
  { code: 'ru', name: 'Russian - Русский' },
  { code: 'zh', name: 'Chinese - 中文' },
  { code: 'ja', name: 'Japanese - 日本語' },
  { code: 'ko', name: 'Korean - 한국어' },
  { code: 'hi', name: 'Hindi - हिन्दी' },
  { code: 'tr', name: 'Turkish - Türkçe' },
];

export default function VoiceToTextPage() {
  const t = useTranslations("VoiceToText");

  const [file, setFile] = useState<File | Blob | null>(null);
  const [mode, setMode] = useState("transcribe");
  const [language, setLanguage] = useState("auto");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setFile(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setFile(null);
      setResult("");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult("");
    }
  };

  const processAudio = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");

    try {
      const audioFile = file instanceof File ? file : new File([file], "recording.webm", { type: "audio/webm" });
      const fileId = await uploadDirectToMinio(audioFile);

      const res = await api.post("/api/ai/voice-to-text/transcribe", {
        fileId: fileId,
        translate: mode === "translate",
        targetLanguage: language
      });

      setResult(res.data.translated_text || res.data.original_text);
    } catch (err) {
      setError(t('error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(result);
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col">
      <div className="fixed top-1/4 left-1/4 w-[60%] h-[500px] bg-violet-600/10 blur-[150px] pointer-events-none z-0 rounded-full" />
      
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('title')}</h1>
          <p className="text-lg text-white/60">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls & Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6"
          >
            {/* Action Selection */}
            <div className="flex gap-4 p-1 bg-white/5 rounded-xl border border-white/10 flex-row" dir={t('title') === 'تحويل الصوت إلى نص' ? 'rtl' : 'ltr'}>
              <button
                onClick={() => setMode("transcribe")}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${mode === "transcribe" ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg" : "text-white/60 hover:text-white"}`}
              >
                {t('transcribe')}
              </button>
              <button
                onClick={() => setMode("translate")}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${mode === "translate" ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg" : "text-white/60 hover:text-white"}`}
              >
                {t('translate')}
              </button>
            </div>

            {/* Language Selection */}
            <div dir={t('title') === 'تحويل الصوت إلى نص' ? 'rtl' : 'ltr'}>
              <label className="block text-sm font-medium text-white/70 mb-2">{t('language')}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={mode === 'translate'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all disabled:opacity-50 appearance-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-[#0a0015]">{lang.name}</option>
                ))}
              </select>
            </div>

            {/* Input Methods */}
            <div className="grid grid-cols-2 gap-4">
              <label className="cursor-pointer group flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 border-dashed rounded-2xl hover:bg-white/10 hover:border-violet-500/50 transition-all text-center">
                <UploadCloud className="w-8 h-8 text-violet-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white">{t('upload')}</span>
                <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="flex flex-col items-center justify-center p-6 bg-red-500/20 border border-red-500/50 rounded-2xl hover:bg-red-500/30 transition-all text-center animate-pulse"
                >
                  <Square className="w-8 h-8 text-red-400 mb-3" />
                  <span className="text-sm font-medium text-red-100">{t('stopRecording')}</span>
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="group flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 border-dashed rounded-2xl hover:bg-white/10 hover:border-fuchsia-500/50 transition-all text-center"
                >
                  <Mic className="w-8 h-8 text-fuchsia-400 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-white">{t('record')}</span>
                </button>
              )}
            </div>

            {file && (
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-white/80 truncate flex-1" dir="ltr">
                  {file instanceof File ? file.name : "Recorded Audio"}
                </span>
                <button
                  onClick={processAudio}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-medium text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {isProcessing ? t('processing') : t('process')}
                </button>
              </div>
            )}
            
            {error && <div className="text-red-400 text-sm mt-2 text-center">{error}</div>}
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4" dir={t('title') === 'تحويل الصوت إلى نص' ? 'rtl' : 'ltr'}>
              <h2 className="text-lg font-bold text-white">{t('result')}</h2>
              {result && (
                <div className="flex gap-2">
                  <button onClick={copyText} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-white transition-all" title={t('copy')}>
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={downloadText} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-white transition-all" title={t('download')}>
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className={`flex-1 w-full bg-[#0a0015]/50 border border-white/5 rounded-2xl p-4 min-h-[300px] overflow-y-auto ${!result ? 'flex items-center justify-center' : ''}`}>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center text-white/50">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-violet-500" />
                  <p>{t('processing')}</p>
                </div>
              ) : result ? (
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap" dir="auto">{result}</p>
              ) : (
                <p className="text-white/30 text-sm text-center">
                  Your transcribed or translated text will appear here.
                </p>
              )}
            </div>
          </motion.div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
