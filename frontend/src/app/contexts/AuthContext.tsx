import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabaseClient';

export type UserRole = 'admin' | 'sales' | 'hr' | 'finance' | 'logistics' | 'infrastructure';
export type ClientType = 'full' | 'courses_only';
export type UserType = 'employee' | 'client';

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  role?: UserRole; // Employee roles
  clientType?: ClientType; // Client tiers
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (module: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permissions by role
const rolePermissions: Record<UserRole, string[]> = {
  admin: ['crm', 'users', 'financial', 'email'],
  sales: ['crm', 'email'],
  hr: ['users', 'email'],
  finance: ['financial', 'email'],
  logistics: ['email'],
  infrastructure: ['email']
};

// Permissions for clients
const clientPermissions: Record<ClientType, string[]> = {
  full: ['courses', 'configure', 'gpt-traders'],
  courses_only: ['courses']
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSupabaseUser = (authUser: SupabaseUser | null): User | null => {
    if (!authUser || !authUser.email) return null;

    const email = authUser.email.toLowerCase();
    const nameFromMeta = typeof authUser.user_metadata?.full_name === 'string'
      ? authUser.user_metadata.full_name
      : authUser.email.split('@')[0];

    if (email === 'admin@mygain.com') {
      return { id: authUser.id, name: 'Admin MyGain', email, type: 'employee', role: 'admin' };
    }
    if (email === 'finance@mygain.com') {
      return { id: authUser.id, name: 'Maria Finance', email, type: 'employee', role: 'finance' };
    }
    if (email === 'sales@mygain.com') {
      return { id: authUser.id, name: 'Carlos Sales', email, type: 'employee', role: 'sales' };
    }
    if (email === 'hr@mygain.com') {
      return { id: authUser.id, name: 'Ana HR', email, type: 'employee', role: 'hr' };
    }
    if (email === 'logistics@mygain.com') {
      return { id: authUser.id, name: 'Pedro Logistics', email, type: 'employee', role: 'logistics' };
    }
    if (email === 'infrastructure@mygain.com') {
      return { id: authUser.id, name: 'Roberto Infrastructure', email, type: 'employee', role: 'infrastructure' };
    }
    if (email === 'client@company.com') {
      return { id: authUser.id, name: 'Full Client', email, type: 'client', clientType: 'full' };
    }
    if (email === 'client2@company.com') {
      return { id: authUser.id, name: 'Courses Client', email, type: 'client', clientType: 'courses_only' };
    }

    return {
      id: authUser.id,
      name: nameFromMeta,
      email,
      type: 'employee',
      role: 'admin'
    };
  };

  useEffect(() => {
    let isMounted = true;

    const supabase = getSupabaseClient();
    if (!supabase) {
      setUser(null);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('Supabase session error:', error.message);
      }
      setUser(mapSupabaseUser(data.session?.user ?? null));
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(mapSupabaseUser(session?.user ?? null));
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const hasPermission = (module: string): boolean => {
    if (!user) return false;

    // Default to allow visual access (backend will enforce later)
    return true;

    // Permissions logic (temporarily disabled)
    /*
    // If employee, check role-based permissions
    if (user.type === 'employee' && user.role) {
      return rolePermissions[user.role]?.includes(module) || false;
    }

    // If client, check tier-based permissions
    if (user.type === 'client' && user.clientType) {
      return clientPermissions[user.clientType]?.includes(module) || false;
    }

    return false;
    */
  };

  const value = useMemo(
    () => ({ user, login, logout, hasPermission, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
