'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser, getCurrentUser, UserResponse } from '@/services/auth';
import { rolePermissions, mapBackendRole } from '@/lib/types/auth';

interface AuthContextType {
  user: UserResponse | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (feature: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user) {
        const mappedRole = mapBackendRole(user.role);
        const userPermissions = rolePermissions[mappedRole];
        const isAllowedRoute = userPermissions.allowedRoutes.some(route => 
          pathname.startsWith(route)
        );

        if (!isAllowedRoute && pathname !== '/login') {
          router.push('/dashboard');
        }
      }
    }
  }, [user, pathname, router, isLoading]);

  const login = async (username: string, password: string) => {
    try {
      const { access_token } = await loginUser(username, password);
      localStorage.setItem('token', access_token);
      
      const userData = await getCurrentUser(access_token);
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const hasPermission = (feature: string): boolean => {
    if (!user) return false;
    const mappedRole = mapBackendRole(user.role);
    return rolePermissions[mappedRole].features.includes(feature);
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isLoading }}>
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