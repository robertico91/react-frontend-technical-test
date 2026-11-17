import { http, HttpResponse, type PathParams } from "msw";
import type { NewPost } from "@/api/types";
import { postsFor, users } from "./fixtures";

export const API_URL = "https://jsonplaceholder.typicode.com";

/** Comportamiento normal de la API. Cada test puede sustituirlo con server.use(...). */
export const handlers = [
  http.get(`${API_URL}/users`, () => HttpResponse.json(users)),

  http.get(`${API_URL}/users/:userId/posts`, ({ params }) =>
    HttpResponse.json(postsFor(Number(params.userId))),
  ),

  // Como la API real: responde siempre con id 101 y no guarda nada.
  http.post<PathParams, NewPost>(`${API_URL}/posts`, async ({ request }) => {
    const post = await request.json();
    return HttpResponse.json({ ...post, id: 101 }, { status: 201 });
  }),
];
