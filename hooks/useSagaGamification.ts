import { useState, useCallback, useRef, useEffect } from 'react';
import type { SagaInput, Saga, Feedback } from '../types';
import { generateSaga, generateFeedback, generateScenarioImage } from '../services/geminiService';
import { t } from '../lib/i18n';
import { loadCurrentSession, saveCurrentSession, clearCurrentSession, saveSagaToHistory } from '../lib/persistence';

export const useSagaGamification = (language: 'en' | 'es') => {
  // State
  const [sagaInput, setSagaInput] = useState<SagaInput>({
    theme: '',
    tasks: [''],
    prompt: '',
    constraints: [''],
  });
  const [mission, setMission] = useState<Saga | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Persistence Loading State
  const [isRestoring, setIsRestoring] = useState(true);

  // Timer State
  const [timerState, setTimerState] = useState({
    totalSeconds: 0,
    remainingSeconds: 0,
    isRunning: false,
    isOnBreak: false,
    breakRemaining: 0,
  });

  const updateTimerState = useCallback((newState: Partial<typeof timerState>) => {
    setTimerState(prev => ({ ...prev, ...newState }));
  }, []);

  // Visuals & Feedback
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  const [toast, setToast] = useState<{ id: number, message: string } | null>(null);
  const [completedFeats, setCompletedFeats] = useState<Feedback[]>([]);
  const [finalFeedback, setFinalFeedback] = useState<{ content: Feedback | null, isLoading: boolean }>({ content: null, isLoading: false });

  // Loading Messages
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  // Refs for current values (used by auto-save)
  const currentStateRef = useRef({ sagaInput, mission, completedFeats, timerState });
  useEffect(() => {
    currentStateRef.current = { sagaInput, mission, completedFeats, timerState };
  }, [sagaInput, mission, completedFeats, timerState]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Restore Session
  useEffect(() => {
    const restore = async () => {
      try {
        const session = await loadCurrentSession();
        if (session) {
          setSagaInput(session.sagaInput);
          setMission(session.mission);
          setCompletedFeats(session.completedFeats);
          if (session.mission?.imageUrl) {
            setBackgroundImage(session.mission.imageUrl);
            setBackgroundOpacity(1);
          }

          if (session.timerIsRunning !== undefined) {
            const elapsed = Math.floor((Date.now() - session.savedAt) / 1000);
            let newRemaining = (session.timerRemainingSeconds || 0);
            let newBreak = (session.timerBreakRemaining || 0);
            let isOnBreak = session.timerIsOnBreak || false;

            if (session.timerIsRunning) {
              if (isOnBreak) {
                newBreak -= elapsed;
                if (newBreak <= 0) {
                  isOnBreak = false;
                  newRemaining -= Math.abs(newBreak);
                }
              } else {
                newRemaining -= elapsed;
              }
            }

            newRemaining = Math.max(0, newRemaining);
            newBreak = Math.max(0, newBreak);

            setTimerState({
              totalSeconds: session.timerTotalSeconds || 0,
              remainingSeconds: newRemaining,
              isRunning: session.timerIsRunning,
              isOnBreak: isOnBreak,
              breakRemaining: newBreak,
            });
          }
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      } finally {
        setIsRestoring(false);
      }
    };
    restore();
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (!timerState.isRunning || isLoading || isRestoring) return;

    const interval = setInterval(() => {
      setTimerState(prev => {
        if (!prev.isRunning) return prev;

        if (prev.isOnBreak) {
          if (prev.breakRemaining > 0) {
            const newBreak = prev.breakRemaining - 1;
            return { ...prev, breakRemaining: newBreak, isOnBreak: newBreak > 0 };
          } else {
            return { ...prev, isOnBreak: false };
          }
        } else {
          if (prev.remainingSeconds > 0) {
            return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
          }
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning, isLoading, isRestoring]);

  // General Auto-save
  useEffect(() => {
    if (isRestoring || isLoading) return;

    const timer = setTimeout(() => {
      const state = currentStateRef.current;
      saveCurrentSession({
        sagaInput: state.sagaInput,
        mission: state.mission,
        completedFeats: state.completedFeats,
        timerTotalSeconds: state.timerState.totalSeconds,
        timerRemainingSeconds: state.timerState.remainingSeconds,
        timerIsRunning: state.timerState.isRunning,
        timerIsOnBreak: state.timerState.isOnBreak,
        timerBreakRemaining: state.timerState.breakRemaining
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [sagaInput, mission, completedFeats, isRestoring, isLoading]); // Only trigger on specific changes, ref gives latest timer

  // Timer 10s specific save interval
  useEffect(() => {
    if (isRestoring || isLoading || !timerState.isRunning) return;

    const interval = setInterval(() => {
      const state = currentStateRef.current;
      saveCurrentSession({
        sagaInput: state.sagaInput,
        mission: state.mission,
        completedFeats: state.completedFeats,
        timerTotalSeconds: state.timerState.totalSeconds,
        timerRemainingSeconds: state.timerState.remainingSeconds,
        timerIsRunning: state.timerState.isRunning,
        timerIsOnBreak: state.timerState.isOnBreak,
        timerBreakRemaining: state.timerState.breakRemaining
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [timerState.isRunning, isRestoring, isLoading]);


  // --- Logic ---

  const startLoadingCycle = useCallback(() => {
    const messages = t('loadingPhases', language) as string[];
    if (!messages || !Array.isArray(messages)) {
      setLoadingMessage("Loading...");
      return;
    }
    let index = 0;
    setLoadingMessage(messages[0]);
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    loadingIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      index = (index + 1) % messages.length;
      setLoadingMessage(messages[index]);
    }, 2000);
  }, [language]);

  const stopLoadingCycle = useCallback(() => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  }, []);

  const generateMission = useCallback(async () => {
    const nonEmptyTasks = sagaInput.tasks.filter(t => t.trim());
    if (!sagaInput.theme || nonEmptyTasks.length === 0) {
      setError(t('app.errorRequired', language));
      return;
    }

    setIsLoading(true);
    startLoadingCycle();
    setError(null);
    setMission(null);
    setCompletedFeats([]);
    setFinalFeedback({ content: null, isLoading: false });
    setBackgroundOpacity(0);
    setIsImageLoading(false);

    try {
      const result = await generateSaga({ ...sagaInput, tasks: nonEmptyTasks }, language);
      if (!isMountedRef.current) return;

      setMission(result);
      setTimerState({
        totalSeconds: 1500,
        remainingSeconds: 1500,
        isRunning: true,
        isOnBreak: false,
        breakRemaining: 0,
      });
      setIsImageLoading(true);

      // Async Image Generation
      generateScenarioImage(sagaInput.theme, result.scenario)
        .then((imageUrl) => {
          if (!isMountedRef.current) return;
          if (imageUrl) {
            setMission(prev => prev ? { ...prev, imageUrl } : null);
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
              if (!isMountedRef.current) return;
              setBackgroundImage(imageUrl);
              setBackgroundOpacity(1);
              setIsImageLoading(false);
            };
          } else {
            setIsImageLoading(false);
          }
        })
        .catch(err => {
          console.error("Image gen failed", err);
          if (isMountedRef.current) setIsImageLoading(false);
        });

    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err instanceof Error ? err.message : t('app.errorUnknown', language));
    } finally {
      if (isMountedRef.current) {
        stopLoadingCycle();
        setIsLoading(false);
      }
    }
  }, [sagaInput, language, startLoadingCycle, stopLoadingCycle]);

  const clearAll = useCallback(async () => {
    if (mission) {
      await saveSagaToHistory(sagaInput, mission, completedFeats, 'paused');
    }
    clearCurrentSession();

    setSagaInput({ theme: '', tasks: [''], prompt: '', constraints: [''] });
    setMission(null);
    setTimerState({
      totalSeconds: 0,
      remainingSeconds: 0,
      isRunning: false,
      isOnBreak: false,
      breakRemaining: 0,
    });
    setError(null);
    setCompletedFeats([]);
    setBackgroundOpacity(0);
    setTimeout(() => { if (isMountedRef.current) setBackgroundImage(null); }, 1000);
    setFinalFeedback({ content: null, isLoading: false });
    stopLoadingCycle();
  }, [stopLoadingCycle, mission, sagaInput, completedFeats]);

  const toggleObjective = useCallback((objectiveIndex: number) => {
    setMission(prevMission => {
      if (!prevMission) return null;

      const newObjectives = [...prevMission.objectives];
      const targetObjective = newObjectives[objectiveIndex];
      newObjectives[objectiveIndex] = { ...targetObjective, completed: !targetObjective.completed };
      const newMissionState = { ...prevMission, objectives: newObjectives };

      if (newObjectives[objectiveIndex].completed) {
        setToast({ id: Date.now(), message: t('toast.successTitle', language) });

        // Micro-reward
        generateFeedback({
          theme: sagaInput.theme || 'adventure',
          role: newMissionState.roleAndObjective,
          completedTask: newObjectives[objectiveIndex].missionTask,
          isFinal: false,
        }, language).then(feat => {
          if (isMountedRef.current) setCompletedFeats(prev => [...prev, feat]);
        });

        // Final reward
        const allComplete = newObjectives.every(obj => obj.completed);
        if (allComplete) {
          setFinalFeedback({ content: null, isLoading: true });

          // Save completed saga
          saveSagaToHistory(sagaInput, newMissionState, completedFeats, 'completed');
          clearCurrentSession();

          generateFeedback({
            theme: sagaInput.theme || 'adventure',
            role: newMissionState.roleAndObjective,
            completedTask: newObjectives[objectiveIndex].missionTask,
            isFinal: true,
          }, language)
            .then(final => {
              if (isMountedRef.current) setFinalFeedback({ content: final, isLoading: false });
            })
            .catch(() => {
              if (isMountedRef.current) {
                setFinalFeedback({
                  content: { id: 'fallback', title: t('fallbackFeedback', language).title, message: t('fallbackFeedback', language).message },
                  isLoading: false
                });
              }
            });
        }
      }
      return newMissionState;
    });
  }, [sagaInput, language, completedFeats]); // Added completedFeats to dependency array as it is used in saveSagaToHistory inside the callback? Wait, saveSagaToHistory uses the CURRENT completedFeats from closure?
  // Actually, toggleObjective's closure captures `completedFeats` from when it was created.
  // If I add completedFeats to dependencies, toggleObjective will be recreated every time completedFeats changes.
  // However, saving to history uses `completedFeats`. If I don't include it, it uses stale `completedFeats`.
  // It's safer to include it.

  const returnToEdit = () => setMission(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => { if (isMountedRef.current) setToast(null); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return {
    sagaInput,
    setSagaInput,
    mission,
    isLoading,
    isRestoring, // Exported
    isImageLoading,
    loadingMessage,
    error,
    backgroundImage,
    backgroundOpacity,
    toast,
    setToast,
    completedFeats,
    finalFeedback,
    setFinalFeedback,
    timerState,
    updateTimerState,
    timerIsOnBreak: timerState.isOnBreak,
    actions: {
      generateMission,
      clearAll,
      toggleObjective,
      returnToEdit
    }
  };
};