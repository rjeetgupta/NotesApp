import type { Request, Response } from "express";
import { noteService } from "../services/note.services";
import { ApiResponse } from "../utils/ApiResponse";
import type {
    CreateNoteInput,
    UpdateNoteInput,
    NoteIdParam,
    NotesQuery,
} from "../validators/notes.validator";

class NoteController {
    private static instance: NoteController;

    private constructor() {
        // Bind all methods to preserve `this` context when used as route handlers
        this.createNote = this.createNote.bind(this);
        this.getAllNotes = this.getAllNotes.bind(this);
        this.getNoteById = this.getNoteById.bind(this);
        this.updateNote = this.updateNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.togglePinNote = this.togglePinNote.bind(this);
        this.getAllTags = this.getAllTags.bind(this);
    }

    public static getInstance(): NoteController {
        if (!NoteController.instance) {
            NoteController.instance = new NoteController();
        }
        return NoteController.instance;
    }

    // CREATE new note

    async createNote(
        req: Request<{}, {}, CreateNoteInput>,
        res: Response,
    ): Promise<void> {
        const createdNote = await noteService.createNote(req.body);

        res.status(201).json(
            ApiResponse.created(createdNote, "Note created successfully"),
        );
    }

    // GET all notes

    async getAllNotes(
        req: Request<{}, {}, {}, NotesQuery>,
        res: Response,
    ): Promise<void> {
        const paginatedNotes = await noteService.getAllNotes(
            req.query as NotesQuery,
        );

        res.status(200).json(
            ApiResponse.ok(paginatedNotes, "Notes fetched successfully"),
        );
    }

    // GET note by ID

    async getNoteById(req: Request<NoteIdParam>, res: Response): Promise<void> {
        const note = await noteService.getNoteById(req.params.id);

        res.status(200).json(ApiResponse.ok(note, "Note fetched successfully"));
    }

    // Update note with ID

    async updateNote(
        req: Request<NoteIdParam, {}, UpdateNoteInput>,
        res: Response,
    ): Promise<void> {
        const updatedNote = await noteService.updateNote(
            req.params.id,
            req.body,
        );

        res.status(200).json(
            ApiResponse.ok(updatedNote, "Note updated successfully"),
        );
    }

    // Delete notes with ID

    async deleteNote(req: Request<NoteIdParam>, res: Response): Promise<void> {
        const deletedNote = await noteService.deleteNote(req.params.id);

        res.status(200).json(
            ApiResponse.noContent(
                `Note '${deletedNote.title}' deleted successfully`,
            ),
        );
    }

    // Toggle pinned notes

    async togglePinNote(
        req: Request<NoteIdParam>,
        res: Response,
    ): Promise<void> {
        const updatedNote = await noteService.togglePinNote(req.params.id);
        const pinMessage = updatedNote.isPinned
            ? "Note pinned"
            : "Note unpinned";

        res.status(200).json(ApiResponse.ok(updatedNote, pinMessage));
    }

    // GET all tags

    async getAllTags(_req: Request, res: Response): Promise<void> {
        const tags = await noteService.getAllTags();

        res.status(200).json(ApiResponse.ok(tags, "Tags fetched successfully"));
    }
}

export const noteController = NoteController.getInstance();
