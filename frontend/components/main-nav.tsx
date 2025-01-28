'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Menu, 
  Rocket, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  Settings,
  TrendingUp,
  FileText,
  BarChart,
  School
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export function MainNav() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      href: '/dashboard',
      label: 'Geral',
      icon: LayoutDashboard,
      permission: 'view_own_profile',
    },
    // Rotas do Aluno
    {
      href: '/quiz/listing',
      label: 'Questionários',
      icon: FileText,
      permission: 'take_quizzes',
      roles: ['aluno'],
    },
    {
      href: '/dashboard/desempenho',
      label: 'Meu Desempenho',
      icon: TrendingUp,
      permission: 'view_own_performance',
      roles: ['aluno'],
    },
    // Rotas do Professor
    {
      href: '/dashboard/questionarios',
      label: 'Questionários',
      icon: BookOpen,
      permission: 'manage_class_quizzes',
      roles: ['professor', 'administrador'],
    },
    {
      href: '/dashboard/analise',
      label: 'Análise de Desempenho',
      icon: BarChart,
      permission: 'view_class_performance',
      roles: ['professor', 'administrador'],
    },
    // Rotas do Administrador
    {
      href: '/dashboard/alunos',
      label: 'Alunos',
      icon: Users,
      permission: 'manage_students',
      roles: ['administrador'],
    },
    {
      href: '/dashboard/professores',
      label: 'Professores',
      icon: School,
      permission: 'manage_teachers',
      roles: ['administrador'],
    },
    {
      href: '/dashboard/turmas',
      label: 'Turmas',
      icon: GraduationCap,
      permission: 'manage_classes',
      roles: ['administrador'],
    },
    {
      href: '/dashboard/questoes',
      label: 'Questões',
      icon: BookOpen,
      permission: 'create_questions',
      roles: ['administrador'],
    },
    {
      href: '/dashboard/analytics',
      label: 'Análise de Resultados',
      icon: BarChart,
      permission: 'view_all_performance',
      roles: ['administrador'],
    },
  ].filter(route => 
    hasPermission(route.permission) && 
    (!route.roles || route.roles.includes(user?.role || ''))
  );

  return (
    <div className="flex-1 flex items-center">
      <Link href="/dashboard" className="flex items-center gap-2 mr-6">
        <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg hidden sm:inline-block">IdeiaSpace</span>
      </Link>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex items-center gap-2 mb-8 mt-4">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">IdeiaSpace</span>
            </div>
            <div className="flex flex-col space-y-4">
              {routes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                      pathname === route.href
                        ? 'text-pink-600 dark:text-pink-400'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {route.label}
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Logado como {user?.username} ({user?.role})
                </p>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex items-center space-x-6 flex-1">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                pathname === route.href
                  ? 'text-pink-600 dark:text-pink-400'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {route.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground hidden lg:block">
            {user?.username} ({user?.role})
          </p>
          {user?.role === 'administrador' && (
            <Link href="/dashboard/admin">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-pink-600"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configurações</span>
              </Button>
            </Link>
          )}
        </div>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Sair</span>
        </Button>
      </div>
    </div>
  );
}