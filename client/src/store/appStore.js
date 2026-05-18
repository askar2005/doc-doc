import { create } from 'zustand';
import appService from '../services/app';
import useUiStore from './uiStore';

const taskKeys = ['water', 'egg', 'fruits', 'vegetables', 'sundal', 'protein', 'keerai'];

const defaultTodayTask = {
  waterCompleted: false,
  eggCompleted: false,
  fruitsCompleted: false,
  vegetablesCompleted: false,
  sundalCompleted: false,
  proteinCompleted: false,
  keeraiCompleted: false,
  score: 0,
  xp: 0,
  consistency: 0,
  streakMultiplier: 1,
  status: 'Poor'
};

const useAppStore = create((set, get) => ({
  loading: false,
  error: null,
  todayTask: defaultTodayTask,
  taskHistory: [],
  weeklyAnalytics: null,
  monthlyAnalytics: null,
  streakSummary: { streak: 0, longestStreak: 0, badge: 'Starter', bonusXP: 0 },
  healthTip: null,
  aiHistory: [],
  reminderSettings: {
    waterReminder: true,
    fruitReminder: true,
    sleepReminder: true,
    keeraiReminder: true
  },
  bootstrapDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const results = await Promise.allSettled([
        appService.getTodayTask(),
        appService.getTaskHistory(),
        appService.getWeeklyAnalytics(),
        appService.getMonthlyAnalytics(),
        appService.getStreakSummary(),
        appService.getDailyTip(),
        appService.getAIHistory()
      ]);

      const [today, history, weekly, monthly, streak, tip, chats] = results.map((result) => (result.status === 'fulfilled' ? result.value : null));

      set({
        todayTask: today?.task || defaultTodayTask,
        taskHistory: history?.tasks || [],
        weeklyAnalytics: weekly || null,
        monthlyAnalytics: monthly || null,
        streakSummary: streak || { streak: 0, longestStreak: 0, badge: 'Starter', bonusXP: 0 },
        healthTip: tip?.tip || null,
        aiHistory: chats?.chats || [],
        loading: false
      });
    } catch (error) {
      set({ error: error.message || 'Failed to load dashboard', loading: false });
      useUiStore.getState().pushToast({
        type: 'error',
        title: 'Load failed',
        message: error.message || 'Unable to fetch dashboard data'
      });
    }
  },
  refreshAll: async () => {
    await get().bootstrapDashboard();
  },
  toggleTask: async (key) => {
    if (!taskKeys.includes(key)) return;

    const previous = get().todayTask;
    const mappedKey = `${key}Completed`;
    const nextValue = !Boolean(previous?.[mappedKey]);
    const optimistic = {
      ...previous,
      [mappedKey]: nextValue
    };

    set({ todayTask: optimistic });

    try {
      const { task } = await appService.updateTask({ key, completed: nextValue });
      set({ todayTask: task });
      useUiStore.getState().pushToast({
        type: 'success',
        title: 'Task updated',
        message: `${key} marked as ${nextValue ? 'complete' : 'incomplete'}`
      });
      await get().refreshSummary();
    } catch (error) {
      set({ todayTask: previous });
      useUiStore.getState().pushToast({
        type: 'error',
        title: 'Update failed',
        message: error.response?.data?.message || error.message || 'Could not update task'
      });
    }
  },
  refreshSummary: async () => {
    try {
      const results = await Promise.allSettled([
        appService.getTodayTask(),
        appService.getTaskHistory(),
        appService.getStreakSummary(),
        appService.getDailyTip()
      ]);

      const [today, history, streak, tip] = results.map((result) => (result.status === 'fulfilled' ? result.value : null));

      set({
        todayTask: today?.task || defaultTodayTask,
        taskHistory: history?.tasks || [],
        streakSummary: streak || { streak: 0, longestStreak: 0, badge: 'Starter', bonusXP: 0 },
        healthTip: tip?.tip || null
      });
    } catch (error) {
      set({ error: error.message || 'Refresh failed' });
    }
  },
  loadAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const results = await Promise.allSettled([
        appService.getWeeklyAnalytics(),
        appService.getMonthlyAnalytics(),
        appService.getStreakSummary()
      ]);

      const [weekly, monthly, streak] = results.map((result) => (result.status === 'fulfilled' ? result.value : null));

      set({
        weeklyAnalytics: weekly || null,
        monthlyAnalytics: monthly || null,
        streakSummary: streak || { streak: 0, longestStreak: 0, badge: 'Starter', bonusXP: 0 },
        loading: false
      });
    } catch (error) {
      set({ loading: false, error: error.message || 'Analytics load failed' });
    }
  },
  loadChatHistory: async () => {
    try {
      const { chats } = await appService.getAIHistory();
      set({ aiHistory: chats || [] });
    } catch (error) {
      useUiStore.getState().pushToast({
        type: 'error',
        title: 'History unavailable',
        message: error.message || 'Could not load AI history'
      });
    }
  },
  sendChat: async (message, context = {}) => {
    const temp = {
      id: `pending-${Date.now()}`,
      message,
      response: 'Typing...',
      createdAt: new Date().toISOString(),
      pending: true
    };

    set((state) => ({ aiHistory: [temp, ...state.aiHistory] }));
    try {
      const { response, chat } = await appService.sendChat({ message, context });
      const normalizedChat = chat || {
        id: `local-${Date.now()}`,
        message,
        response,
        createdAt: new Date().toISOString()
      };
      set((state) => ({
        aiHistory: [normalizedChat, ...state.aiHistory.filter((item) => item.id !== temp.id)]
      }));
      return response;
    } catch (error) {
      set((state) => ({
        aiHistory: state.aiHistory.filter((item) => item.id !== temp.id)
      }));
      throw error;
    }
  },
  setReminderSettings: (next) => set((state) => ({ reminderSettings: { ...state.reminderSettings, ...next } }))
}));

export default useAppStore;
