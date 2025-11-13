
import React from 'react';
import type { Feedback } from '../types';
import LoadingSpinner from './icons/LoadingSpinner';
import { t } from '../lib/i18n';

interface FeedbackModalProps {
  feedback: Feedback | null;
  isLoading: boolean;
  onClose: () => void;
  language: 'en' | 'es';
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ feedback, isLoading, onClose, language }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-accent)]/50 shadow-2xl shadow-[var(--color-accent-strong)]/20 w-full max-w-md m-4 transform transition-all duration-300 ease-out animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          {isLoading ? (
            <>
              <div className="flex justify-center mb-4">
                <LoadingSpinner />
              </div>
              <h2 className="font-cinzel text-2xl font-bold text-[var(--color-text-secondary)]">{t('feedbackModal.loadingTitle', language)}</h2>
              <p className="text-[var(--color-text-muted)] mt-2">{t('feedbackModal.loadingBody', language)}</p>
            </>
          ) : feedback ? (
            <>
              <h2 className="font-cinzel text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-red-400 mb-4">
                {feedback.title}
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-4 leading-relaxed">{feedback.message}</p>

              <button
                onClick={onClose}
                className="mt-8 bg-[var(--color-accent-strong)] text-white font-bold py-2 px-8 rounded-md hover:bg-[var(--color-accent-hover)] transition-all transform hover:scale-105"
              >
                {t('feedbackModal.closeButton', language)}
              </button>
            </>
          ) : null}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
