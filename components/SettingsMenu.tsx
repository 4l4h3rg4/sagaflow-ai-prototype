
import React, { useState, useEffect, useRef } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { t } from '../lib/i18n';
import Tooltip from './Tooltip';

type Theme = 'dark' | 'light' | 'mystic';

const SettingsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const RefreshIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface SettingsMenuProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  language: 'en' | 'es';
  onLanguageChange: (lang: 'en' | 'es') => void;
  onRestartTutorial: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ theme, onThemeChange, language, onLanguageChange, onRestartTutorial }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Tooltip text={t('tooltips.settings', language)} position="left">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="p-3 sm:p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] backdrop-blur-sm bg-[var(--color-card-bg)] border border-[var(--color-border)] sm:border-none sm:bg-transparent shadow-sm sm:shadow-none"
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Open settings menu"
        >
          <SettingsIcon />
        </button>
      </Tooltip>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-[85vw] sm:w-56 bg-[var(--color-card-bg)] ring-1 ring-white/10 rounded-lg shadow-2xl z-20 p-4 animate-fade-in-fast backdrop-blur-xl origin-top-right"
          role="menu"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">{t('settings.theme', language)}</label>
              <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} language={language} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">{t('settings.language', language)}</label>
              <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
            </div>
            <div className="pt-2 border-t border-[var(--color-border)]/50 space-y-1">
               <button 
                onClick={() => {
                    onRestartTutorial();
                    setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors p-2 rounded hover:bg-[var(--color-input-bg)]"
               >
                   <RefreshIcon />
                   {t('settings.tutorial', language)}
               </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; transform: translateY(-5px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.15s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SettingsMenu;
