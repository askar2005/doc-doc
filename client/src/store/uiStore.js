import { create } from 'zustand';

let counter = 0;

const useUiStore = create((set) => ({
  toasts: [],
  confirmLogoutOpen: false,
  pushToast: (toast) => {
    const id = ++counter;
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          type: toast.type || 'info',
          title: toast.title || 'Notice',
          message: toast.message || ''
        }
      ]
    }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
    }, toast.duration || 3200);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
  openLogoutConfirm: () => set({ confirmLogoutOpen: true }),
  closeLogoutConfirm: () => set({ confirmLogoutOpen: false })
}));

export default useUiStore;
