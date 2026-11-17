import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api/posts";
import type { Post } from "@/api/types";
import { nextLocalId } from "./localId";
import { postsQueryKey } from "./usePosts";
import type { PostDraft } from "./validatePost";

/**
 * La API no guarda nada: la publicación creada se añade a la caché, arriba de la lista,
 * con un id local en lugar del 101 que devuelve siempre el servidor.
 */
export function useCreatePost(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: PostDraft) => createPost({ ...draft, userId }),
    onSuccess: (created) => {
      const post: Post = { id: nextLocalId(), userId, title: created.title, body: created.body };
      queryClient.setQueryData<Post[]>(postsQueryKey(userId), (posts = []) => [post, ...posts]);
    },
  });
}
