import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

export default function PublicLayout({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <PublicFooter />
    </div>
  );
}
