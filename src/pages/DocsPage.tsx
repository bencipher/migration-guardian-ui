import { useState } from 'react';
import {
  BookOpen,
  Rocket,
  Database,
  Layers,
  GitBranch,
  Code2,
  ShieldCheck,
  Terminal,
  ChevronRight,
} from 'lucide-react';

const docsNav = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'quickstart', label: 'Quick Start', icon: Rocket },
  { id: 'raw-sql', label: 'Raw SQL', icon: Database },
  { id: 'django', label: 'Django', icon: Layers },
  { id: 'alembic', label: 'Alembic', icon: GitBranch },
  { id: 'api', label: 'API', icon: Code2 },
  { id: 'security', label: 'Security Model', icon: ShieldCheck },
  { id: 'cli', label: 'CLI', icon: Terminal },
];

const docsContent: Record<string, { title: string; body: JSX.Element }> = {
  overview: {
    title: 'Overview',
    body: (
      <>
        <p className="text-ink-600 leading-relaxed">
          Migration Guardian is a PostgreSQL migration safety platform that evaluates candidate database migrations against the actual current database state before deployment.
        </p>
        <p className="text-ink-600 leading-relaxed mt-4">
          It combines static migration analysis, read-only source database inspection, evidence gathering, isolated sandbox execution (where safe), and post-migration verification to produce a structured deployment recommendation.
        </p>
        <h3 className="text-base font-semibold text-ink-900 mt-8 mb-3">Key concepts</h3>
        <ul className="space-y-2 text-sm text-ink-600">
          <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" /> <span><strong>Source database</strong> — your PostgreSQL database, inspected in read-only mode.</span></li>
          <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" /> <span><strong>Candidate migration</strong> — the SQL or Python artifact you want to evaluate.</span></li>
          <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" /> <span><strong>Sandbox</strong> — an isolated PostgreSQL instance where candidate SQL is safely executed.</span></li>
          <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" /> <span><strong>Evidence provenance</strong> — the origin label on every finding (SOURCE DB, SANDBOX, STATIC, UNVERIFIED).</span></li>
        </ul>
      </>
    ),
  },
  quickstart: {
    title: 'Quick Start',
    body: (
      <>
        <p className="text-ink-600 leading-relaxed">Get started with Migration Guardian in three steps.</p>
        <ol className="mt-4 space-y-4 text-sm text-ink-600">
          <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">1</span><div><strong className="text-ink-900">Connect your database</strong><br />Provide a read-only PostgreSQL connection URL. Migration Guardian verifies read-only access.</div></li>
          <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">2</span><div><strong className="text-ink-900">Upload your migration</strong><br />Drop a <code className="text-xs bg-ink-100 px-1.5 py-0.5 rounded font-mono">.sql</code> or <code className="text-xs bg-ink-100 px-1.5 py-0.5 rounded font-mono">.py</code> file. Migration Guardian auto-detects the type.</div></li>
          <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">3</span><div><strong className="text-ink-900">Run Migration Guardian</strong><br />Review the deployment decision, verified evidence, and next steps.</div></li>
        </ol>
      </>
    ),
  },
  'raw-sql': {
    title: 'Raw SQL',
    body: (
      <>
        <p className="text-ink-600 leading-relaxed">Raw PostgreSQL SQL migrations receive full analysis — static review, source inspection, sandbox execution, and post-migration verification.</p>
        <div className="mt-4 p-4 bg-ink-900 rounded-lg font-mono text-xs text-ink-100 overflow-x-auto">
          <div className="text-ink-400">-- 20260909_enforce_shipment_constraints.sql</div>
          <div className="text-brand-400 mt-2">ALTER TABLE</div> shipments
          <div className="text-brand-400">ALTER COLUMN</div> dispatched_at
          <div className="text-brand-400">SET NOT NULL</div>;
          <div className="text-brand-400 mt-2">ALTER TABLE</div> shipments
          <div className="text-brand-400">ADD CONSTRAINT</div> weight_positive
          <div className="text-brand-400">CHECK</div> (weight_grams &gt; 0);
        </div>
        <p className="text-sm text-ink-500 mt-4">Migration Guardian will execute this SQL in an isolated sandbox and verify it against source data state.</p>
      </>
    ),
  },
  django: {
    title: 'Django',
    body: (
      <>
        <p className="text-ink-600 leading-relaxed">Django migrations are statically analyzed without executing their Python code. Migration Guardian extracts operations, dependencies, and app metadata from the migration file.</p>
        <p className="text-sm text-ink-500 mt-4">Custom <code className="text-xs bg-ink-100 px-1.5 py-0.5 rounded font-mono">RunPython</code> operations are flagged as requiring trusted project context. Full verification requires running Migration Guardian locally inside the Django project.</p>
        <div className="mt-4 p-3 bg-ink-50 border border-ink-200 rounded-lg text-sm text-ink-600">
          <strong className="text-ink-900">Security boundary:</strong> Uploaded Python is treated as untrusted source code. It is never executed in the web workflow.
        </div>
      </>
    ),
  },
  alembic: {
    title: 'Alembic',
    body: (
      <>
        <p className="text-ink-600 leading-relaxed">Alembic revisions are statically analyzed. Migration Guardian extracts revision identifiers, down-revision, and operation names.</p>
        <p className="text-sm text-ink-500 mt-4">A single uploaded artifact does not contain the full revision graph or <code className="text-xs bg-ink-100 px-1.5 py-0.5 rounded font-mono">env.py</code> context. Full framework-native analysis requires running Migration Guardian locally in the project environment.</p>
      </>
    ),
  },
  api: {
    title: 'API',
    body: (
      <>
        <p className="text-ink-600 leading-relaxed">Migration Guardian exposes a REST API for programmatic migration review. The API follows the same lifecycle as the web workflow.</p>
        <div className="mt-4 space-y-2">
          <div className="text-sm"><code className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded font-mono">POST</code> <code className="text-xs font-mono text-ink-700">/api/v1/connection/test</code> — Test a read-only database connection</div>
          <div className="text-sm"><code className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded font-mono">POST</code> <code className="text-xs font-mono text-ink-700">/api/v1/migrations/analyze</code> — Submit a migration for analysis</div>
          <div className="text-sm"><code className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded font-mono">GET</code> <code className="text-xs font-mono text-ink-700">/api/v1/reviews</code> — List review history</div>
          <div className="text-sm"><code className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded font-mono">GET</code> <code className="text-xs font-mono text-ink-700">/api/v1/reviews/:id</code> — Get assessment result</div>
        </div>
        <p className="text-sm text-ink-400 mt-4">Detailed API reference documentation will be provided with the production release.</p>
      </>
    ),
  },
  security: {
    title: 'Security Model',
    body: (
      <>
        <p className="text-ink-600 leading-relaxed">Migration Guardian is designed around safe execution boundaries.</p>
        <ul className="mt-4 space-y-3 text-sm text-ink-600">
          <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" /><span><strong>Read-only source access</strong> — Source databases are inspected using bounded read-only queries only.</span></li>
          <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" /><span><strong>Isolated sandbox execution</strong> — Candidate migration SQL executes only in an isolated PostgreSQL sandbox.</span></li>
          <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" /><span><strong>Untrusted Python</strong> — Django and Alembic uploads are statically analyzed without executing uploaded Python.</span></li>
          <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" /><span><strong>Evidence separation</strong> — Source and sandbox evidence are clearly labeled and never mixed.</span></li>
          <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" /><span><strong>Ephemeral credentials</strong> — Database credentials are ephemeral in the current web workflow.</span></li>
        </ul>
      </>
    ),
  },
  cli: {
    title: 'CLI',
    body: (
      <>
        <p className="text-ink-600 leading-relaxed">Migration Guardian provides a CLI for local and CI/CD usage.</p>
        <div className="mt-4 p-4 bg-ink-900 rounded-lg font-mono text-xs text-ink-100 overflow-x-auto">
          <div className="text-ink-400"># Test a source connection</div>
          <div className="mt-1"><span className="text-success-400">$</span> guardian connect --url postgresql://...</div>
          <div className="mt-3 text-ink-400"># Analyze a migration</div>
          <div className="mt-1"><span className="text-success-400">$</span> guardian analyze --file migration.sql --type auto</div>
          <div className="mt-3 text-ink-400"># List reviews</div>
          <div className="mt-1"><span className="text-success-400">$</span> guardian reviews list</div>
        </div>
        <p className="text-sm text-ink-400 mt-4">The CLI is on the roadmap. The web workflow is the primary interface today.</p>
      </>
    ),
  },
};

export default function DocsPage() {
  const [active, setActive] = useState('overview');
  const content = docsContent[active];

  return (
    <div className="container-public py-12">
      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">Documentation</h3>
          <nav className="space-y-0.5">
            {docsNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                  active === item.id
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-ink-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-ink-900">{content.title}</h1>
          </div>
          <div className="prose-body max-w-none">
            {content.body}
          </div>
        </div>
      </div>
    </div>
  );
}
