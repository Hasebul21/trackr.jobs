import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="flex flex-col lg:flex-row gap-6">
        <Skeleton className="h-96 w-full lg:w-64 shrink-0" />
        <div className="flex-1 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    </div>
  );
}
