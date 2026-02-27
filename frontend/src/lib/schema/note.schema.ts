import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string("Title is required")
    .trim()
    .min(1, "Title must be at least 1 character")
    .max(200, "Title must not exceed 200 characters"),

  content: z
    .string("Content is required")
    .trim()
    .min(1, "Content must be at least 1 character")
    .max(10000, "Content must not exceed 10000 characters"),

  tags: z
    .array(z.string().trim().min(1).max(30))
    .max(10, "Maximum 10 tags allowed")
    .optional()
    .default([]),

  isPinned: z.boolean().optional().default(false),

  color: z.string().optional().default("#1A1A24"),
});

export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title must be at least 1 character")
      .max(200, "Title must not exceed 200 characters")
      .optional(),

    content: z
      .string()
      .trim()
      .min(1, "Content must be at least 1 character")
      .max(10000, "Content must not exceed 10000 characters")
      .optional(),

    tags: z
      .array(z.string().trim().min(1).max(30))
      .max(10, "Maximum 10 tags allowed")
      .optional(),

    isPinned: z.boolean().optional(),

    color: z.string().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateNoteFormValues = z.infer<typeof createNoteSchema>;
export type UpdateNoteFormValues = z.infer<typeof updateNoteSchema>;