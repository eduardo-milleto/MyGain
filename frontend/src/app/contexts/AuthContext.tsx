import { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (email: string, password: string) => void;
  logout: () => void;
  hasPermission: (module: string) => boolean;
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

  const login = (email: string, password: string) => {
    // Simulated login - implement real auth later
    
    // Admin
    if (email === 'admin@mygain.com') {
      setUser({
        id: '1',
        name: 'Admin MyGain',
        email: 'admin@mygain.com',
        type: 'employee',
        role: 'admin'
      });
    }
    // Finance
    else if (email === 'finance@mygain.com') {
      setUser({
        id: '2',
        name: 'Maria Finance',
        email: 'finance@mygain.com',
        type: 'employee',
        role: 'finance'
      });
    }
    // Sales
    else if (email === 'sales@mygain.com') {
      setUser({
        id: '3',
        name: 'Carlos Sales',
        email: 'sales@mygain.com',
        type: 'employee',
        role: 'sales'
      });
    }
    // HR
    else if (email === 'hr@mygain.com') {
      setUser({
        id: '6',
        name: 'Ana HR',
        email: 'hr@mygain.com',
        type: 'employee',
        role: 'hr'
      });
    }
    // Logistics
    else if (email === 'logistics@mygain.com') {
      setUser({
        id: '7',
        name: 'Pedro Logistics',
        email: 'logistics@mygain.com',
        type: 'employee',
        role: 'logistics'
      });
    }
    // Infrastructure
    else if (email === 'infrastructure@mygain.com') {
      setUser({
        id: '8',
        name: 'Roberto Infrastructure',
        email: 'infrastructure@mygain.com',
        type: 'employee',
        role: 'infrastructure'
      });
    }
    // Full client
    else if (email === 'client@company.com') {
      setUser({
        id: '4',
        name: 'Full Client',
        email: 'client@company.com',
        type: 'client',
        clientType: 'full'
      });
    }
    // Courses-only client
    else if (email === 'client2@company.com') {
      setUser({
        id: '5',
        name: 'Courses Client',
        email: 'client2@company.com',
        type: 'client',
        clientType: 'courses_only'
      });
    }
    // Default: Admin
    else {
      setUser({
        id: '1',
        name: 'Admin MyGain',
        email: email,
        type: 'employee',
        role: 'admin'
      });
    }
  };

  const logout = () => {
    setUser(null);
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

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
