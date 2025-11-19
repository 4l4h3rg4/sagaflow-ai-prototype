
import React, { useState, useCallback, useEffect } from 'react';
import type { SagaInput, Saga, Feedback } from './types';
import { generateSaga, generateFeedback, generateScenarioImage } from './services/geminiService';
import InputSection from './components/InputSection';
import MissionCard from './components/MissionCard';
import FeedbackModal from './components/FeedbackModal';
import ToastNotification from './components/ToastNotification';
import FeatsLog from './components/FeatsLog';
import TutorialOverlay from './components/TutorialOverlay';
import SettingsMenu from './components/SettingsMenu';
import { t, placeholderSagas } from './lib/i18n';

type Theme = 'dark' | 'light' | 'mystic';

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

  // State for Image Generation
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Tutorial State
  const [isTutorialActive, setIsTutorialActive] = useState(false);

  useEffect(() => {
    // Check if tutorial has been completed
    const tutorialDone = localStorage.getItem('sagaFlowTutorialDone');
    if (!tutorialDone) {
        // Small delay to ensure UI is ready
        const timer = setTimeout(() => setIsTutorialActive(true), 1000);
        return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseTutorial = () => {
      setIsTutorialActive(false);
      localStorage.setItem('sagaFlowTutorialDone', 'true');
  };

  const handleRestartTutorial = () => {
      setIsTutorialActive(true);
  };

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
    setIsImageLoading(false);

    try {
      const result = await generateSaga({ ...sagaInput, tasks: nonEmptyTasks }, language);
      setMission(result);
      
      // Trigger Image Generation asynchronously once text is ready
      setIsImageLoading(true);
      generateScenarioImage(sagaInput.theme, result.scenario)
        .then((imageUrl) => {
           if (imageUrl) {
             setMission(prev => prev ? { ...prev, imageUrl } : null);
           }
        })
        .catch(err => console.error("Image gen failed", err))
        .finally(() => setIsImageLoading(false));

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
      <TutorialOverlay 
          isActive={isTutorialActive} 
          onClose={handleCloseTutorial} 
          language={language} 
      />
      
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <SettingsMenu 
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
          onRestartTutorial={handleRestartTutorial}
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
          />
          <div>
            <MissionCard
              mission={mission}
              isLoading={isLoading}
              isImageLoading={isImageLoading}
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
