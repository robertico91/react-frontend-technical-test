import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/**
 * Si al navegar desaparece o se oculta el elemento con el foco (por ejemplo, en móvil la
 * lista se oculta al abrir un usuario), el foco iría al <body> y el teclado y el lector de
 * pantalla perderían el sitio. En ese caso se lleva al título visible de la pantalla nueva.
 */
export function useRecoverFocusOnNavigation() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const active = document.activeElement;
    const focusLost =
      !active || active === document.body || !active.isConnected || !active.checkVisibility();
    if (!focusLost) return;

    const titles = document.querySelectorAll<HTMLElement>("[data-screen-title]");
    const visibleTitle = Array.from(titles).find((title) => title.checkVisibility());
    visibleTitle?.focus();
  }, [pathname]);
}
