'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { STORE } from '@/lib/config';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string, phone?: string) => { ok: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);
const KEY = 'kq_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const login = useCallback((email: string, password: string) => {
    const e = email.trim().toLowerCase();
    if (e === STORE.adminEmail.toLowerCase() && password === STORE.adminPassword) {
      const admin: User = { id: 'admin', name: 'Admin', email: STORE.adminEmail, role: 'admin' };
      persist(admin);
      return { ok: true };
    }
    // demo customer accounts stored in localStorage users list
    try {
      const users: Array<User & { password: string }> = JSON.parse(localStorage.getItem('kq_users') || '[]');
      const found = users.find((u) => u.email.toLowerCase() === e && u.password === password);
      if (found) {
        const { password: _, ...safe } = found;
        persist(safe);
        return { ok: true };
      }
    } catch {}
    return { ok: false, error: 'Invalid email or password' };
  }, []);

  const signup = useCallback((name: string, email: string, password: string, phone?: string) => {
    const e = email.trim().toLowerCase();
    if (!name || !e || password.length < 6) return { ok: false, error: 'Fill all fields (password min 6)' };
    try {
      const users: Array<User & { password: string }> = JSON.parse(localStorage.getItem('kq_users') || '[]');
      if (users.some((u) => u.email.toLowerCase() === e) || e === STORE.adminEmail.toLowerCase()) {
        return { ok: false, error: 'Email already registered' };
      }
      const newUser: User & { password: string } = {
        id: `u_${Date.now()}`,
        name: name.trim(),
        email: e,
        phone,
        role: 'customer',
        password,
      };
      users.push(newUser);
      localStorage.setItem('kq_users', JSON.stringify(users));
      const { password: _, ...safe } = newUser;
      persist(safe);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Signup failed' };
    }
  }, []);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
