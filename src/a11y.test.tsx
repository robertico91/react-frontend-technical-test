import { screen, within } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, test } from "vitest";
import { renderApp } from "@/test/renderApp";

/**
 * Pasa axe sobre la página y devuelve las infracciones en texto legible. Sin la regla de
 * contraste: jsdom no calcula estilos ni colores (el contraste se revisa en el navegador).
 */
async function axeViolations() {
  const results = await axe.run(document.body, {
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
  );
}

describe("accesibilidad (axe)", () => {
  test("portada con la lista de usuarios", async () => {
    renderApp("/");
    await screen.findByRole("link", { name: /Leanne Graham/ });

    expect(await axeViolations()).toEqual([]);
  });

  test("detalle de un usuario con sus publicaciones", async () => {
    renderApp("/users/1");
    await screen.findByText("Publicación 1 de 1");

    expect(await axeViolations()).toEqual([]);
  });

  test("formulario de nueva publicación abierto y con errores", async () => {
    const { user } = renderApp("/users/1");
    await user.click(await screen.findByRole("button", { name: "Nueva publicación" }));
    const dialog = screen.getByRole("dialog", { name: "Nueva publicación" });

    expect(await axeViolations()).toEqual([]);

    await user.click(within(dialog).getByRole("button", { name: "Publicar" }));
    expect(within(dialog).getByLabelText("Título")).toHaveAttribute("aria-invalid", "true");

    expect(await axeViolations()).toEqual([]);
  });

  test("usuario no encontrado", async () => {
    renderApp("/users/999");
    await screen.findByRole("heading", { name: "Usuario no encontrado" });

    expect(await axeViolations()).toEqual([]);
  });
});
