import { AppSidebar } from '@/components/shared/layout/AppSidebar';
import { Bottombar } from '@/components/shared/layout/Bottombar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { RootLayoutProps } from '@/types';
import { Toaster } from 'sonner';

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <section>
      <SidebarProvider open={false}>
        <AppSidebar />
        <div className="flex-1 min-w-0 overflow-x-hidden">{children}</div>
        <Bottombar />
        <Toaster theme="dark" />
      </SidebarProvider>
    </section>
  );
}
