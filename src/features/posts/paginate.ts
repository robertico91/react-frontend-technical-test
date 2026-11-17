export type Page<T> = {
  items: T[];
  /** Página real mostrada: una fuera de rango se ajusta a la primera o la última. */
  page: number;
  totalPages: number;
  /** Posición (desde 1) del primer y último elemento de la página, para "1–5 de 10". */
  from: number;
  to: number;
  total: number;
};

export function paginate<T>(items: T[], requestedPage: number, pageSize: number): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const wholePage = Number.isInteger(requestedPage) ? requestedPage : 1;
  const page = Math.min(Math.max(1, wholePage), totalPages);
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    items: pageItems,
    page,
    totalPages,
    from: pageItems.length > 0 ? start + 1 : 0,
    to: start + pageItems.length,
    total: items.length,
  };
}
