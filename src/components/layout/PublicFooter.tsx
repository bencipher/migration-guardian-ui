import { Link } from 'react-router-dom';
import { useRef } from 'react';
import Logo from '@/components/ui/Logo';
import WaitlistForm from '@/components/forms/WaitlistForm';

const footerLinks = [
  { label: 'Product', to: '/product' },
  { label: 'Docs', to: '/docs' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Sign in', to: '/login' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
];

export default function PublicFooter() {
  const waitlistRef = useRef<HTMLDivElement>(null);

  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="container-public py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-ink-500 max-w-xs">
              Evidence-backed PostgreSQL migration safety.
            </p>
          </div>

          <div ref={waitlistRef} className="md:col-span-1" id="waitlist">
            <h4 className="text-sm font-semibold text-ink-900 mb-3">Join the Waitlist</h4>
            <WaitlistForm compact />
          </div>

          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-ink-900 mb-3">Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ink-500 hover:text-ink-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-400">Migration Guardian — Evidence-backed PostgreSQL migration safety.</p>
          <p className="text-xs text-ink-400">© {new Date().getFullYear()} Migration Guardian. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
