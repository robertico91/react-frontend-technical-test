import type { Ref } from "react";

type UserSearchProps = {
  value: string;
  onChange: (value: string) => void;
  ref?: Ref<HTMLInputElement>;
};

export function UserSearch({ value, onChange, ref }: UserSearchProps) {
  return (
    <div className="group relative">
      <label htmlFor="user-search" className="sr-only">
        Buscar usuario por nombre
      </label>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500 group-focus-within:text-brand"
      >
        <circle cx="8.5" cy="8.5" r="5.5" />
        <path d="m13 13 4 4" />
      </svg>
      <input
        ref={ref}
        id="user-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre"
        autoComplete="off"
        spellCheck={false}
        className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-brand focus:ring-4 focus:ring-brand/20 focus:outline-none"
      />
    </div>
  );
}
