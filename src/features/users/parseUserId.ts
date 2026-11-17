/** Id de usuario válido (entero positivo) a partir del parámetro de la URL, o null. */
export function parseUserId(param: string | undefined): number | null {
  if (!param || !/^\d+$/.test(param)) return null;
  const id = Number(param);
  return id > 0 ? id : null;
}
