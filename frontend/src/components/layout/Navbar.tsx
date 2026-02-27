"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Notes" },
  { href: "/pinned", label: "Pinned" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl 
                            bg-primary text-primary-foreground 
                            shadow-md transition-all duration-300
                            group-hover:shadow-lg group-hover:scale-105">
              <span className="text-sm font-semibold tracking-tight">
                N
              </span>
            </div>

            <span className="text-lg font-semibold tracking-tight text-foreground">
              Notely
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  {link.label}

                  {/* Active indicator line */}
                  {isActive && (
                    <span className="absolute inset-x-2 -bottom-1.5 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Profile Placeholder */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full
                       bg-muted text-muted-foreground
                       border border-border
                       transition-colors duration-200
                       hover:bg-accent hover:text-accent-foreground"
            title="Profile (Auth coming soon)"
          >
            <span className="text-xs font-medium">U</span>
          </div>

        </div>
      </div>
    </header>
  );
}