import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "@/api/posts";

export function postsQueryKey(userId: number) {
  return ["posts", userId] as const;
}

export function usePosts(userId: number) {
  return useQuery({
    queryKey: postsQueryKey(userId),
    queryFn: ({ signal }) => getUserPosts(userId, signal),
    // Las publicaciones creadas solo viven en la caché (la API no las guarda): un refetch las
    // borraría, y si la caché se liberase al cambiar de usuario, se perderían al volver.
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
