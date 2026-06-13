"use client";

// Mobile navigation drawer. Shown only below the `sm` breakpoint (the
// desktop navbar hides this and renders inline links instead). A hamburger
// opens a right-side slide-over listing every destination plus the refresh
// and theme controls. Closes on link tap, backdrop tap, and Escape; locks
// body scroll while open.

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Briefcase,
  Building2,
  Globe,
  Plane,
  Laptop,
  Bookmark,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshButton } from "./refresh-button";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "/", label: "Jobs", icon: Briefcase },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/job-platforms", label: "Platforms", icon: Globe },
  { href: "/visa-sponsors", label: "Visa sponsors", icon: Plane },
  { href: "/remote", label: "Remote", icon: Laptop },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  // Portal target only exists after mount (document is undefined during SSR).
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- defer portal until client mount
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      {/* Overlay is portaled to <body> so it escapes the navbar <header>:
          the header's `backdrop-blur` (backdrop-filter) would otherwise make
          it the containing block for this `fixed` element, trapping the
          drawer inside the 56px header. overflow-hidden clips the off-canvas
          (translate-x-full) panel so it can't widen the document. */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 overflow-hidden sm:hidden ${open ? "" : "pointer-events-none"}`}
            role="dialog"
            aria-modal="true"
            aria-hidden={!open}
          >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[85%] flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-xl transition-transform duration-200 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
            <span className="font-semibold tracking-tight">
              Trackr<span className="text-[var(--muted-foreground)]">.jobs</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-2">
            {LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--muted)] text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" /> {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[var(--border)] p-3">
            <RefreshButton />
            <ThemeToggle />
          </div>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}
