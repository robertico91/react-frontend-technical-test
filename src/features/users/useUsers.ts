import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/users";
import { sortUsersByName } from "./sortUsersByName";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: ({ signal }) => getUsers(signal),
    // Se ordena una vez al llegar los datos; el filtro posterior conserva el orden.
    select: sortUsersByName,
  });
}
