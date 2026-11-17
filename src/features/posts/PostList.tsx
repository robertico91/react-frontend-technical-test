import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { StatusMessage } from "@/components/StatusMessage";
import { paginate } from "./paginate";
import { usePosts } from "./usePosts";

const PAGE_SIZE = 5;

type PostListProps = { userId: number; userName: string };

/** Publicaciones del usuario, paginadas en el cliente con la página en `?page=`. */
export function PostList({ userId, userName }: PostListProps) {
  const query = usePosts(userId);
  const [searchParams] = useSearchParams();
  const current = paginate(query.data ?? [], Number(searchParams.get("page") ?? "1"), PAGE_SIZE);

  const listRef = useRef<HTMLUListElement>(null);
  const previousPage = useRef(current.page);
  // Al cambiar de página, la lista vuelve arriba (escritorio) y se pone a la vista (móvil).
  useEffect(() => {
    if (previousPage.current === current.page) return;
    previousPage.current = current.page;
    listRef.current?.scrollTo({ top: 0 });
    // "start" + scroll-mt-28: en móvil queda justo bajo la cabecera y la barra "Volver".
    listRef.current?.scrollIntoView({ block: "start" });
  }, [current.page]);

  if (query.isPending) {
    return (
      <Skeleton label="Cargando publicaciones…">
        <ul className="flex flex-col gap-3 overflow-hidden p-4 md:px-6">
          {Array.from({ length: 3 }, (_, i) => (
            <li key={i} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4">
              <SkeletonBlock className="h-4 w-2/3 rounded" />
              <SkeletonBlock className="h-3 w-full rounded" />
              <SkeletonBlock className="h-3 w-5/6 rounded" />
            </li>
          ))}
        </ul>
      </Skeleton>
    );
  }

  if (!query.data) {
    return (
      <StatusMessage
        kind="error"
        message="No se pudieron cargar las publicaciones."
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (query.data.length === 0) {
    return (
      <EmptyState
        titleAs="p"
        title="Este usuario aún no tiene publicaciones"
        description="Cuando publique algo, aparecerá aquí."
      />
    );
  }

  return (
    <>
      <ul
        ref={listRef}
        // Desplazable con teclado en escritorio: necesita foco y nombre.
        tabIndex={0}
        aria-label={`Publicaciones de ${userName}`}
        className="flex scroll-mt-28 flex-col gap-3 p-4 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none focus-visible:ring-inset md:min-h-0 md:flex-1 md:overflow-y-auto md:overscroll-contain md:px-6"
      >
        {current.items.map((post) => (
          <li key={post.id}>
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 first-letter:uppercase">{post.title}</h4>
              <p className="mt-1 text-sm text-slate-600 first-letter:uppercase">{post.body}</p>
            </article>
          </li>
        ))}
      </ul>
      {current.totalPages > 1 && (
        <div className="border-t border-slate-200 px-4 py-3 md:px-6">
          <Pagination
            label="Páginas de publicaciones"
            page={current.page}
            totalPages={current.totalPages}
            from={current.from}
            to={current.to}
            total={current.total}
          />
        </div>
      )}
    </>
  );
}
