import { useState, useRef, type FormEvent } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Form';
import { joinWaitlist } from '@/services/api';

export default function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const result = await joinWaitlist(email, firstName || undefined);
    if (result.success) {
      setStatus('success');
      setMessage(result.message);
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 ${compact ? 'py-3' : 'p-5'} bg-success-50 border border-success-200 rounded-lg animate-slide-up`}>
        <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0" />
        <p className="text-sm font-medium text-success-800">{message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={compact ? 'space-y-2.5' : 'space-y-4'}>
      {!compact && (
        <Field label="First name" htmlFor="wl-firstName" optional>
          <Input
            id="wl-firstName"
            type="text"
            placeholder="Jordan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Field>
      )}
      <Field label="Work email" htmlFor="wl-email" error={status === 'error' ? message : undefined}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <Input
            id="wl-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </Field>
      {compact && status === 'error' && (
        <p className="text-xs text-danger-600">{message}</p>
      )}
      <Button type="submit" loading={status === 'loading'} className="w-full">
        Join the Waitlist
      </Button>
      <p className="text-xs text-ink-400 text-center">No spam. Product and engineering updates only.</p>
    </form>
  );
}
