import type { UseQueryResult } from "@tanstack/react-query";
import type { User } from "@/api/types";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { StatusMessage } from "@/components/StatusMessage";
import { UserAvatar } from "./UserAvatar";

const SKELETON_ROWS = 6;

type UserResultsProps = { query: UseQueryResult<User[]> };

/** Carga, error, vacío o lista: solo cambia esta parte, nunca la columna entera. */
export function UserResults({ query }: UserResultsProps) {
  if (query.isPending) {
    return (
      <Skeleton label="Cargando usuarios…">
        <ul className="divide-y divide-slate-100">
          {Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <SkeletonBlock className="size-10 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <SkeletonBlock className="h-3.5 w-32 rounded" />
                <SkeletonBlock className="h-3 w-44 rounded" />
              </div>
            </li>
          ))}
        </ul>
      </Skeleton>
    );
  }

  // Si falla un refetch en segundo plano se conservan los datos que ya había:
  // el error solo sustituye a la lista cuando no hay nada que enseñar.
  if (!query.data) {
    return (
      <StatusMessage
        kind="error"
        message="No se pudieron cargar los usuarios."
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (query.data.length === 0) {
    return <StatusMessage kind="empty" message="No hay usuarios." />;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {query.data.map((user) => (
        <li key={user.id} className="flex items-center gap-3 px-4 py-3">
          <UserAvatar id={user.id} name={user.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900" title={user.name}>
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-600" title={user.email}>
              {user.email}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
