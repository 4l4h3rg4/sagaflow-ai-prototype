
import React, { useState, useRef } from 'react';
import LoadingSpinner from './icons/LoadingSpinner';
import SpeakerIcon from './icons/SpeakerIcon';
import type { Saga } from '../types';
import { t } from '../lib/i18n';
import { generateNarratorAudio } from '../services/geminiService';

interface MissionCardProps {
  mission: Saga | null;
  isLoading: boolean;
  isImageLoading: boolean;
  error: string | null;
  onToggleObjective: (index: number) => void;
  language: 'en' | 'es';
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, isLoading, isImageLoading, error, onToggleObjective, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handlePlayAudio = async () => {
    if (!mission) return;

    if (isPlaying) {
      // Stop playback
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsAudioLoading(true);
    try {
      // Construct text to read: Scenario + Call to Action
      const textToRead = `${mission.scenario} ... ${mission.callToAction}`;
      const audioBuffer = await generateNarratorAudio(textToRead, language);

      if (audioBuffer) {
        // Init Audio Context if not exists
        if (!audioContextRef.current) {
           audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        }
        
        // Setup Source
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        
        source.onended = () => setIsPlaying(false);
        
        sourceNodeRef.current = source;
        source.start();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Failed to play audio", err);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
          <LoadingSpinner />
          <p className="mt-4 text-lg font-cinzel tracking-wider text-[var(--color-text-secondary)] animate-pulse">{t('missionCard.loading', language)}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center">
          <h3 className="text-xl font-cinzel font-bold text-[var(--color-destructive)] mb-2">{t('missionCard.errorTitle', language)}</h3>
          <p className="text-[var(--color-destructive)] bg-[var(--color-destructive-bg)] p-4 rounded-md">{error}</p>
        </div>
      );
    }

    if (mission) {
      return (
        <div className="text-left w-full self-start">
          {/* Image Section */}
          <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden bg-[var(--color-input-bg)] flex items-center justify-center border border-[var(--color-border)]">
             {isImageLoading ? (
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs text-[var(--color-text-muted)] animate-pulse">Materializing Vision...</span>
                 </div>
             ) : mission.imageUrl ? (
                 <img src={mission.imageUrl} alt={mission.scenario.substring(0, 50)} className="w-full h-full object-cover animate-fade-in" />
             ) : (
                 <span className="text-[var(--color-text-muted)] italic text-sm opacity-50">No visual data</span>
             )}
          </div>

          <div className="relative">
            <p className="whitespace-pre-wrap text-[var(--color-text-secondary)] leading-relaxed mb-4 pr-12">{mission.scenario}</p>
            <button 
              onClick={handlePlayAudio}
              disabled={isAudioLoading}
              className="absolute top-0 right-0 p-2 rounded-full bg-[var(--color-input-bg)] hover:bg-[var(--color-accent)]/20 text-[var(--color-accent)] transition-colors disabled:opacity-50"
              title="Narrate Mission"
            >
                {isAudioLoading ? (
                     <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <SpeakerIcon isPlaying={isPlaying} />
                )}
            </button>
          </div>

          <p className="whitespace-pre-wrap text-[var(--color-text-secondary)] italic leading-relaxed mb-6">{mission.roleAndObjective}</p>
          
          <h3 className="font-cinzel text-xl font-bold mb-3 text-[var(--color-accent)] border-b border-[var(--color-border)] pb-2">{t('missionCard.objectivesTitle', language)}</h3>
          <ul className="space-y-4 mb-6">
            {mission.objectives.map((obj, index) => (
              <li key={index} className="group relative flex items-start gap-4">
                <input
                  type="checkbox"
                  id={`objective-${index}`}
                  checked={obj.completed}
                  onChange={() => onToggleObjective(index)}
                  className="mt-1 h-5 w-5 rounded-sm bg-[var(--color-input-bg)] border-[var(--color-border)] text-[var(--color-accent-strong)] focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-accent-strong)] cursor-pointer transition"
                  aria-labelledby={`mission-task-${index}`}
                />
                <label htmlFor={`objective-${index}`} className={`flex-1 cursor-pointer transition-colors ${obj.completed ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-secondary)]'}`}>
                  <span id={`mission-task-${index}`} className={`font-semibold block ${obj.completed ? 'line-through' : ''}`}>{obj.missionTask}</span>
                </label>
                {/* Tooltip */}
                <div
                  role="tooltip"
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-10"
                >
                  <span className="font-bold">{t('missionCard.originalTaskLabel', language)}:</span> {obj.originalTask}
                </div>
              </li>
            ))}
          </ul>

          {mission.missionRules && mission.missionRules.trim() && (
            <>
              <h3 className="font-cinzel text-xl font-bold mb-3 text-[var(--color-accent)] border-b border-[var(--color-border)] pb-2">{t('missionCard.rulesTitle', language)}</h3>
              <p className="whitespace-pre-wrap text-[var(--color-text-muted)] bg-[var(--color-input-bg)] p-3 rounded-md mb-6">{mission.missionRules}</p>
            </>
          )}

          <p className="text-center font-cinzel font-bold text-lg text-[var(--color-accent-hover)] mt-6 pt-4 border-t border-[var(--color-border)]">{mission.callToAction}</p>
        </div>
      );
    }

    return (
      <div className="text-center text-[var(--color-text-muted)] min-h-[300px] flex flex-col justify-center items-center">
        <h3 className="text-2xl font-cinzel font-bold">{t('missionCard.placeholderTitle', language)}</h3>
        <p className="mt-2 max-w-md">{t('missionCard.placeholderBody', language)}</p>
      </div>
    );
  };
  
  return (
    <div id="tour-mission" className="bg-[var(--color-card-bg)] p-6 rounded-lg border border-[var(--color-border)] backdrop-blur-md">
      {renderContent()}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default MissionCard;
