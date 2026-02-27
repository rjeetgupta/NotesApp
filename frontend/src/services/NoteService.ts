import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";
import { IApiResponse, IApiError } from "@/types/api.types";
import {
    INote,
    IPaginatedNotes,
    ICreateNotePayload,
    IUpdateNotePayload,
    INotesQueryParams,
} from "@/types/note.types";

class NoteService {
    private static instance: NoteService;
    private readonly baseEndpoint = "/notes";

    private constructor() {}

    public static getInstance(): NoteService {
        if (!NoteService.instance) {
            NoteService.instance = new NoteService();
        }
        return NoteService.instance;
    }

    // Error handler
    private handleServiceError(error: unknown): never {
        if (error instanceof AxiosError) {
            const apiError = error.response?.data as IApiError | undefined;

            const errorMessage = apiError?.errors?.length
                ? apiError.errors.join(", ")
                : (apiError?.message ??
                  error.message ??
                  "An unexpected error occurred");

            throw new Error(errorMessage);
        }

        throw new Error("An unexpected error occurred. Please try again.");
    }

    // Create Note

    async createNote(payload: ICreateNotePayload): Promise<INote> {
        try {
            const response = await axiosInstance.post<IApiResponse<INote>>(
                this.baseEndpoint,
                payload,
            );
            return response.data.data;
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    // Get All Notes

    async getAllNotes(
        queryParams?: INotesQueryParams,
    ): Promise<IPaginatedNotes> {
        try {
            const response = await axiosInstance.get<
                IApiResponse<IPaginatedNotes>
            >(this.baseEndpoint, { params: queryParams });
            return response.data.data;
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    // Get Note By ID

    async getNoteById(noteId: string): Promise<INote> {
        try {
            const response = await axiosInstance.get<IApiResponse<INote>>(
                `${this.baseEndpoint}/${noteId}`,
            );
            return response.data.data;
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    // Update Note

    async updateNote(
        noteId: string,
        payload: IUpdateNotePayload,
    ): Promise<INote> {
        try {
            const response = await axiosInstance.patch<IApiResponse<INote>>(
                `${this.baseEndpoint}/${noteId}`,
                payload,
            );
            return response.data.data;
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    // Delete Note

    async deleteNote(noteId: string): Promise<void> {
        try {
            await axiosInstance.delete<IApiResponse<null>>(
                `${this.baseEndpoint}/${noteId}`,
            );
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    // Toggle Pin

    async togglePinNote(noteId: string): Promise<INote> {
        try {
            const response = await axiosInstance.patch<IApiResponse<INote>>(
                `${this.baseEndpoint}/${noteId}/pin`,
            );
            return response.data.data;
        } catch (error) {
            this.handleServiceError(error);
        }
    }

    // Get All Tags

    async getAllTags(): Promise<string[]> {
        try {
            const response = await axiosInstance.get<IApiResponse<string[]>>(
                `${this.baseEndpoint}/tags`,
            );
            return response.data.data;
        } catch (error) {
            this.handleServiceError(error);
        }
    }
}

export const noteService = NoteService.getInstance();
