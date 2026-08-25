import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string()
    .min(5, "Job title must be at least 5 characters.")
    .refine((title) => !title.toLowerCase().includes("free"), "Jobs cannot be free."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  budget: z
    .number({ message: "Budget must be a number." })
    .min(1, "Budget must be at least 1.")
    .refine((budget) => budget % 10 === 0, "Budget must be a multiple of 10."),
});

export type JobFormValues = z.infer<typeof jobSchema>;
