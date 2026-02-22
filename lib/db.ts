import Dexie, { Table } from 'dexie';
import { SagaInput, Saga, Feedback } from '../types';

export interface CurrentSession {
    id: string;
    sagaInput: SagaInput;
    mission: Saga | null;
    completedFeats: Feedback[];
    savedAt: number;
    timerTotalSeconds?: number;
    timerRemainingSeconds?: number;
    timerIsRunning?: boolean;
    timerIsOnBreak?: boolean;
    timerBreakRemaining?: number;
}

export interface SagaHistoryItem {
    id?: number;
    sagaInput: SagaInput;
    mission: Saga;
    completedFeats: Feedback[];
    status: 'completed' | 'paused';
    completedTasks: number;
    totalTasks: number;
    createdAt: number;
    completedAt: number | null;
}

export class SagaFlowDB extends Dexie {
    currentSession!: Table<CurrentSession, string>;
    sagaHistory!: Table<SagaHistoryItem, number>;

    constructor() {
        super('SagaFlowDB');
        this.version(1).stores({
            currentSession: 'id',
            sagaHistory: '++id, createdAt'
        });
        this.version(2).stores({
            currentSession: 'id',
            sagaHistory: '++id, createdAt'
        });
    }
}

export const db = new SagaFlowDB();
