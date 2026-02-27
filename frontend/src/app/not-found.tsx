import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div className="mb-6 text-8xl font-extrabold tracking-tight text-primary">
                404
            </div>

            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
                Page not found
            </h2>

            <p className="mb-8 max-w-md text-sm text-muted-foreground">
                The page you are looking for does not exist or has been moved.
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
                ← Back to Notes
            </Link>
        </div>
    );
}
