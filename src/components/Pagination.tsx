import type { ReactNode } from "react";
import { Link } from "react-router";

type PaginationProps = {
  label: string;
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
};

const ITEM =
  "flex size-9 items-center justify-center rounded-lg text-sm font-medium focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none";

/** Paginación con enlaces a `?page=N`: la página vive en la URL, como el usuario. */
export function Pagination({ label, page, totalPages, from, to, total }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label={label} className="flex items-center justify-between gap-3">
      <p aria-live="polite" className="text-sm text-slate-600">
        {from}–{to} de {total}
      </p>
      <ul className="flex items-center gap-1">
        <li>
          <PageLink page={page - 1} disabled={page === 1} label="Página anterior">
            ‹
          </PageLink>
        </li>
        {pages.map((n) => (
          <li key={n}>
            <Link
              to={{ search: `?page=${n}` }}
              aria-current={n === page ? "page" : undefined}
              className={`${ITEM} text-slate-700 hover:bg-slate-100 aria-[current=page]:bg-brand aria-[current=page]:text-white`}
            >
              {n}
            </Link>
          </li>
        ))}
        <li>
          <PageLink page={page + 1} disabled={page === totalPages} label="Página siguiente">
            ›
          </PageLink>
        </li>
      </ul>
    </nav>
  );
}

type PageLinkProps = { page: number; disabled: boolean; label: string; children: ReactNode };

/** Anterior/siguiente; en los extremos queda deshabilitado (sin enlace). */
function PageLink({ page, disabled, label, children }: PageLinkProps) {
  if (disabled) {
    return (
      <span aria-disabled="true" aria-label={label} className={`${ITEM} text-slate-300`}>
        <span aria-hidden="true">{children}</span>
      </span>
    );
  }
  return (
    <Link
      to={{ search: `?page=${page}` }}
      aria-label={label}
      className={`${ITEM} text-slate-700 hover:bg-slate-100`}
    >
      <span aria-hidden="true">{children}</span>
    </Link>
  );
}
