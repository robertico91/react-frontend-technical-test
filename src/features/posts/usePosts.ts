import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "@/api/posts";

export function usePosts(userId: number) {
  return useQuery({
    queryKey: ["posts", userId],
    queryFn: ({ signal }) => getUserPosts(userId, signal),
  });
}
