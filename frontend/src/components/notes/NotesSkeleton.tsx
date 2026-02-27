export default function NotesSkeleton() {
    return (
        <div
            className="grid grid-cols-1 gap-6sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                    <div className="space-y-3 animate-pulse">
                        <div className="h-5 w-3/4 rounded-md bg-muted" />
                        <div className="h-3 w-full rounded-md bg-muted" />
                        <div className="h-3 w-full rounded-md bg-muted" />
                        <div className="h-3 w-2/3 rounded-md bg-muted" />

                        <div className="flex gap-2 pt-3">
                            <div className="h-5 w-14 rounded-full bg-muted" />
                            <div className="h-5 w-14 rounded-full bg-muted" />
                        </div>

                        <div className="flex items-center justify-between border-t border-border pt-3">
                            <div className="h-3 w-20 rounded-md bg-muted" />
                            <div className="h-5 w-12 rounded-md bg-muted" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
