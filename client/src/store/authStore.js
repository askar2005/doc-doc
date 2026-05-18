import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/auth';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      todayTask: null,
      stats: null,
      token: null,
      isAuthenticated: false,
      bootstrapped: false,
      loading: false,
      bootstrapping: false,
      error: null,
      setSession: (payload) =>
        set({
          user: payload.user || null,
          todayTask: payload.todayTask || null,
          stats: payload.stats || null,
          token: payload.token || get().token,
          isAuthenticated: true,
          bootstrapped: true,
          error: null
        }),
      logout: () => {
        set({
          user: null,
          todayTask: null,
          stats: null,
          token: null,
          isAuthenticated: false,
          bootstrapped: true,
          error: null
        });
      },
      bootstrap: async () => {
        const token = get().token;
        if (!token) {
          set({ bootstrapped: true });
          return;
        }

        set({ bootstrapping: true, error: null });
        try {
          const data = await authService.me();
          get().setSession(data);
        } catch (error) {
          get().logout();
          set({ error: error.message || 'Session expired' });
        } finally {
          set({ bootstrapping: false, bootstrapped: true });
        }
      },
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.login(credentials);
          get().setSession(data);
          return data;
        } catch (error) {
          set({ error: error.message || 'Login failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      signup: async (payload) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.register(payload);
          get().setSession(data);
          return data;
        } catch (error) {
          set({ error: error.message || 'Signup failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'doc-doc-auth',
      partialize: (state) => ({
        user: state.user,
        todayTask: state.todayTask,
        stats: state.stats,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('doc-doc-logout', () => {
    useAuthStore.getState().logout();
  });
}

export default useAuthStore;
