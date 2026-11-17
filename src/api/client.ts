const API_URL = "https://jsonplaceholder.typicode.com";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * fetch no lanza con respuestas 4xx/5xx: aquí se comprueba `res.ok` para que
 * esos casos lleguen como error a quien llama (y a TanStack Query).
 */
export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  if (!res.ok) {
    throw new ApiError(res.status, `La petición a ${path} falló (${res.status})`);
  }
  const data: T = await res.json();
  return data;
}
