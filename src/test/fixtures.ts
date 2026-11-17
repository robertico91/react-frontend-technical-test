import type { Post, User } from "@/api/types";

function user(id: number, name: string, username: string): User {
  return {
    id,
    name,
    username,
    email: `${username.toLowerCase()}@example.com`,
    phone: "000",
    website: `${username.toLowerCase()}.example.com`,
    address: { city: "Ciudad" },
    company: { name: "Empresa" },
  };
}

/**
 * Datos propios, no los de la API: con tildes (para la búsqueda) y con un tratamiento
 * ("Mrs.") que las iniciales deben ignorar. Desordenados a propósito para probar el orden.
 */
export const users: User[] = [
  user(1, "Leanne Graham", "Bret"),
  user(2, "José Álvarez", "Pepe"),
  user(3, "Mrs. Dennis Schulist", "Leopoldo"),
  user(4, "Clementine Bauch", "Samantha"),
];

export function postsFor(userId: number, count = 7): Post[] {
  return Array.from({ length: count }, (_, i) => ({
    id: userId * 100 + i + 1,
    userId,
    title: `Publicación ${i + 1} de ${userId}`,
    body: `Texto de la publicación ${i + 1}`,
  }));
}
