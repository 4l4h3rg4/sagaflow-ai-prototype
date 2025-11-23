
import React from 'react';
import Tooltip from './Tooltip';
import { t } from '../lib/i18n';

interface LanguageSwitcherProps {
  language: 'en' | 'es';
  onLanguageChange: (lang: 'en' | 'es') => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, onLanguageChange }) => {
  const baseClasses = "w-full px-3 py-1 rounded-full transition-all duration-300 ease-in-out text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:ring-offset-2 focus:ring-offset-[var(--color-input-bg)]";
  const activeClasses = "bg-[var(--color-accent-strong)] text-white";
  const inactiveClasses = "text-[var(--color-text-muted)] hover:bg-[var(--color-card-bg)] hover:text-[var(--color-text-primary)]";

  return (
    <div className="flex items-center p-1 bg-[var(--color-input-bg)] rounded-full border border-[var(--color-border)]/50 w-full gap-1">
      <Tooltip text={t('tooltips.langEN', language)} position="bottom" className="flex-1">
        <button 
          onClick={() => onLanguageChange('en')}
          className={`${baseClasses} ${language === 'en' ? activeClasses : inactiveClasses}`}
          aria-pressed={language === 'en'}
        >
          EN
        </button>
      </Tooltip>
      <Tooltip text={t('tooltips.langES', language)} position="bottom" className="flex-1">
        <button 
          onClick={() => onLanguageChange('es')}
          className={`${baseClasses} ${language === 'es' ? activeClasses : inactiveClasses}`}
          aria-pressed={language === 'es'}
        >
          ES
        </button>
      </Tooltip>
    </div>
  );
};

export default LanguageSwitcher;
