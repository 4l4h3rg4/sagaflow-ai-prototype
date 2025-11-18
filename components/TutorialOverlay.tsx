
import React, { useEffect, useState, useMemo } from 'react';
import { t } from '../lib/i18n';

interface TutorialOverlayProps {
  isActive: boolean;
  onClose: () => void;
  language: 'en' | 'es';
}

interface Step {
  targetId: string | null;
  title: string;
  content: string;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isActive, onClose, language }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const steps: Step[] = useMemo(() => {
      const rawSteps = (t('tutorial.steps', language) as unknown as Array<{ title: string, content: string }>);
      
      if (!rawSteps || !Array.isArray(rawSteps)) return [];

      // Step 0: Welcome (No target)
      // Step 1: Theme (#tour-theme)
      // Step 2: Tasks (#tour-tasks)
      // Step 3: Generate (#tour-generate)
      // Step 4: Mission (#tour-mission)
      
      // Safety check to ensure we have enough steps defined in i18n
      if (rawSteps.length < 5) return [];

      return [
          { targetId: null, ...rawSteps[0] },
          { targetId: 'tour-theme', ...rawSteps[1] },
          { targetId: 'tour-tasks', ...rawSteps[2] },
          { targetId: 'tour-generate', ...rawSteps[3] },
          { targetId: 'tour-mission', ...rawSteps[4] },
      ];
  }, [language]);

  useEffect(() => {
    if (!isActive) return;
    // Reset step when opened
    setCurrentStep(0);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || steps.length === 0) return;

    const handleResize = () => {
      const step = steps[currentStep];
      if (step && step.targetId) {
        const element = document.getElementById(step.targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetRect({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
          });
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true); // Capture scroll events

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isActive, currentStep, steps]);

  if (!isActive || steps.length === 0) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const stepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  // Calculate Tooltip Position
  let tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90vw',
    width: '400px',
  };

  if (targetRect) {
    const spaceBelow = window.innerHeight - (targetRect.y + targetRect.height);
    const placeBelow = spaceBelow > 200;

    tooltipStyle = {
      position: 'absolute',
      left: targetRect.x + targetRect.width - 400 > 0 ? (targetRect.x > window.innerWidth - 420 ? window.innerWidth - 420 : targetRect.x) : 20,
      top: placeBelow ? targetRect.y + targetRect.height + 20 : targetRect.y - 10 - 200,
      width: 'min(400px, 90vw)',
      transform: 'none'
    };
    
    // Ensure it doesn't go off-screen top/left
    if (parseInt(tooltipStyle.top as string) < 10) tooltipStyle.top = 10;
    if (parseInt(tooltipStyle.left as string) < 10) tooltipStyle.left = 10;
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
        {/* SVG Overlay/Mask */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <defs>
                <mask id="tutorial-mask" x="0" y="0" width="100%" height="100%">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    {targetRect && (
                         <rect 
                         x={targetRect.x - 5} 
                         y={targetRect.y - 5} 
                         width={targetRect.width + 10} 
                         height={targetRect.height + 10} 
                         rx="8" 
                         fill="black" 
                         className="transition-all duration-300 ease-in-out"
                       />
                    )}
                </mask>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask="url(#tutorial-mask)" />
            
            {/* Optional: Animated border around target */}
            {targetRect && (
                 <rect 
                 x={targetRect.x - 5} 
                 y={targetRect.y - 5} 
                 width={targetRect.width + 10} 
                 height={targetRect.height + 10} 
                 rx="8" 
                 fill="none"
                 stroke="var(--color-accent)"
                 strokeWidth="2"
                 strokeDasharray="10"
                 className="animate-pulse-slow"
               />
            )}
        </svg>

        <style>{`
            .animate-pulse-slow { animation: pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse-border {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
        `}</style>

        {/* Content Card */}
        <div 
            style={tooltipStyle}
            className="bg-[var(--color-card-bg)] backdrop-blur-xl border border-[var(--color-border)] p-6 rounded-xl shadow-2xl text-[var(--color-text-primary)] transition-all duration-300"
        >
            <h3 className="font-cinzel text-xl font-bold mb-2 text-[var(--color-accent)]">{stepData.title}</h3>
            <p className="text-[var(--color-text-secondary)] mb-6 text-sm leading-relaxed">{stepData.content}</p>
            
            <div className="flex justify-between items-center">
                <div className="flex gap-1">
                    {steps.map((_, idx) => (
                        <div key={idx} className={`h-1.5 w-6 rounded-full transition-colors ${idx === currentStep ? 'bg-[var(--color-accent-strong)]' : 'bg-[var(--color-border)]'}`} />
                    ))}
                </div>
                <div className="flex gap-3">
                    {!isLastStep && (
                        <button 
                            onClick={onClose}
                            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-3 py-1 transition-colors"
                        >
                            {t('tutorial.skip', language)}
                        </button>
                    )}
                    <button 
                        onClick={handleNext}
                        className="gradient-button text-white text-sm font-bold py-2 px-6 rounded-md shadow-lg hover:shadow-xl transition-transform transform active:scale-95"
                    >
                        {isLastStep ? t('tutorial.finish', language) : t('tutorial.next', language)}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TutorialOverlay;
