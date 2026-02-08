import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabaseClient';

export type AccessRole = 'cliente' | 'colaborador';
export type ClientSubRole = 'cursos' | 'agentes' | 'cursos_agentes';
export type EmployeeSubRole = 'admin' | 'vendas' | 'financeiro' | 'rh' | 'logistica' | 'infraestrutura';
export type UserType = 'employee' | 'client';

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  role?: AccessRole;
  subRole?: ClientSubRole | EmployeeSubRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (module: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const employeePermissions: Record<EmployeeSubRole, string[]> = {
  admin: ['crm', 'users', 'financial', 'email'],
  vendas: ['crm'],
  rh: ['users'],
  financeiro: ['financial'],
  logistica: ['email'],
  infraestrutura: ['email']
};

const clientPermissions: Record<ClientSubRole, string[]> = {
  cursos: ['courses'],
  agentes: ['configure', 'gpt-traders'],
  cursos_agentes: ['configure', 'gpt-traders', 'courses']
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
    return {
      id: authUser.id,
      name: nameFromMeta,
      email,
      type: 'employee'
    };
  };

  const loadCargos = async (authUser: SupabaseUser | null): Promise<User | null> => {
    const baseUser = mapSupabaseUser(authUser);
    if (!baseUser) return null;

    const supabase = getSupabaseClient();
    if (!supabase) return baseUser;

    const { data, error } = await supabase
      .from('cargos')
      .select('role, sub_role')
      .eq('supabase_id', baseUser.id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao carregar cargos:', error.message);
      return baseUser;
    }

    if (!data) {
      return baseUser;
    }

    const role = data.role as AccessRole;
    const subRole = data.sub_role as ClientSubRole | EmployeeSubRole;

    return {
      ...baseUser,
      role,
      subRole,
      type: role === 'cliente' ? 'client' : 'employee'
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

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('Supabase session error:', error.message);
      }
      const nextUser = await loadCargos(data.session?.user ?? null);
      setUser(nextUser);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      const nextUser = await loadCargos(session?.user ?? null);
      setUser(nextUser);
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

    if (!user.role || !user.subRole) return false;

    if (module === 'erp') {
      return user.role === 'colaborador';
    }

    if (module === 'agents') {
      return user.role === 'cliente';
    }

    if (user.role === 'colaborador') {
      return employeePermissions[user.subRole as EmployeeSubRole]?.includes(module) || false;
    }

    return clientPermissions[user.subRole as ClientSubRole]?.includes(module) || false;
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
