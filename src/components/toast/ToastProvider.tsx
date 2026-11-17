import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ToastContext, type ToastMessage } from "./toastContext";

const DURATION_MS = 4000;

type Toast = ToastMessage & { id: number };

/**
 * Avisos de confirmación hechos a mano: uno cada vez, 4 s en pantalla con pausa mientras el
 * ratón o el foco están encima. La región aria-live está siempre montada para que el lector de
 * pantalla anuncie el aviso al aparecer.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [paused, setPaused] = useState(false);

  const show = useCallback((message: ToastMessage) => {
    setToast({ ...message, id: Date.now() });
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
        // Arriba a la derecha, bajo la cabecera fija (en móvil, también bajo la barra "Volver").
        className="pointer-events-none fixed inset-x-0 top-[6.5rem] z-30 flex justify-center px-4 sm:inset-x-auto sm:top-20 sm:right-6 sm:px-0"
      >
        {toast && (
          <div
            key={toast.id}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-lg shadow-emerald-900/5 transition duration-200 motion-reduce:transition-none starting:-translate-y-2 starting:opacity-0"
          >
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="m5 10.5 3.5 3.5L15 7" />
              </svg>
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="font-semibold text-emerald-800">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-sm text-slate-600">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Cerrar aviso"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                className="size-4"
              >
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </ToastContext>
  );
}
