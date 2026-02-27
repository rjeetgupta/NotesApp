import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { noteService } from "@/services/noteService";
import {
    INote,
    IPaginatedNotes,
    ICreateNotePayload,
    IUpdateNotePayload,
    INotesQueryParams,
} from "@/types/note.types";

// State shape
interface NoteState {
    notes: INote[];
    selectedNote: INote | null;
    tags: string[];
    pagination: Omit<IPaginatedNotes, "notes"> | null;
    queryParams: INotesQueryParams;
    isLoading: boolean;
    isSubmitting: boolean;
    errorMessage: string | null;
    successMessage: string | null;
}

const initialState: NoteState = {
    notes: [],
    selectedNote: null,
    tags: [],
    pagination: null,
    queryParams: { page: 1, limit: 12, sortBy: "createdAt", sortOrder: "desc" },
    isLoading: false,
    isSubmitting: false,
    errorMessage: null,
    successMessage: null,
};

// Async Thunks

export const fetchAllNotes = createAsyncThunk(
    "notes/fetchAll",
    async (queryParams: INotesQueryParams | undefined, { rejectWithValue }) => {
        try {
            return await noteService.getAllNotes(queryParams);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const fetchNoteById = createAsyncThunk(
    "notes/fetchById",
    async (noteId: string, { rejectWithValue }) => {
        try {
            return await noteService.getNoteById(noteId);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const createNote = createAsyncThunk(
    "notes/create",
    async (payload: ICreateNotePayload, { rejectWithValue }) => {
        try {
            return await noteService.createNote(payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const updateNote = createAsyncThunk(
    "notes/update",
    async (
        { noteId, payload }: { noteId: string; payload: IUpdateNotePayload },
        { rejectWithValue },
    ) => {
        try {
            return await noteService.updateNote(noteId, payload);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const deleteNote = createAsyncThunk(
    "notes/delete",
    async (noteId: string, { rejectWithValue }) => {
        try {
            await noteService.deleteNote(noteId);
            return noteId;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const togglePinNote = createAsyncThunk(
    "notes/togglePin",
    async (noteId: string, { rejectWithValue }) => {
        try {
            return await noteService.togglePinNote(noteId);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const fetchAllTags = createAsyncThunk(
    "notes/fetchTags",
    async (_, { rejectWithValue }) => {
        try {
            return await noteService.getAllTags();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setSelectedNote(state, action: PayloadAction<INote | null>) {
            state.selectedNote = action.payload;
        },
        setQueryParams(
            state,
            action: PayloadAction<Partial<INotesQueryParams>>,
        ) {
            state.queryParams = { ...state.queryParams, ...action.payload };
        },
        clearMessages(state) {
            state.errorMessage = null;
            state.successMessage = null;
        },
        clearError(state) {
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch All Notes
        builder
            .addCase(fetchAllNotes.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(fetchAllNotes.fulfilled, (state, action) => {
                state.isLoading = false;
                const { notes, ...paginationMeta } = action.payload;
                state.notes = notes;
                state.pagination = paginationMeta;
            })
            .addCase(fetchAllNotes.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload as string;
            });

        // Fetch Single Note
        builder
            .addCase(fetchNoteById.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(fetchNoteById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedNote = action.payload;
            })
            .addCase(fetchNoteById.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload as string;
            });

        // Create Note
        builder
            .addCase(createNote.pending, (state) => {
                state.isSubmitting = true;
                state.errorMessage = null;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.notes.unshift(action.payload);
                state.successMessage = "Note created successfully";
            })
            .addCase(createNote.rejected, (state, action) => {
                state.isSubmitting = false;
                state.errorMessage = action.payload as string;
            });

        // Update Note
        builder
            .addCase(updateNote.pending, (state) => {
                state.isSubmitting = true;
                state.errorMessage = null;
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                state.isSubmitting = false;
                const noteIndex = state.notes.findIndex(
                    (note) => note.id === action.payload.id,
                );
                if (noteIndex !== -1) {
                    state.notes[noteIndex] = action.payload;
                }
                if (state.selectedNote?.id === action.payload.id) {
                    state.selectedNote = action.payload;
                }
                state.successMessage = "Note updated successfully";
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.isSubmitting = false;
                state.errorMessage = action.payload as string;
            });

        // Delete Note
        builder
            .addCase(deleteNote.pending, (state) => {
                state.isSubmitting = true;
                state.errorMessage = null;
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.notes = state.notes.filter(
                    (note) => note.id !== action.payload,
                );
                if (state.selectedNote?.id === action.payload) {
                    state.selectedNote = null;
                }
                state.successMessage = "Note deleted successfully";
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.isSubmitting = false;
                state.errorMessage = action.payload as string;
            });

        // Toggle Pin
        builder
            .addCase(togglePinNote.fulfilled, (state, action) => {
                const noteIndex = state.notes.findIndex(
                    (note) => note.id === action.payload.id,
                );
                if (noteIndex !== -1) {
                    state.notes[noteIndex] = action.payload;
                }
                state.successMessage = action.payload.isPinned
                    ? "Note pinned"
                    : "Note unpinned";
            })
            .addCase(togglePinNote.rejected, (state, action) => {
                state.errorMessage = action.payload as string;
            });

        // Fetch Tags
        builder.addCase(fetchAllTags.fulfilled, (state, action) => {
            state.tags = action.payload;
        });
    },
});

export const { setSelectedNote, setQueryParams, clearMessages, clearError } =
    noteSlice.actions;

export default noteSlice.reducer;
