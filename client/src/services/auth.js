import api from './api';

const authService = {
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  async login(payload) {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
  async signup(payload) {
    const { data } = await api.post('/auth/signup', payload);
    return data;
  },
  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  }
};

export default authService;
