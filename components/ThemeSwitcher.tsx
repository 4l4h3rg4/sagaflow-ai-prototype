
import React from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import StarIcon from './icons/StarIcon';
import Tooltip from './Tooltip';
import { t } from '../lib/i18n';

type Theme = 'dark' | 'light' | 'mystic';

interface ThemeSwitcherProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  language?: 'en' | 'es';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onThemeChange, language = 'en' }) => {
  const baseClasses = "p-2 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:ring-offset-2 focus:ring-offset-[var(--color-input-bg)]";
  const activeClasses = "bg-[var(--color-accent-strong)] text-white";
  const inactiveClasses = "text-[var(--color-text-muted)] hover:bg-[var(--color-card-bg)] hover:text-[var(--color-text-primary)]";

  const currentLang = language as 'en' | 'es';

  return (
    <div className="flex items-center justify-around p-1 bg-[var(--color-input-bg)] rounded-full border border-[var(--color-border)]/50 w-full">
      <Tooltip text={t('tooltips.themeLight', currentLang)} position="bottom">
        <button 
          onClick={() => onThemeChange('light')}
          className={`${baseClasses} ${theme === 'light' ? activeClasses : inactiveClasses}`}
          aria-pressed={theme === 'light'}
          aria-label="Switch to light theme"
        >
          <SunIcon />
        </button>
      </Tooltip>
      <Tooltip text={t('tooltips.themeDark', currentLang)} position="bottom">
        <button 
          onClick={() => onThemeChange('dark')}
          className={`${baseClasses} ${theme === 'dark' ? activeClasses : inactiveClasses}`}
          aria-pressed={theme === 'dark'}
          aria-label="Switch to dark theme"
        >
          <MoonIcon />
        </button>
      </Tooltip>
      <Tooltip text={t('tooltips.themeMystic', currentLang)} position="bottom">
        <button 
          onClick={() => onThemeChange('mystic')}
          className={`${baseClasses} ${theme === 'mystic' ? activeClasses : inactiveClasses}`}
          aria-pressed={theme === 'mystic'}
          aria-label="Switch to mystic theme"
        >
          <StarIcon />
        </button>
      </Tooltip>
    </div>
  );
};

export default ThemeSwitcher;
