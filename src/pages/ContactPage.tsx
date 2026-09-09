import { useState, type FormEvent } from 'react';
import { CheckCircle2, Send, Building2, Mail, User, Briefcase, Users, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Textarea, Field, Select } from '@/components/ui/Form';
import { requestDemo } from '@/services/api';

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
    teamSize: '',
    message: '',
    tooling: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const result = await requestDemo({
      fullName: form.fullName,
      email: form.email,
      company: form.company,
      role: form.role,
      teamSize: form.teamSize || undefined,
      message: form.message || undefined,
      tooling: form.tooling || undefined,
    });
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg(result.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="container-public py-24">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-50 border border-success-200 mb-6">
            <CheckCircle2 className="w-8 h-8 text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">Thanks — your request has been received.</h1>
          <p className="mt-3 text-ink-600">
            We'll reach out to schedule your Migration Guardian demo shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-public py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-ink-900">Request a Migration Guardian demo</h1>
        <p className="mt-3 text-ink-600 leading-relaxed">
          Tell us about your database migration workflow and we'll show you how Migration Guardian can fit into your deployment process.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name" htmlFor="fullName">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <Input id="fullName" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="pl-10" placeholder="Jordan Chen" required />
              </div>
            </Field>
            <Field label="Work email" htmlFor="email">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="pl-10" placeholder="you@company.com" required />
              </div>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Company" htmlFor="company">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <Input id="company" value={form.company} onChange={(e) => update('company', e.target.value)} className="pl-10" placeholder="Acme Inc." required />
              </div>
            </Field>
            <Field label="Role" htmlFor="role">
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <Input id="role" value={form.role} onChange={(e) => update('role', e.target.value)} className="pl-10" placeholder="Platform Engineer" required />
              </div>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Team size" htmlFor="teamSize" optional>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <Input id="teamSize" value={form.teamSize} onChange={(e) => update('teamSize', e.target.value)} className="pl-10" placeholder="1-10, 11-50, 50+" />
              </div>
            </Field>
            <Field label="Migration tooling" htmlFor="tooling" optional>
              <Select id="tooling" value={form.tooling} onChange={(e) => update('tooling', e.target.value)}>
                <option value="">Select tooling</option>
                <option value="raw_sql">Raw SQL</option>
                <option value="django">Django</option>
                <option value="alembic">Alembic</option>
                <option value="other">Other</option>
              </Select>
            </Field>
          </div>

          <Field label="What are you looking to improve?" htmlFor="message" optional>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-ink-400" />
              <Textarea id="message" value={form.message} onChange={(e) => update('message', e.target.value)} className="pl-10" placeholder="Tell us about your current migration review process and pain points..." />
            </div>
          </Field>

          {status === 'error' && (
            <p className="text-sm text-danger-600">{errorMsg}</p>
          )}

          <Button type="submit" size="lg" loading={status === 'loading'}>
            <Send className="w-4 h-4" /> Request Demo
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-ink-200">
          <p className="text-sm text-ink-500">
            Questions? Contact the Migration Guardian team at{' '}
            <a href="mailto:hello@migrationguardian.io" className="text-brand-600 hover:text-brand-700 font-medium">
              hello@migrationguardian.io
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
