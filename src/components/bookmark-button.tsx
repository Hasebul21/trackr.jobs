"use client";

import * as React from "react";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/stores/bookmarks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  id,
  className,
  iconOnly = false,
}: {
  id: string;
  className?: string;
  iconOnly?: boolean;
}) {
  // Avoid hydration mismatch from localStorage-derived state.
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer to client paint to avoid SSR/CSR mismatch on persisted bookmark state
  React.useEffect(() => setMounted(true), []);
  const has = useBookmarks((s) => s.ids[id]);
  const toggle = useBookmarks((s) => s.toggle);
  const active = mounted && !!has;
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size={iconOnly ? "icon" : "sm"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-pressed={active}
      className={cn(className)}
    >
      <Bookmark className={active ? "fill-current" : ""} />
      {!iconOnly && <span>{active ? "Saved" : "Save"}</span>}
    </Button>
  );
}
