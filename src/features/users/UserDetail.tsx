import type { ReactNode } from "react";
import { useParams } from "react-router";
import type { User } from "@/api/types";
import { NotFound } from "@/components/NotFound";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { StatusMessage } from "@/components/StatusMessage";
import { PostList } from "@/features/posts/PostList";
import { usePosts } from "@/features/posts/usePosts";
import { usePageTitle } from "@/hooks/usePageTitle";
import { parseUserId } from "./parseUserId";
import { UserAvatar } from "./UserAvatar";
import { useUsers } from "./useUsers";

/** El usuario sale de la lista ya cargada: no se pide aparte. */
export function UserDetail() {
  const userId = parseUserId(useParams().userId);
  const query = useUsers();
  const user = userId === null ? undefined : query.data?.find((u) => u.id === userId);

  usePageTitle(user?.name ?? (query.isPending ? "Cargando usuario…" : undefined));

  if (query.isPending) {
    return (
      <Skeleton label="Cargando usuario…">
        <div className="flex items-start gap-4 border-b border-slate-200 p-4 md:p-6">
          <SkeletonBlock className="size-16 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <SkeletonBlock className="h-6 w-48 rounded" />
            <SkeletonBlock className="h-4 w-24 rounded" />
            <SkeletonBlock className="mt-2 h-4 w-full max-w-sm rounded" />
          </div>
        </div>
      </Skeleton>
    );
  }

  if (!query.data) {
    return (
      <StatusMessage
        kind="error"
        message="No se pudo cargar el usuario."
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (!user) {
    return (
      <NotFound
        title="Usuario no encontrado"
        description="No existe ningún usuario con ese identificador. Elige uno de la lista."
      />
    );
  }

  return (
    // En escritorio la ficha y el título quedan fijos y solo se desplaza la lista de publicaciones.
    <div className="flex flex-col md:h-full md:min-h-0">
      <UserCard user={user} />
      <section aria-labelledby="posts-title" className="flex flex-col md:min-h-0 md:flex-1">
        <PostsHeading userId={user.id} />
        {/* key: al cambiar de usuario, la lista empieza de cero (scroll y página). */}
        <PostList key={user.id} userId={user.id} userName={user.name} />
      </section>
    </div>
  );
}

/** Título con el total a continuación: el final de la línea queda para "Nueva publicación". */
function PostsHeading({ userId }: { userId: number }) {
  // Misma query que PostList: comparte caché, no hace otra petición.
  const { data } = usePosts(userId);
  return (
    <div className="flex items-center gap-2 px-4 pt-4 md:px-6">
      <h3 id="posts-title" className="text-base font-semibold text-slate-900">
        Publicaciones
      </h3>
      <span aria-live="polite" className="text-sm text-slate-600">
        {data && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">
            {data.length}
            <span className="sr-only"> publicaciones</span>
          </span>
        )}
      </span>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <header className="flex items-start gap-4 border-b border-slate-200 p-4 md:p-6">
      <UserAvatar id={user.id} name={user.name} size="lg" />
      <div className="min-w-0 flex-1">
        <h2
          id="user-title"
          tabIndex={-1}
          data-screen-title=""
          className="truncate text-xl font-semibold text-slate-900 focus:outline-none"
        >
          {user.name}
        </h2>
        <p className="truncate text-sm text-slate-600">@{user.username}</p>
        <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          <Detail label="Email">
            <a href={`mailto:${user.email}`} className={LINK}>
              {user.email}
            </a>
          </Detail>
          <Detail label="Web">
            <a href={`https://${user.website}`} target="_blank" rel="noreferrer" className={LINK}>
              {user.website}
            </a>
          </Detail>
          <Detail label="Empresa">{user.company.name}</Detail>
          <Detail label="Ciudad">{user.address.city}</Detail>
        </dl>
      </div>
    </header>
  );
}

const LINK =
  "text-brand rounded underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 gap-2">
      <dt className="shrink-0 text-slate-600">{label}:</dt>
      <dd className="truncate text-slate-900">{children}</dd>
    </div>
  );
}
