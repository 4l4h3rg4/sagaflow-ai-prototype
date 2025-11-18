
export interface SagaInput {
  theme: string;
  tasks: string[];
  prompt: string;
  constraints: string[];
}

export interface MissionObjective {
  originalTask: string;
  missionTask: string;
  completed: boolean;
}

export interface Saga {
  scenario: string;
  roleAndObjective: string;
  objectives: MissionObjective[];
  missionRules?: string;
  callToAction: string;
  imageUrl?: string; // New field for the generated scenario image
}

export interface Feedback {
  id: string;
  title: string;
  message: string;
}
