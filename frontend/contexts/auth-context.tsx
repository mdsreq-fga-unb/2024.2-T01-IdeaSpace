'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser, getCurrentUser, UserResponse } from '@/services/auth';
import { rolePermissions, getUserRole } from '@/lib/types/auth';
import Loading from '@/app/loading';

interface AuthContextType {
  user: UserResponse | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (feature: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MIN_LOADING_TIME = 1500; // 1.5 segundos de loading mínimo

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const startTime = Date.now();
      try {
        // Em desenvolvimento, limpe o token (exemplo com Docker)
        if (process.env.NODE_ENV === 'development') {
          localStorage.removeItem('token');
        }

        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('token');
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
        setTimeout(() => {
          setIsLoading(false);
          setIsInitialized(true);
        }, remainingTime);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user) {
        const userRole = getUserRole(user);
        // Define a rota padrão para cada papel
        let defaultRoute = '/dashboard/alunos';
        if (userRole === 'professor') {
          defaultRoute = '/dashboard/professores';
        } else if (userRole === 'administrador') {
          defaultRoute = '/dashboard/admin';
        }
        const userPermissions = rolePermissions[userRole];
        const isAllowedRoute = userPermissions.allowedRoutes.some(route =>
          pathname.startsWith(route)
        );
        if (!isAllowedRoute && pathname !== '/login') {
          router.push(defaultRoute);
        }
      }
    }
  }, [user, pathname, router, isInitialized]);

  const login = async (username: string, password: string) => {
    try {
      const { access_token } = await loginUser(username, password);
      localStorage.setItem('token', access_token);

      const userData = await getCurrentUser(access_token);
      setUser(userData);

      // Redireciona de acordo com o papel do usuário
      const userRole = getUserRole(userData);
      if (userRole === 'aluno') {
        router.push('/dashboard/home/alunos');
      } else if (userRole === 'professor') {
        router.push('/dashboard/home/professores');
      } else if (userRole === 'administrador') {
        router.push('/dashboard/home/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Falha no login:', error);
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
    const userRole = getUserRole(user);
    return rolePermissions[userRole].features.includes(feature);
  };

  if (!isInitialized || isLoading) {
    return <Loading />;
  }

  if (!user && pathname !== '/login') {
    return <Loading />;
  }

  if (user) {
    const userRole = getUserRole(user);
    const userPermissions = rolePermissions[userRole];
    const isAllowedRoute = userPermissions.allowedRoutes.some(route =>
      pathname.startsWith(route)
    );
    if (!isAllowedRoute && pathname !== '/login') {
      return <Loading />;
    }
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
