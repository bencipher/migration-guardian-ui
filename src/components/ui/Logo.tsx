import { Database, type LucideIcon } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  variant?: 'default' | 'light';
}

export default function Logo({
  className = '',
  iconSize = 20,
  showText = true,
  variant = 'default',
}: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-ink-900';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center rounded-lg bg-brand-600 text-white" style={{ width: iconSize + 8, height: iconSize + 8 }}>
        <Database size={iconSize} strokeWidth={2.2} />
      </div>
      {showText && (
        <span className={`font-bold text-[15px] tracking-tight ${textColor}`}>
          Migration Guardian
        </span>
      )}
    </div>
  );
}

export function LogoIcon({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-ink-200 shadow-sm">
        <Icon className="w-6 h-6 text-ink-600" strokeWidth={1.8} />
      </div>
      <span className="text-xs font-medium text-ink-500">{label}</span>
    </div>
  );
}
