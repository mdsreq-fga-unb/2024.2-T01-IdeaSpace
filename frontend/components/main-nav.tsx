'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Rocket, LayoutDashboard, Users, GraduationCap, BookOpen, LogOut } from 'lucide-react';
import { useState } from 'react';

const routes = [
  {
    href: '/dashboard',
    label: 'Geral',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/alunos',
    label: 'Alunos',
    icon: Users,
  },
  {
    href: '/dashboard/turmas',
    label: 'Turmas',
    icon: GraduationCap,
  },
  {
    href: '/dashboard/questoes',
    label: 'Questões',
    icon: BookOpen,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // Aqui você pode adicionar a lógica de logout
    router.push('/login');
  };

  return (
    <div className="flex-1 flex items-center">
      {/* Logo - Always visible */}
      <Link href="/dashboard" className="flex items-center gap-2 mr-6">
        <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg hidden sm:inline-block">IdeiaSpace</span>
      </Link>

      {/* Mobile Menu */}
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
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sair
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
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

      {/* Theme Toggle and Logout - Always visible */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Sair</span>
        </Button>
      </div>
    </div>
  );
}