"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAiStore } from "../../store/useAiStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function VoiceToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { isTranscribing, transcriptionText, error, transcribeAudio, clearError } = useAiStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const startRecording = () => {
    if (!isAuthenticated) {
      alert("يجب تسجيل الدخول لاستخدام هذه الأداة.");
      router.push("/login");
      return;
    }
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    // Note: Live recording logic to capture microphone data is omitted for brevity.
    // In a full implementation, you would capture audio blobs via MediaRecorder, 
    // convert them to a File object, and set it to the `file` state on stop.
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    if (!isAuthenticated) {
      alert("يجب تسجيل الدخول لاستخدام هذه الأداة.");
      router.push("/login");
      return;
    }
    if (!file) return;
    clearError();
    await transcribeAudio(file);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in" dir="rtl">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">تحويل الصوت إلى نص</h1>
        <p className="text-[var(--color-bento-muted)] mt-2">قم بتفريغ الملفات الصوتية إلى نصوص بدقة عالية باستخدام الذكاء الاصطناعي.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
        
        {/* Upload Section (span 2) */}
        <div className="bento-card col-span-1 md:col-span-2 p-8 flex flex-col items-center justify-center text-center border-dashed border-[#3f3f46]">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-blue-400 text-2xl mb-6 shadow-inner">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">رفع ملف صوتي</h3>
          <p className="text-sm text-[var(--color-bento-muted)] mb-6">MP3, WAV, M4A حتى 50 ميجابايت</p>
          
          <input 
            type="file" 
            id="audio-upload" 
            className="hidden" 
            accept="audio/*"
            onChange={handleFileUpload}
          />
          <label 
            htmlFor="audio-upload" 
            className="bento-btn-primary px-8 py-3 cursor-pointer"
          >
            اختر ملف
          </label>
          
          {file && (
            <div className="mt-6 p-4 bg-[#0a0a0a] rounded-xl border border-[var(--color-bento-border)] text-sm text-[var(--color-bento-text)] font-medium flex items-center">
              <i className="fas fa-file-audio text-blue-400 ml-2"></i>
              {file.name}
            </div>
          )}
        </div>

        {/* Record Section */}
        <div className="bento-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {isRecording && <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>}
          
          <div className="mb-8 relative z-10">
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all border
                ${isRecording 
                  ? 'bg-red-500 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
                  : 'bg-[#0a0a0a] border-[#262626] text-white hover:border-[#3f3f46]'}`}
            >
              <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2 relative z-10">
            {isRecording ? "جاري التسجيل..." : "تسجيل مباشر"}
          </h3>
          <p className="text-2xl font-mono text-[var(--color-bento-muted)] font-bold tracking-widest relative z-10">
            {formatTime(recordingTime)}
          </p>
        </div>

      </div>

      {/* Settings Section */}
      <div className="bento-card p-8">
        <h3 className="text-lg font-bold text-white mb-6">إعدادات التفريغ</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">لغة الملف الصوتي</label>
            <div className="relative">
              <select className="bento-input w-full appearance-none text-sm text-right">
                <option>تلقائي</option>
                <option>العربية</option>
                <option>الإنجليزية</option>
                <option>الإسبانية</option>
                <option>الفرنسية</option>
              </select>
              <i className="fas fa-chevron-down absolute left-4 top-4 text-[var(--color-bento-muted)] pointer-events-none text-xs"></i>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-bento-muted)] uppercase tracking-wider">نوع المخرجات</label>
            <div className="relative">
              <select className="bento-input w-full appearance-none text-sm text-right">
                <option>نص عادي</option>
                <option>ترجمة (SRT)</option>
                <option>ترجمة (VTT)</option>
              </select>
              <i className="fas fa-chevron-down absolute left-4 top-4 text-[var(--color-bento-muted)] pointer-events-none text-xs"></i>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleTranscribe}
            disabled={!file || isTranscribing}
            className={`px-8 py-3 text-sm flex items-center rounded-xl font-bold transition-all
              ${!file 
                ? 'bg-[#1a1a1a] text-[#52525b] cursor-not-allowed border border-[var(--color-bento-border)]' 
                : 'bento-btn-accent shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              }
            `}
          >
            {isTranscribing ? (
              <><i className="fas fa-spinner fa-spin ml-2"></i> جاري التفريغ...</>
            ) : (
              <><i className="fas fa-magic ml-2"></i> بدء التفريغ</>
            )}
          </button>
        </div>
      </div>

      {/* Transcription Result */}
      {transcriptionText && (
        <div className="mt-8 bento-card p-8 border border-green-500/30 bg-green-500/5 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <i className="fas fa-check-circle text-green-400 ml-2"></i> النتيجة
            </h3>
            <button 
              onClick={() => navigator.clipboard.writeText(transcriptionText)}
              className="text-[var(--color-bento-muted)] hover:text-white"
              title="نسخ النص"
            >
              <i className="far fa-copy"></i>
            </button>
          </div>
          <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[var(--color-bento-border)] text-[var(--color-bento-text)] whitespace-pre-wrap leading-relaxed">
            {transcriptionText}
          </div>
        </div>
      )}

    </div>
  );
}
