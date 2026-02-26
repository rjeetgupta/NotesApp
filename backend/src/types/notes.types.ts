import { Document, Types } from "mongoose";

export type NoteTag = string;

export interface INoteDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  tags: NoteTag[];
  isPinned: boolean;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNotePayload {
  title: string;
  content: string;
  tags?: NoteTag[];
  isPinned?: boolean;
  color?: string;
}

export interface IUpdateNotePayload {
  title?: string;
  content?: string;
  tags?: NoteTag[];
  isPinned?: boolean;
  color?: string;
}

export interface INotesQueryParams {
  search?: string;
  tag?: string;
  isPinned?: string;
  page?: string;
  limit?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface IPaginatedNotes {
  notes: INoteDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}