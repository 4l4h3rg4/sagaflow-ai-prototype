import { db, CurrentSession, SagaHistoryItem } from './db';
import { SagaInput, Saga, Feedback } from '../types';

export const saveCurrentSession = async (data: {
    sagaInput: SagaInput;
    mission: Saga | null;
    completedFeats: Feedback[];
    timerTotalSeconds?: number;
    timerRemainingSeconds?: number;
    timerIsRunning?: boolean;
    timerIsOnBreak?: boolean;
    timerBreakRemaining?: number;
}) => {
    await db.currentSession.put({
        id: 'active',
        ...data,
        savedAt: Date.now(),
    });
};

export const loadCurrentSession = async (): Promise<CurrentSession | undefined> => {
    return await db.currentSession.get('active');
};

export const clearCurrentSession = async () => {
    await db.currentSession.delete('active');
};

export const saveSagaToHistory = async (
    sagaInput: SagaInput,
    mission: Saga,
    completedFeats: Feedback[],
    status: 'completed' | 'paused'
) => {
    const completedTasks = mission.objectives.filter((obj) => obj.completed).length;
    const totalTasks = mission.objectives.length;

    const historyItem: SagaHistoryItem = {
        sagaInput,
        mission,
        completedFeats,
        status,
        completedTasks,
        totalTasks,
        createdAt: Date.now(),
        completedAt: status === 'completed' ? Date.now() : null,
    };

    await db.sagaHistory.add(historyItem);
};

export const getSagaHistory = async (): Promise<SagaHistoryItem[]> => {
    return await db.sagaHistory.orderBy('createdAt').reverse().toArray();
};
