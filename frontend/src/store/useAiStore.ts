import { create } from 'zustand';
import api from '../lib/axios';

interface AiState {
  isGeneratingAudio: boolean;
  isTranscribing: boolean;
  audioUrl: string | null;
  transcriptionText: string | null;
  error: string | null;
  
  generateAudio: (text: string, language: string, voiceName: string, styleInstruction: string) => Promise<void>;
  transcribeAudio: (file: File) => Promise<void>;
  clearAudio: () => void;
  clearError: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  isGeneratingAudio: false,
  isTranscribing: false,
  audioUrl: null,
  transcriptionText: null,
  error: null,

  generateAudio: async (text, language, voiceName, styleInstruction) => {
    set({ isGeneratingAudio: true, error: null, audioUrl: null });
    try {
      // Send POST request, expecting a binary Blob response
      const response = await api.post(
        '/ai/text-to-voice/generate',
        { text, language, voiceName, styleInstruction },
        { responseType: 'blob' } // CRITICAL for handling binary streams
      );

      // Create a local URL for the downloaded Blob
      const blob = new Blob([response.data], { type: response.headers['content-type'] as string });
      const url = URL.createObjectURL(blob);

      set({
        audioUrl: url,
        isGeneratingAudio: false,
      });
    } catch (error: any) {
      // When responseType is 'blob', Axios errors are blobs too. We must read them as text to extract the error message.
      let errorMessage = 'Failed to generate audio';
      if (error.response?.data instanceof Blob) {
        try {
          const textData = await error.response.data.text();
          const jsonError = JSON.parse(textData);
          errorMessage = jsonError.message || errorMessage;
        } catch (e) {
           console.error("Could not parse error blob", e);
        }
      }
      set({
        isGeneratingAudio: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  transcribeAudio: async (file) => {
    set({ isTranscribing: true, error: null, transcriptionText: null });
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await api.post('/ai/voice-to-text/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({
        transcriptionText: response.data.original_text || 'Transcription completed, but no text was found.',
        isTranscribing: false,
      });
    } catch (error: any) {
      set({
        isTranscribing: false,
        error: error.response?.data?.error || 'Failed to transcribe audio.',
      });
      throw error;
    }
  },

  clearAudio: () => set({ audioUrl: null }),
  clearError: () => set({ error: null }),
}));
