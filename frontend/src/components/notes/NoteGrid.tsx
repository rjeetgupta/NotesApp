"use client";

import { INote } from "@/types/notes.type";
import NoteCard from "./NoteCard";

interface NotesGridProps {
    notes: INote[];
    onEdit: (note: INote) => void;
}

export default function NotesGrid({ notes, onEdit }: NotesGridProps) {
    return (
        <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4"
        >
            {notes.map((note, index) => (
                <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={onEdit}
                    animationDelay={index * 60}
                />
            ))}
        </div>
    );
}
