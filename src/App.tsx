import { AppHeader } from "@/components/AppHeader";
import { UserList } from "@/features/users/UserList";

function App() {
  return (
    <div className="flex h-dvh flex-col bg-slate-50 text-slate-900">
      <AppHeader />
      <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[minmax(0,1fr)] md:grid-cols-[20rem_minmax(0,1fr)] md:gap-6 md:p-6">
        <UserList />
        <main className="hidden min-h-0 items-center justify-center rounded-xl border border-dashed border-slate-300 md:flex">
          <p className="text-sm text-slate-600">Elige un usuario para ver sus publicaciones.</p>
        </main>
      </div>
    </div>
  );
}

export default App;
