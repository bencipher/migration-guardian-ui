import { Database, FlaskConical, ShieldCheck, FileText, Eye, GitBranch } from 'lucide-react';

const principles = [
  {
    icon: Database,
    title: 'Deterministic evidence where possible',
    desc: 'When the database can answer a question definitively, it should. Migration Guardian prefers verifiable evidence over inference.',
  },
  {
    icon: GitBranch,
    title: 'Agent reasoning where judgment is useful',
    desc: 'When a question requires interpretation — like assessing lock risk — agent reasoning supplements deterministic evidence.',
  },
  {
    icon: Eye,
    title: 'Read-only source access',
    desc: 'Source databases are never modified. Inspection is bounded and read-only by design.',
  },
  {
    icon: FlaskConical,
    title: 'Isolated execution',
    desc: 'Candidate migrations execute only in an isolated sandbox, never against the source database.',
  },
  {
    icon: FileText,
    title: 'Explicit uncertainty',
    desc: 'Unverified items are clearly separated from verified evidence. Nothing is hidden behind a confidence score.',
  },
  {
    icon: ShieldCheck,
    title: 'Human-readable deployment decisions',
    desc: 'Every assessment ends with a clear decision, evidence, and next steps — written for engineers, not machines.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-ink-200 bg-ink-50/50 py-16">
        <div className="container-public">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-ink-900">Safer database changes through evidence.</h1>
            <p className="mt-4 text-lg text-ink-600 leading-relaxed">
              Migration failures often occur because review systems inspect the migration artifact but not the current state of the database. Migration Guardian is built around a simple principle.
            </p>
            <blockquote className="mt-6 pl-5 border-l-4 border-brand-500 text-lg font-medium text-ink-800 italic">
              A migration should be evaluated against the state it is about to change.
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-public">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl font-bold text-ink-900">Product philosophy</h2>
            <p className="mt-3 text-ink-600 leading-relaxed">
              Migration Guardian combines deterministic database inspection with agent-assisted reasoning. The goal is not to replace engineering judgment — it is to give engineers the evidence they need to make confident deployment decisions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {principles.map((p) => (
              <div key={p.title} className="p-6 border border-ink-200 rounded-xl bg-white">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="text-sm font-semibold text-ink-900 mb-2">{p.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-ink-200 bg-ink-900 text-white">
        <div className="container-public">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white">Built for engineering teams</h2>
            <p className="mt-3 text-ink-300 leading-relaxed">
              Migration Guardian is designed for backend engineers, platform engineers, DevOps teams, SREs, and engineering leads who need to deploy database migrations safely — without surprises, without downtime, and without guessing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
