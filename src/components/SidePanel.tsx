import { useEffect, useRef, type ReactNode } from "react";

type SidePanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/**
 * Panel lateral derecho sobre un <dialog> nativo con showModal(): el navegador atrapa el foco,
 * deja el resto de la página inerte y cierra con Escape. Se cierra también con ×, con el fondo
 * o desde dentro (onClose), y devuelve el foco al elemento que lo abrió.
 */
export function SidePanel({ open, onClose, title, children }: SidePanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleClose() {
    onClose();
    // Se guarda quién abrió el panel en vez de fiarse del orden entre desmontar el contenido
    // y dialog.close(): así el foco vuelve siempre al botón.
    openerRef.current?.focus();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="side-panel-title"
      onClose={handleClose}
      // Un clic en el propio <dialog> (no en su contenido) es un clic en el fondo.
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md bg-white p-0 shadow-xl transition-transform duration-200 backdrop:bg-slate-900/40 motion-reduce:transition-none starting:open:translate-x-full"
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
            <h2 id="side-panel-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Cerrar"
              className="flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                className="size-5"
              >
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      )}
    </dialog>
  );
}
