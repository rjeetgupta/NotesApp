"use client";

import { useState } from "react";
import { INote } from "@/types/notes.type";
import { togglePinNote, deleteNote } from "@/store/noteSlice";
import ConfirmDialog from "@/components/ui/ConfirmDialog"
import { useAppDispatch, useAppSelector } from "@/store/hook";

interface NoteCardProps {
  note: INote;
  onEdit: (note: INote) => void;
  animationDelay?: number;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NoteCard({ note, onEdit, animationDelay = 0 }: NoteCardProps) {
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((s) => s.notes);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleTogglePin = () => {
    console.log(note)
    dispatch(togglePinNote(note._id));
  };

  const handleDelete = () => {
    dispatch(deleteNote(note._id));
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        className={`
          group relative flex h-full flex-col rounded-xl
          border bg-card text-card-foreground
          shadow-sm transition-all duration-300
          hover:shadow-lg hover:-translate-y-1
          ${note.isPinned ? "border-primary shadow-md" : "border-border"}
        `}
        style={{
          animationDelay: `${animationDelay}ms`,
          background: note.color !== "#1A1A24" ? note.color : undefined,
        }}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <h3 className="flex-1 text-base font-semibold leading-snug tracking-tight line-clamp-2">
            {note.title}
          </h3>

          <button
            onClick={handleTogglePin}
            className={`
              flex h-8 w-8 items-center justify-center rounded-md
              transition-all duration-200
              ${
                note.isPinned
                  ? "bg-primary/30 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            📌
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 pb-4">
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
            {note.content}
          </p>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-4">
            {note.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{note.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border/60 px-5 py-3">
          <span className="text-xs text-muted-foreground">
            {formatDate(note.updatedAt)}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(note)}
              className="flex h-8 w-8 items-center justify-center rounded-md
                         text-muted-foreground transition-all duration-200
                         hover:bg-muted hover:text-foreground"
              title="Edit note"
            >
              ✎
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md
                         text-destructive transition-all duration-200
                         hover:bg-destructive/10"
              title="Delete note"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Note?"
        description={`"${note.title}" will be permanently deleted. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isSubmitting}
      />
    </>
  );
}