import React, { useEffect, useRef } from 'react';
import { t } from '../lib/i18n';
import LoadingSpinner from './icons/LoadingSpinner';

export interface MicroGoals {
    step1: string;
    step2: string;
    step3: string;
}

interface CheckInPopupProps {
    isVisible: boolean;
    checkInMessage: string | null;
    isLoadingMicroGoals: boolean;
    microGoals: MicroGoals | null;
    language: 'en' | 'es';
    onDismiss: () => void;
    onBlocked: () => void;
    onBreak: () => void;
    onAcceptMicroGoals: (goals: MicroGoals) => void;
}

const CheckInPopup: React.FC<CheckInPopupProps> = ({
    isVisible,
    checkInMessage,
    isLoadingMicroGoals,
    microGoals,
    language,
    onDismiss,
    onBlocked,
    onBreak,
    onAcceptMicroGoals,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkin-title"
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className="relative mx-4 w-full max-w-md animate-fade-in outline-none scale-95 origin-center transform transition-transform duration-300"
                style={{ transform: 'scale(1)' }}
            >
                <div className="bg-[var(--color-card-bg)]/95 backdrop-blur-2xl ring-1 ring-white/10 rounded-2xl overflow-hidden shadow-2xl relative">

                    {/* Top magic border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)]"></div>

                    <div className="p-6">

                        {/* INITIAL STATE */}
                        {!isLoadingMicroGoals && !microGoals && checkInMessage && (
                            <div className="animate-fade-in">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 id="checkin-title" className="text-center text-lg md:text-xl font-display font-medium text-[var(--color-text-primary)] mb-6 leading-relaxed italic">
                                    "{checkInMessage}"
                                </h3>

                                <div className="space-y-3">
                                    <button
                                        onClick={onDismiss}
                                        className="w-full relative flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 text-[var(--color-text-primary)] font-medium transition-all group ring-1 ring-[var(--color-accent)]/30 hover:ring-[var(--color-accent)]/60"
                                    >
                                        <span>⚔️</span>
                                        <span>{t('checkIn.keepGoing', language)}</span>
                                    </button>

                                    <button
                                        onClick={onBlocked}
                                        className="w-full relative flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-200 font-medium transition-all group ring-1 ring-orange-500/30 hover:ring-orange-500/60"
                                    >
                                        <span>🔗</span>
                                        <span>{t('checkIn.blocked', language)}</span>
                                    </button>

                                    <button
                                        onClick={onBreak}
                                        className="w-full relative flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 font-medium transition-all group ring-1 ring-blue-500/30 hover:ring-blue-500/60"
                                    >
                                        <span>🏕️</span>
                                        <span>{t('checkIn.needBreak', language)}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* LOADING MICRO-GOALS STATE */}
                        {isLoadingMicroGoals && (
                            <div className="py-8 flex flex-col items-center justify-center animate-fade-in min-h-[220px]">
                                <div className="w-12 h-12 flex items-center justify-center mb-6">
                                    <LoadingSpinner />
                                </div>
                                <p className="text-center font-medium text-[var(--color-accent)] text-lg animate-pulse">
                                    {t('checkIn.consultingMap', language)}
                                </p>
                            </div>
                        )}

                        {/* MICRO-GOALS READY STATE */}
                        {!isLoadingMicroGoals && microGoals && (
                            <div className="animate-fade-in">

                                <h3 id="checkin-title" className="text-center text-xl font-display font-medium text-[var(--color-text-primary)] mb-6 mt-4">
                                    {t('checkIn.acceptRoute', language)}
                                </h3>

                                <div className="space-y-4 mb-8">
                                    {[microGoals.step1, microGoals.step2, microGoals.step3].map((step, idx) => (
                                        <div key={idx} className="flex gap-3 items-start bg-[var(--color-bg)]/50 p-3 rounded-lg ring-1 ring-white/5">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] flex items-center justify-center text-xs font-bold ring-1 ring-[var(--color-accent)]/40 mt-0.5">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => onAcceptMicroGoals(microGoals)}
                                        className="w-full py-3 px-4 rounded-xl bg-[var(--color-primary)] text-white font-bold shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/40 transition-all active:scale-[0.98]"
                                    >
                                        {t('checkIn.acceptRoute', language)}
                                    </button>
                                    <button
                                        onClick={onDismiss}
                                        className="w-full py-3 px-4 rounded-xl relative flex items-center justify-center gap-2 text-[var(--color-text-secondary)] font-medium transition-all hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)]"
                                    >
                                        {t('checkIn.keepOriginal', language)}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckInPopup;
