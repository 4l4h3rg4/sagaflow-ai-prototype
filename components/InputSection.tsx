
import React, { useState, useRef, useEffect } from 'react';
import type { SagaInput } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import SparklesIcon from './icons/SparklesIcon';
import GripVerticalIcon from './icons/GripVerticalIcon';
import DiceIcon from './icons/DiceIcon';
import { t } from '../lib/i18n';

type PlaceholderSaga = {
  theme: string;
  task: string;
  role: string;
  rule: string;
};

interface InputSectionProps {
  sagaInput: SagaInput;
  setSagaInput: React.Dispatch<React.SetStateAction<SagaInput>>;
  onGenerate: () => void;
  isLoading: boolean;
  onClear: () => void;
  language: 'en' | 'es';
  placeholders: PlaceholderSaga;
  placeholderSagaList: PlaceholderSaga[];
}

const InputSection: React.FC<InputSectionProps> = ({ sagaInput, setSagaInput, onGenerate, isLoading, onClear, language, placeholders, placeholderSagaList }) => {
  const [showExamples, setShowExamples] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExamples(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setSagaInput(prev => ({ ...prev, [listName]: [...prev[listName], ''] }));
  };

  const removeListItem = (listName: 'tasks' | 'constraints', index: number) => {
    const newList = sagaInput[listName].filter((_, i) => i !== index);
    if (newList.length === 0) {
      setSagaInput(prev => ({ ...prev, [listName]: [''] }));
    } else {
      setSagaInput(prev => ({ ...prev, [listName]: newList }));
    }
  };

  const handleSelectExample = (saga: PlaceholderSaga) => {
    const cleanTheme = saga.theme.replace(/^(e\.g\.|Ej:)\s*/, '');
    const cleanRole = saga.role.replace(/^(e\.g\.|Ej:)\s*/, '');

    setSagaInput(prev => ({
      ...prev,
      theme: cleanTheme,
      prompt: cleanRole,
    }));
    setShowExamples(false);
  };

  const dragTask = React.useRef<number | null>(null);
  const draggedOverTask = React.useRef<number | null>(null);
  
  const handleSortTasks = () => {
    if (dragTask.current === null || draggedOverTask.current === null) return;
    if (dragTask.current === draggedOverTask.current) return;
    
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
    if (dragConstraint.current === null || draggedOverConstraint.current === null) return;
    if (dragConstraint.current === draggedOverConstraint.current) return;
    
    const constraintsCopy = [...sagaInput.constraints];
    const [reorderedItem] = constraintsCopy.splice(dragConstraint.current, 1);
    constraintsCopy.splice(draggedOverConstraint.current, 0, reorderedItem);
    
    setSagaInput(prev => ({ ...prev, constraints: constraintsCopy }));

    dragConstraint.current = null;
    draggedOverConstraint.current = null;
  };

  return (
    <div className="bg-[var(--color-card-bg)] p-6 rounded-lg border border-[var(--color-border)] backdrop-blur-md space-y-6">
      <div id="tour-theme">
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="theme" className="block text-sm font-medium text-[var(--color-accent)] font-cinzel tracking-wide">{t('inputSection.themeLabel', language)}</label>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowExamples(prev => !prev)}
                    className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition rounded-full py-1 px-2 hover:bg-[var(--color-input-bg)]"
                    aria-haspopup="true"
                    aria-expanded={showExamples}
                >
                    <DiceIcon />
                    {t('inputSection.inspireMe', language)}
                </button>
                {showExamples && (
                    <div className="absolute right-0 mt-2 w-72 max-h-60 overflow-y-auto bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md shadow-lg z-10 animate-fade-in-fast">
                         <ul className="py-1" role="menu">
                            {placeholderSagaList.map((saga, index) => (
                                <li key={index} role="presentation">
                                    <button
                                        onClick={() => handleSelectExample(saga)}
                                        className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-strong)]/20 transition-colors"
                                        role="menuitem"
                                    >
                                        <span className="font-semibold block">{saga.theme.replace(/^(e\.g\.|Ej:)\s*/, '')}</span>
                                        <span className="text-xs text-[var(--color-text-muted)]">{saga.role.replace(/^(e\.g\.|Ej:)\s*/, '')}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
        <input
          type="text"
          id="theme"
          name="theme"
          value={sagaInput.theme}
          onChange={handleInputChange}
          placeholder={placeholders.theme}
          className="w-full bg-[var(--color-input-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:border-[var(--color-accent-strong)] transition"
        />
        <style>{`
          @keyframes fade-in-fast {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-fast { animation: fade-in-fast 0.15s ease-out forwards; }
        `}</style>
      </div>

      <div id="tour-tasks">
        <label className="block text-sm font-medium text-[var(--color-accent)] mb-2 font-cinzel tracking-wide">{t('inputSection.tasksLabel', language)}</label>
        <div className="space-y-2">
          {sagaInput.tasks.map((task, index) => (
            <div 
              key={`task-${index}`}
              className="flex items-center gap-2 group"
              draggable
              onDragStart={() => (dragTask.current = index)}
              onDragEnter={() => (draggedOverTask.current = index)}
              onDragEnd={handleSortTasks}
              onDragOver={(e) => e.preventDefault()}
            >
              <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                <GripVerticalIcon />
              </span>
              <input
                type="text"
                value={task}
                onChange={(e) => handleListChange('tasks', index, e.target.value)}
                placeholder={placeholders.task}
                className="flex-grow bg-[var(--color-input-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:border-[var(--color-accent-strong)] transition"
              />
              <button onClick={() => removeListItem('tasks', index)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] transition" aria-label="Remove task">
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => addListItem('tasks')} className="mt-2 flex items-center gap-2 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition">
          <PlusIcon /> {t('inputSection.addTask', language)}
        </button>
      </div>
      
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-[var(--color-accent)] mb-2 font-cinzel tracking-wide">{t('inputSection.roleLabel', language)}</label>
        <input
          type="text"
          id="prompt"
          name="prompt"
          value={sagaInput.prompt}
          onChange={handleInputChange}
          placeholder={placeholders.role}
          className="w-full bg-[var(--color-input-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:border-[var(--color-accent-strong)] transition"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[var(--color-accent)] mb-2 font-cinzel tracking-wide">{t('inputSection.rulesLabel', language)}</label>
        <div className="space-y-2">
          {sagaInput.constraints.map((constraint, index) => (
            <div 
              key={`constraint-${index}`} 
              className="flex items-center gap-2 group"
              draggable
              onDragStart={() => (dragConstraint.current = index)}
              onDragEnter={() => (draggedOverConstraint.current = index)}
              onDragEnd={handleSortConstraints}
              onDragOver={(e) => e.preventDefault()}
            >
              <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                <GripVerticalIcon />
              </span>
              <input
                type="text"
                value={constraint}
                onChange={(e) => handleListChange('constraints', index, e.target.value)}
                placeholder={placeholders.rule}
                className="flex-grow bg-[var(--color-input-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-md px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:border-[var(--color-accent-strong)] transition"
              />
              <button onClick={() => removeListItem('constraints', index)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-destructive)] transition" aria-label="Remove rule">
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => addListItem('constraints')} className="mt-2 flex items-center gap-2 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition">
          <PlusIcon /> {t('inputSection.addRule', language)}
        </button>
      </div>

      <div className="flex items-stretch gap-3">
        <button
          id="tour-generate"
          onClick={onGenerate}
          disabled={isLoading}
          className="flex-1 w-full flex items-center justify-center gap-3 gradient-button text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          <SparklesIcon />
          {isLoading ? t('inputSection.generateButtonLoading', language) : t('inputSection.generateButton', language)}
        </button>
        <button
          onClick={onClear}
          disabled={isLoading}
          title={t('inputSection.clearButton', language)}
          className="bg-[var(--color-input-bg)] text-[var(--color-text-secondary)] font-semibold py-3 px-5 rounded-md hover:bg-[var(--color-card-bg)] border border-[var(--color-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('inputSection.clearButton', language)}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
