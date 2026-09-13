import type { Decision, RiskLevel, Severity } from '@/types';
import { ShieldAlert, ShieldCheck, ShieldQuestion, AlertTriangle } from 'lucide-react';

export function DecisionBadge({ decision }: { decision: Decision | null }) {
  const config: Record<Decision, { label: string; icon: typeof ShieldAlert; classes: string }> = {
    block: {
      label: 'BLOCK',
      icon: ShieldAlert,
      classes: 'bg-danger-50 text-danger-700 border-danger-300',
    },
    approve_with_conditions: {
      label: 'APPROVE WITH CONDITIONS',
      icon: AlertTriangle,
      classes: 'bg-warning-50 text-warning-700 border-warning-300',
    },
    approve: {
      label: 'APPROVE',
      icon: ShieldCheck,
      classes: 'bg-success-50 text-success-700 border-success-300',
    },
    review_required: {
      label: 'REVIEW REQUIRED',
      icon: ShieldQuestion,
      classes: 'bg-ink-100 text-ink-700 border-ink-300',
    },
  };

  if (!decision) {
    return <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border bg-ink-100 text-ink-600 border-ink-300">PENDING</span>;
  }

  const { label, icon: Icon, classes } = config[decision];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border ${classes}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: RiskLevel | null }) {
  const config: Record<RiskLevel, { label: string; classes: string }> = {
    high: { label: 'HIGH', classes: 'bg-danger-100 text-danger-800' },
    medium: { label: 'MEDIUM', classes: 'bg-warning-100 text-warning-800' },
    low: { label: 'LOW', classes: 'bg-success-100 text-success-800' },
  };

  if (!risk) {
    return <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wide rounded bg-ink-100 text-ink-600">PENDING</span>;
  }

  const { label, classes } = config[risk];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wide rounded ${classes}`}>
      {label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const config: Record<Severity, { label: string; classes: string }> = {
    high: { label: 'HIGH', classes: 'bg-danger-50 text-danger-700 border border-danger-200' },
    medium: { label: 'MEDIUM', classes: 'bg-warning-50 text-warning-700 border border-warning-200' },
    low: { label: 'LOW', classes: 'bg-success-50 text-success-700 border border-success-200' },
  };

  const { label, classes } = config[severity];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wide rounded ${classes}`}>
      {label}
    </span>
  );
}
