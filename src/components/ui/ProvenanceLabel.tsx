import type { Provenance } from '@/types';

const config: Record<Provenance, { label: string; classes: string }> = {
  source_database: { label: 'SOURCE DB', classes: 'bg-brand-50 text-brand-700 border-brand-200' },
  sandbox: { label: 'SANDBOX', classes: 'bg-accent-50 text-accent-700 border-accent-200' },
  static: { label: 'STATIC', classes: 'bg-ink-100 text-ink-600 border-ink-200' },
  unverified: { label: 'UNVERIFIED', classes: 'bg-ink-100 text-ink-400 border-ink-200' },
};

export default function ProvenanceLabel({ provenance }: { provenance: Provenance }) {
  const { label, classes } = config[provenance];
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${classes}`}>
      {label}
    </span>
  );
}
