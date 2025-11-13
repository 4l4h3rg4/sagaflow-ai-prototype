
import React from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose }) => {
  return (
    <div 
      className="fixed top-5 right-5 z-50 flex items-center w-full max-w-xs p-4 text-[var(--color-text-secondary)] bg-[var(--color-card-bg)] rounded-lg shadow-lg border border-green-500/30"
      role="alert"
      style={{ animation: 'toast-in-right 0.5s ease-out forwards, toast-out-right 0.5s ease-in 2.5s forwards' }}
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-400 bg-green-900/50 rounded-lg">
        <CheckCircleIcon />
      </div>
      <div className="ml-3 text-sm font-semibold">{message}</div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-border)] p-1.5 hover:bg-[var(--color-input-bg)] inline-flex h-8 w-8"
        aria-label="Close"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
      <style>{`
        @keyframes toast-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toast-out-right {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ToastNotification;
