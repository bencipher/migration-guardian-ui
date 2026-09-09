import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, ShieldCheck, Database, FlaskConical, GitBranch, Code2, Terminal, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const docLinks = [
  { icon: Rocket, title: 'Quick Start', desc: 'Get running in three steps — connect, upload, review.', to: '/docs' },
  { icon: Database, title: 'Raw SQL', desc: 'Full sandbox verification for PostgreSQL SQL migrations.', to: '/docs' },
  { icon: GitBranch, title: 'Django', desc: 'Static analysis of Django migration artifacts.', to: '/docs' },
  { icon: FlaskConical, title: 'Alembic', desc: 'Static analysis of Alembic revision files.', to: '/docs' },
  { icon: Code2, title: 'API', desc: 'REST API for programmatic migration review.', to: '/docs' },
  { icon: ShieldCheck, title: 'Security Model', desc: 'Read-only source access, isolated sandbox, untrusted Python.', to: '/docs' },
  { icon: Terminal, title: 'CLI', desc: 'Command-line interface for local and CI/CD usage.', to: '/docs' },
];

export default function AppDocsPage() {
  return (
    <div className="container-app py-10">
      <h1 className="text-2xl font-bold text-ink-900">Product Documentation</h1>
      <p className="mt-1.5 text-sm text-ink-500 mb-8">Integration guidance and reference for Migration Guardian.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docLinks.map((doc) => (
          <Link key={doc.title} to={doc.to}>
            <Card className="p-5 h-full hover:shadow-md hover:border-ink-300 transition-all cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                  <doc.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-ink-900">{doc.title}</h3>
                  <p className="mt-1 text-xs text-ink-500 leading-relaxed">{doc.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-ink-600 transition-colors flex-shrink-0" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 p-6 bg-ink-50 border-ink-200">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-ink-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-ink-600">
              Looking for the full public documentation?{' '}
              <Link to="/docs" className="text-brand-600 hover:text-brand-700 font-medium">
                View developer docs
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
