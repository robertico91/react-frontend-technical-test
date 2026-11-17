import { useEffect } from "react";

const APP_NAME = "Usuarios y publicaciones";

/** Título de la pestaña de cada pantalla; sin título, solo el nombre de la app. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);
}
