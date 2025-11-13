
import React from 'react';
import LoadingSpinner from './icons/LoadingSpinner';
import type { Saga } from '../types';
import { t } from '../lib/i18n';

interface MissionCardProps {
  mission: Saga | null;
  isLoading: boolean;
  error: string | null;
  onToggleObjective: (index: number) => void;
  language: 'en' | 'es';
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, isLoading, error, onToggleObjective, language }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
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
          <p className="whitespace-pre-wrap text-[var(--color-text-secondary)] leading-relaxed mb-4">{mission.scenario}</p>
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
      <div className="text-center text-[var(--color-text-muted)]">
        <h3 className="text-2xl font-cinzel font-bold">{t('missionCard.placeholderTitle', language)}</h3>
        <p className="mt-2">{t('missionCard.placeholderBody', language)}</p>
      </div>
    );
  };
  
  return (
    <div className="bg-[var(--color-card-bg)] p-6 rounded-lg border border-[var(--color-border)] backdrop-blur-md min-h-[300px] flex items-center justify-center">
      {renderContent()}
    </div>
  );
};

export default MissionCard;