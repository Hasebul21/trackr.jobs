// Tailwind class sets for the button and badge styles used across the app.
// These mirror the shadcn variants from the original React UI so templates
// can bind them with [class].

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
export type BadgeVariant = 'default' | 'outline' | 'accent' | 'success' | 'info' | 'warn';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] [&_svg]:size-4 [&_svg]:shrink-0';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90',
  outline:
    'border border-[var(--border)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
  ghost: 'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
  secondary: 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent)]',
  destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-10 rounded-md px-6',
  icon: 'h-9 w-9',
};

export function buttonClasses(variant: ButtonVariant = 'default', size: ButtonSize = 'default') {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]}`;
}

const BADGE_BASE =
  'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors';

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-[var(--muted)] text-[var(--foreground)] border-transparent',
  outline: 'border-[var(--border)] text-[var(--foreground)]',
  accent: 'bg-[var(--accent)] text-[var(--accent-foreground)] border-transparent',
  success: 'bg-[var(--gain-50)] text-[var(--gain-700)] border-[var(--gain-200)]',
  info: 'bg-[var(--accent-50)] text-[var(--accent-700)] border-[var(--accent-200)]',
  warn: 'bg-[var(--warn-50)] text-[var(--warn-700)] border-[var(--warn-200)]',
};

export function badgeClasses(variant: BadgeVariant = 'default') {
  return `${BADGE_BASE} ${BADGE_VARIANTS[variant]}`;
}
