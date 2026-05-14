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
          "bg-[var(--gain-50)] text-[var(--gain-700)] border-[var(--gain-200)]",
        info: "bg-[var(--accent-50)] text-[var(--accent-700)] border-[var(--accent-200)]",
        warn: "bg-[var(--warn-50)] text-[var(--warn-700)] border-[var(--warn-200)]",
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
