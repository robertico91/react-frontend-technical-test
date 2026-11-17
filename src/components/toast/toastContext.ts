import { createContext, useContext } from "react";

export type ToastMessage = { title: string; description?: string };

export const ToastContext = createContext<(message: ToastMessage) => void>(() => {});

/** Muestra un aviso de confirmación breve (se anuncia con aria-live="polite"). */
export function useToast() {
  return useContext(ToastContext);
}
