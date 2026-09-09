import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, hint, error, optional, children, className = '' }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-700">
          {label}
        </label>
        {optional && <span className="text-xs text-ink-400">Optional</span>}
      </div>
      {children}
      {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  );
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-3.5 py-2.5 text-sm border border-ink-300 rounded-lg bg-white text-ink-900 placeholder:text-ink-400',
        'transition-colors duration-150 hover:border-ink-400',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
        'disabled:bg-ink-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full px-3.5 py-2.5 text-sm border border-ink-300 rounded-lg bg-white text-ink-900 placeholder:text-ink-400',
        'transition-colors duration-150 hover:border-ink-400',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
        'resize-y min-h-[100px]',
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={cn(
        'w-full px-3.5 py-2.5 text-sm border border-ink-300 rounded-lg bg-white text-ink-900',
        'transition-colors duration-150 hover:border-ink-400',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
        'disabled:bg-ink-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
