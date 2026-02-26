import { z } from "zod";
import { NOTE_COLORS } from "../models/notes.model";

const noteTitleSchema = z
    .string("Title is required")
    .trim()
    .min(1, "Title must be at least 1 character")
    .max(200, "Title must not exceed 200 characters");

const noteContentSchema = z
    .string("Content is required")
    .trim()
    .min(1, "Content must be at least 1 character")
    .max(10000, "Content must not exceed 10000 characters");

const noteTagsSchema = z
    .array(z.string().trim().min(1).max(30))
    .max(10, "A note can have at most 10 tags")
    .optional()
    .default([]);

const noteColorSchema = z
    .enum(NOTE_COLORS as [string, ...string[]], {
        error: () => "Invalid note color selected",
    })
    .optional()
    .default("#ffffff");

const noteIsPinnedSchema = z.boolean().optional().default(false);

export const createNoteSchema = z.object({
    title: noteTitleSchema,
    content: noteContentSchema,
    tags: noteTagsSchema,
    isPinned: noteIsPinnedSchema,
    color: noteColorSchema,
});

export const updateNoteSchema = z
    .object({
        title: noteTitleSchema.optional(),
        content: noteContentSchema.optional(),
        tags: noteTagsSchema,
        isPinned: z.boolean().optional(),
        color: noteColorSchema,
    })
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        { message: "At least one field must be provided for update" },
    );

// Route params schema

export const noteIdParamSchema = z.object({
    id: z
        .string("Note ID is required")
        .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId format"),
});

// Query params schema

export const notesQuerySchema = z.object({
    search: z.string().trim().max(100).optional(),
    tag: z.string().trim().max(30).optional(),
    isPinned: z
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .optional(),
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .pipe(z.number().int().positive()),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .pipe(z.number().int().min(1).max(100)),
    sortBy: z
        .enum(["createdAt", "updatedAt", "title"])
        .optional()
        .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Inferred TS types from Zod

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type NoteIdParam = z.infer<typeof noteIdParamSchema>;
export type NotesQuery = z.infer<typeof notesQuerySchema>;
