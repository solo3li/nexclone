"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "../../store/useHistoryStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function History() {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  
  const { history: historyData, isLoading, fetchHistory, deleteHistory } = useHistoryStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchHistory();
  }, [isAuthenticated, router, fetchHistory]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("هل أنت متأكد من أنك تريد حذف هذا السجل؟")) {
      await deleteHistory(id);
    }
  };

  const filteredData = activeTab === "all" ? historyData : historyData.filter(d => d.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in" dir="rtl">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">السجل</h1>
          <p className="text-[var(--color-bento-muted)] mt-1 text-sm">الوصول، وتحميل، وإدارة العمليات السابقة الخاصة بك.</p>
        </div>
        <div className="flex space-x-2">
          <button className="bento-btn w-10 h-10 flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white">
            <i className="fas fa-search text-sm"></i>
          </button>
          <button className="bento-btn w-10 h-10 flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white">
            <i className="fas fa-filter text-sm"></i>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 border-b border-[var(--color-bento-border)] space-x-reverse">
        <button 
          onClick={() => setActiveTab("all")}
          className={`px-4 py-3 text-sm font-bold transition-all whitespace-nowrap border-b-2
            ${activeTab === "all" ? 'border-white text-white' : 'border-transparent text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)]'}`}
        >
          جميع العمليات
        </button>
        <button 
          onClick={() => setActiveTab("text-to-voice")}
          className={`px-4 py-3 text-sm font-bold transition-all whitespace-nowrap border-b-2
            ${activeTab === "text-to-voice" ? 'border-white text-white' : 'border-transparent text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)]'}`}
        >
          تحويل النص إلى صوت
        </button>
        <button 
          onClick={() => setActiveTab("voice-to-text")}
          className={`px-4 py-3 text-sm font-bold transition-all whitespace-nowrap border-b-2
            ${activeTab === "voice-to-text" ? 'border-white text-white' : 'border-transparent text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)]'}`}
        >
          تحويل الصوت إلى نص
        </button>
      </div>

      <div className="bento-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center">
            <i className="fas fa-circle-notch fa-spin text-3xl text-blue-500 mb-4"></i>
            <p className="text-[var(--color-bento-muted)]">جاري تحميل السجل...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] text-[var(--color-bento-muted)] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)] text-right">المعرف</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)] text-right">النوع</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)] text-right">العنوان</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)] text-right">التفاصيل</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)] text-right">التاريخ</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)] text-right">الحالة</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)] text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-bento-border)]">
              {filteredData.map((item, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                  onClick={() => router.push(`/history/${item.id}`)}
                >
                  <td className="p-4 font-mono text-xs text-[var(--color-bento-muted)] group-hover:text-blue-400 transition-colors">
                    {item.id.split('-')[0]}...
                  </td>
                  <td className="p-4">
                    {item.type === 'text-to-voice' ? (
                      <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20" title="Text to Voice">
                        <i className="fas fa-volume-up text-xs"></i>
                      </div>
                    ) : item.type === 'voice-to-text' ? (
                      <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20" title="Voice to Text">
                        <i className="fas fa-microphone text-xs"></i>
                      </div>
                    ) : item.type === 'bg-remover' ? (
                      <div className="w-8 h-8 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20" title="BG Remover">
                        <i className="fas fa-image text-xs"></i>
                      </div>
                    ) : item.type === 'img-to-txt' ? (
                      <div className="w-8 h-8 rounded-md bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20" title="Image to Text">
                        <i className="fas fa-file-alt text-xs"></i>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20" title="GPT">
                        <i className="fas fa-robot text-xs"></i>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm font-bold text-white">{item.title}</td>
                  <td className="p-4 text-xs text-[var(--color-bento-muted)] space-y-1 text-right">
                    {item.lang !== "Auto" && <div><span className="text-[#52525b]">اللغة:</span> {item.lang}</div>}
                    {item.voice !== "-" && <div><span className="text-[#52525b]">الصوت:</span> {item.voice}</div>}
                    {item.duration !== "0:00" && <div><span className="text-[#52525b]">المدة:</span> {item.duration}</div>}
                    {!item.lang && !item.voice && <div className="italic">غير متوفر</div>}
                  </td>
                  <td className="p-4 text-xs text-[var(--color-bento-muted)]">{item.date}</td>
                  <td className="p-4 text-right">
                    {item.status === 'completed' && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 font-bold text-[10px] rounded border border-green-500/20 uppercase tracking-wider">
                        مكتمل
                      </span>
                    )}
                    {item.status === 'processing' && (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 font-bold text-[10px] rounded border border-blue-500/20 uppercase tracking-wider flex items-center w-max">
                        <i className="fas fa-circle-notch fa-spin mr-1"></i> قيد المعالجة
                      </span>
                    )}
                    {item.status === 'failed' && (
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 font-bold text-[10px] rounded border border-red-500/20 uppercase tracking-wider">
                        فشل
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2 space-x-reverse">
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="bento-btn w-7 h-7 rounded flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white" 
                        title="تشغيل/عرض"
                      >
                        <i className="fas fa-play text-[10px]"></i>
                      </button>
                      {item.fileUrl && (
                        <a 
                          href={`http://178.62.192.74:8080${item.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} 
                          className="bento-btn w-7 h-7 rounded flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white" 
                          title="تحميل"
                        >
                          <i className="fas fa-download text-[10px]"></i>
                        </a>
                      )}
                      <button 
                        onClick={(e) => handleDelete(e, item.id)} 
                        className="bento-btn w-7 h-7 rounded flex items-center justify-center text-[var(--color-bento-muted)] hover:text-red-400" 
                        title="حذف"
                      >
                        <i className="fas fa-trash text-[10px]"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="p-12 text-center text-[#52525b]">
              <i className="fas fa-folder-open text-4xl mb-4 opacity-50"></i>
              <p className="font-bold text-sm">لم يتم العثور على سجل في هذا القسم.</p>
            </div>
          )}
        </div>
        )}
      </div>

    </div>
  );
}
