import type { User } from "@/api/types";

const collator = new Intl.Collator("es", { sensitivity: "base" });

/** Devuelve una copia ordenada por nombre de la A a la Z (sin mutar la original). */
export function sortUsersByName(users: User[]): User[] {
  return [...users].sort((a, b) => collator.compare(a.name, b.name));
}
