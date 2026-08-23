import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: api.users.list,
  });
}