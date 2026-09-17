import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('auth_token')
  );
  const [isLoading, setIsLoading] = useState(false);

  // Hydrate user from /me on refresh if token exists
  useEffect(() => {
    if (token && !user) {
      authApi.me()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('auth_user', JSON.stringify(res.data));
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback((u: User, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('auth_user', JSON.stringify(u));
    localStorage.setItem('auth_token', t);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      persist(data.user, data.token);
    } finally {
      setIsLoading(false);
    }
  }, [persist]);

  const register = useCallback(async (
    name: string, email: string, password: string, passwordConfirmation: string
  ) => {
    setIsLoading(true);
    try {
      const { data } = await authApi.register(name, email, password, passwordConfirmation);
      persist(data.user, data.token);
    } finally {
      setIsLoading(false);
    }
  }, [persist]);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* swallow */ }
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
