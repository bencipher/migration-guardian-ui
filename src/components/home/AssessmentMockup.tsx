import { ShieldAlert, Database, FlaskConical, FileCheck2 } from 'lucide-react';
import ProvenanceLabel from '@/components/ui/ProvenanceLabel';

export default function AssessmentMockup() {
  return (
    <div className="w-full max-w-lg rounded-xl border border-ink-200 bg-white shadow-xl overflow-hidden animate-slide-up">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-200 bg-ink-50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-ink-300" />
          <div className="w-3 h-3 rounded-full bg-ink-300" />
          <div className="w-3 h-3 rounded-full bg-ink-300" />
        </div>
        <span className="ml-2 text-xs text-ink-400 font-mono">migration-guardian / review</span>
      </div>

      {/* Decision header */}
      <div className="px-5 py-4 border-b border-ink-200 bg-danger-50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-danger-600" />
          <span className="text-sm font-bold text-danger-700 uppercase tracking-wider">Block · High Risk</span>
        </div>
        <p className="mt-2 text-sm text-ink-700">
          317 rows violate the proposed NOT NULL constraint.
        </p>
      </div>

      {/* Issue cards */}
      <div className="px-5 py-4 space-y-3">
        <div className="border border-ink-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-ink-900">Existing rows violate NOT NULL constraint</span>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-danger-50 text-danger-700 border border-danger-200">HIGH</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <ProvenanceLabel provenance="source_database" />
            <span className="text-xs text-ink-500">317 rows have dispatched_at IS NULL.</span>
          </div>
        </div>

        <div className="border border-ink-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-ink-900">Sandbox execution failed</span>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-danger-50 text-danger-700 border border-danger-200">HIGH</span>
          </div>
          <div className="flex items-center gap-2">
            <ProvenanceLabel provenance="sandbox" />
            <span className="text-xs text-ink-500 font-mono">SQLSTATE 23502</span>
          </div>
        </div>

        <div className="border border-ink-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-ink-900">Source inspection completed read-only</span>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-success-50 text-success-700 border border-success-200">VERIFIED</span>
          </div>
          <div className="flex items-center gap-2">
            <ProvenanceLabel provenance="source_database" />
            <span className="text-xs text-ink-500">No write operations detected.</span>
          </div>
        </div>
      </div>

      {/* Footer stages */}
      <div className="px-5 py-3 border-t border-ink-200 bg-ink-50 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-success-600" />
          <span className="text-[11px] text-ink-500">Source inspected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5 text-danger-600" />
          <span className="text-[11px] text-ink-500">Sandbox failed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileCheck2 className="w-3.5 h-3.5 text-ink-400" />
          <span className="text-[11px] text-ink-500">Assessment ready</span>
        </div>
      </div>
    </div>
  );
}
