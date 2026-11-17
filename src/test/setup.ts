import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import "./jsdomPolyfills";
import { server } from "./server";

// "error": una petición sin handler hace fallar el test en lugar de salir a la red.
// (En MSW 3 la opción es onUnhandledFrame; en MSW 2 era onUnhandledRequest.)
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
