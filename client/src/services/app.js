import api from './api';

const appService = {
  async getTodayTask() {
    const { data } = await api.get('/tasks/today');
    return data;
  },
  async updateTask(payload) {
    const { data } = await api.patch('/tasks/update', payload);
    return data;
  },
  async getTaskHistory() {
    const { data } = await api.get('/tasks/history');
    return data;
  },
  async getWeeklyAnalytics() {
    const { data } = await api.get('/analytics/weekly');
    return data;
  },
  async getMonthlyAnalytics() {
    const { data } = await api.get('/analytics/monthly');
    return data;
  },
  async getStreakSummary() {
    const { data } = await api.get('/analytics/streak');
    return data;
  },
  async getAIHistory() {
    const { data } = await api.get('/ai/history');
    return data;
  },
  async sendChat(payload) {
    const { data } = await api.post('/ai/chat', payload);
    return data;
  },
  async getDailyTip() {
    const { data } = await api.get('/tips/daily');
    return data;
  }
};

export default appService;
