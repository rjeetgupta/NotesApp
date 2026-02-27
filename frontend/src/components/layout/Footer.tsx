export default function Footer() {
    return (
      <footer className="mt-auto w-full border-t border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg
                           bg-primary text-primary-foreground
                           shadow-sm"
              >
                <span className="text-xs font-semibold tracking-tight">
                  N
                </span>
              </div>
  
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Notely
              </span>
            </div>
  
            <p className="text-sm text-muted-foreground">
              Built with <span className="text-foreground">Next.js</span> ·{" "}
              <span className="text-foreground">Node.js</span> ·{" "}
              <span className="text-foreground">MongoDB</span>
            </p>
  
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Notely
            </div>
  
          </div>
  

          <div className="mt-8 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
            Designed for focused note-taking.
          </div>
  
        </div>
      </footer>
    );
  }