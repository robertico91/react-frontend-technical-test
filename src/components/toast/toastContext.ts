import { createContext, useContext } from "react";

export const ToastContext = createContext<(message: string) => void>(() => {});

/** Muestra un aviso de confirmación breve (se anuncia con aria-live="polite"). */
export function useToast() {
  return useContext(ToastContext);
}
