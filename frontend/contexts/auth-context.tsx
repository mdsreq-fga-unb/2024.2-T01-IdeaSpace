'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, UserRole, rolePermissions } from '@/lib/types/auth';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has access to current route
    if (user) {
      const userPermissions = rolePermissions[user.role];
      const isAllowedRoute = userPermissions.allowedRoutes.some(route => 
        pathname.startsWith(route)
      );

      if (!isAllowedRoute && pathname !== '/login') {
        router.push('/dashboard');
      }
    } else if (pathname !== '/login') {
      router.push('/login');
    }
  }, [user, pathname, router]);

  const login = async (username: string, password: string) => {
    try {
      // Mock login - replace with actual authentication
      let role: UserRole = 'aluno';
      if (username.includes('admin')) {
        role = 'administrador';
      } else if (username.includes('prof')) {
        role = 'professor';
      }

      const mockUser: User = {
        id: '1',
        name: 'Nome do Usuário',
        username,
        role,
      };

      setUser(mockUser);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  const hasPermission = (feature: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role].features.includes(feature);
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