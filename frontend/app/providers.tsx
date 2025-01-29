'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}