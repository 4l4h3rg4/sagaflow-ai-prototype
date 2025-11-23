
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { t } from '../lib/i18n';
import TerminalIcon from './icons/TerminalIcon';

interface TutorialOverlayProps {
  isActive: boolean;
  onClose: () => void;
  language: 'en' | 'es';
  type?: 'onboarding' | 'mission';
}

interface SocialLink {
  label: string;
  url: string;
  type?: string;
}

interface Step {
  targetId: string | null;
  title: string;
  content: string;
  emoji?: string;
  image?: string;
  socialLinks?: SocialLink[];
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isActive, onClose, language, type = 'onboarding' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [imgError, setImgError] = useState(false); // State to track image loading errors
  const rafRef = useRef<number | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Memoize steps to prevent recalculation errors
  const steps: Step[] = useMemo(() => {
      try {
        let rawSteps;
        let targets: (string | null)[] = [];

        if (type === 'onboarding') {
            rawSteps = (t('tutorial.onboardingSteps', language) as unknown as any[]);
            // Mapped to: Welcome, Inspire, Theme, Hero, Tasks, Rules, Generate
            targets = [null, 'tour-inspire', 'tour-theme', 'tour-hero', 'tour-tasks', 'tour-rules', 'tour-generate'];
        } else {
            rawSteps = (t('tutorial.missionSteps', language) as unknown as any[]);
            // Mapped to: Scenario, Narrator, Objectives, FeatsLog, Back
            targets = ['tour-mission-scenario', 'tour-mission-narrate', 'tour-mission-objectives', 'tour-feats', 'tour-mission-back'];
        }
        
        if (!rawSteps || !Array.isArray(rawSteps)) return [];

        return rawSteps.map((step, index) => ({
            title: step.title,
            content: step.content,
            emoji: step.emoji,
            image: step.image,
            socialLinks: step.socialLinks,
            targetId: targets[index] || null
        }));
      } catch (e) {
        console.error("Error generating tutorial steps", e);
        return [];
      }

  }, [language, type]);

