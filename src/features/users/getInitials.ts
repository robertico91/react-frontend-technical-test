const TITLES = new Set(["mr", "mrs", "ms", "miss", "dr"]);

/** Iniciales de las dos primeras palabras del nombre, ignorando tratamientos como "Mrs.". */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word !== "" && !TITLES.has(word.toLowerCase().replace(/\.$/, "")))
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
