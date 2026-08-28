import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Keep it under 100 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
});

export type UserFormValues = z.infer<typeof userFormSchema>;