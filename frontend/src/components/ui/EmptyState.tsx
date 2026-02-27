interface EmptyStateProps {
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

export default function EmptyState({
    title = "No notes yet",
    description = "Create your first note to get started.",
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-muted text-4xl">
                🗒️
            </div>

            <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
                {title}
            </h3>

            <p className="mb-6 max-w-xs text-sm text-muted-foreground">
                {description}
            </p>

            {action}
        </div>
    );
}