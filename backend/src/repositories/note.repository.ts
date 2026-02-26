import { Types, type SortOrder } from "mongoose";
import { NoteModel } from "../models/notes.model";
import type {
    INoteDocument,
    ICreateNotePayload,
    IUpdateNotePayload,
    IPaginatedNotes,
} from "../types/notes.types";
import type { NotesQuery } from "../validators/notes.validator";

class NoteRepository {
    private static instance: NoteRepository;

    private constructor() {}

    public static getInstance(): NoteRepository {
        if (!NoteRepository.instance) {
            NoteRepository.instance = new NoteRepository();
        }
        return NoteRepository.instance;
    }

    // Create

    async create(payload: ICreateNotePayload): Promise<INoteDocument> {
        const note = await NoteModel.create(payload);
        return note;
    }

    // Read (single)

    async findById(noteId: string): Promise<INoteDocument | null> {
        if (!Types.ObjectId.isValid(noteId)) return null;
        return NoteModel.findById(noteId).lean({ virtuals: true });
    }

    // Read (many with filters + pagination)

    async findAll(queryParams: NotesQuery): Promise<IPaginatedNotes> {
        const { search, tag, isPinned, page, limit, sortBy, sortOrder } =
            queryParams;

        // Build dynamic filter
        const filterQuery: FilterQuery<INoteDocument> = {};

        if (search) {
            filterQuery.$text = { $search: search };
        }

        if (tag) {
            filterQuery.tags = { $in: [tag] };
        }

        if (isPinned !== undefined) {
            filterQuery.isPinned = isPinned;
        }

        // Build sort
        const sortOptions: { [key: string]: SortOrder } = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        // Always sort pinned notes first, then by requested sort
        sortOptions.isPinned = -1;

        const skip = (page - 1) * limit;

        const [notes, total] = await Promise.all([
            NoteModel.find(filterQuery)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean({ virtuals: true }),
            NoteModel.countDocuments(filterQuery),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            notes: notes as INoteDocument[],
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }

    // Update

    async updateById(
        noteId: string,
        payload: IUpdateNotePayload,
    ): Promise<INoteDocument | null> {
        if (!Types.ObjectId.isValid(noteId)) return null;

        return NoteModel.findByIdAndUpdate(
            noteId,
            { $set: payload },
            {
                new: true, // return updated document
                runValidators: true,
            },
        ).lean({ virtuals: true });
    }

    // Delete

    async deleteById(noteId: string): Promise<INoteDocument | null> {
        if (!Types.ObjectId.isValid(noteId)) return null;
        return NoteModel.findByIdAndDelete(noteId).lean({ virtuals: true });
    }

    async existsById(noteId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(noteId)) return false;
        const count = await NoteModel.countDocuments({ _id: noteId });
        return count > 0;
    }

    async getAllUniqueTags(): Promise<string[]> {
        const result = await NoteModel.distinct("tags");
        return result as string[];
    }
}

export const noteRepository = NoteRepository.getInstance();
