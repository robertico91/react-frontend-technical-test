import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: ReactNode;
  /** "p" cuando la sección ya tiene su propio encabezado. */
  titleAs?: "h2" | "p";
  /** Marca el título como destino del foco al navegar a esta pantalla. */
  isScreenTitle?: boolean;
  children?: ReactNode;
};

/** Aviso centrado con icono decorativo, título y una línea útil. */
export function EmptyState({
  title,
  description,
  titleAs: Title = "h2",
  isScreenTitle = false,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-6"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" strokeLinecap="round" />
        </svg>
      </span>
      <Title
        tabIndex={isScreenTitle ? -1 : undefined}
        data-screen-title={isScreenTitle ? "" : undefined}
        className="text-base font-semibold text-slate-900 focus:outline-none"
      >
        {title}
      </Title>
      <p className="max-w-xs text-sm text-slate-600">{description}</p>
      {children}
    </div>
  );
}
