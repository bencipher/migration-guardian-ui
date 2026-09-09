import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white border border-ink-200 rounded-xl shadow-sm', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-ink-200', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-5', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-ink-200 bg-ink-50/50 rounded-b-xl', className)}>
      {children}
    </div>
  );
}
