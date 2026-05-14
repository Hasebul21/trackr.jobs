import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--muted)] text-[var(--foreground)] border-transparent",
        outline: "border-[var(--border)] text-[var(--foreground)]",
        accent:
          "bg-[var(--accent)] text-[var(--accent-foreground)] border-transparent",
        success:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
