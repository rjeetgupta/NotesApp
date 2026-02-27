"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { INote, NOTE_COLOR_OPTIONS } from "@/types/notes.type";
import {
  createNoteSchema,
  updateNoteSchema,
  CreateNoteFormValues,
} from "@/lib/schema/note.schema";

import Spinner from "@/components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { createNote, updateNote } from "@/store/noteSlice";

interface NoteFormProps {
  editingNote?: INote | null;
  onClose: () => void;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NoteForm({ editingNote, onClose }: NoteFormProps) {
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((s) => s.notes);
  const [tagInput, setTagInput] = useState("");

  const isEditing = !!editingNote;
  const schema = isEditing ? updateNoteSchema : createNoteSchema;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateNoteFormValues>({
    resolver: zodResolver(schema as typeof createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      isPinned: false,
      color: "#1A1A24",
    },
  });

  const watchedTags = watch("tags") ?? [];
  const watchedColor = watch("color");

  useEffect(() => {
    if (editingNote) {
      reset({
        title: editingNote.title,
        content: editingNote.content,
        tags: editingNote.tags,
        isPinned: editingNote.isPinned,
        color: editingNote.color,
      });
    }
  }, [editingNote, reset]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "");
      if (!watchedTags.includes(newTag) && watchedTags.length < 10) {
        setValue("tags", [...watchedTags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", watchedTags.filter((t) => t !== tagToRemove));
  };

  const onSubmit = async (data: CreateNoteFormValues) => {
    if (isEditing && editingNote) {
      await dispatch(updateNote({ noteId: editingNote.id, payload: data }));
    } else {
      await dispatch(createNote(data));
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {isEditing ? "Edit Note" : "New Note"}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="Note title..."
              className={`
                w-full rounded-lg border bg-background px-3 py-2 text-sm
                transition-colors outline-none
                ${errors.title
                  ? "border-destructive focus:ring-2 focus:ring-destructive/30"
                  : "border-input focus:ring-2 focus:ring-ring/40"}
              `}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>


          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Content <span className="text-destructive">*</span>
            </label>
            <textarea
              {...register("content")}
              rows={5}
              placeholder="Write your note here..."
              className={`
                w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm
                transition-colors outline-none
                ${errors.content
                  ? "border-destructive focus:ring-2 focus:ring-destructive/30"
                  : "border-input focus:ring-2 focus:ring-ring/40"}
              `}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>


          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Tags <span className="text-muted-foreground">(Enter or comma)</span>
            </label>

            <div className="flex flex-wrap gap-2 rounded-lg border border-input bg-background p-2 min-h-11">
              {watchedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="opacity-70 hover:opacity-100"
                  >
                    ✕
                  </button>
                </span>
              ))}

              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={watchedTags.length === 0 ? "Add tags..." : ""}
                className="flex-1 min-w-24 bg-transparent text-sm outline-none"
              />
            </div>
          </div>


          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-3">
              Color
            </label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-3">
                  {NOTE_COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`
                        h-8 w-8 rounded-full border-2 transition-all
                        hover:scale-110
                        ${
                          watchedColor === option.value
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border"
                        }
                      `}
                      style={{ background: option.value }}
                      title={option.label}
                    />
                  ))}
                </div>
              )}
            />
          </div>


          <Controller
            name="isPinned"
            control={control}
            render={({ field }) => (
              <label className="flex items-center justify-between rounded-lg border border-input bg-background px-4 py-2 cursor-pointer">
                <span className="text-sm text-muted-foreground">
                  Pin this note
                </span>

                <div
                  onClick={() => field.onChange(!field.value)}
                  className={`
                    relative h-5 w-10 rounded-full transition-colors
                    ${field.value ? "bg-primary" : "bg-muted"}
                  `}
                >
                  <div
                    className={`
                      absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all
                      ${field.value ? "translate-x-5" : "translate-x-1"}
                    `}
                  />
                </div>
              </label>
            )}
          />


          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border bg-background py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Note"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}