import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem('doc-doc-auth') : null;
  let token = null;

  if (raw) {
    try {
      token = JSON.parse(raw)?.state?.token || null;
    } catch {
      token = null;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('doc-doc-logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
