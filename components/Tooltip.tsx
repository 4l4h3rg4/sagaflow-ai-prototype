
import React, { ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top', className = '' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={`group relative flex items-center justify-center ${className}`}>
      {children}
      <div className={`absolute ${positionClasses[position]} pointer-events-none px-2 py-1 bg-[var(--color-card-bg)] text-[var(--color-text-primary)] text-xs font-medium rounded-md border border-[var(--color-accent)]/30 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-105 z-[60] whitespace-nowrap backdrop-blur-md`}>
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
