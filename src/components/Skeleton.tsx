import type { ReactNode } from "react";

type SkeletonProps = {
  /** Texto que anuncian los lectores de pantalla mientras carga. */
  label: string;
  children: ReactNode;
};

/** Silueta de carga: decorativa para lectores de pantalla, que solo oyen `label`. */
export function Skeleton({ label, children }: SkeletonProps) {
  return (
    <div>
      <p role="status" className="sr-only">
        {label}
      </p>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

/** Bloque gris sin redondeo por defecto: sirve para barras de texto y para círculos. */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`bg-slate-200 motion-safe:animate-pulse ${className}`} />;
}
