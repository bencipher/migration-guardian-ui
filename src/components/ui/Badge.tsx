import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'slate';

const variantClasses: Record<Variant, string> = {
  gray: 'bg-ink-100 text-ink-600 border-ink-200',
  blue: 'bg-brand-50 text-brand-700 border-brand-200',
  green: 'bg-success-50 text-success-700 border-success-200',
  amber: 'bg-warning-50 text-warning-700 border-warning-200',
  red: 'bg-danger-50 text-danger-700 border-danger-200',
  slate: 'bg-ink-800 text-ink-100 border-ink-700',
};

export default function Badge({
  children,
  variant = 'gray',
  className = '',
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide rounded border',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
