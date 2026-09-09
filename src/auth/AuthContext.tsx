import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import * as api from '@/services/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'mg_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const u = await api.signIn(email, password);
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await api.signOut();
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
