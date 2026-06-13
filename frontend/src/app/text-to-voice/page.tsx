"use client";

import { useState } from "react";

export default function TextToVoice() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!text) return;
    setIsGenerating(true);
    setAudioUrl(null);
    setTimeout(() => {
      // Mock audio url Generation
      setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="section-header">
        <h2>Text to Speech</h2>
        <p>Turn your text into lifelike speech in seconds.</p>
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
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>Language</label>
            <select style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white',
              outline: 'none'
            }}>
              <option value="en">English (US)</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>Voice Model</label>
            <select style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white',
              outline: 'none'
            }}>
              <option value="alloy">Alloy (Neutral)</option>
              <option value="echo">Echo (Warm)</option>
              <option value="fable">Fable (Expressive)</option>
              <option value="onyx">Onyx (Deep)</option>
              <option value="nova">Nova (Energetic)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '8px' }}>Your Text</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            style={{
              width: '100%',
              height: '200px',
              padding: '15px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '5px' }}>
            {text.length} / 5000 characters
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={!text || isGenerating}
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--accent-color) 100%)',
            color: 'black',
            border: 'none',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: (!text || isGenerating) ? 'not-allowed' : 'pointer',
            opacity: (!text || isGenerating) ? 0.7 : 1,
            transition: 'opacity 0.3s'
          }}
        >
          {isGenerating ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : <><i className="fas fa-magic"></i> Generate Audio</>}
        </button>

        {audioUrl && (
          <div style={{
            background: 'rgba(26, 219, 138, 0.1)',
            border: '1px solid var(--accent-color)',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '30px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: 'var(--accent-color)', marginBottom: '15px' }}>
              <i className="fas fa-check-circle"></i> Audio Generated Successfully
            </h4>
            <audio controls src={audioUrl} style={{ width: '100%' }}></audio>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                <i className="fas fa-download"></i> Download MP3
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
