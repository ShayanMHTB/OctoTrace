import AuthGuard from '@/components/auth/AuthGuard';
import DashboardHeader from '@/components/layout/DashboardHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh">
        <SidebarProvider>
          <DashboardSidebar />
          <div className="flex w-full flex-col">
            <DashboardHeader />
            <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          </div>
        </SidebarProvider>
      </div>
    </AuthGuard>
  );
}
