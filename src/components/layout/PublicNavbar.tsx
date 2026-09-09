import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';

const navLinks = [
  { label: 'Product', to: '/product' },
  { label: 'Docs', to: '/docs' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ink-200">
      <nav className="container-public h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3.5 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 hover:bg-ink-50 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/contact">
            <Button variant="primary" size="sm">Request a Demo</Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-ink-600 hover:text-ink-900"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ink-200 bg-white animate-fade-in">
          <div className="container-public py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded-lg"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <Link to="/login" onClick={() => setOpen(false)} className="block">
                <Button variant="outline" size="md" className="w-full">Sign in</Button>
              </Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="block">
                <Button variant="primary" size="md" className="w-full">Request a Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
