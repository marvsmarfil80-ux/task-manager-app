import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { LoginPayload, RegisterPayload } from "@/types";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: api.auth.me,
    // Don't retry a failed auth check — a 401 means "not logged in," not
    // "network hiccup," so retrying just delays the redirect to /login.
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginPayload) => api.auth.login(data),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterPayload) => api.auth.register(data),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.auth.logout,
    onSuccess: () => {
      // Wipe every cached query — the next person to log in on this browser
      // should never see a flash of the previous user's projects/tasks.
      queryClient.clear();
    },
  });
}