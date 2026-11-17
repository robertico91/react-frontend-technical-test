import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ToastContext } from "./toastContext";

const DURATION_MS = 4000;

type Toast = { id: number; message: string };

/**
 * Avisos de confirmación hechos a mano: uno cada vez, 4 s en pantalla con pausa mientras el
 * ratón o el foco están encima. La región aria-live está siempre montada para que el lector de
 * pantalla anuncie el aviso al aparecer.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [paused, setPaused] = useState(false);

  const show = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
    setPaused(false);
  }, []);

  useEffect(() => {
    if (!toast || paused) return;
    const timer = setTimeout(() => setToast(null), DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast, paused]);

  return (
    <ToastContext value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4"
      >
        {toast && (
          <div
            key={toast.id}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="pointer-events-auto flex items-center gap-3 rounded-xl bg-slate-900 py-2 pr-2 pl-4 text-sm text-white shadow-lg"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-4 text-emerald-400"
            >
              <path d="m4 10 4 4 8-8" />
            </svg>
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Cerrar aviso"
              className="flex size-7 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        )}
      </div>
    </ToastContext>
  );
}
