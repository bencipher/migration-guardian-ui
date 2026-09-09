import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/auth/AuthContext';

const navItems = [
  { label: 'Workspace', to: '/app', icon: LayoutDashboard },
  { label: 'Reviews', to: '/app/reviews', icon: FileText },
  { label: 'Docs', to: '/app/docs', icon: BookOpen },
];

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const isActive = (to: string) => (to === '/app' ? pathname === '/app' : pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-ink-200">
        <div className="px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/app"><Logo iconSize={18} /></Link>
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.to)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-ink-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-ink-700 font-medium">{user?.name || 'User'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-ink-200 rounded-lg shadow-lg z-20 py-1 animate-fade-in">
                    <div className="px-3 py-2 border-b border-ink-100">
                      <p className="text-sm font-medium text-ink-900 truncate">{user?.name}</p>
                      <p className="text-xs text-ink-400 truncate">{user?.email}</p>
                    </div>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:bg-ink-50">
                      <User className="w-4 h-4" /> Account
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 text-ink-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-ink-200 bg-white animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                    isActive(item.to) ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-ink-100">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-ink-900">{user?.name}</p>
                  <p className="text-xs text-ink-400">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
