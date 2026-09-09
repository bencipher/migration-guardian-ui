import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
  secondary:
    'bg-ink-800 text-white hover:bg-ink-900 active:bg-ink-950 shadow-sm',
  ghost:
    'text-ink-600 hover:text-ink-900 hover:bg-ink-100 active:bg-ink-200',
  danger:
    'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-sm',
  outline:
    'border border-ink-300 text-ink-700 hover:border-ink-400 hover:bg-ink-50 active:bg-ink-100 bg-white',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
