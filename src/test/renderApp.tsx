import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "@/App";
import { ToastProvider } from "@/components/toast/ToastProvider";

/**
 * Monta la app completa en una ruta, con un QueryClient nuevo por test (sin caché compartida)
 * y sin reintentos: con ellos, los tests de error tardarían y fallarían a veces.
 */
export function renderApp(route = "/") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const user = userEvent.setup();

  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return { user, queryClient, ...result };
}
