import { UserResults } from "./UserResults";
import { useUsers } from "./useUsers";

export function UserList() {
  const query = useUsers();

  return (
    <section
      aria-labelledby="users-title"
      className="flex min-h-0 flex-col bg-white md:rounded-xl md:border md:border-slate-200 md:shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <h2 id="users-title" className="text-lg font-semibold text-slate-900">
          Usuarios
        </h2>
        {/* Región presente desde el inicio para que el cambio de número se anuncie. */}
        <span aria-live="polite" className="ml-auto text-sm text-slate-600">
          {query.data && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">
              {query.data.length}
              <span className="sr-only"> usuarios</span>
            </span>
          )}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <UserResults query={query} />
      </div>
    </section>
  );
}
