"use client";

import * as React from "react";
import { ExternalLink, CheckCircle2, X, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import { useHiddenCompanies } from "@/stores/hidden-companies";

export type Company = {
  name: string;
  url: string;
  country: string;
  auto: boolean;
  note?: string;
};

// Mirrors the previous server-side constant so visual rhythm doesn't shift
// when the grid switches to client-side filtering.
const PAGE_SIZE = 12;

export function CompaniesGrid({
  companies,
  initialPage,
  basePath = "/companies",
}: {
  companies: Company[];
  initialPage: number;
  basePath?: string;
}) {
  // Defer hide-list reads to post-mount so SSR markup matches first paint —
  // same trick the bookmark button uses.
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer to client paint to avoid SSR/CSR mismatch on persisted hide state
  React.useEffect(() => setMounted(true), []);

  const hiddenIds = useHiddenCompanies((s) => s.ids);
  const hide = useHiddenCompanies((s) => s.hide);
  const restore = useHiddenCompanies((s) => s.restore);

  const [showHidden, setShowHidden] = React.useState(false);

  const visible = React.useMemo(() => {
    if (!mounted) return companies;
    return showHidden ? companies : companies.filter((c) => !hiddenIds[c.name]);
  }, [companies, hiddenIds, mounted, showHidden]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, initialPage), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, visible.length);
  const slice = visible.slice(start, end);

  const hiddenCount = mounted ? Object.keys(hiddenIds).length : 0;

  return (
    <>
      {hiddenCount > 0 && (
        <div className="mb-3 flex items-center justify-end gap-2 text-xs text-[var(--muted-foreground)]">
          <span>{hiddenCount} hidden</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHidden((v) => !v)}
          >
            {showHidden ? <EyeOff /> : <Eye />}
            {showHidden ? "Hide hidden" : "Show hidden"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((c) => (
          <CompanyCard
            key={c.name}
            c={c}
            hidden={!!hiddenIds[c.name]}
            onHide={() => hide(c.name)}
            onRestore={() => restore(c.name)}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        rangeStart={visible.length === 0 ? 0 : start + 1}
        rangeEnd={end}
        total={visible.length}
        hrefFor={(n) => (n <= 1 ? basePath : `${basePath}?page=${n}`)}
      />
    </>
  );
}

function CompanyCard({
  c,
  hidden,
  onHide,
  onRestore,
}: {
  c: Company;
  hidden: boolean;
  onHide: () => void;
  onRestore: () => void;
}) {
  return (
    <Card className={`flex h-full flex-col ${hidden ? "opacity-60" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-semibold text-[var(--foreground)]">
              {c.name}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              {c.country}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {c.auto ? (
              <Badge
                variant="success"
                title="Pulled into the dashboard automatically"
              >
                <CheckCircle2 className="h-3 w-3" /> Auto
              </Badge>
            ) : (
              <Badge variant="outline" title="Visit manually">
                Link
              </Badge>
            )}
            {hidden ? (
              <Button
                variant="ghost"
                size="icon"
                title="Restore"
                aria-label={`Restore ${c.name}`}
                onClick={onRestore}
              >
                <RotateCcw />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                title="Hide"
                aria-label={`Hide ${c.name}`}
                onClick={onHide}
              >
                <X />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between gap-2 pt-0">
        <span className="truncate text-xs text-[var(--muted-foreground)]">
          {c.note ?? new URL(c.url).hostname.replace(/^www\./, "")}
        </span>
        <Button asChild size="sm">
          <a href={c.url} target="_blank" rel="noreferrer noopener">
            Visit <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
