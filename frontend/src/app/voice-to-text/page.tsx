"use client";

import { useState } from "react";

export default function VoiceToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTranscription("Listening...");
      setTimeout(() => {
        setTranscription("This is a simulated transcription of your voice in the NexMedia AI dashboard.");
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="section-header">
        <h2>Voice to Text</h2>
        <p>Convert your audio into highly accurate text instantly.</p>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        backdropFilter: 'blur(10px)'
      }}>
        
        <div style={{
          border: '2px dashed rgba(26, 219, 138, 0.3)',
          borderRadius: '15px',
          padding: '50px',
          textAlign: 'center',
          marginBottom: '30px',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(26, 219, 138, 0.3)'}
        >
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '48px', color: 'var(--accent-color)', marginBottom: '15px' }}></i>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Upload Audio File</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Drag and drop your audio file here or click to browse</p>
          <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', marginTop: '10px' }}>Supported formats: MP3, WAV, M4A (Max 50MB)</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>— OR —</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button 
            onClick={handleRecord}
            style={{
              background: isRecording ? 'rgba(255, 59, 48, 0.2)' : 'rgba(26, 219, 138, 0.1)',
              color: isRecording ? '#ff3b30' : 'var(--accent-color)',
              border: `1px solid ${isRecording ? '#ff3b30' : 'var(--accent-color)'}`,
              padding: '15px 40px',
              borderRadius: '30px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
          >
            <i className={`fas fa-microphone ${isRecording ? 'fa-pulse' : ''}`}></i>
            {isRecording ? "Recording... Click to Stop" : "Record from Microphone"}
          </button>
        </div>

        {transcription && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '30px'
          }}>
            <h4 style={{ color: 'var(--accent-color)', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
              Transcription Result
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} title="Copy to clipboard">
                <i className="fas fa-copy"></i>
              </button>
            </h4>
            <p style={{ color: 'white', lineHeight: '1.6' }}>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
