// Tailwind class sets for the button and badge styles used across the app.
// These mirror the shadcn variants from the original React UI so templates
// can bind them with [class]. There is no class merging here, so variants
// and sizes must not set the same property twice.

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'apply';
export type ButtonSize = 'default' | 'sm' | 'xs' | 'lg' | 'icon';
export type BadgeVariant = 'default' | 'outline' | 'accent' | 'success' | 'info' | 'warn';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] [&_svg]:size-4 [&_svg]:shrink-0';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90',
  outline:
    'border border-[var(--border)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
  ghost: 'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
  secondary: 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent)]',
  destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90',
  // Green call-to-action used for the Apply button on job cards.
  apply: 'bg-[var(--gain-700)] text-[var(--bg-canvas)] hover:bg-[var(--gain-600)]',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  // Compact chips in the filters panel; callers add their own text size.
  xs: 'h-6 px-2',
  lg: 'h-10 px-6 text-sm',
  icon: 'h-9 w-9 text-sm',
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
