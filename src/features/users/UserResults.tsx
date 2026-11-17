import type { UseQueryResult } from "@tanstack/react-query";
import { NavLink } from "react-router";
import type { User } from "@/api/types";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { StatusMessage } from "@/components/StatusMessage";
import { UserAvatar } from "./UserAvatar";

const SKELETON_ROWS = 6;

type UserResultsProps = {
  query: UseQueryResult<User[]>;
  /** Usuarios ya filtrados por la búsqueda. */
  users: User[];
  search: string;
  onClearSearch: () => void;
};

/** Carga, error, vacío o lista: solo cambia esta parte, nunca la columna entera. */
export function UserResults({ query, users, search, onClearSearch }: UserResultsProps) {
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

  if (users.length === 0) {
    return (
      <StatusMessage
        kind="empty"
        message={`Ningún usuario coincide con «${search.trim()}».`}
        action={{ label: "Ver todos los usuarios", onClick: onClearSearch }}
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {users.map((user) => (
        <li key={user.id}>
          <NavLink
            to={`/users/${user.id}`}
            className="group flex items-center gap-3 px-4 py-3 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none focus-visible:ring-inset aria-[current=page]:bg-brand/10 aria-[current=page]:shadow-[inset_3px_0_0_var(--color-brand)]"
          >
            <UserAvatar id={user.id} name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900" title={user.name}>
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-600" title={user.email}>
                {user.email}
              </p>
            </div>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-4 shrink-0 text-slate-400 group-aria-[current=page]:text-brand"
            >
              <path d="m8 5 5 5-5 5" />
            </svg>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
