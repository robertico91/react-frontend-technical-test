import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderApp } from "@/test/renderApp";

test("carga la lista de usuarios desde la API", async () => {
  renderApp("/");

  expect(await screen.findByRole("link", { name: /Leanne Graham/ })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Elige un usuario" })).toBeInTheDocument();
});
