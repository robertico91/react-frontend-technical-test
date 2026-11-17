import { getInitials } from "./getInitials";

// Pares suaves de fondo y texto con contraste suficiente (texto 800 sobre fondo 100).
const COLORS = [
  "bg-sky-100 text-sky-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-violet-100 text-violet-800",
  "bg-teal-100 text-teal-800",
];

const SIZES = { md: "size-10 text-sm", lg: "size-16 text-xl" };

type UserAvatarProps = { id: number; name: string; size?: keyof typeof SIZES };

/** Avatar con iniciales; el color depende del id para que no cambie al filtrar u ordenar. */
export function UserAvatar({ id, name, size = "md" }: UserAvatarProps) {
  const color = COLORS[id % COLORS.length] ?? COLORS[0];
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZES[size]} ${color}`}
    >
      {getInitials(name)}
    </span>
  );
}
