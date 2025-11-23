import { useState, useRef, useEffect, useCallback } from 'react';
import { generateNarratorAudio } from '../services/geminiService';

// Helper to decode base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export const useAudioNarrator = (language: 'en' | 'es') => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    };
  }, []);

  const stop = useCallback(() => {
      if (sourceNodeRef.current) {
        try {
            sourceNodeRef.current.stop();
        } catch (e) {
            // Ignore if already stopped
        }
        sourceNodeRef.current = null;
      }
      setIsPlaying(false);
  }, []);

  const play = useCallback(async (text: string) => {
    if (isPlaying) {
      stop();
      return;
    }

    setIsLoading(true);
    try {
      // 1. Fetch Audio Data
      const base64Audio = await generateNarratorAudio(text, language);

      if (base64Audio) {
        // 2. Initialize Context (Lazy Load)
        if (!audioContextRef.current) {
           const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
           audioContextRef.current = new AudioCtor({sampleRate: 24000});
        }

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        
        // 3. Decode
        const audioData = base64ToArrayBuffer(base64Audio);
        const audioBuffer = await ctx.decodeAudioData(audioData);
        
        // 4. Play
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        source.onended = () => setIsPlaying(false);
        
        sourceNodeRef.current = source;
        source.start();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Failed to play audio", err);
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, language, stop]);

  return {
      isPlaying,
      isLoading,
      play,
      stop
  };
};