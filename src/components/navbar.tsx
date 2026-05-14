import Link from "next/link";
import { Suspense } from "react";
import { Bookmark, Settings, LayoutDashboard } from "lucide-react";
import { SearchInput } from "./search-input";
import { ThemeToggle } from "./theme-toggle";
import { RefreshButton } from "./refresh-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <Link
          href="/"
          className="font-semibold tracking-tight text-[var(--foreground)] hover:opacity-80"
        >
          job<span className="text-[var(--muted-foreground)]">·stes</span>
        </Link>
        <div className="flex-1 px-4">
          {/* SearchInput uses useSearchParams() — must be inside a Suspense
              boundary so static pages (like /_not-found) don't bail out. */}
          <Suspense fallback={<Skeleton className="h-9 w-full max-w-md" />}>
            <SearchInput />
          </Suspense>
        </div>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <LayoutDashboard /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/bookmarks">
              <Bookmark /> <span className="hidden sm:inline">Bookmarks</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/settings">
              <Settings /> <span className="hidden sm:inline">Settings</span>
            </Link>
          </Button>
          <RefreshButton />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
