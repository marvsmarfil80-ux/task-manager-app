export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  is_shared: boolean;
  owner: User;
}

export interface ProjectCreate {
  name: string;
  description?: string | null;
  is_shared?: boolean;
}

export interface ProjectUpdate {
  name?: string;
  description?: string | null;
  is_shared?: boolean;
}

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  project_id: number;
  project: Project;
  assignees: User[];
}

export interface TaskCreate {
  title: string;
  status?: TaskStatus;
  project_id: number;
}

export interface TaskUpdate {
  title?: string;
  status?: TaskStatus;
}

export interface TaskAssign {
  user_id: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}