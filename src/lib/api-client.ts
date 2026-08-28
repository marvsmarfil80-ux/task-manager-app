import type {
  User,
  UserCreate,
  UserUpdate,
  Project,
  ProjectCreate,
  ProjectUpdate,
  Task,
  TaskCreate,
  TaskUpdate,
  TaskAssign,
  LoginPayload,
  RegisterPayload,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set. Check your .env.local file.");
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    // Required so the browser sends/receives the httpOnly session cookie
    // across origins (frontend :3000 -> backend :8000).
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    let message = bodyText || `API error ${res.status} on ${path}`;
    try {
      const parsed = JSON.parse(bodyText);
      if (parsed?.detail) {
        message = typeof parsed.detail === "string" ? parsed.detail : JSON.stringify(parsed.detail);
      }
    } catch {
      // response wasn't JSON — keep the raw text as the message
    }
    throw new Error(message);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  auth: {
    register: (data: RegisterPayload) => apiFetch<User>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: LoginPayload) => apiFetch<User>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    logout: () => apiFetch<{ detail: string }>("/auth/logout", { method: "POST" }),
    me: () => apiFetch<User>("/auth/me"),
  },
  users: {
    list: () => apiFetch<User[]>("/users/"),
    create: (data: UserCreate) =>
      apiFetch<User>("/users/", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: UserUpdate) =>
      apiFetch<User>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      apiFetch<{ detail: string }>(`/users/${id}`, { method: "DELETE" }),
  },
  projects: {
    list: () => apiFetch<Project[]>("/projects/"),
    get: (id: number) => apiFetch<Project>(`/projects/${id}`),
    create: (data: ProjectCreate) =>
      apiFetch<Project>("/projects/", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: ProjectUpdate) =>
      apiFetch<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      apiFetch<{ detail: string }>(`/projects/${id}`, { method: "DELETE" }),
  },
  tasks: {
    list: () => apiFetch<Task[]>("/tasks/"),
    create: (data: TaskCreate) =>
      apiFetch<Task>("/tasks/", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: TaskUpdate) =>
      apiFetch<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      apiFetch<{ detail: string }>(`/tasks/${id}`, { method: "DELETE" }),
    assign: (taskId: number, data: TaskAssign) =>
      apiFetch<Task>(`/tasks/${taskId}/assign`, { method: "POST", body: JSON.stringify(data) }),
    unassign: (taskId: number, userId: number) =>
      apiFetch<Task>(`/tasks/${taskId}/unassign/${userId}`, { method: "DELETE" }),
  },
};