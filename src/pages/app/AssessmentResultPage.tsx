import { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ShieldQuestion,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Lock,
  Code2,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SeverityBadge } from '@/components/ui/StatusBadges';
import { getReview } from '@/services/api';
import type { Assessment, Decision } from '@/types';

const decisionConfig: Record<Decision, { icon: typeof ShieldAlert; bg: string; border: string; text: string; label: string; subtext: string }> = {
  block: {
    icon: ShieldAlert,
    bg: 'bg-danger-50',
    border: 'border-danger-200',
    text: 'text-danger-700',
    label: 'HIGH RISK',
    subtext: 'This migration is expected to fail against the current database state.',
  },
  approve_with_conditions: {
    icon: AlertTriangle,
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    text: 'text-warning-700',
    label: 'MEDIUM RISK',
    subtext: 'No immediate blocker was verified, but deployment conditions remain.',
  },
  approve: {
    icon: ShieldCheck,
    bg: 'bg-success-50',
    border: 'border-success-200',
    text: 'text-success-700',
    label: 'LOW RISK',
    subtext: 'No material deployment blockers were found.',
  },
  review_required: {
    icon: ShieldQuestion,
    bg: 'bg-ink-100',
    border: 'border-ink-300',
    text: 'text-ink-700',
    label: 'REVIEW REQUIRED',
    subtext: 'Additional trusted project context is required for full verification.',
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AssessmentResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [jsonOpen, setJsonOpen] = useState(false);

  useEffect(() => {
    if (location.state?.assessment) {
      setAssessment(location.state.assessment as Assessment);
      setLoading(false);
    } else if (id) {
      getReview(id).then((a) => {
        setAssessment(a);
        setLoading(false);
      });
    }
  }, [id, location.state]);

  if (loading) {
    return (
      <div className="container-app py-10">
        <div className="space-y-4">
          <div className="h-24 rounded-xl shimmer-bg" />
          <div className="h-48 rounded-xl shimmer-bg" />
          <div className="h-48 rounded-xl shimmer-bg" />
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container-app py-10 text-center">
        <FileText className="w-8 h-8 text-ink-300 mx-auto mb-3" />
        <p className="text-sm text-ink-500">Review not found.</p>
        <Link to="/app/reviews" className="mt-3 inline-block">
          <Button variant="outline" size="sm">Back to Reviews</Button>
        </Link>
      </div>
    );
  }

  const config = decisionConfig[assessment.decision];
  const DecisionIcon = config.icon;
  const isStatic = assessment.analysis_scope === 'static_only';
  const hasDiagnostics = !!assessment.diagnostics;

  return (
    <div className="container-app py-8 max-w-4xl">
      <Link to="/app/reviews" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Reviews
      </Link>

      {/* Decision header */}
      <div className={`rounded-xl border-2 ${config.border} ${config.bg} p-6 mb-6`}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center ${config.text}`}>
            <DecisionIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-lg font-bold uppercase tracking-wider ${config.text}`}>{config.label}</span>
              {isStatic && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wide rounded bg-ink-200 text-ink-600">
                  Static Analysis
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-700">{config.subtext}</p>
            <p className="mt-3 text-sm text-ink-600">{assessment.summary}</p>
            <div className="mt-4 flex items-center gap-3 text-xs text-ink-500 flex-wrap">
              {assessment.migration?.filename && (
                <span className="font-mono">{assessment.migration.filename}</span>
              )}
              {assessment.timestamp && (
                <>
                  <span>·</span>
                  <span>{formatDate(assessment.timestamp)}</span>
                </>
              )}
              {assessment.duration_seconds != null && (
                <>
                  <span>·</span>
                  <span>{assessment.duration_seconds}s</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Static analysis security boundary notice */}
      {isStatic && (
        <Card className="p-5 mb-6 border-ink-300 bg-ink-50">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-ink-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink-900">
                Migration Guardian safely analyzed this artifact without executing its Python code.
              </p>
              {assessment.missing_context && assessment.missing_context.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-ink-500 uppercase tracking-wide mb-1.5">Missing context</p>
                  <div className="flex flex-wrap gap-1.5">
                    {assessment.missing_context.map((ctx) => (
                      <span key={ctx} className="inline-flex items-center px-2 py-1 text-xs rounded bg-white border border-ink-200 text-ink-600">
                        {ctx}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Warnings */}
      {assessment.warnings && assessment.warnings.length > 0 && (
        <div className="mb-6 space-y-2">
          {assessment.warnings.map((warning, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-warning-700 uppercase tracking-wide font-mono">{warning.code}</p>
                <p className="text-sm text-warning-800 mt-0.5">{warning.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {assessment.error && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-danger-600" />
            <span className="text-sm font-semibold text-danger-800">Analysis error</span>
          </div>
          <p className="text-sm text-danger-700">{assessment.error}</p>
        </div>
      )}

      {/* Issues */}
      {assessment.issues.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-ink-900 uppercase tracking-wide mb-3">
            Issues · {assessment.issues.length}
          </h2>
          <div className="space-y-3">
            {assessment.issues.map((issue, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-ink-900">{issue.title}</h3>
                    <SeverityBadge severity={issue.severity} />
                  </div>

                  {/* Evidence list */}
                  <div className="p-3 bg-ink-50 rounded-lg mb-3">
                    <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-1.5">Evidence</p>
                    <ul className="space-y-1.5">
                      {issue.evidence.map((ev, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-ink-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-ink-700">{ev}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-ink-50 rounded-lg">
                      <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-1">Impact</p>
                      <p className="text-sm text-ink-700">{issue.impact}</p>
                    </div>
                    <div className="p-3 bg-brand-50 rounded-lg">
                      <p className="text-xs font-medium text-brand-700 uppercase tracking-wide mb-1">Action</p>
                      <p className="text-sm text-ink-700">{issue.action}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Verified / Unverified */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-success-600" />
            <h2 className="text-sm font-semibold text-ink-900">Verified</h2>
            <span className="text-xs text-ink-400">({assessment.verified_checks.length})</span>
          </div>
          {assessment.verified_checks.length === 0 ? (
            <p className="text-sm text-ink-400">No verified checks recorded.</p>
          ) : (
            <ul className="space-y-2.5">
              {assessment.verified_checks.map((check, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full border-2 border-success-500 flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-success-600" />
                  </div>
                  <p className="text-sm text-ink-700">{check}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-ink-400" />
            <h2 className="text-sm font-semibold text-ink-900">Unverified</h2>
            <span className="text-xs text-ink-400">({assessment.unverified_checks?.length ?? 0})</span>
          </div>
          {!assessment.unverified_checks || assessment.unverified_checks.length === 0 ? (
            <p className="text-sm text-ink-400">No unverified items.</p>
          ) : (
            <ul className="space-y-2.5">
              {assessment.unverified_checks.map((check, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full border-2 border-ink-300 flex items-center justify-center mt-0.5">
                    <HelpCircle className="w-2.5 h-2.5 text-ink-400" />
                  </div>
                  <p className="text-sm text-ink-600">{check}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Next steps */}
      {assessment.next_steps.length > 0 && (
        <Card className="p-5 mb-6">
          <h2 className="text-sm font-semibold text-ink-900 uppercase tracking-wide mb-3">Next steps</h2>
          <ol className="space-y-2.5">
            {assessment.next_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-ink-700 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Technical details */}
      {hasDiagnostics && (
        <Card className="overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-ink-200">
            <span className="text-sm font-semibold text-ink-900">Technical details</span>
          </div>
          <div className="px-5 py-5">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
              {assessment.diagnostics && (
                <>
                  <div>
                    <dt className="text-xs text-ink-400 uppercase tracking-wide">Framework</dt>
                    <dd className="text-ink-700 font-mono mt-0.5">{assessment.diagnostics.framework}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400 uppercase tracking-wide">Model</dt>
                    <dd className="text-ink-700 font-mono mt-0.5">{assessment.diagnostics.model}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400 uppercase tracking-wide">Provider</dt>
                    <dd className="text-ink-700 font-mono mt-0.5">{assessment.diagnostics.provider}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400 uppercase tracking-wide">Duration</dt>
                    <dd className="text-ink-700 font-mono mt-0.5">{assessment.diagnostics.duration_seconds}s</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400 uppercase tracking-wide">Tool calls</dt>
                    <dd className="text-ink-700 font-mono mt-0.5">{assessment.diagnostics.tool_calls}</dd>
                  </div>
                  {assessment.diagnostics.sandbox_sqlstate && (
                    <div>
                      <dt className="text-xs text-ink-400 uppercase tracking-wide">SQLSTATE</dt>
                      <dd className="text-ink-700 font-mono mt-0.5">{assessment.diagnostics.sandbox_sqlstate}</dd>
                    </div>
                  )}
                </>
              )}
              <div>
                <dt className="text-xs text-ink-400 uppercase tracking-wide">Source schema</dt>
                <dd className="text-ink-700 font-mono mt-0.5">public</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-400 uppercase tracking-wide">Sandbox execution</dt>
                <dd className="text-ink-700 font-mono mt-0.5">{isStatic ? 'skipped' : 'completed'}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <button
                onClick={() => setJsonOpen(!jsonOpen)}
                className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                <Code2 className="w-4 h-4" />
                {jsonOpen ? 'Hide JSON' : 'View JSON'}
              </button>
              {jsonOpen && (
                <pre className="mt-3 p-4 bg-ink-900 rounded-lg text-xs text-ink-100 font-mono overflow-x-auto max-h-96 animate-fade-in">
                  {JSON.stringify(assessment, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Link to="/app/reviews/new">
          <Button variant="primary" size="md">Run Another Review</Button>
        </Link>
        <Link to="/app/reviews">
          <Button variant="outline" size="md">View All Reviews</Button>
        </Link>
      </div>
    </div>
  );
}
