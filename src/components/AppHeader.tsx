export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 h-14 shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center px-4 md:px-6">
        <h1 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
            <rect width="32" height="32" rx="7" className="fill-brand" />
            <circle cx="16" cy="12.5" r="5" fill="#fff" />
            <path d="M7 26c0-5 4-8 9-8s9 3 9 8z" fill="#fff" />
          </svg>
          Usuarios y publicaciones
        </h1>
      </div>
    </header>
  );
}
