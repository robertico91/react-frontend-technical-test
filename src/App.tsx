import { Link, Route, Routes, useLocation } from "react-router";
import { AppHeader } from "@/components/AppHeader";
import { EmptyState } from "@/components/EmptyState";
import { NotFound } from "@/components/NotFound";
import { UserDetail } from "@/features/users/UserDetail";
import { UserList } from "@/features/users/UserList";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useRecoverFocusOnNavigation } from "@/hooks/useRecoverFocusOnNavigation";

function HomeScreen() {
  usePageTitle();
  return (
    <EmptyState
      title="Elige un usuario"
      description="Selecciona un usuario de la lista para ver sus publicaciones."
    />
  );
}

function App() {
  const isHome = useLocation().pathname === "/";
  useRecoverFocusOnNavigation();

  return (
    // En móvil, la portada ocupa la pantalla y solo se desplaza la lista; el resto de
    // pantallas usan el scroll de la página. En escritorio, siempre la altura de la ventana.
    <div
      className={`flex flex-col bg-slate-50 text-slate-900 md:h-dvh ${isHome ? "h-dvh" : "min-h-dvh"}`}
    >
      {/* En escritorio, el teclado no tiene que recorrer el buscador y toda la lista para
          llegar al detalle. En móvil no hace falta: se ve la lista o el detalle. */}
      <a
        href="#contenido"
        className="z-30 hidden rounded-lg bg-brand text-sm font-medium text-white focus-visible:outline-none md:sr-only md:block md:focus:not-sr-only md:focus:fixed md:focus:top-3 md:focus:left-3 md:focus:px-4 md:focus:py-2"
      >
        Saltar la lista de usuarios
      </a>
      <AppHeader />
      {!isHome && (
        <nav
          aria-label="Volver"
          className="sticky top-14 z-10 border-b border-slate-200 bg-white px-4 py-2 md:hidden"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded text-sm font-medium text-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            <span aria-hidden="true">←</span> Volver a usuarios
          </Link>
        </nav>
      )}
      {/* <main> envuelve lista y detalle: en la portada de móvil el detalle está oculto y la
          lista es el contenido principal. */}
      <main className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[minmax(0,1fr)] md:grid-cols-[20rem_minmax(0,1fr)] md:gap-6 md:p-6">
        <UserList hiddenOnMobile={!isHome} />
        <div
          id="contenido"
          tabIndex={-1}
          className={`focus:outline-none ${isHome ? "hidden md:block" : "block"} min-h-0 bg-white md:overflow-y-auto md:rounded-xl md:border md:border-slate-200 md:shadow-sm`}
        >
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route
              path="*"
              element={
                <NotFound
                  title="Página no encontrada"
                  description="La dirección no corresponde a ninguna pantalla de la aplicación."
                />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
