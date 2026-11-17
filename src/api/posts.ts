import { fetchJson } from "./client";
import type { NewPost, Post } from "./types";

export function getUserPosts(userId: number, signal?: AbortSignal): Promise<Post[]> {
  return fetchJson<Post[]>(`/users/${userId}/posts`, { signal });
}

export function createPost(post: NewPost): Promise<Post> {
  return fetchJson<Post>("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(post),
  });
}
