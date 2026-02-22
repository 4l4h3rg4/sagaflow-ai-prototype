import React from 'react';
import { t } from '../lib/i18n';

interface MissionTimerProps {
    isActive: boolean;
    language: 'en' | 'es';
    onBreakStart: () => void;
    onBreakEnd: () => void;
    timerState: {
        totalSeconds: number;
        remainingSeconds: number;
        isRunning: boolean;
        isOnBreak: boolean;
        breakRemaining: number;
    };
    onTimerStateChange: (newState: any) => void;
}

const MissionTimer: React.FC<MissionTimerProps> = ({
    isActive,
    language,
    onBreakStart,
    onBreakEnd,
    timerState,
    onTimerStateChange,
}) => {
    if (!isActive) return null;

    const { totalSeconds, remainingSeconds, isRunning, isOnBreak, breakRemaining } = timerState;

    const handleExtend = () => {
        onTimerStateChange({
            ...timerState,
            totalSeconds: totalSeconds + 300,
            remainingSeconds: remainingSeconds + 300,
        });
    };

    const handleBreak = () => {
        if (isOnBreak) return;
        onBreakStart();
        onTimerStateChange({
            ...timerState,
            isOnBreak: true,
            breakRemaining: 300,
        });
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(Math.max(0, seconds) / 60);
        const s = Math.floor(Math.max(0, seconds) % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isCompleted = remainingSeconds <= 0 && totalSeconds > 0;

    const progressPercent = isCompleted
        ? 100
        : Math.min(100, Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));

    let barColorClass = "bg-[var(--color-accent)]";
    if (isCompleted) {
        barColorClass = "bg-green-500/80";
    } else if (isOnBreak) {
        barColorClass = "bg-amber-500/80";
    }

    return (
        <div className="bg-[var(--color-card-bg)]/80 rounded-2xl p-4 sm:p-6 ring-1 ring-white/5 mb-8 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col items-center">
                {isCompleted ? (
                    <div className="text-xl sm:text-2xl font-display font-bold text-green-400 mb-3 text-center">
                        {t('timer.sessionComplete', language)}
                    </div>
                ) : isOnBreak ? (
                    <div className="text-xl sm:text-2xl font-display font-bold text-amber-400 mb-3 text-center">
                        {t('timer.resting', language).replace('MM:SS', formatTime(breakRemaining))}
                    </div>
                ) : (
                    <div className="text-4xl sm:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-4 drop-shadow-md tracking-wider">
                        {formatTime(remainingSeconds)}
                    </div>
                )}

                <div className="w-full h-4 sm:h-5 bg-[var(--color-input-bg)] rounded-full overflow-hidden mb-5 sm:mb-6 ring-1 ring-white/5 shadow-inner">
                    <div
                        className={`h-full ${barColorClass} transition-all duration-1000 ease-linear motion-reduce:transition-none`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {!isCompleted && (
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        <button
                            onClick={handleExtend}
                            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[var(--color-input-bg)]/50 hover:bg-[var(--color-accent)]/20 text-[var(--color-text-primary)] hover:text-white ring-1 ring-white/5 hover:ring-[var(--color-accent)]/50 transition-all active:scale-95 text-sm sm:text-base font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-accent)]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            {t('timer.extendJourney', language)}
                        </button>
                        <button
                            onClick={handleBreak}
                            disabled={isOnBreak}
                            className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl ring-1 transition-all active:scale-95 text-sm sm:text-base font-medium ${isOnBreak
                                    ? 'bg-amber-500/20 text-amber-500/50 ring-amber-500/20 cursor-not-allowed'
                                    : 'bg-[var(--color-input-bg)]/50 hover:bg-amber-500/20 text-[var(--color-text-primary)] hover:text-amber-500 ring-white/5 hover:ring-amber-500/50'
                                }`}
                        >
                            <span className="text-lg">🔥</span>
                            {t('timer.campfireRest', language)}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionTimer;
