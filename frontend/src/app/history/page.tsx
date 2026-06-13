"use client";

import { useState } from "react";

export default function History() {
  const [activeTab, setActiveTab] = useState("all");

  const historyItems = [
    { id: 1, type: "voice-to-text", title: "Meeting Recording.mp3", date: "2026-06-12", duration: "05:23", status: "Completed" },
    { id: 2, type: "text-to-voice", title: "Welcome Message", date: "2026-06-10", duration: "00:45", status: "Completed" },
    { id: 3, type: "voice-to-text", title: "Interview_01.wav", date: "2026-06-08", duration: "12:10", status: "Completed" },
    { id: 4, type: "text-to-voice", title: "Tutorial Voiceover", date: "2026-06-05", duration: "02:30", status: "Completed" },
  ];

  const filteredItems = activeTab === "all" ? historyItems : historyItems.filter(item => item.type === activeTab);

  return (
    <div className="container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="section-header">
        <h2>Your History</h2>
        <p>Access your past generations and transcriptions.</p>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '1000px',
        margin: '0 auto',
        backdropFilter: 'blur(10px)'
      }}>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <button 
            onClick={() => setActiveTab("all")}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === "all" ? 'var(--accent-color)' : 'rgba(255,255,255,0.6)', 
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: activeTab === "all" ? 'bold' : 'normal'
            }}
          >
            All History
          </button>
          <button 
            onClick={() => setActiveTab("voice-to-text")}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === "voice-to-text" ? 'var(--accent-color)' : 'rgba(255,255,255,0.6)', 
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: activeTab === "voice-to-text" ? 'bold' : 'normal'
            }}
          >
            Voice to Text
          </button>
          <button 
            onClick={() => setActiveTab("text-to-voice")}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === "text-to-voice" ? 'var(--accent-color)' : 'rgba(255,255,255,0.6)', 
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: activeTab === "text-to-voice" ? 'bold' : 'normal'
            }}
          >
            Text to Speech
          </button>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.5)', textAlign: 'left' }}>
                <th style={{ padding: '15px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Type</th>
                <th style={{ padding: '15px' }}>Title</th>
                <th style={{ padding: '15px' }}>Date</th>
                <th style={{ padding: '15px' }}>Duration</th>
                <th style={{ padding: '15px' }}>Status</th>
                <th style={{ padding: '15px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px' }}>
                    {item.type === "voice-to-text" ? 
                      <span style={{ color: '#00a8ff' }}><i className="fas fa-microphone"></i> Transcription</span> : 
                      <span style={{ color: '#e84118' }}><i className="fas fa-volume-up"></i> Synthesis</span>
                    }
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{item.title}</td>
                  <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)' }}>{item.date}</td>
                  <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)' }}>{item.duration}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ background: 'rgba(26, 219, 138, 0.2)', color: 'var(--accent-color)', padding: '5px 10px', borderRadius: '20px', fontSize: '12px' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>
                    <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>
                      <i className="fas fa-eye"></i> View
                    </button>
                    {item.type === "text-to-voice" && (
                      <button style={{ background: 'rgba(26, 219, 138, 0.2)', border: 'none', color: 'var(--accent-color)', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                        <i className="fas fa-download"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredItems.length === 0 && (
             <div style={{ textAlign: 'center', padding: '50px', color: 'rgba(255,255,255,0.5)' }}>
               No history found.
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
