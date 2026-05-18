import { X } from 'lucide-react';
import useUiStore from '../../store/uiStore';

const toneClasses = {
  info: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-50',
  success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-50',
  error: 'border-rose-400/20 bg-rose-500/10 text-rose-50',
  warning: 'border-amber-400/20 bg-amber-500/10 text-amber-50'
};

export default function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed left-3 right-3 top-3 z-[80] flex max-w-full flex-col gap-3 sm:left-auto sm:right-4 sm:top-4 sm:w-[calc(100%-2rem)] sm:max-w-sm">
      {toasts.map((toast) => (
        <div key={toast.id} className={`pointer-events-auto rounded-3xl border p-3 shadow-neon backdrop-blur-xl sm:p-4 ${toneClasses[toast.type]}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold sm:text-base">{toast.title}</div>
              {toast.message ? <div className="mt-1 text-xs leading-5 opacity-90 sm:text-sm">{toast.message}</div> : null}
            </div>
            <button type="button" onClick={() => removeToast(toast.id)} className="rounded-full p-1 hover:bg-white/10">
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
