"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">

          <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>

          <p className="mb-6 text-sm text-muted-foreground">
            {description}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-border bg-background py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-destructive py-2 text-sm font-medium text-destructive-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? "Deleting..." : confirmLabel}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}