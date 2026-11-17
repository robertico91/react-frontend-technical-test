import { QueryClient } from "@tanstack/react-query";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Un reintento cubre un fallo puntual sin hacer esperar varios segundos
        // (con los 3 por defecto y su espera creciente, el error tarda ~7 s en verse).
        retry: 1,
      },
    },
  });
}
