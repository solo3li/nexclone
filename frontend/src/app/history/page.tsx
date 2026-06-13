"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function History() {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  const historyData = [
    { id: "GEN-0145", type: "text-to-voice", title: "Blog Post Intro", date: "24 Oct 2024", duration: "1:24", status: "completed", lang: "English", voice: "Aurora" },
    { id: "GEN-0144", type: "voice-to-text", title: "Interview Recording", date: "23 Oct 2024", duration: "45:10", status: "processing", lang: "Auto", voice: "-" },
    { id: "GEN-0143", type: "text-to-voice", title: "YouTube Voiceover", date: "20 Oct 2024", duration: "8:05", status: "completed", lang: "Spanish", voice: "Atlas" },
    { id: "GEN-0142", type: "voice-to-text", title: "Meeting Notes", date: "18 Oct 2024", duration: "12:30", status: "failed", lang: "French", voice: "-" },
    { id: "GEN-0141", type: "text-to-voice", title: "Podcast Ad Read", date: "15 Oct 2024", duration: "0:45", status: "completed", lang: "English", voice: "Nova" },
  ];

  const filteredData = activeTab === "all" ? historyData : historyData.filter(d => d.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">History</h1>
          <p className="text-[var(--color-bento-muted)] mt-1 text-sm">Access, download, and manage your past AI generations.</p>
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
      <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 border-b border-[var(--color-bento-border)]">
        <button 
          onClick={() => setActiveTab("all")}
          className={`px-4 py-3 text-sm font-bold transition-all whitespace-nowrap border-b-2
            ${activeTab === "all" ? 'border-white text-white' : 'border-transparent text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)]'}`}
        >
          All Generations
        </button>
        <button 
          onClick={() => setActiveTab("text-to-voice")}
          className={`px-4 py-3 text-sm font-bold transition-all whitespace-nowrap border-b-2
            ${activeTab === "text-to-voice" ? 'border-white text-white' : 'border-transparent text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)]'}`}
        >
          Speech AI
        </button>
        <button 
          onClick={() => setActiveTab("voice-to-text")}
          className={`px-4 py-3 text-sm font-bold transition-all whitespace-nowrap border-b-2
            ${activeTab === "voice-to-text" ? 'border-white text-white' : 'border-transparent text-[var(--color-bento-muted)] hover:text-[var(--color-bento-text)]'}`}
        >
          Voice AI
        </button>
      </div>

      {/* Data Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] text-[var(--color-bento-muted)] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)]">ID</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)]">Type</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)]">Title</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)]">Details</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)]">Date</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)]">Status</th>
                <th className="p-4 font-bold border-b border-[var(--color-bento-border)] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-bento-border)]">
              {filteredData.map((item, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                  onClick={() => router.push(`/history/${item.id}`)}
                >
                  <td className="p-4 font-mono text-xs text-[var(--color-bento-muted)] group-hover:text-blue-400 transition-colors">{item.id}</td>
                  <td className="p-4">
                    {item.type === 'text-to-voice' ? (
                      <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <i className="fas fa-volume-up text-xs"></i>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                        <i className="fas fa-microphone text-xs"></i>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm font-bold text-white">{item.title}</td>
                  <td className="p-4 text-xs text-[var(--color-bento-muted)] space-y-1">
                    <div><span className="text-[#52525b]">Lang:</span> {item.lang}</div>
                    {item.voice !== "-" && <div><span className="text-[#52525b]">Voice:</span> {item.voice}</div>}
                    <div><span className="text-[#52525b]">Length:</span> {item.duration}</div>
                  </td>
                  <td className="p-4 text-xs text-[var(--color-bento-muted)]">{item.date}</td>
                  <td className="p-4">
                    {item.status === 'completed' && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 font-bold text-[10px] rounded border border-green-500/20 uppercase tracking-wider">
                        Completed
                      </span>
                    )}
                    {item.status === 'processing' && (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 font-bold text-[10px] rounded border border-blue-500/20 uppercase tracking-wider flex items-center w-max">
                        <i className="fas fa-circle-notch fa-spin mr-1"></i> Processing
                      </span>
                    )}
                    {item.status === 'failed' && (
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 font-bold text-[10px] rounded border border-red-500/20 uppercase tracking-wider">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="bento-btn w-7 h-7 rounded flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white" 
                        title="Play/View"
                      >
                        <i className="fas fa-play text-[10px]"></i>
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="bento-btn w-7 h-7 rounded flex items-center justify-center text-[var(--color-bento-muted)] hover:text-white" 
                        title="Download"
                      >
                        <i className="fas fa-download text-[10px]"></i>
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="bento-btn w-7 h-7 rounded flex items-center justify-center text-[var(--color-bento-muted)] hover:text-red-400" 
                        title="Delete"
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
              <p className="font-bold text-sm">No history found for this category.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