  useEffect(() => {
    if (!isActive) return;
    setCurrentStep(0);
    setImgError(false); // Reset image error state when tutorial starts
    if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 640);
    }
  }, [isActive, type]);

  // Reset image error when step changes
  useEffect(() => {
      setImgError(false);
  }, [currentStep]);

  useEffect(() => {
    // Safety check: ensure window exists and we are active
    if (!isActive || steps.length === 0 || typeof window === 'undefined') return;

    const updateLayout = () => {
      if (!isActive) return;

      setIsMobile(window.innerWidth < 640);
      
      try {
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
      } catch (e) {
        setTargetRect(null);
      }
    };

    const handleResize = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updateLayout);
    };

    try {
        observerRef.current = new ResizeObserver(() => {
            try {
                handleResize();
            } catch (err) {
                // Ignore external errors inside the observer callback
            }
        });
        if (document.body) {
            observerRef.current.observe(document.body);
        }
    } catch (e) {
        window.addEventListener('resize', handleResize);
    }
    
    window.addEventListener('scroll', handleResize, true);

    handleResize();
    const timer = setTimeout(handleResize, 500);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (observerRef.current) {
          observerRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isActive, currentStep, steps]);

  if (!isActive) return null;
  const stepData = steps?.[currentStep];
  if (!stepData) return null;

  const handleNext = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
      if (navigator.vibrate) navigator.vibrate(10);
      onClose();
  };

  const isLastStep = currentStep === steps.length - 1;
  const isWelcomeStep = currentStep === 0 && type === 'onboarding'; 

  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: isWelcomeStep ? '95vw' : '90vw',
    maxWidth: isWelcomeStep ? '480px' : '400px',
    zIndex: 101,
  };

  if (targetRect && !isMobile && !isWelcomeStep) {
    const spaceBelow = window.innerHeight - (targetRect.y + targetRect.height);
    const placeBelow = spaceBelow > 220;

    tooltipStyle = {
      position: 'absolute',
      left: targetRect.x + targetRect.width - 400 > 0 ? (targetRect.x > window.innerWidth - 420 ? window.innerWidth - 420 : targetRect.x) : 20,
      top: placeBelow ? targetRect.y + targetRect.height + 20 : targetRect.y - 20 - 200,
      width: '400px',
      maxWidth: '90vw',
      transform: 'none',
      zIndex: 101,
    };
    
    if (parseInt(tooltipStyle.top as string) < 10) tooltipStyle.top = 10;
    if (parseInt(tooltipStyle.left as string) < 10) tooltipStyle.left = 10;
  }

  // Helper to parse welcome message parts
  const welcomeParts = isWelcomeStep ? stepData.content.split('|||') : [];
  
  // Decide whether to show image or fallback emoji
  const showImage = stepData.image && !imgError;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden font-sans">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <defs>
                <mask id="tutorial-mask" x="0" y="0" width="100%" height="100%">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    {targetRect && !isWelcomeStep && (
                         <rect 
                         x={targetRect.x - 5} 
                         y={targetRect.y - 5} 
                         width={targetRect.width + 10} 
                         height={targetRect.height + 10} 
                         rx="8" 
                         fill={isMobile ? "white" : "black"} 
                         className="transition-all duration-300 ease-in-out"
                       />
                    )}
                </mask>
                {/* Dot Pattern for Background */}
                <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)" />
                </pattern>
            </defs>
            <rect 
                x="0" y="0" width="100%" height="100%" 
                fill={isWelcomeStep ? "rgba(5, 5, 15, 0.85)" : "rgba(0,0,0,0.7)"} 
                mask={isMobile || isWelcomeStep ? undefined : "url(#tutorial-mask)"} 
                className="transition-all duration-1000"
            />
            
            {targetRect && !isMobile && !isWelcomeStep && (
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
            @keyframes float-gentle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            .animate-float-gentle { animation: float-gentle 4s ease-in-out infinite; }
            
            @keyframes pop-in-elastic {
                0% { opacity: 0; transform: translate(-50%, -40%) scale(0.8); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            .animate-pop-in {
                animation: pop-in-elastic 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            
            .pattern-dots {
                background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
                background-size: 12px 12px;
            }
        `}</style>

        {/* Content Card */}
        <div 
            style={tooltipStyle}
            className={`transition-all duration-500 flex flex-col ${
                isWelcomeStep 
                ? 'animate-pop-in' 
                : 'rounded-2xl animate-fade-in-fast'
            }`}
        >
            {isWelcomeStep ? (
                /* --- SAGA DOSSIER / GAMIFIED MODAL (Step 0) --- */
                <div className="relative flex flex-col group">
                    
                    {/* MAIN BODY - Rounded Container with Glassmorphism */}
                    <div className="relative z-10 bg-[#0F0B18] bg-opacity-95 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                        
                        {/* Subtle Top Gradient Accent instead of Tab */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60"></div>

                        {/* Inner Content with Dot Pattern */}
                        <div className="p-8 sm:p-10 pattern-dots relative">
                            
                            {/* Hero Icon Area (Mascot) */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[var(--color-accent)]/30 blur-[60px] rounded-full animate-pulse-slow"></div>
                                    {showImage ? (
                                        <img 
                                            src={stepData.image} 
                                            alt="SagaFlow Mascot" 
                                            onError={() => setImgError(true)}
                                            loading="eager"
                                            draggable={false}
                                            className="w-48 h-auto object-contain animate-float-gentle relative z-10 drop-shadow-[0_0_35px_rgba(168,85,247,0.5)] select-none"
                                        />
                                    ) : (
                                        <div className="text-7xl sm:text-8xl animate-float-gentle relative z-10 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
                                            {stepData.emoji}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Text Hierarchy */}
                            <div className="text-center mb-8">
                                {/* 1. Window Title (Small/Top) */}
                                {welcomeParts[0] && (
                                    <p className="font-display font-bold text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 opacity-80">
                                        {welcomeParts[0]}
                                    </p>
                                )}

                                {/* 2. Hook (Big Headline) */}
                                {welcomeParts[1] && (
                                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white leading-tight tracking-tight drop-shadow-sm mb-4">
                                        {welcomeParts[1]}
                                    </h2>
                                )}
                                
                                {/* 3. Body (Standard) with Specific Hierarchy */}
                                {welcomeParts[2] && (
                                    <div className="font-sans px-2">
                                        {welcomeParts[2].split('\n').map((line, i) => {
                                            const isFirstLine = i === 0;
                                            return (
                                                <p key={i} className={`leading-relaxed text-pretty ${
                                                    isFirstLine 
                                                        ? 'font-display font-bold text-lg sm:text-xl text-[var(--color-text-primary)] mb-3 drop-shadow-sm tracking-tight' 
                                                        : 'text-[var(--color-text-secondary)] text-sm sm:text-base font-medium opacity-70 italic'
                                                }`}>
                                                    {line.split('*').map((part, j) => 
                                                        j % 2 === 1 ? <span key={j} className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-pink-500 font-extrabold not-italic">{part}</span> : part
                                                    )}
                                                </p>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* ACTION AREA (Gamified Buttons) */}
                            <div className="space-y-6">
                                
                                {/* Secondary Actions (Socials) - 2 Columns */}
                                {stepData.socialLinks && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {stepData.socialLinks.map((link, idx) => (
                                            <a 
                                                key={idx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center justify-center py-3 px-2 bg-[var(--color-card-bg)] hover:bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl transition-all duration-200 active:scale-95 hover:border-[var(--color-accent)]/50 group/btn shadow-md"
                                            >
                                                <span className="text-xl mb-1 filter drop-shadow-sm group-hover/btn:scale-110 transition-transform">
                                                    {link.label.toLowerCase().includes('instagram') ? '📸' : '✨'}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] group-hover/btn:text-[var(--color-accent)]">
                                                    {link.label.split(' ')[0]}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                                
                                {/* 4. Footer (Disclaimer) - Ethereal Glow */}
                                {welcomeParts[3] && (
                                    <p className="text-[10px] sm:text-xs text-center font-medium font-display uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-text-muted)] via-[var(--color-accent)] to-[var(--color-text-muted)] drop-shadow-[0_0_8px_rgba(124,58,237,0.2)] animate-pulse-slow">
                                        {welcomeParts[3]}
                                    </p>
                                )}

                                {/* Primary Action (The "Confirm" Button) */}
                                <button 
                                    onClick={handleNext}
                                    className="w-full relative overflow-hidden bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-strong)] border-t border-white/20 border-b-4 border-[var(--color-button-gradient-to)] rounded-2xl py-4 shadow-[0_10px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_25px_rgba(124,58,237,0.4)] active:border-b-0 active:translate-y-1 transition-all duration-150 group"
                                >
                                    <span className="font-display font-bold text-white text-lg tracking-[0.1em] uppercase flex items-center justify-center gap-2">
                                        {t('tutorial.next', language)} 
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                    </span>
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                /* --- POP GLASS GUIDE (Steps 1+) - Kept Clean & Contextual --- */
                <div className="bg-[var(--color-card-bg)]/95 backdrop-blur-xl border border-[var(--color-border)] p-6 rounded-2xl shadow-2xl text-[var(--color-text-primary)] relative overflow-hidden ring-1 ring-white/10">
                     <div className="relative z-10 flex items-start gap-4 mb-4">
                        {stepData.emoji && (
                            <div className="text-4xl filter drop-shadow-lg animate-bounce-slow shrink-0">{stepData.emoji}</div>
                        )}
                        <div>
                            <h3 className="font-display text-xl font-bold mb-2 text-[var(--color-accent)] leading-tight">{stepData.title}</h3>
                            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed font-medium">{stepData.content}</p>
                        </div>
                     </div>
                    
                    <div className="relative z-10 flex justify-between items-center mt-6 pt-4 border-t border-[var(--color-border)]/30">
                        <div className="flex gap-1.5">
                            {steps.map((_, idx) => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-[var(--color-accent-strong)]' : 'w-1.5 bg-[var(--color-border)]'}`} />
                            ))}
                        </div>
                        <div className="flex gap-3">
                            {!isLastStep && (
                                <button 
                                    onClick={handleSkip}
                                    className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-2 py-1 transition-colors uppercase tracking-wider"
                                >
                                    {t('tutorial.skip', language)}
                                </button>
                            )}
                            <button 
                                onClick={handleNext}
                                className="gradient-button text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-transform transform active:scale-95"
                            >
                                {isLastStep ? t('tutorial.finish', language) : t('tutorial.next', language)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <style>{`
            .animate-bounce-slow { animation: bounce 3s infinite; }
        `}</style>
    </div>
  );
};

export default TutorialOverlay;
