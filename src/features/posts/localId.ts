let lastLocalId = 0;

/**
 * POST /posts siempre responde con id 101: dos publicaciones creadas tendrían la misma `key`.
 * Las creadas usan un id local negativo y decreciente (-1, -2…): sigue siendo un número y nunca
 * coincide con los de la API, que son positivos.
 */
export function nextLocalId(): number {
  lastLocalId -= 1;
  return lastLocalId;
}
