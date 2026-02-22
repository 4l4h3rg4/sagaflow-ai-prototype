import React from 'react';
import LoadingSpinner from './icons/LoadingSpinner';
import SpeakerIcon from './icons/SpeakerIcon';
import type { Saga } from '../types';
import { t } from '../lib/i18n';
import Tooltip from './Tooltip';
import { useAudioNarrator } from '../hooks/useAudioNarrator';
import MissionTimer from './MissionTimer';

interface MissionCardProps {
  mission: Saga | null;
  isLoading: boolean;
  isImageLoading: boolean;
  error: string | null;
  onToggleObjective: (index: number) => void;
  language: 'en' | 'es';
  timerState?: {
    totalSeconds: number;
    remainingSeconds: number;
    isRunning: boolean;
    isOnBreak: boolean;
    breakRemaining: number;
  };
  onTimerStateChange?: (newState: any) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, isLoading, isImageLoading, error, onToggleObjective, language, timerState, onTimerStateChange }) => {
  const { isPlaying, isLoading: isAudioLoading, play } = useAudioNarrator(language);

  const handlePlayAudio = () => {
    if (!mission) return;
    if (navigator.vibrate) navigator.vibrate(10);
    const textToRead = `${mission.scenario} ... ${mission.callToAction}`;
    play(textToRead);
  };

  const handleToggle = (index: number) => {
    if (navigator.vibrate) navigator.vibrate([10]);
    onToggleObjective(index);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center">
          <h3 className="text-xl font-display font-bold text-[var(--color-destructive)] mb-2">{t('missionCard.errorTitle', language)}</h3>
          <p className="text-[var(--color-destructive)] bg-[var(--color-destructive-bg)] p-4 rounded-md border border-[var(--color-destructive)]/50">{error}</p>
        </div>
      );
    }

    if (mission) {
      return (
        <div className="text-left w-full self-start">

          <div id="tour-mission-scenario" className="relative border-b border-[var(--color-border)]/30 pb-6 sm:pb-8 mb-6 sm:mb-8">
            <p className="whitespace-pre-wrap text-[var(--color-text-primary)] text-[1.1rem] sm:text-xl leading-relaxed sm:leading-loose mb-4 font-display font-medium tracking-wide drop-shadow-sm pr-12">{mission.scenario}</p>
            <p className="text-[var(--color-text-secondary)] italic text-sm bg-[var(--color-input-bg)]/40 p-4 rounded-lg border-l-2 border-[var(--color-accent)]">{mission.roleAndObjective}</p>

            <div className="absolute top-0 right-0">
              <Tooltip text={t('tooltips.narrate', language)} position="left">
                <button
                  id="tour-mission-narrate"
                  onClick={handlePlayAudio}
                  disabled={isAudioLoading}
                  className="p-3 rounded-full bg-[var(--color-card-bg)] hover:bg-[var(--color-accent)] text-[var(--color-accent)] hover:text-white ring-1 ring-[var(--color-accent)]/20 transition-all hover:shadow-[0_0_15px_var(--color-accent)] disabled:opacity-50 active:scale-95 touch-manipulation"
                  aria-label={t('tooltips.narrate', language)}
                >
                  {isAudioLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <SpeakerIcon isPlaying={isPlaying} />
                  )}
                </button>
              </Tooltip>
            </div>
          </div>

          {timerState && onTimerStateChange && (
            <MissionTimer
              isActive={true}
              language={language}
              onBreakStart={() => {
                if (navigator.vibrate) navigator.vibrate(50);
              }}
              onBreakEnd={() => {
                if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
              }}
              timerState={timerState}
              onTimerStateChange={onTimerStateChange}
            />
          )}

          <div id="tour-mission-objectives" className="bg-[var(--color-input-bg)]/20 rounded-2xl p-2 sm:p-8 ring-1 ring-white/5 mb-10 shadow-inner">
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-[var(--color-text-primary)] flex items-center gap-4 px-2">
              <span className="text-2xl sm:text-3xl drop-shadow-md">⚔️</span> {t('missionCard.objectivesTitle', language)}
            </h3>
            <ul className="space-y-3 sm:space-y-5">
              {mission.objectives.map((obj, index) => (
                <li
                  key={index}
                  className={`group relative rounded-xl transition-all duration-500 ease-out backdrop-blur-sm ${obj.completed
                      ? 'bg-green-900/20 ring-1 ring-green-500/20 translate-x-1 sm:translate-x-2 shadow-none'
                      : 'bg-[var(--color-card-bg)] ring-1 ring-white/5 hover:ring-[var(--color-accent)]/30 hover:bg-[var(--color-card-bg)]/80 hover:shadow-lg hover:-translate-y-1'
                    }`}
                >
                  <label className="flex items-start gap-4 sm:gap-5 cursor-pointer select-none w-full p-4 sm:p-5 min-h-[80px] items-center sm:items-start active:bg-[var(--color-input-bg)] transition-colors rounded-xl">
                    <div className="relative mt-0 sm:mt-1 shrink-0">
                      <input
                        type="checkbox"
                        id={`objective-${index}`}
                        checked={obj.completed}
                        onChange={() => handleToggle(index)}
                        className="peer sr-only"
                        aria-labelledby={`mission-task-${index}`}
                      />
                      <div className={`w-10 h-10 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-out ${obj.completed
                          ? 'bg-[var(--color-accent-strong)] border-[var(--color-accent-strong)] scale-110 rotate-0 shadow-[0_0_10px_var(--color-accent)]'
                          : 'bg-transparent border-[var(--color-text-muted)]/30 group-hover:border-[var(--color-accent)] scale-100 rotate-0'
                        }`}>
                        <svg
                          className={`w-6 h-6 sm:w-3.5 sm:h-3.5 text-white transition-all duration-300 cubic-bezier(0.4, 0.0, 0.2, 1) ${obj.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-0 rotate-[-90deg]'
                            }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="4"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      {obj.completed && (
                        <div className="absolute inset-0 -z-10 rounded-full bg-[var(--color-accent)] animate-[ping_0.6s_ease-out_once]"></div>
                      )}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <span
                        id={`mission-task-${index}`}
                        className={`text-base sm:text-lg font-medium block transition-all duration-500 ease-in-out origin-left leading-snug ${obj.completed
                            ? 'text-[var(--color-text-muted)] line-through decoration-2 decoration-[var(--color-accent)]/50 opacity-60 grayscale'
                            : 'text-[var(--color-text-primary)]'
                          }`}
                      >
                        {obj.missionTask}
                      </span>
                    </div>
                  </label>

                  <div
                    role="tooltip"
                    className="hidden sm:block absolute left-12 -top-9 w-max max-w-xs px-4 py-2 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-card-bg)] ring-1 ring-white/10 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 backdrop-blur-md translate-y-2 group-hover:translate-y-0"
                  >
                    <span className="font-bold text-[var(--color-accent)] uppercase tracking-wider mr-2 text-[10px]">{t('missionCard.originalTaskLabel', language)}:</span> {obj.originalTask}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {mission.missionRules && mission.missionRules.trim() && (
            <div className="mb-10">
              <div className="relative bg-[var(--color-card-bg)]/50 border-l-4 border-[var(--color-accent)] rounded-r-xl p-6 sm:p-8 shadow-sm backdrop-blur-sm">
                <h3 className="font-display text-base font-bold mb-4 text-[var(--color-accent)] uppercase tracking-widest flex items-center gap-3 opacity-90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t('missionCard.rulesTitle', language)}
                </h3>
                <div className="text-[var(--color-text-primary)] text-base sm:text-lg font-medium leading-relaxed pl-1">
                  {mission.missionRules}
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <div className="inline-block relative w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-pink-500 blur-xl opacity-20"></div>
              <p className="relative font-display font-bold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent-strong)] to-pink-500 py-4 px-4 sm:px-8 border-t border-b border-[var(--color-border)]/30">
                {mission.callToAction}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[var(--color-card-bg)]/95 p-4 sm:p-12 rounded-[24px] sm:rounded-3xl ring-1 ring-white/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(124,58,237,0.2)]">
      {renderContent()}
    </div>
  );
};

export default MissionCard;