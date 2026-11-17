import { fetchJson } from "./client";
import type { User } from "./types";

export function getUsers(signal?: AbortSignal): Promise<User[]> {
  return fetchJson<User[]>("/users", { signal });
}
