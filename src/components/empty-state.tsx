import { Inbox } from "lucide-react";

export function EmptyState({
  title = "No jobs match these filters yet",
  hint = "Try clearing filters, or click Refresh to fetch a new batch.",
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--border)] p-12 text-center">
      <div className="h-10 w-10 rounded-full bg-[var(--muted)] grid place-items-center">
        <Inbox className="h-5 w-5 text-[var(--muted-foreground)]" />
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-[var(--muted-foreground)] max-w-sm">
          {hint}
        </div>
      </div>
    </div>
  );
}
