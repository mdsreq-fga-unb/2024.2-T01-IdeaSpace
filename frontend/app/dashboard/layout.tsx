import { MainNav } from '@/components/main-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4">
          <div className="flex h-16 items-center">
            <MainNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}