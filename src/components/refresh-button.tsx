"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { refreshAction } from "@/app/actions";

export function RefreshButton() {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          try {
            const res = await refreshAction();
            const detail = res.bySource
              .filter((s) => s.fetched > 0 || !s.ok)
              .map((s) => `${s.source}: ${s.fetched}${s.ok ? "" : " (failed)"}`)
              .join(" · ");
            toast.success(
              `${res.totalUpserted} jobs upserted`,
              { description: detail || "No new jobs from any source." },
            );
            router.refresh();
          } catch (err) {
            toast.error("Refresh failed", {
              description: (err as Error).message,
            });
          }
        })
      }
    >
      <RefreshCw className={pending ? "animate-spin" : ""} />
      {pending ? "Refreshing…" : "Refresh"}
    </Button>
  );
}
