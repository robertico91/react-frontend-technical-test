import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderApp } from "@/test/renderApp";

test("carga la lista de usuarios desde la API", async () => {
  renderApp("/");

  expect(await screen.findByRole("link", { name: /Leanne Graham/ })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Elige un usuario" })).toBeInTheDocument();
});

test.each(["/users/999", "/users/abc"])(
  "%s muestra «Usuario no encontrado» en lugar de una pantalla rota",
  async (route) => {
    renderApp(route);

    expect(
      await screen.findByRole("heading", { name: "Usuario no encontrado" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver la lista de usuarios" })).toBeInTheDocument();
  },
);

test("una ruta inexistente muestra «Página no encontrada»", async () => {
  renderApp("/otra-cosa");

  expect(await screen.findByRole("heading", { name: "Página no encontrada" })).toBeInTheDocument();
});
