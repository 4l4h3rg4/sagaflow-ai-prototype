import React from 'react';
import type { SagaInput } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import SparklesIcon from './icons/SparklesIcon';
import GripVerticalIcon from './icons/GripVerticalIcon';
import { t } from '../lib/i18n';
import { InspirationEngine } from '../lib/inspirationEngine';

interface InputSectionProps {
  sagaInput: SagaInput;
  setSagaInput: React.Dispatch<React.SetStateAction<SagaInput>>;
  onGenerate: () => void;
  isLoading: boolean;
  onClear: () => void;
  language: 'en' | 'es';
  placeholders: {
    theme: string;
    task: string;
    role: string;
    rule: string;
  };
}

const InputSection: React.FC<InputSectionProps> = ({ sagaInput, setSagaInput, onGenerate, isLoading, onClear, language, placeholders }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSagaInput(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (listName: 'tasks' | 'constraints', index: number, value: string) => {
    const newList = [...sagaInput[listName]];
    newList[index] = value;
    setSagaInput(prev => ({ ...prev, [listName]: newList }));
  };

  const addListItem = (listName: 'tasks' | 'constraints') => {
    if (navigator.vibrate) navigator.vibrate(10);
    setSagaInput(prev => ({ ...prev, [listName]: [...prev[listName], ''] }));
  };

  const removeListItem = (listName: 'tasks' | 'constraints', index: number) => {
    if (navigator.vibrate) navigator.vibrate(10);
    const newList = sagaInput[listName].filter((_, i) => i !== index);
    if (newList.length === 0) {
      setSagaInput(prev => ({ ...prev, [listName]: [''] }));
    } else {
      setSagaInput(prev => ({ ...prev, [listName]: newList }));
    }
  };

  const handleInspireMe = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    // Delegate logic to the engine (SRP)
    const newValues = InspirationEngine.inspire(sagaInput, language);
    setSagaInput(newValues);
  };

  const dragTask = React.useRef<number | null>(null);
  const draggedOverTask = React.useRef<number | null>(null);
  
  const handleSortTasks = () => {
    if (dragTask.current === null || draggedOverTask.current === null || dragTask.current === draggedOverTask.current) return;
    if (navigator.vibrate) navigator.vibrate(5);
    const tasksCopy = [...sagaInput.tasks];
    const [reorderedItem] = tasksCopy.splice(dragTask.current, 1);
    tasksCopy.splice(draggedOverTask.current, 0, reorderedItem);
    setSagaInput(prev => ({ ...prev, tasks: tasksCopy }));
    dragTask.current = null;
    draggedOverTask.current = null;
  };
  
  const dragConstraint = React.useRef<number | null>(null);
  const draggedOverConstraint = React.useRef<number | null>(null);
  
  const handleSortConstraints = () => {
    if (dragConstraint.current === null || draggedOverConstraint.current === null || dragConstraint.current === draggedOverConstraint.current) return;
    if (navigator.vibrate) navigator.vibrate(5);
    const constraintsCopy = [...sagaInput.constraints];
    const [reorderedItem] = constraintsCopy.splice(dragConstraint.current, 1);
    constraintsCopy.splice(draggedOverConstraint.current, 0, reorderedItem);
    setSagaInput(prev => ({ ...prev, constraints: constraintsCopy }));
    dragConstraint.current = null;
    draggedOverConstraint.current = null;
  };

  return (
    <div className="bg-[var(--color-card-bg)] backdrop-blur-[40px] p-4 sm:p-10 rounded-[24px] sm:rounded-[40px] ring-1 ring-white/5 shadow-2xl relative overflow-visible pb-40 sm:pb-12 transition-all duration-500">
      
      {/* Visual Accents */}
      <div className="absolute inset-0 rounded-[24px] sm:rounded-[40px] pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-30 overflow-hidden rounded-t-[40px]"></div>
      
      {/* Top Actions */}
      <div className="flex justify-end mb-2">
          <button
            id="tour-inspire"
            onClick={handleInspireMe}
            className="flex items-center gap-2 px-4 py-3 sm:py-2 rounded-full bg-white/5 hover:bg-[var(--color-accent)]/20 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20 hover:ring-[var(--color-accent)] transition-all duration-300 text-xs sm:text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm group active:scale-95"
          >
            <SparklesIcon />
            <span className="group-hover:text-[var(--color-text-primary)] transition-colors">{t('inputSection.inspireMe', language)}</span>
          </button>
      </div>

      {/* 01: Theme */}
      <div id="tour-theme" className="relative space-y-6 mb-8">
        <div className="group relative transition-all duration-500">
            <label htmlFor="theme" className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.3em] mb-2 ml-1 opacity-70">
                01 // {t('inputSection.themeLabel', language)}
            </label>
            <div className="relative">
              <input
                  type="text"
                  id="theme"
                  name="theme"
                  value={sagaInput.theme}
                  onChange={handleInputChange}
                  placeholder={placeholders.theme}
                  className="w-full bg-transparent border-none text-[var(--color-text-primary)] px-1 py-2 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight focus:ring-0 transition-all placeholder:text-[var(--color-text-muted)]/20 placeholder:font-normal outline-none drop-shadow-sm"
                  autoComplete="off"
                  enterKeyHint="next"
              />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-border)] opacity-20"></div>
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-[var(--color-accent)] to-pink-400 transition-all duration-700 ease-out group-focus-within:w-full shadow-[0_0_15px_var(--color-accent)] opacity-70"></div>
            </div>
        </div>
      </div>

      {/* 02: Role */}
      <div id="tour-hero" className="group relative mb-10">
        <div className="flex items-center justify-between mb-2 pl-1">
            <label htmlFor="prompt" className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.3em] opacity-70">
                02 // {t('inputSection.roleLabel', language)}
            </label>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]/40">
                {t('inputSection.optional', language)}
            </span>
        </div>
        <div className="relative">
             <input
                type="text"
                id="prompt"
                name="prompt"
                value={sagaInput.prompt}
                onChange={handleInputChange}
                placeholder={placeholders.role}
                className="w-full bg-transparent border-none text-[var(--color-text-primary)] px-1 py-3 text-xl sm:text-3xl font-bold tracking-wide focus:ring-0 transition-all placeholder:text-[var(--color-text-muted)]/20 placeholder:font-normal outline-none"
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-border)] opacity-20"></div>
            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-[var(--color-accent)] via-purple-400 to-transparent transition-all duration-700 ease-out group-focus-within:w-full opacity-70"></div>
        </div>
      </div>

      {/* 03: Tasks */}
      <div id="tour-tasks" className="space-y-6 mb-10">
        <div className="flex items-center justify-between px-1">
            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.3em] opacity-70">
                03 // {t('inputSection.tasksLabel', language)}
            </label>
            <span className="text-[9px] font-bold text-[var(--color-text-primary)] bg-[var(--color-input-bg)] px-2 py-0.5 rounded-full ring-1 ring-white/10 backdrop-blur-sm shadow-sm">
                {sagaInput.tasks.filter(t => t.trim()).length} {t('inputSection.active', language)}
            </span>
        </div>

        <div className="space-y-4 sm:space-y-4">
          {sagaInput.tasks.map((task, index) => (
            <div 
              key={`task-${index}`}
              className="group flex items-center gap-2 sm:gap-3 relative transition-all duration-300"
              draggable
              onDragStart={() => (dragTask.current = index)}
              onDragEnter={() => (draggedOverTask.current = index)}
              onDragEnd={handleSortTasks}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex-grow relative flex items-center bg-[var(--color-input-bg)] hover:bg-[var(--color-card-bg)] rounded-2xl transition-all duration-300 shadow-sm group-focus-within:ring-1 group-focus-within:ring-[var(--color-accent)]/30 group-focus-within:bg-[var(--color-card-bg)]">
                  <div className="pl-3 sm:pl-4 pr-1 text-xs font-bold text-[var(--color-text-muted)]/50 select-none font-mono hidden xs:block">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleListChange('tasks', index, e.target.value)}
                    placeholder={placeholders.task}
                    className="w-full bg-transparent border-none text-[var(--color-text-primary)] py-4 sm:py-4 focus:ring-0 placeholder:text-[var(--color-text-muted)]/30 font-medium min-h-[60px] sm:min-h-[56px] text-[17px] sm:text-base leading-tight" 
                  />
                  <div className="flex pr-3 opacity-30 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 items-center cursor-grab active:cursor-grabbing text-[var(--color-text-muted)] hover:text-[var(--color-accent)]">
                       <GripVerticalIcon />
                  </div>
              </div>

              <div className="flex-shrink-0 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  <button 
                      onClick={() => removeListItem('tasks', index)} 
                      className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] bg-[var(--color-input-bg)] sm:bg-transparent rounded-full active:scale-95 transition-all hover:bg-[var(--color-destructive)]/10"
                      aria-label="Remove task"
                  >
                    <TrashIcon />
                  </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-1">
            <button 
                onClick={() => addListItem('tasks')} 
                className="group flex items-center justify-center gap-2 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all duration-300 py-4 sm:py-3 px-4 rounded-xl border border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/5 w-full active:scale-[0.98]"
            >
              <span className="text-[var(--color-accent)] group-hover:rotate-90 transition-transform duration-300"><PlusIcon /></span> 
              {t('inputSection.addTask', language)}
            </button>
        </div>
      </div>
      
      {/* 04: Rules */}
      <div id="tour-rules" className="pt-2">
         <div className="flex items-center justify-between px-1 mb-4">
             <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.3em] opacity-70">
                04 // {t('inputSection.rulesLabel', language)}
            </label>
         </div>
            
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sagaInput.constraints.map((constraint, index) => (
                <div 
                key={`constraint-${index}`} 
                className="group/rule flex items-center gap-2 relative bg-[var(--color-input-bg)]/30 rounded-lg p-1 pr-2 hover:bg-[var(--color-input-bg)] transition-all border border-transparent hover:border-[var(--color-border)]"
                draggable
                onDragStart={() => (dragConstraint.current = index)}
                onDragEnter={() => (draggedOverConstraint.current = index)}
                onDragEnd={handleSortConstraints}
                onDragOver={(e) => e.preventDefault()}
                >
                    <div className="pl-3 pr-1 flex items-center justify-center">
                         <div className="w-1.5 h-1.5 rotate-45 bg-[var(--color-accent)] rounded-[1px] shadow-[0_0_8px_var(--color-accent)] opacity-70 group-hover/rule:opacity-100 transition-opacity"></div>
                    </div>
                    <input
                        type="text"
                        value={constraint}
                        onChange={(e) => handleListChange('constraints', index, e.target.value)}
                        placeholder={placeholders.rule}
                        className="flex-grow bg-transparent border-none text-[var(--color-text-secondary)] px-2 py-3 sm:py-2 text-[16px] sm:text-sm transition-colors focus:ring-0 placeholder:text-[var(--color-text-muted)]/30 font-medium"
                    />
                    <button 
                        onClick={() => removeListItem('constraints', index)} 
                        className="w-10 h-10 sm:w-6 sm:h-6 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] transition-all rounded-full hover:bg-[var(--color-card-bg)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
            
            <button 
                onClick={() => addListItem('constraints')} 
                className="flex items-center justify-center gap-2 text-xs text-[var(--color-accent)] hover:text-[var(--color-text-primary)] px-3 py-3 rounded-lg border border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all font-medium h-full min-h-[48px] sm:min-h-[44px]"
            >
                <PlusIcon /> {t('inputSection.addRule', language)}
            </button>
        </div>
      </div>

      {/* Generate Button (Sticky Mobile) */}
      <div className="fixed bottom-0 left-0 w-full p-4 pb-safe pt-12 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent backdrop-blur-md sm:static sm:bg-none sm:p-0 sm:pt-12 z-40 transition-all duration-300 sm:backdrop-blur-none pointer-events-none sm:pointer-events-auto">
        <button
          id="tour-generate"
          onClick={() => {
              if (!isLoading) {
                  if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
                  onGenerate();
              }
          }}
          disabled={isLoading}
          className="w-full pointer-events-auto relative overflow-hidden group bg-gradient-to-r from-[var(--color-button-gradient-from)] to-[var(--color-button-gradient-to)] text-white font-display font-bold text-lg py-4 sm:py-5 px-6 rounded-2xl shadow-[0_8px_25px_-5px_rgba(var(--color-accent-rgb),0.5)] hover:shadow-[0_15px_40px_-5px_rgba(124,58,237,0.6)] transition-all duration-500 ease-out disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:scale-[1.01] ring-1 ring-white/20 active:scale-[0.98]"
        >
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500"></div>
          <span className="relative z-10 flex items-center justify-center gap-3">
            <SparklesIcon />
            <span className="tracking-[0.2em]">{isLoading ? t('inputSection.generateButtonLoading', language) : t('inputSection.generateButton', language)}</span>
            <SparklesIcon />
          </span>
        </button>
      </div>
      <style>{`
        @keyframes shine { 100% { left: 125%; } }
        .group-hover\\:animate-shine { animation: shine 1s; }
      `}</style>
    </div>
  );
};

export default InputSection;