import { Link } from 'react-router-dom';
import {
  Database,
  FlaskConical,
  FileText,
  ShieldCheck,
  GitBranch,
  Terminal,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import WaitlistForm from '@/components/forms/WaitlistForm';

const sections = [
  {
    icon: Database,
    title: 'Source inspection',
    desc: 'Migration Guardian connects to your PostgreSQL database using read-only credentials and runs bounded queries to inspect the current schema and data state that your migration will operate against.',
    points: ['Read-only connection verified', 'Bounded data sampling', 'Schema and constraint inspection'],
  },
  {
    icon: FileText,
    title: 'Migration artifact analysis',
    desc: 'Candidate migrations are parsed and statically analyzed. Migration Guardian understands raw SQL, Django migrations, and Alembic revisions — extracting operations, dependencies, and framework metadata.',
    points: ['Operation extraction', 'Dependency graph parsing', 'Type auto-detection'],
  },
  {
    icon: FlaskConical,
    title: 'Sandbox execution',
    desc: 'For raw SQL migrations, Migration Guardian safely executes the candidate migration against an isolated PostgreSQL sandbox that mirrors the source database structure — never against your production database.',
    points: ['Isolated PostgreSQL instance', 'Safe execution of candidate SQL', 'Post-migration state capture'],
  },
  {
    icon: CheckCircle2,
    title: 'Evidence provenance',
    desc: 'Every finding is labeled with its provenance — SOURCE DB, SANDBOX, STATIC, or UNVERIFIED — so you always know where evidence came from and how much to trust it.',
    points: ['Provenance tracked per finding', 'Source and sandbox never mixed', 'Explicit unverified items'],
  },
  {
    icon: ShieldCheck,
    title: 'Deployment decision',
    desc: 'Receive a structured BLOCK, APPROVE WITH CONDITIONS, or APPROVE outcome — backed by verified evidence, unresolved checks, and ordered next steps.',
    points: ['Risk-level assessment', 'Verified and unverified sections', 'Actionable next steps'],
  },
  {
    icon: GitBranch,
    title: 'Raw SQL / Django / Alembic',
    desc: 'Migration Guardian supports the three most common PostgreSQL migration frameworks. Each receives framework-appropriate analysis — full sandbox execution for raw SQL, static analysis for Python artifacts.',
    points: ['Raw PostgreSQL SQL', 'Django migrations', 'Alembic revisions'],
  },
  {
    icon: Terminal,
    title: 'CLI / API / future CI/CD',
    desc: 'Migration Guardian is designed to become a programmable safety gate in your deployment pipeline. The web workflow is the first surface — CLI and API integrations are on the roadmap.',
    points: ['Programmatic safety gate', 'CI/CD integration ready', 'Structured JSON output'],
  },
];

export default function ProductPage() {
  return (
    <div>
      <section className="border-b border-ink-200 bg-ink-50/50 py-16">
        <div className="container-public">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-ink-900">Product</h1>
            <p className="mt-4 text-lg text-ink-600 leading-relaxed">
              Migration Guardian evaluates candidate migrations through a full review lifecycle — from source inspection to structured deployment decision.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-public space-y-16">
          {sections.map((section, i) => (
            <div key={section.title} className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-ink-900">{section.title}</h2>
                </div>
                <p className="text-ink-600 leading-relaxed mb-4">{section.desc}</p>
                <ul className="space-y-2">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-ink-700">
                      <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="bg-white border border-ink-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-ink-300" />
                    <div className="w-2 h-2 rounded-full bg-ink-300" />
                    <div className="w-2 h-2 rounded-full bg-ink-300" />
                    <span className="ml-1 text-xs text-ink-400 font-mono">migration-guardian</span>
                  </div>
                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <section.icon className="w-3.5 h-3.5 text-brand-500" />
                      <span className="text-ink-400">$</span>
                      <span className="text-ink-700">guardian inspect --source</span>
                    </div>
                    <div className="pl-6 text-success-600">✓ Read-only access verified</div>
                    <div className="pl-6 text-ink-500">→ PostgreSQL 16.3 · schema: public</div>
                    <div className="flex items-center gap-2 pt-2">
                      <Layers className="w-3.5 h-3.5 text-brand-500" />
                      <span className="text-ink-400">$</span>
                      <span className="text-ink-700">guardian analyze --migration</span>
                    </div>
                    <div className="pl-6 text-success-600">✓ Detected: PostgreSQL SQL migration</div>
                    <div className="pl-6 text-ink-500">→ 2 operations · 3 constraints</div>
                    <div className="flex items-center gap-2 pt-2">
                      <FlaskConical className="w-3.5 h-3.5 text-brand-500" />
                      <span className="text-ink-400">$</span>
                      <span className="text-ink-700">guardian verify --sandbox</span>
                    </div>
                    <div className="pl-6 text-danger-600">✗ SQLSTATE 23502 — NOT NULL violation</div>
                    <div className="pl-6 text-ink-500">→ 317 rows affected</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 border-t border-ink-200 bg-ink-50/50">
        <div className="container-public">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="p-8 bg-white border border-ink-200 rounded-xl">
              <h3 className="text-xl font-bold text-ink-900 mb-3">Request a Demo</h3>
              <p className="text-sm text-ink-600 mb-5">See Migration Guardian in action with your migration workflow.</p>
              <Link to="/contact">
                <Button variant="primary" size="lg">Request a Demo <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
            <div className="p-8 bg-white border border-ink-200 rounded-xl">
              <h3 className="text-xl font-bold text-ink-900 mb-3">Join the Waitlist</h3>
              <p className="text-sm text-ink-600 mb-5">Get product updates and early access announcements.</p>
              <WaitlistForm compact />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
