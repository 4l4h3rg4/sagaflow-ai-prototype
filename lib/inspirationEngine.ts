import { inspirationData } from './inspirationData';

export class InspirationEngine {
  static inspire(
    currentInput: { theme: string; prompt: string; tasks: string[]; constraints: string[] },
    language: 'en' | 'es'
  ) {
    const data = inspirationData[language];
    
    // Helper functions
    const isStringEmpty = (s: string) => !s || !s.trim();
    const isListCompletelyEmpty = (arr: string[]) => arr.length === 0 || arr.every(isStringEmpty);
    const isListCompletelyFull = (arr: string[]) => arr.length > 0 && arr.every(s => !isStringEmpty(s));

    const themeEmpty = isStringEmpty(currentInput.theme);
    const roleEmpty = isStringEmpty(currentInput.prompt);
    
    const tasksFull = isListCompletelyFull(currentInput.tasks);
    const constraintsFull = isListCompletelyFull(currentInput.constraints);
    
    const tasksEmpty = isListCompletelyEmpty(currentInput.tasks);
    const constraintsEmpty = isListCompletelyEmpty(currentInput.constraints);

    const allEmpty = themeEmpty && roleEmpty && tasksEmpty && constraintsEmpty;
    const allFull = !themeEmpty && !roleEmpty && tasksFull && constraintsFull;

    let newTheme = currentInput.theme;
    let newRole = currentInput.prompt;
    let newTasks = [...currentInput.tasks];
    let newConstraints = [...currentInput.constraints];

    if (allEmpty || allFull) {
        // Full Refresh
        const randomThemeObj = data.themes[Math.floor(Math.random() * data.themes.length)];
        newTheme = randomThemeObj.universe;
        newRole = randomThemeObj.roles[Math.floor(Math.random() * randomThemeObj.roles.length)];

        const shuffledTasks = [...data.tasks].sort(() => 0.5 - Math.random());
        newTasks = shuffledTasks.slice(0, 3);

        const shuffledConstraints = [...data.constraints].sort(() => 0.5 - Math.random());
        newConstraints = shuffledConstraints.slice(0, 2);
    } else {
        // Partial Fill
        if (themeEmpty) {
            const randomThemeObj = data.themes[Math.floor(Math.random() * data.themes.length)];
            newTheme = randomThemeObj.universe;
        }

        if (roleEmpty) {
             const existingThemeObj = data.themes.find(t => t.universe === newTheme);
             if (existingThemeObj) {
                 newRole = existingThemeObj.roles[Math.floor(Math.random() * existingThemeObj.roles.length)];
             } else {
                 const randomThemeObj = data.themes[Math.floor(Math.random() * data.themes.length)];
                 newRole = randomThemeObj.roles[Math.floor(Math.random() * randomThemeObj.roles.length)];
             }
        }

        let availableTasks = [...data.tasks].sort(() => 0.5 - Math.random());
        if (tasksEmpty) {
            newTasks = availableTasks.slice(0, 3);
        } else {
            newTasks = newTasks.map(task => {
                if (isStringEmpty(task)) {
                    const nextTask = availableTasks.pop();
                    return nextTask || "Complete Mission"; 
                }
                return task;
            });
        }

        let availableConstraints = [...data.constraints].sort(() => 0.5 - Math.random());
        if (constraintsEmpty) {
            newConstraints = availableConstraints.slice(0, 2);
        } else {
             newConstraints = newConstraints.map(c => {
                if (isStringEmpty(c)) {
                    const nextC = availableConstraints.pop();
                    return nextC || "Maintain Protocol";
                }
                return c;
             });
        }
    }

    return {
        theme: newTheme,
        prompt: newRole,
        tasks: newTasks,
        constraints: newConstraints
    };
  }
}