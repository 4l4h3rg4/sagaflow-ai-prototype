import React from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import StarIcon from './icons/StarIcon';

type Theme = 'dark' | 'light' | 'mystic';

interface ThemeSwitcherProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onThemeChange }) => {
  const baseClasses = "p-2 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:ring-offset-2 focus:ring-offset-[var(--color-input-bg)]";
  const activeClasses = "bg-[var(--color-accent-strong)] text-white";
  const inactiveClasses = "text-[var(--color-text-muted)] hover:bg-[var(--color-card-bg)] hover:text-[var(--color-text-primary)]";

  return (
    <div className="flex items-center justify-around p-1 bg-[var(--color-input-bg)] rounded-full border border-[var(--color-border)]/50 w-full">
      <button 
        onClick={() => onThemeChange('light')}
        className={`${baseClasses} ${theme === 'light' ? activeClasses : inactiveClasses}`}
        aria-pressed={theme === 'light'}
        aria-label="Switch to light theme"
        title="Light Theme"
      >
        <SunIcon />
      </button>
      <button 
        onClick={() => onThemeChange('dark')}
        className={`${baseClasses} ${theme === 'dark' ? activeClasses : inactiveClasses}`}
        aria-pressed={theme === 'dark'}
        aria-label="Switch to dark theme"
        title="Dark Theme"
      >
        <MoonIcon />
      </button>
      <button 
        onClick={() => onThemeChange('mystic')}
        className={`${baseClasses} ${theme === 'mystic' ? activeClasses : inactiveClasses}`}
        aria-pressed={theme === 'mystic'}
        aria-label="Switch to mystic theme"
        title="Mystic Theme"
      >
        <StarIcon />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
