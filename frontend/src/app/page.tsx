"use client";

import { useEffect, useState } from "react";
import { fetchAllNotes, fetchAllTags } from "@/store/noteSlice";
import { INote } from "@/types/notes.type";
import NotesToolbar from "@/components/notes/NoteToolbar";
import NotesGrid from "@/components/notes/NoteGrid";
import NotesSkeleton from "@/components/notes/NotesSkeleton";
import NoteForm from "@/components/notes/NoteForm";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { useAppDispatch, useAppSelector } from "@/store/hook";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { notes, isLoading, errorMessage, queryParams } = useAppSelector(
    (s) => s.notes
  );

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<INote | null>(null);

  useEffect(() => {
    dispatch(fetchAllNotes(queryParams));
    dispatch(fetchAllTags());
  }, [dispatch]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setShowNoteForm(true);
  };

  const handleOpenEdit = (note: INote) => {
    setEditingNote(note);
    setShowNoteForm(true);
  };

  const handleCloseForm = () => {
    setShowNoteForm(false);
    setEditingNote(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          My Notes
        </h1>
        <p className="text-sm text-muted-foreground">
          Capture, organise, and revisit your thoughts
        </p>
      </div>

      <div className="mb-8">
        <NotesToolbar onCreateClick={handleOpenCreate} />
      </div>

      {errorMessage && !isLoading && (
        <div className="mb-8 rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <NotesSkeleton />
      ) : notes.length === 0 ? (
        <EmptyState
          title={queryParams.search ? "No notes found" : "No notes yet"}
          description={
            queryParams.search
              ? `No results for "${queryParams.search}". Try a different keyword.`
              : "Create your first note to get started."
          }
          action={
            !queryParams.search && (
              <button
                onClick={handleOpenCreate}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                + Create your first note
              </button>
            )
          }
        />
      ) : (
        <>
          <NotesGrid notes={notes} onEdit={handleOpenEdit} />
          <Pagination />
        </>
      )}

      {showNoteForm && (
        <NoteForm editingNote={editingNote} onClose={handleCloseForm} />
      )}
    </div>
  );
}