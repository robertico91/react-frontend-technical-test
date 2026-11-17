import type { User } from "@/api/types";

/** Minúsculas y sin tildes, para comparar "José" con "jose". */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/** Usuarios cuyo nombre contiene la búsqueda, sin distinguir mayúsculas ni tildes. */
export function filterUsers(users: User[], search: string): User[] {
  const term = normalize(search.trim());
  if (term === "") return users;
  return users.filter((user) => normalize(user.name).includes(term));
}
