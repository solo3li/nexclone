"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAiStore } from "../../store/useAiStore";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/axios";

interface Voice {
  id: number;
  name: string;
  voiceName: string;
  accent: string;
  gender: string;
  isPremium: boolean;
  demoAudio: string | null;
}

export default function TextToVoice() {
  const [text, setText] = useState("");
  const [languageMode, setLanguageMode] = useState<"Arabic" | "Other">("Arabic");
  const [otherLanguage, setOtherLanguage] = useState("English (US)");
  const [voiceName, setVoiceName] = useState("");
  
  // New style settings
  const [dialectFilter, setDialectFilter] = useState("");
  const [emotion, setEmotion] = useState("");
  const [performanceStyle, setPerformanceStyle] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(true);

  const { isGeneratingAudio, audioUrl, error, generateAudio, clearAudio } = useAiStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const openAiVoices = [
    { id: 'alloy', name: 'Alloy', gender: 'Neutral' },
    { id: 'echo', name: 'Echo', gender: 'Male' },
    { id: 'fable', name: 'Fable', gender: 'Male' },
    { id: 'onyx', name: 'Onyx', gender: 'Male' },
    { id: 'nova', name: 'Nova', gender: 'Female' },
    { id: 'shimmer', name: 'Shimmer', gender: 'Female' }
  ];

  const handleLanguageModeChange = (mode: "Arabic" | "Other") => {
    setLanguageMode(mode);
    if (mode === "Arabic") {
      const defaultVoice = voices.find(v => dialectFilter === "" || v.accent === dialectFilter);
      setVoiceName(defaultVoice ? defaultVoice.voiceName : "Aurora");
    } else {
      setVoiceName("alloy");
    }
  };

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await api.get('/platform/voices');
        setVoices(res.data);
        if (res.data.length > 0) {
          setVoiceName(res.data[0].voiceName);
        }
      } catch (err) {
        console.error("Failed to load voices:", err);
      } finally {
        setLoadingVoices(false);
      }
    };
    fetchVoices();
  }, []);

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      alert("يجب تسجيل الدخول لاستخدام هذه الأداة.");
      router.push("/login");
      return;
    }
    clearAudio();

    let finalStyleInstruction = "";
    if (languageMode === "Arabic") {
      const parts = [];
      if (emotion) parts.push(`Emotion: ${emotion}`);
      if (performanceStyle) parts.push(`Style: ${performanceStyle}`);
      if (customInstructions) parts.push(`Extra: ${customInstructions}`);
      finalStyleInstruction = parts.join(", ") || "Neutral";
    } else {
      finalStyleInstruction = "Neutral";
    }

    const targetLang = languageMode === "Arabic" ? "Arabic" : otherLanguage;
    await generateAudio(text, targetLang, voiceName, finalStyleInstruction);
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Auto-play prevented", e));
    }
  }, [audioUrl]);

  // Derived data
  const uniqueAccents = Array.from(new Set(voices.map(v => v.accent).filter(Boolean)));
  const filteredVoices = voices.filter(v => dialectFilter === "" || v.accent === dialectFilter);

  // Play demo handler
  const handlePlayDemo = (voice: Voice, e: React.MouseEvent) => {
    e.stopPropagation();
    if (voice.demoAudio) {
      const audio = new Audio(voice.demoAudio);
      audio.play().catch(err => console.error("Failed to play demo", err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in" dir="rtl">
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-[var(--color-bento-text)] tracking-tight mb-2">مولد النص إلى صوت</h1>
        <p className="text-[var(--color-bento-muted)] text-lg">حول النص إلى كلام طبيعي بسهولة باستخدام أداتنا بالذكاء الاصطناعي.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Right Column: Settings */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          <div className="bento-card p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-[var(--color-bento-text)] mb-6 flex items-center">
              <i className="fas fa-microphone-alt text-blue-500 ml-2"></i> إعدادات الصوت
            </h3>
            
            {/* Language Mode Toggle */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-[var(--color-bento-muted)] flex items-center">
                <i className="fas fa-language ml-2"></i> وضع اللغة
              </label>
              <div className="flex bg-[var(--color-bento-bg)] rounded-xl p-1 border border-[var(--color-bento-border)]">
                <button
                  onClick={() => handleLanguageModeChange("Arabic")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    languageMode === "Arabic" 
                      ? "bg-white text-black shadow-md" 
                      : "text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)]"
                  }`}
                >
                  <i className="fas fa-keyboard ml-2"></i> العربية
                </button>
                <button
                  onClick={() => handleLanguageModeChange("Other")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    languageMode === "Other" 
                      ? "bg-white text-black shadow-md" 
                      : "text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)]"
                  }`}
                >
                  <i className="fas fa-globe ml-2"></i> لغات أخرى
                </button>
              </div>

              {languageMode === "Other" && (
                <div className="mt-3">
                  <select 
                    value={otherLanguage}
                    onChange={(e) => setOtherLanguage(e.target.value)}
                    className="bento-input w-full appearance-none text-sm"
                  >
                    <option value="English (US)">الإنجليزية (الولايات المتحدة)</option>
                    <option value="English (UK)">الإنجليزية (المملكة المتحدة)</option>
                    <option value="Spanish">الإسبانية</option>
                    <option value="French">الفرنسية</option>
                  </select>
                </div>
              )}
            </div>

            {/* Voice Grid Selection */}
            <div className="space-y-3 mb-6 border-t border-[var(--color-bento-border)] pt-6">
              <label className="text-xs font-bold text-[var(--color-bento-muted)] flex items-center">
                <i className="fas fa-user-voice ml-2"></i> اختر الصوت
              </label>
              
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {languageMode === "Arabic" ? (
                  loadingVoices ? (
                    <div className="col-span-2 text-center text-[var(--color-bento-muted)] py-4 text-sm">جاري تحميل الأصوات...</div>
                  ) : filteredVoices.length > 0 ? (
                    filteredVoices.map(v => (
                      <div 
                        key={v.id}
                        onClick={() => setVoiceName(v.voiceName)}
                        className={`relative p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2
                          ${voiceName === v.voiceName 
                            ? 'bg-blue-500/10 border-blue-500' 
                            : 'bg-[var(--color-bento-bg)] border-[var(--color-bento-border)] hover:border-[var(--color-bento-border)]'
                          }`}
                      >
                        {v.isPremium && (
                          <div className="absolute top-0 -translate-y-1/2 bg-blue-600 text-[var(--color-bento-text)] text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                            <i className="fas fa-crown ml-1 text-yellow-200"></i> مميز
                          </div>
                        )}
                        <h4 className="font-bold text-[var(--color-bento-text)] text-sm mt-2">{v.name}</h4>
                        <p className="text-[10px] text-[var(--color-bento-muted)]">{v.accent}</p>
                        <div className="text-[10px] text-[var(--color-bento-muted)] flex items-center">
                          <i className={`fas ${v.gender === 'Female' ? 'fa-venus' : 'fa-mars'} ml-1`}></i>
                          {v.gender === 'Female' ? 'أنثى' : 'ذكر'}
                        </div>
                        {v.demoAudio && (
                          <button 
                            onClick={(e) => handlePlayDemo(v, e)}
                            className="absolute top-2 left-2 text-[var(--color-bento-muted)] hover:text-blue-400"
                            title="استماع للعينة"
                          >
                            <i className="fas fa-play-circle"></i>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center text-[var(--color-bento-muted)] py-4 text-sm">لا توجد أصوات مطابقة</div>
                  )
                ) : (
                  openAiVoices.map(v => (
                    <div 
                        key={v.id}
                        onClick={() => setVoiceName(v.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2
                          ${voiceName === v.id 
                            ? 'bg-blue-500/10 border-blue-500' 
                            : 'bg-[var(--color-bento-bg)] border-[var(--color-bento-border)] hover:border-[var(--color-bento-border)]'
                          }`}
                      >
                        <h4 className="font-bold text-[var(--color-bento-text)] text-sm">{v.name}</h4>
                        <div className="text-[10px] text-[var(--color-bento-muted)] flex items-center">
                           <i className={`fas ${v.gender === 'Female' ? 'fa-venus' : v.gender === 'Male' ? 'fa-mars' : 'fa-robot'} ml-1`}></i>
                           {v.gender === 'Female' ? 'أنثى' : v.gender === 'Male' ? 'ذكر' : 'محايد'}
                        </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Performance Options (Only for Arabic) */}
            {languageMode === "Arabic" && (
              <div className="space-y-4 border-t border-[var(--color-bento-border)] pt-6">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-bento-muted)] flex items-center">
                    <i className="fas fa-comments ml-2 text-blue-400"></i> اللهجة
                  </label>
                  <select 
                    value={dialectFilter}
                    onChange={(e) => {
                      setDialectFilter(e.target.value);
                      const firstMatch = voices.find(v => e.target.value === "" || v.accent === e.target.value);
                      if (firstMatch) setVoiceName(firstMatch.voiceName);
                    }}
                    className="bento-input w-full appearance-none text-sm"
                  >
                    <option value="">-- كل اللهجات --</option>
                    {uniqueAccents.map((acc, idx) => (
                      <option key={idx} value={acc as string}>{acc}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-bento-muted)] flex items-center">
                    <i className="fas fa-heart ml-2 text-blue-400"></i> المشاعر
                  </label>
                  <select 
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    className="bento-input w-full appearance-none text-sm"
                  >
                    <option value="">-- اختر المشاعر (اختياري) --</option>
                    <option value="طبيعي">طبيعي (Neutral)</option>
                    <option value="سعيد">سعيد (Happy)</option>
                    <option value="حزين">حزين (Sad)</option>
                    <option value="غاضب">غاضب (Angry)</option>
                    <option value="متحمس">متحمس (Excited)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-bento-muted)] flex items-center">
                    <i className="fas fa-theater-masks ml-2 text-blue-400"></i> أسلوب الأداء
                  </label>
                  <select 
                    value={performanceStyle}
                    onChange={(e) => setPerformanceStyle(e.target.value)}
                    className="bento-input w-full appearance-none text-sm"
                  >
                    <option value="">-- اختر أسلوب الأداء (اختياري) --</option>
                    <option value="إخباري">إخباري (News)</option>
                    <option value="سرد قصصي">سرد قصصي (Storytelling)</option>
                    <option value="وثائقي">وثائقي (Documentary)</option>
                    <option value="حواري">حواري (Conversational)</option>
                    <option value="إعلاني">إعلاني (Advertisement)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-bento-muted)] flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-magic ml-2 text-blue-400"></i> إرشادات مخصصة
                    </div>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] border border-blue-500/30">
                      <i className="fas fa-lock ml-1 text-[8px]"></i> للمشتركين فقط
                    </span>
                  </label>
                  <textarea 
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    className="bento-input w-full resize-none h-20 text-sm"
                    placeholder="مثال: تحدث ببطء شديد، وركز على مخارج الحروف..."
                  ></textarea>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Left Column: Script Input & Output */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="bento-card p-6 flex flex-col min-h-[500px] relative">
            
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--color-bento-border)]">
               <div className="text-sm font-bold text-[var(--color-bento-text)] flex items-center">
                 أدخل النص هنا <i className="fas fa-edit mr-2 text-[var(--color-bento-muted)]"></i>
               </div>
               <div className="bg-blue-900/40 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30 font-mono flex-row-reverse">
                 الحد الأقصى 4096
               </div>
            </div>
            
            <textarea 
              className="w-full flex-1 resize-none bg-transparent text-[var(--color-bento-text)] text-lg placeholder-[var(--color-bento-muted)] leading-relaxed outline-none mb-4"
              placeholder="اكتب النص هنا (الحد الأقصى 4096 حرف)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              dir="auto"
              maxLength={4096}
            ></textarea>

            <div className="text-left text-[var(--color-bento-muted)] text-xs font-mono mb-6">
              الأحرف 4096 / {text.length}
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGeneratingAudio || text.length === 0}
              className={`w-full py-4 text-md flex items-center justify-center transition-all rounded-xl font-bold
                ${text.length === 0 
                  ? 'bg-[var(--color-bento-card-hover)] text-[#52525b] cursor-not-allowed border border-[var(--color-bento-border)]' 
                  : 'bento-btn-accent shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                }
              `}
            >
              {isGeneratingAudio ? (
                <><i className="fas fa-spinner fa-spin ml-2"></i> جاري توليد الصوت...</>
              ) : (
                <><i className="fas fa-wave-square ml-2"></i> إنشاء صوت</>
              )}
            </button>
          </div>

          {/* Audio Player Result */}
          {audioUrl && (
            <div className="bento-card border-blue-500/30 p-4 shadow-xl flex items-center justify-between animate-fade-in relative overflow-hidden bg-blue-500/5">
              <div className="relative flex-1 px-4 z-10">
                <audio ref={audioRef} controls src={audioUrl} className="w-full outline-none" />
              </div>
              <div className="relative z-10 flex space-x-2 space-x-reverse">
                <a 
                  href={audioUrl} 
                  download={`tts_output_${Date.now()}.mp3`}
                  className="bento-btn w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)] transition-colors"
                  title="تحميل الصوت"
                >
                  <i className="fas fa-download"></i>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
