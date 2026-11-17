import { useParams } from "react-router";
import { NotFound } from "@/components/NotFound";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { StatusMessage } from "@/components/StatusMessage";
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
        <div className="flex items-center gap-3 p-6">
          <SkeletonBlock className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-5 w-48 rounded" />
            <SkeletonBlock className="h-3 w-32 rounded" />
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
    <section aria-labelledby="user-title" className="flex items-center gap-3 p-6">
      <UserAvatar id={user.id} name={user.name} />
      <div className="min-w-0">
        <h2
          id="user-title"
          tabIndex={-1}
          data-screen-title=""
          className="truncate text-xl font-semibold text-slate-900 focus:outline-none"
        >
          {user.name}
        </h2>
        <p className="truncate text-sm text-slate-600">@{user.username}</p>
      </div>
    </section>
  );
}
