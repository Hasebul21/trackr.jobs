import Link from "next/link";
import { Suspense } from "react";
import { Bookmark, Settings, Briefcase, Building2, Globe, Plane, Laptop, User } from "lucide-react";
import { SearchInput } from "./search-input";
import { ThemeToggle } from "./theme-toggle";
import { RefreshButton } from "./refresh-button";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap font-semibold tracking-tight text-[var(--foreground)] hover:opacity-80"
        >
          Trackr<span className="text-[var(--muted-foreground)]">.jobs</span>
        </Link>
        {/* min-w-0 lets this flex item shrink below the input's intrinsic
            width on narrow screens — without it the long placeholder forces
            the whole row (and document) wider than the viewport. */}
        <div className="min-w-0 flex-1 px-2 sm:px-4">
          {/* SearchInput uses useSearchParams() — must be inside a Suspense
              boundary so static pages (like /_not-found) don't bail out. */}
          <Suspense fallback={<Skeleton className="h-9 w-full max-w-md" />}>
            <SearchInput />
          </Suspense>
        </div>
        {/* Desktop nav — inline links. Hidden on mobile in favour of the
            hamburger drawer below, which avoids cramming 7 links + search
            + controls into a single 360px row. */}
        <nav className="hidden items-center gap-1 sm:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <Briefcase /> <span className="hidden sm:inline">Jobs</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/companies">
              <Building2 /> <span className="hidden sm:inline">Companies</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/job-platforms">
              <Globe />{" "}
              <span className="hidden sm:inline">Platforms</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/visa-sponsors">
              <Plane />{" "}
              <span className="hidden sm:inline">Visa sponsors</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/remote">
              <Laptop /> <span className="hidden sm:inline">Remote</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/bookmarks">
              <Bookmark /> <span className="hidden sm:inline">Bookmarks</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/information">
              <User /> <span className="hidden sm:inline">Information</span>
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

        {/* Mobile nav — hamburger drawer. */}
        <div className="flex items-center sm:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
