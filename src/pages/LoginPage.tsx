import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Form';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/auth/AuthContext';

export default function LoginPage() {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as any)?.from || '/app';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <Link to="/"><Logo /></Link>
          </div>

          <div className="bg-white border border-ink-200 rounded-xl shadow-sm p-8">
            <h1 className="text-xl font-bold text-ink-900 text-center">Sign in to your workspace</h1>
            <p className="mt-1.5 text-sm text-ink-500 text-center">Enter your credentials to access Migration Guardian.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field label="Work email" htmlFor="email">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </Field>

              <Field label="Password" htmlFor="password">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </Field>

              {error && (
                <p className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <Button type="submit" size="lg" loading={loading} className="w-full">
                Sign in <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-between text-sm">
                <a href="#" className="text-ink-500 hover:text-ink-900">Forgot password?</a>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-ink-200 text-center">
              <p className="text-sm text-ink-500">
                Need access?{' '}
                <Link to="/#waitlist" className="text-brand-600 hover:text-brand-700 font-medium">Join the waitlist</Link>
                {' '}or{' '}
                <Link to="/contact" className="text-brand-600 hover:text-brand-700 font-medium">request a demo</Link>.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-ink-400">
            <Link to="/" className="hover:text-ink-600">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
