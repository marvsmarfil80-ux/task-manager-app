import { z } from "zod";

export const taskStatusEnum = z.enum(["todo", "in_progress", "done"]);

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Task title is required").max(150, "Keep it under 150 characters"),
  project_id: z.coerce.number().int().min(1, "Select a project"),
  status: taskStatusEnum,
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;