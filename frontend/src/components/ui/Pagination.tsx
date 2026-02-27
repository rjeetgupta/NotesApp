"use client";


import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAllNotes, setQueryParams } from "@/store/noteSlice";

export default function Pagination() {
    const dispatch = useAppDispatch();
    const { pagination, queryParams } = useAppSelector((s) => s.notes);

    if (!pagination || pagination.totalPages <= 1) return null;

    const { page, totalPages, total } = pagination;

    const goToPage = (targetPage: number) => {
        const updated = { ...queryParams, page: targetPage };
        dispatch(setQueryParams(updated));
        dispatch(fetchAllNotes(updated));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Showing page{" "}
                <span className="text-foreground font-medium">{page}</span> of{" "}
                <span className="text-foreground font-medium">
                    {totalPages}
                </span>{" "}
                · {total} notes
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                    ← Prev
                </button>

                {pageNumbers.map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`
              h-9 w-9 rounded-lg text-sm font-medium transition
              ${
                  pageNum === page
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
                    >
                        {pageNum}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
