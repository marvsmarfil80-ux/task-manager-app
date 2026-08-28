import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100, "Keep it under 100 characters"),
  description: z.string().trim().max(500, "Keep it under 500 characters").optional().or(z.literal("")),
  is_shared: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
