import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { API_URL } from "@/test/handlers";
import { renderApp } from "@/test/renderApp";
import { server } from "@/test/server";

function userList() {
  return screen.getByRole("region", { name: "Usuarios" });
}

function userNames() {
  return within(userList())
    .queryAllByRole("link")
    .map((link) => link.textContent);
}

describe("lista de usuarios", () => {
  test("muestra los usuarios ordenados por nombre con el total", async () => {
    renderApp("/");

    await screen.findByRole("link", { name: /Leanne Graham/ });
    expect(userNames()).toEqual([
      expect.stringContaining("Clementine Bauch"),
      expect.stringContaining("José Álvarez"),
      expect.stringContaining("Leanne Graham"),
      expect.stringContaining("Mrs. Dennis Schulist"),
    ]);
    expect(within(userList()).getByText("4")).toBeInTheDocument();
  });

  test("filtra por nombre sin distinguir mayúsculas ni tildes", async () => {
    const { user } = renderApp("/");
    const search = await screen.findByRole("searchbox", { name: "Buscar usuario por nombre" });
    await screen.findByRole("link", { name: /Leanne Graham/ });

    await user.type(search, "JOSE");

    // useDeferredValue: la lista se actualiza justo después de escribir.
    await waitFor(() => expect(userNames()).toEqual([expect.stringContaining("José Álvarez")]));
    expect(within(userList()).getByText(/1 de 4/)).toBeInTheDocument();
  });

  test("sin resultados ofrece volver a ver todos y devuelve el foco al buscador", async () => {
    const { user } = renderApp("/");
    const search = await screen.findByRole("searchbox", { name: "Buscar usuario por nombre" });
    await screen.findByRole("link", { name: /Leanne Graham/ });

    await user.type(search, "zzz");
    expect(await screen.findByText("Ningún usuario coincide con «zzz».")).toBeInTheDocument();
    expect(userNames()).toEqual([]);

    await user.click(screen.getByRole("button", { name: "Ver todos los usuarios" }));

    await waitFor(() => expect(userNames()).toHaveLength(4));
    expect(search).toHaveValue("");
    expect(search).toHaveFocus();
  });

  test("si falla la carga muestra el error y «Reintentar» trae los datos", async () => {
    server.use(
      // Un 500 con un cuerpo JSON válido: solo comprobando res.ok se trata como error.
      http.get(`${API_URL}/users`, () => HttpResponse.json([], { status: 500 }), { once: true }),
    );
    const { user } = renderApp("/");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("No se pudieron cargar los usuarios.");
    // El buscador sigue visible aunque falle la carga.
    expect(
      screen.getByRole("searchbox", { name: "Buscar usuario por nombre" }),
    ).toBeInTheDocument();

    await user.click(within(alert).getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByRole("link", { name: /Leanne Graham/ })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
