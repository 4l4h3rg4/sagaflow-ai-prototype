
import React from 'react';
import type { Feedback } from '../types';
import { t } from '../lib/i18n';

interface FeatsLogProps {
  feats: Feedback[];
  language: 'en' | 'es';
}

const FeatsLog: React.FC<FeatsLogProps> = ({ feats, language }) => {
  if (feats.length === 0) {
    return null;
  }

  return (
    <div id="tour-feats" className="mt-8 bg-[var(--color-card-bg)] p-6 rounded-lg border border-[var(--color-border)] backdrop-blur-md animate-fade-in-up">
      <h3 className="font-display text-xl font-bold mb-4 text-[var(--color-accent)] border-b border-[var(--color-border)] pb-2">
        {t('featsLog.title', language)}
      </h3>
      <ul className="space-y-4">
        {feats.map((feat) => (
          <li key={feat.id} className="p-4 bg-[var(--color-input-bg)] rounded-md border-l-4 border-[var(--color-accent-strong)]">
            <h4 className="font-semibold text-[var(--color-text-secondary)]">{feat.title}</h4>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">{feat.message}</p>
          </li>
        ))}
      </ul>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FeatsLog;
