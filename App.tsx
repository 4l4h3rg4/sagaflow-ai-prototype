import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { SagaInput, Saga, Feedback } from './types';
import { generateSaga, generateFeedback } from './services/geminiService';
import InputSection from './components/InputSection';
import MissionCard from './components/MissionCard';
import FeedbackModal from './components/FeedbackModal';
import LanguageSwitcher from './components/LanguageSwitcher';
import ToastNotification from './components/ToastNotification';
import FeatsLog from './components/FeatsLog';
import ThemeSwitcher from './components/ThemeSwitcher';
import { t, placeholderSagas } from './lib/i18n';

type Theme = 'dark' | 'light' | 'mystic';

// --- Start of inlined components for the new Settings Menu ---

const SettingsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface SettingsMenuProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  language: 'en' | 'es';
  onLanguageChange: (lang: 'en' | 'es') => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ theme, onThemeChange, language, onLanguageChange }) => {
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
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open settings menu"
        title="Settings"
      >
        <SettingsIcon />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg shadow-2xl z-20 p-4 animate-fade-in-fast backdrop-blur-md"
          role="menu"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">{t('settings.theme', language)}</label>
              <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">{t('settings.language', language)}</label>
              <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
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

// --- End of inlined components ---

const App: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('es');
  const [theme, setTheme] = useState<Theme>('dark');
  const [sagaInput, setSagaInput] = useState<SagaInput>({
    theme: '',
    tasks: [''],
    prompt: '',
    constraints: [''],
  });
  const [mission, setMission] = useState<Saga | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for feedback system
  const [toast, setToast] = useState<{ id: number, message: string } | null>(null);
  const [completedFeats, setCompletedFeats] = useState<Feedback[]>([]);
  const [finalFeedback, setFinalFeedback] = useState<{ content: Feedback | null, isLoading: boolean }>({ content: null, isLoading: false });
  const [placeholders, setPlaceholders] = useState({
    theme: '',
    task: '',
    role: '',
    rule: '',
  });

  useEffect(() => {
    // remove previous theme classes
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-mystic');
    // add current theme class
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Pick a random placeholder on mount and language change
  useEffect(() => {
    const langPlaceholders = placeholderSagas[language];
    const randomIndex = Math.floor(Math.random() * langPlaceholders.length);
    setPlaceholders(langPlaceholders[randomIndex]);
  }, [language]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const handleGenerateSaga = useCallback(async () => {
    const nonEmptyTasks = sagaInput.tasks.filter(t => t.trim());
    if (!sagaInput.theme || nonEmptyTasks.length === 0) {
      setError(t('app.errorRequired', language));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setMission(null);
    setCompletedFeats([]);
    setFinalFeedback({ content: null, isLoading: false });

    try {
      const result = await generateSaga({ ...sagaInput, tasks: nonEmptyTasks }, language);
      setMission(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('app.errorUnknown', language));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [sagaInput, language]);

  const handleClearAll = useCallback(() => {
    setSagaInput({
      theme: '',
      tasks: [''],
      prompt: '',
      constraints: [''],
    });
    setMission(null);
    setError(null);
    setCompletedFeats([]);
    setFinalFeedback({ content: null, isLoading: false });
  }, []);

  const handleToggleObjective = useCallback((objectiveIndex: number) => {
    setMission(prevMission => {
      if (!prevMission) return null;

      const newObjectives = [...prevMission.objectives];
      const targetObjective = newObjectives[objectiveIndex];

      newObjectives[objectiveIndex] = { ...targetObjective, completed: !targetObjective.completed };
      const newMissionState = { ...prevMission, objectives: newObjectives };

      // If a task was just marked as COMPLETE
      if (newObjectives[objectiveIndex].completed) {
        // 1. Show instant visual feedback (toast)
        setToast({ id: Date.now(), message: t('toast.successTitle', language) });

        // 2. Generate feat description in the background
        (async () => {
          try {
            const featData = await generateFeedback({
              theme: sagaInput.theme || 'a grand adventure',
              role: newMissionState.roleAndObjective,
              completedTask: newObjectives[objectiveIndex].missionTask,
              isFinal: false,
            }, language);
            setCompletedFeats(prevFeats => [...prevFeats, featData]);
          } catch (err) {
            console.error("Could not generate feat:", err);
          }
        })();
        
        // 3. Check if all objectives are now complete
        const allComplete = newObjectives.every(obj => obj.completed);
        if (allComplete) {
          // 4. Trigger the final, grand feedback modal
          (async () => {
            setFinalFeedback({ content: null, isLoading: true });
            try {
              const finalFeedbackData = await generateFeedback({
                theme: sagaInput.theme || 'a grand adventure',
                role: newMissionState.roleAndObjective,
                completedTask: newObjectives[objectiveIndex].missionTask, // The last completed task
                isFinal: true,
              }, language);
              setFinalFeedback({ content: finalFeedbackData, isLoading: false });
            } catch (err) {
              console.error("Could not generate final feedback:", err);
              // Show a fallback if API fails
              setFinalFeedback({
                content: { id: 'fallback', title: 'Victory!', message: 'You have completed all your objectives. A legendary achievement!' },
                isLoading: false
              });
            }
          })();
        }
      }

      return newMissionState;
    });
  }, [sagaInput.theme, language]);
  
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <SettingsMenu 
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
        />
      </div>
      <main className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1
            className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-transparent bg-clip-text"
            style={{ backgroundImage: `linear-gradient(to right, var(--color-header-gradient-from), var(--color-header-gradient-via), var(--color-header-gradient-to))`}}
          >
            {t('header.title', language)}
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)] text-base sm:text-lg">{t('header.subtitle', language)}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputSection
            sagaInput={sagaInput}
            setSagaInput={setSagaInput}
            onGenerate={handleGenerateSaga}
            isLoading={isLoading}
            onClear={handleClearAll}
            language={language}
            placeholders={placeholders}
            placeholderSagaList={placeholderSagas[language]}
          />
          <div>
            <MissionCard
              mission={mission}
              isLoading={isLoading}
              error={error}
              onToggleObjective={handleToggleObjective}
              language={language}
            />
            <FeatsLog feats={completedFeats} language={language} />
          </div>
        </div>
      </main>
      <footer className="text-center mt-12 text-[var(--color-text-muted)] text-sm">
        <p>{t('app.footer', language)}</p>
      </footer>

      {toast && (
        <ToastNotification 
          key={toast.id}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {(finalFeedback.isLoading || finalFeedback.content) && (
        <FeedbackModal 
          feedback={finalFeedback.content}
          isLoading={finalFeedback.isLoading}
          onClose={() => setFinalFeedback({ content: null, isLoading: false })}
          language={language}
        />
      )}
    </div>
  );
};

export default App;
