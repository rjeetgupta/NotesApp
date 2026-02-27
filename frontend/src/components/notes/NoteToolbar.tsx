"use client";

import { useState, useCallback } from "react";
import { fetchAllNotes, setQueryParams } from "@/store/noteSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";

function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

interface NotesToolbarProps {
  onCreateClick: () => void;
}

export default function NotesToolbar({
  onCreateClick,
}: NotesToolbarProps) {
  const dispatch = useAppDispatch();
  const { queryParams, tags } = useAppSelector((s) => s.notes);
  const [searchValue, setSearchValue] = useState(queryParams.search ?? "");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const updated = { ...queryParams, search: value || undefined, page: 1 };
      dispatch(setQueryParams(updated));
      dispatch(fetchAllNotes(updated));
    }, 400),
    [queryParams, dispatch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleTagFilter = (tag: string) => {
    const updated = {
      ...queryParams,
      tag: queryParams.tag === tag ? undefined : tag,
      page: 1,
    };
    dispatch(setQueryParams(updated));
    dispatch(fetchAllNotes(updated));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split("_") as [
      "createdAt" | "updatedAt" | "title",
      "asc" | "desc"
    ];
    const updated = { ...queryParams, sortBy, sortOrder, page: 1 };
    dispatch(setQueryParams(updated));
    dispatch(fetchAllNotes(updated));
  };

  const sortValue = `${
    queryParams.sortBy ?? "createdAt"
  }_${queryParams.sortOrder ?? "desc"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            ⌕
          </span>

          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search notes..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring/40"
          />
        </div>

        {/* Sort */}
        <select
          value={sortValue}
          onChange={handleSortChange}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring/40 sm:w-48"
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="updatedAt_desc">Recently Updated</option>
          <option value="title_asc">Title A → Z</option>
          <option value="title_desc">Title Z → A</option>
        </select>

        <button
          onClick={onCreateClick}
          className="whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          + New Note
        </button>
      </div>


      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">

          {tags.map((tag) => {
            const isActive = queryParams.tag === tag;

            return (
              <button
                key={tag}
                onClick={() => handleTagFilter(tag)}
                className={`
                  rounded-md px-3 py-1 text-xs font-medium transition
                  ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary"
                      : "bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground"
                  }
                `}
              >
                #{tag}
              </button>
            );
          })}

          {queryParams.tag && (
            <button
              onClick={() => handleTagFilter(queryParams.tag!)}
              className="rounded-md border border-destructive bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive transition hover:opacity-90"
            >
              Clear filter ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}