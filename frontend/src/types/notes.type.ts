export interface INote {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    isPinned: boolean;
    color: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateNotePayload {
    title: string;
    content: string;
    tags?: string[];
    isPinned?: boolean;
    color?: string;
}

export interface IUpdateNotePayload {
    title?: string;
    content?: string;
    tags?: string[];
    isPinned?: boolean;
    color?: string;
}

export interface IPaginatedNotes {
    notes: INote[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface INotesQueryParams {
    search?: string;
    tag?: string;
    isPinned?: boolean;
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "updatedAt" | "title";
    sortOrder?: "asc" | "desc";
}

export interface INoteColorOption {
    value: string;
    label: string;
    className: string;
}

export const NOTE_COLOR_OPTIONS: INoteColorOption[] = [
    { value: "#1A1A24", label: "Default", className: "note-color-default" },
    { value: "#2A2410", label: "Yellow", className: "note-color-yellow" },
    { value: "#0F2318", label: "Green", className: "note-color-green" },
    { value: "#0F1A2E", label: "Blue", className: "note-color-blue" },
    { value: "#2A0F0F", label: "Red", className: "note-color-red" },
    { value: "#1A0F2A", label: "Purple", className: "note-color-purple" },
    { value: "#2A1A0A", label: "Orange", className: "note-color-orange" },
    { value: "#0A2020", label: "Teal", className: "note-color-teal" },
];
