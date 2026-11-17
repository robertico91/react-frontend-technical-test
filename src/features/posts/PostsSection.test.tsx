import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, test, vi } from "vitest";
import { API_URL } from "@/test/handlers";
import { renderApp } from "@/test/renderApp";
import { server } from "@/test/server";

type User = ReturnType<typeof renderApp>["user"];

async function openForm(user: User) {
  await user.click(await screen.findByRole("button", { name: "Nueva publicación" }));
  return screen.getByRole("dialog", { name: "Nueva publicación" });
}

async function createPost(user: User, title: string, body: string) {
  const dialog = await openForm(user);
  await user.type(within(dialog).getByLabelText("Título"), title);
  await user.type(within(dialog).getByLabelText("Texto"), body);
  await user.click(within(dialog).getByRole("button", { name: "Publicar" }));
}

function postTitles() {
  const list = screen.getByRole("list", { name: "Publicaciones de Leanne Graham" });
  return within(list)
    .getAllByRole("heading", { level: 4 })
    .map((heading) => heading.textContent);
}

/** Cuenta los POST que llegan al servidor, sin cambiar su respuesta. */
function countPosts() {
  const calls = { count: 0 };
  server.events.on("request:start", ({ request }) => {
    if (request.method === "POST") calls.count += 1;
  });
  return calls;
}

afterEach(() => {
  server.events.removeAllListeners();
  vi.restoreAllMocks();
});

describe("publicaciones", () => {
  test("muestra las publicaciones del usuario con su total, 5 por página", async () => {
    renderApp("/users/1");

    expect(
      await screen.findByRole("heading", { name: "Leanne Graham", level: 2 }),
    ).toBeInTheDocument();
    await screen.findByText("Publicación 1 de 1");
    expect(postTitles()).toHaveLength(5);
    expect(screen.getByText("1–5 de 7")).toBeInTheDocument();
  });

  test("si fallan las publicaciones muestra el error y «Reintentar» las trae", async () => {
    server.use(
      http.get(`${API_URL}/users/:userId/posts`, () => HttpResponse.json([], { status: 500 }), {
        once: true,
      }),
    );
    const { user } = renderApp("/users/1");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("No se pudieron cargar las publicaciones.");

    await user.click(within(alert).getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText("Publicación 1 de 1")).toBeInTheDocument();
  });
});

describe("nueva publicación", () => {
  test("enviar vacío o con solo espacios muestra los errores y no hace POST", async () => {
    const posts = countPosts();
    const { user } = renderApp("/users/1");
    const dialog = await openForm(user);
    const title = within(dialog).getByLabelText("Título");
    const body = within(dialog).getByLabelText("Texto");

    await user.click(within(dialog).getByRole("button", { name: "Publicar" }));

    expect(title).toHaveAccessibleDescription("El título es obligatorio");
    expect(body).toHaveAccessibleDescription("El texto es obligatorio");
    expect(title).toHaveAttribute("aria-invalid", "true");
    expect(title).toHaveFocus();

    await user.type(title, "   ");
    await user.type(body, "   ");
    await user.click(within(dialog).getByRole("button", { name: "Publicar" }));

    expect(title).toHaveAccessibleDescription("El título es obligatorio");
    expect(body).toHaveAccessibleDescription("El texto es obligatorio");
    expect(posts.count).toBe(0);
  });

  test("tras el primer intento, el error desaparece al corregir el campo", async () => {
    const { user } = renderApp("/users/1");
    const dialog = await openForm(user);
    const title = within(dialog).getByLabelText("Título");

    await user.click(within(dialog).getByRole("button", { name: "Publicar" }));
    expect(title).toHaveAccessibleDescription("El título es obligatorio");

    await user.type(title, "Hola");

    expect(title).not.toHaveAccessibleDescription();
    expect(title).not.toHaveAttribute("aria-invalid");
  });

  test("al crear una publicación aparece arriba de la lista y se confirma", async () => {
    const { user } = renderApp("/users/1?page=2");
    await screen.findByText("6–7 de 7");

    await createPost(user, "Mi publicación", "Lo que quería contar");

    // Se cierra el panel, se vuelve a la página 1 y la nueva va la primera.
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    // El router aplica el cambio de ?page= en una transición, un instante después de cerrar
    // el panel: hay que esperar a que la lista se actualice.
    await waitFor(() => expect(postTitles()[0]).toBe("Mi publicación"));
    expect(screen.getByText("1–5 de 8")).toBeInTheDocument();
    expect(screen.getByText("Publicación creada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nueva publicación" })).toHaveFocus();
  });

  test("dos publicaciones creadas no repiten key aunque la API devuelva siempre id 101", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { user } = renderApp("/users/1");

    await createPost(user, "Primera", "Uno");
    await waitFor(() => expect(postTitles()[0]).toBe("Primera"));
    await createPost(user, "Segunda", "Dos");
    await waitFor(() => expect(postTitles()[0]).toBe("Segunda"));

    expect(postTitles().slice(0, 2)).toEqual(["Segunda", "Primera"]);
    // Se juntan todos los argumentos de cada llamada: el aviso de React parte el mensaje
    // en varios, y mirar solo el primero haría que el test pasara siempre.
    const errors = consoleError.mock.calls.map((args) => args.map(String).join(" "));
    expect(errors.filter((message) => message.includes("same key"))).toEqual([]);
  });

  test("si falla el envío muestra el error y conserva lo escrito", async () => {
    server.use(http.post(`${API_URL}/posts`, () => HttpResponse.json({}, { status: 500 })));
    const { user } = renderApp("/users/1");

    await createPost(user, "No se guarda", "Texto que no se pierde");

    const dialog = screen.getByRole("dialog", { name: "Nueva publicación" });
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("No se pudo publicar");
    expect(within(dialog).getByLabelText("Título")).toHaveValue("No se guarda");
    expect(within(dialog).getByLabelText("Texto")).toHaveValue("Texto que no se pierde");
    expect(screen.queryByText("No se guarda", { selector: "h4" })).not.toBeInTheDocument();
  });
});
