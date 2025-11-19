
import React from 'react';
import type { SagaInput } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import SparklesIcon from './icons/SparklesIcon';
import GripVerticalIcon from './icons/GripVerticalIcon';
import DiceIcon from './icons/DiceIcon';
import { t } from '../lib/i18n';
import { inspirationData } from '../lib/inspirationData';

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

  const getRandomItem = (array: string[], exclude: string[]): string => {
    const available = array.filter(item => !exclude.includes(item));
    if (available.length === 0) return array[Math.floor(Math.random() * array.length)];
    return available[Math.floor(Math.random() * available.length)];
  };

  const handleInspireMe = () => {
    const data = inspirationData[language];
    const updates: Partial<SagaInput> = {};

    // 1. Universe & Role (Coherence check)
    // Only fill if theme is empty to allow mixing custom themes with random tasks
    if (!sagaInput.theme.trim()) {
      const randomThemeObj = data.themes[Math.floor(Math.random() * data.themes.length)];
      updates.theme = randomThemeObj.universe;
      
      // Also set the role if it's empty or if we just set a new theme
      if (!sagaInput.prompt.trim()) {
        updates.prompt = randomThemeObj.roles[Math.floor(Math.random() * randomThemeObj.roles.length)];
      }
    } else if (!sagaInput.prompt.trim()) {
        // If theme exists but role is empty, we can't guarantee coherence from static data easily.
        // We'll leave it blank or user can clear theme to get a pair.
        // Alternatively, we could pick a generic "Hero" role, but let's respect the user's custom theme.
    }

    // 2. Tasks (Fill empty slots)
    const currentTasks = [...sagaInput.tasks];
    // Keep track of tasks we've already used in this session to avoid duplicates
    const usedTasks = [...currentTasks.filter(t => t.trim())]; 

    const newTasks = currentTasks.map(task => {
      if (!task.trim()) {
        const randomTask = getRandomItem(data.tasks, usedTasks);
        usedTasks.push(randomTask);
        return randomTask;
      }
      return task;
    });
    updates.tasks = newTasks;

    // 3. Constraints (Fill empty slots)
    const currentConstraints = [...sagaInput.constraints];
    const usedConstraints = [...currentConstraints.filter(c => c.trim())];

    const newConstraints = currentConstraints.map(constraint => {
      if (!constraint.trim()) {
        const randomConstraint = getRandomItem(data.constraints, usedConstraints);
        usedConstraints.push(randomConstraint);
        return randomConstraint;
      }
      return constraint;
    });
    updates.constraints = newConstraints;

    setSagaInput(prev => ({ ...prev, ...updates }));
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
            <div className="relative">
                <button
                    onClick={handleInspireMe}
                    className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition rounded-full py-1 px-2 hover:bg-[var(--color-input-bg)] active:scale-95"
                >
                    <DiceIcon />
                    {t('inputSection.inspireMe', language)}
                </button>
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
