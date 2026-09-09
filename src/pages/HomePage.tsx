import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Database,
  FlaskConical,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  Layers,
  GitBranch,
  Terminal,
  AlertTriangle,
  Unlink,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import AssessmentMockup from '@/components/home/AssessmentMockup';
import { LogoIcon } from '@/components/ui/Logo';
import WaitlistForm from '@/components/forms/WaitlistForm';

const techStack = [
  { icon: Database, label: 'PostgreSQL' },
  { icon: Layers, label: 'Django' },
  { icon: GitBranch, label: 'Alembic' },
  { icon: Terminal, label: 'Python' },
  { icon: FileText, label: 'OpenAI' },
  { icon: AlertTriangle, label: 'AWS' },
];

const problemExamples = [
  {
    icon: AlertTriangle,
    title: 'NOT NULL without backfill',
    desc: 'A migration adds a NOT NULL constraint, but existing rows already contain NULL values — the migration fails mid-deployment.',
  },
  {
    icon: Layers,
    title: 'Duplicate data breaks uniqueness',
    desc: 'A new unique constraint is valid SQL, but duplicate rows already exist in the source database.',
  },
  {
    icon: Unlink,
    title: 'Orphaned foreign keys',
    desc: 'A foreign key constraint references parent rows that were deleted, so validation cannot pass.',
  },
  {
    icon: Database,
    title: 'Valid SQL, dangerous locks',
    desc: 'A migration is syntactically correct but causes blocking table locks under production traffic.',
  },
];

const workflowSteps = [
  {
    icon: Database,
    title: 'Connect',
    desc: 'Connect a PostgreSQL database using read-only credentials.',
  },
  {
    icon: FileText,
    title: 'Upload',
    desc: 'Upload a raw SQL, Django, or Alembic migration artifact.',
  },
  {
    icon: FlaskConical,
    title: 'Verify',
    desc: 'Migration Guardian inspects current database state, gathers evidence, and safely exercises executable migration SQL in an isolated sandbox.',
  },
  {
    icon: ShieldAlert,
    title: 'Decide',
    desc: 'Receive a structured deployment decision with verified risks, unresolved checks, and concrete next steps.',
  },
];

const features = [
  {
    icon: CheckCircle2,
    title: 'Evidence-backed analysis',
    desc: 'Go beyond static migration review by checking the database state that actually determines whether a migration succeeds.',
  },
  {
    icon: Database,
    title: 'Read-only source inspection',
    desc: 'Source databases are inspected using bounded read-only queries. Candidate migrations are never executed there.',
  },
  {
    icon: FlaskConical,
    title: 'Isolated sandbox verification',
    desc: 'Safely exercise executable migration SQL against an isolated PostgreSQL sandbox before deployment.',
  },
  {
    icon: Layers,
    title: 'Framework awareness',
    desc: 'Support for raw PostgreSQL SQL, Django migrations, and Alembic revisions.',
  },
  {
    icon: ShieldAlert,
    title: 'Structured deployment decisions',
    desc: 'Get actionable BLOCK, APPROVE WITH CONDITIONS, or APPROVE outcomes with evidence and required actions.',
  },
  {
    icon: GitBranch,
    title: 'CI/CD ready',
    desc: 'Designed to evolve into a programmable safety gate for deployment pipelines.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white" />
        <div className="relative container-public py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-medium text-brand-700 mb-6">
                <Lock className="w-3.5 h-3.5" />
                Evidence-backed migration safety
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-ink-900 leading-[1.1]">
                Ship database migrations with evidence, not assumptions.
              </h1>
              <p className="mt-5 text-lg text-ink-600 leading-relaxed max-w-xl">
                Migration Guardian evaluates candidate migrations against the database that exists right now — combining static analysis, read-only source inspection, and isolated sandbox verification.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/contact">
                  <Button variant="primary" size="lg">Request a Demo <ArrowRight className="w-4 h-4" /></Button>
                </Link>
                <a href="#waitlist">
                  <Button variant="outline" size="lg">Join the Waitlist</Button>
                </a>
              </div>
              <a href="#how-it-works" className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition-colors">
                See how it works <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex justify-center lg:justify-end">
              <AssessmentMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Technology ecosystem strip */}
      <section className="border-b border-ink-200 bg-ink-50/50 py-14">
        <div className="container-public">
          <p className="text-center text-sm font-medium text-ink-400 uppercase tracking-wide mb-8">
            Works with the tools engineering teams already use
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 lg:gap-10 items-start justify-items-center">
            {techStack.map((tech) => (
              <LogoIcon key={tech.label} icon={tech.icon} label={tech.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-20 border-b border-ink-200">
        <div className="container-public">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-ink-900">
              Migration failures often depend on state — not syntax.
            </h2>
            <p className="mt-4 text-ink-600 leading-relaxed">
              Static review checks whether your migration is valid SQL. It cannot tell you whether your migration will succeed against the data and schema that exist in your database right now. That is where migration failures actually happen.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {problemExamples.map((ex) => (
              <div key={ex.title} className="flex gap-4 p-5 border border-ink-200 rounded-xl bg-white hover:border-ink-300 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center">
                  <ex.icon className="w-5 h-5 text-ink-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">{ex.title}</h3>
                  <p className="mt-1 text-sm text-ink-500 leading-relaxed">{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 border-b border-ink-200 bg-ink-50/50">
        <div className="container-public">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-ink-900">How it works</h2>
            <p className="mt-4 text-ink-600 leading-relaxed">
              Four stages from connection to deployment decision — each producing auditable evidence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="bg-white border border-ink-200 rounded-xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-ink-400">Step {i + 1}</span>
                  </div>
                  <h3 className="text-base font-semibold text-ink-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{step.desc}</p>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 w-5 h-5 text-ink-300 -translate-y-1/2 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-b border-ink-200">
        <div className="container-public">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-ink-900">Built for migration safety, not just review</h2>
            <p className="mt-4 text-ink-600 leading-relaxed">
              Every capability is designed to answer one question: can this migration deploy safely against the database that exists right now?
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat) => (
              <div key={feat.title} className="p-6 border border-ink-200 rounded-xl bg-white hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="text-base font-semibold text-ink-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security / trust */}
      <section className="py-20 border-b border-ink-200 bg-ink-900 text-white">
        <div className="container-public">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold text-white">Designed around safe execution boundaries</h2>
            <p className="mt-4 text-ink-300 leading-relaxed">
              Migration Guardian separates read-only source inspection from isolated sandbox execution. Evidence provenance is tracked at every step.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Database, title: 'Read-only source access', desc: 'Source databases are inspected using bounded read-only queries only.' },
              { icon: FlaskConical, title: 'Isolated sandbox execution', desc: 'Migration SQL executes only in an isolated PostgreSQL sandbox environment.' },
              { icon: Lock, title: 'Clear evidence separation', desc: 'Source and sandbox evidence remain clearly labeled and never mixed.' },
              { icon: FileText, title: 'Untrusted Python artifacts', desc: 'Django and Alembic uploads are statically analyzed without executing uploaded Python.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 rounded-xl bg-ink-800 border border-ink-700">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-ink-700 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-20 bg-ink-50/50">
        <div className="container-public">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-ink-900">Join the Migration Guardian early-access list</h2>
            <p className="mt-4 text-ink-600 leading-relaxed">
              Get product updates, early access announcements, and migration-safety engineering insights.
            </p>
            <div className="mt-8 max-w-md mx-auto p-6 bg-white border border-ink-200 rounded-xl shadow-sm">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
