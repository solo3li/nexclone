"use client";

import { useState } from "react";

export default function History() {
  const [activeTab, setActiveTab] = useState("all");

  const historyData = [
    { id: "GEN-0145", type: "text-to-voice", title: "Blog Post Intro", date: "24 Oct 2024", duration: "1:24", status: "completed", lang: "English", voice: "Aurora" },
    { id: "GEN-0144", type: "voice-to-text", title: "Interview Recording", date: "23 Oct 2024", duration: "45:10", status: "processing", lang: "Auto", voice: "-" },
    { id: "GEN-0143", type: "text-to-voice", title: "YouTube Voiceover", date: "20 Oct 2024", duration: "8:05", status: "completed", lang: "Spanish", voice: "Atlas" },
    { id: "GEN-0142", type: "voice-to-text", title: "Meeting Notes", date: "18 Oct 2024", duration: "12:30", status: "failed", lang: "French", voice: "-" },
    { id: "GEN-0141", type: "text-to-voice", title: "Podcast Ad Read", date: "15 Oct 2024", duration: "0:45", status: "completed", lang: "English", voice: "Nova" },
  ];

  const filteredData = activeTab === "all" ? historyData : historyData.filter(d => d.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Generation History</h1>
          <p className="text-slate-500 mt-2">Access, download, and manage your past AI generations.</p>
        </div>
        <div className="flex space-x-2">
          <button className="clay-btn w-12 h-12 flex items-center justify-center text-slate-600">
            <i className="fas fa-search"></i>
          </button>
          <button className="clay-btn w-12 h-12 flex items-center justify-center text-slate-600">
            <i className="fas fa-filter"></i>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap
            ${activeTab === "all" ? 'clay-btn-primary' : 'clay-btn text-slate-500 hover:text-slate-700'}`}
        >
          All Generations
        </button>
        <button 
          onClick={() => setActiveTab("text-to-voice")}
          className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap
            ${activeTab === "text-to-voice" ? 'clay-btn-primary' : 'clay-btn text-slate-500 hover:text-slate-700'}`}
        >
          Text to Speech
        </button>
        <button 
          onClick={() => setActiveTab("voice-to-text")}
          className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap
            ${activeTab === "voice-to-text" ? 'clay-btn-primary' : 'clay-btn text-slate-500 hover:text-slate-700'}`}
        >
          Voice to Text
        </button>
      </div>

      {/* Data Table */}
      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-bold border-b border-slate-200">ID</th>
                <th className="p-4 font-bold border-b border-slate-200">Type</th>
                <th className="p-4 font-bold border-b border-slate-200">Title</th>
                <th className="p-4 font-bold border-b border-slate-200">Details</th>
                <th className="p-4 font-bold border-b border-slate-200">Date</th>
                <th className="p-4 font-bold border-b border-slate-200">Status</th>
                <th className="p-4 font-bold border-b border-slate-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-500">{item.id}</td>
                  <td className="p-4">
                    {item.type === 'text-to-voice' ? (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                        <i className="fas fa-volume-up"></i>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                        <i className="fas fa-microphone"></i>
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-slate-700">{item.title}</td>
                  <td className="p-4 text-sm text-slate-500">
                    <div><span className="font-bold text-slate-600">Lang:</span> {item.lang}</div>
                    {item.voice !== "-" && <div><span className="font-bold text-slate-600">Voice:</span> {item.voice}</div>}
                    <div><span className="font-bold text-slate-600">Length:</span> {item.duration}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{item.date}</td>
                  <td className="p-4">
                    {item.status === 'completed' && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-full border border-green-200">
                        Completed
                      </span>
                    )}
                    {item.status === 'processing' && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-200 flex items-center w-max">
                        <i className="fas fa-circle-notch fa-spin mr-1"></i> Processing
                      </span>
                    )}
                    {item.status === 'failed' && (
                      <span className="px-3 py-1 bg-red-50 text-red-700 font-bold text-xs rounded-full border border-red-200">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button className="clay-btn w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800" title="Play/View">
                        <i className="fas fa-play text-xs"></i>
                      </button>
                      <button className="clay-btn w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800" title="Download">
                        <i className="fas fa-download text-xs"></i>
                      </button>
                      <button className="clay-btn w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600" title="Delete">
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <i className="fas fa-folder-open text-4xl mb-4 text-slate-300"></i>
              <p className="font-bold">No history found for this category.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
