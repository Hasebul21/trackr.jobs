"use client";

// Marks a job as applied. On success the Job row is gone and the page
// is revalidated, so the card disappears on the next paint. We rely on
// router.refresh() rather than optimistic UI because revalidatePath in
// the action already invalidates the route's cache — refresh re-fetches
// the new server-rendered jobs grid.

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markAppliedAction } from "@/app/actions";

export function MarkAppliedButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending}
      title="Mark as applied (removes this job)"
      aria-label="Mark as applied"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        start(async () => {
          try {
            const res = await markAppliedAction(id);
            if (!res.ok) {
              toast.error("Could not mark as applied", {
                description: res.reason ?? "unknown error",
              });
              return;
            }
            toast.success("Marked as applied", { description: title });
            router.refresh();
          } catch (err) {
            toast.error("Could not mark as applied", {
              description: (err as Error).message,
            });
          }
        });
      }}
    >
      <CheckCircle2 className={pending ? "animate-pulse" : ""} />
    </Button>
  );
}
