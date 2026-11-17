import { useDeferredValue, useRef, useState } from "react";
import { filterUsers } from "./filterUsers";
import { UserResults } from "./UserResults";
import { UserSearch } from "./UserSearch";
import { useUsers } from "./useUsers";

type UserListProps = {
  /** En móvil se oculta con CSS (no se desmonta) para conservar la búsqueda. */
  hiddenOnMobile: boolean;
};

export function UserList({ hiddenOnMobile }: UserListProps) {
  const query = useUsers();
  const [search, setSearch] = useState("");
  // Con 10 usuarios no hace falta debounce: basta con que escribir tenga prioridad sobre filtrar.
  const deferredSearch = useDeferredValue(search);
  const searchRef = useRef<HTMLInputElement>(null);

  const total = query.data?.length ?? 0;
  const users = filterUsers(query.data ?? [], deferredSearch);

  function clearSearch() {
    setSearch("");
    searchRef.current?.focus();
  }

  return (
    <section
      aria-labelledby="users-title"
      className={`${hiddenOnMobile ? "hidden md:flex" : "flex"} min-h-0 flex-col bg-white md:rounded-xl md:border md:border-slate-200 md:shadow-sm`}
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <h2
            id="users-title"
            tabIndex={-1}
            data-screen-title=""
            className="text-lg font-semibold text-slate-900 focus:outline-none"
          >
            Usuarios
          </h2>
          {/* Región presente desde el inicio para que el cambio de número se anuncie. */}
          <span aria-live="polite" className="ml-auto text-sm text-slate-600">
            {query.data && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">
                {users.length === total ? total : `${users.length} de ${total}`}
                <span className="sr-only"> usuarios</span>
              </span>
            )}
          </span>
        </div>
        {/* Siempre visible: se puede escribir mientras cargan los datos o si fallan. */}
        <UserSearch ref={searchRef} value={search} onChange={setSearch} />
      </div>
      <div className="min-h-0 flex-1 [scrollbar-width:thin] overflow-y-auto overscroll-contain">
        <UserResults
          query={query}
          users={users}
          search={deferredSearch}
          onClearSearch={clearSearch}
        />
      </div>
    </section>
  );
}
