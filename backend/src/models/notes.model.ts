import mongoose, { Schema } from "mongoose";
import type { INoteDocument } from "../types/notes.types";

const NOTE_COLORS = [
    "#ffffff",
    "#fef08a",
    "#bbf7d0",
    "#bfdbfe",
    "#fecaca",
    "#e9d5ff",
    "#fed7aa",
    "#cffafe",
];

const NoteSchema = new Schema<INoteDocument>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [1, "Title must be at least 1 character"],
            maxlength: [100, "Title must not exceed 200 characters"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
            minlength: [1, "Content must be at least 1 character"],
            maxlength: [10000, "Content must not exceed 10000 characters"],
        },
        tags: {
            type: [String],
            default: [],
            validate: {
                validator: (tagsArray: string[]) => tagsArray.length <= 10,
                message: "A note can have at most 10 tags",
            },
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: "#ffffff",
            enum: {
                values: NOTE_COLORS,
                message: "Invalid note color",
            },
        },
    },
    {
        timestamps: true,     
    },
);

// Text index for full-text search on title and content
NoteSchema.index({ title: "text", content: "text" });
NoteSchema.index({ isPinned: -1, createdAt: -1 });
NoteSchema.index({ tags: 1 });

const NoteModel = mongoose.model<INoteDocument>("Note", NoteSchema);

export { NoteModel, NOTE_COLORS };