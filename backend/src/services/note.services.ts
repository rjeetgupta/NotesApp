import { noteRepository } from "../repositories/note.repository";
import { ApiError } from "../utils/ApiError";
import type {
    INoteDocument,
    IPaginatedNotes,
    ICreateNotePayload,
    IUpdateNotePayload,
} from "../types/notes.types";
import type { NotesQuery } from "../validators/notes.validator";

class NoteService {
    private static instance: NoteService;

    private constructor() {}

    public static getInstance(): NoteService {
        if (!NoteService.instance) {
            NoteService.instance = new NoteService();
        }
        return NoteService.instance;
    }

    // Create a new note

    async createNote(payload: ICreateNotePayload): Promise<INoteDocument> {
        const createdNote = await noteRepository.create(payload);
        return createdNote;
    }

    // Get all notes (filtered + paginated)

    async getAllNotes(queryParams: NotesQuery): Promise<IPaginatedNotes> {
        const paginatedResult = await noteRepository.findAll(queryParams);
        return paginatedResult;
    }

    // Get a single note by ID
    async getNoteById(noteId: string): Promise<INoteDocument> {
        const existingNote = await noteRepository.findById(noteId);

        if (!existingNote) {
            throw ApiError.notFound(`Note with id '${noteId}' does not exist`);
        }

        return existingNote;
    }

    // Update note by ID

    async updateNote(
        noteId: string,
        payload: IUpdateNotePayload,
    ): Promise<INoteDocument> {
        // Verify the note exists before updating
        const noteExists = await noteRepository.existsById(noteId);

        if (!noteExists) {
            throw ApiError.notFound(`Note with id '${noteId}' does not exist`);
        }

        const updatedNote = await noteRepository.updateById(noteId, payload);

        if (!updatedNote) {
            throw ApiError.internalServer(
                "Failed to update note. Please try again.",
            );
        }

        return updatedNote;
    }

    // Delete note by ID

    async deleteNote(noteId: string): Promise<INoteDocument> {
        const deletedNote = await noteRepository.deleteById(noteId);

        if (!deletedNote) {
            throw ApiError.notFound(`Note with id '${noteId}' does not exist`);
        }

        return deletedNote;
    }

    // Toggle pin status

    async togglePinNote(noteId: string): Promise<INoteDocument> {
        const existingNote = await noteRepository.findById(noteId);

        if (!existingNote) {
            throw ApiError.notFound(`Note with id '${noteId}' does not exist`);
        }

        const updatedNote = await noteRepository.updateById(noteId, {
            isPinned: !existingNote.isPinned,
        });

        if (!updatedNote) {
            throw ApiError.internalServer(
                "Failed to toggle pin. Please try again.",
            );
        }

        return updatedNote;
    }

    // Get all unique tags

    async getAllTags(): Promise<string[]> {
        return noteRepository.getAllUniqueTags();
    }
}

export const noteService = NoteService.getInstance();