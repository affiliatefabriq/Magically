import { AppSidebar } from '@/components/shared/layout/AppSidebar';
import { Bottombar } from '@/components/shared/layout/Bottombar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { RootLayoutProps } from '@/types';
import { Toaster } from 'sonner';

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <section>
      <SidebarProvider>
        <AppSidebar />
        {/*
         * CRITICAL: flex-1 alone is not enough in a flex container —
         * without min-w-0 the div can still report its intrinsic width
         * (full viewport) to children like Embla Carousel.
         * min-w-0 forces the flex child to respect the space left over
         * after the sidebar, which is exactly what we need.
         */}
        <div className="flex-1 min-w-0 overflow-x-hidden">{children}</div>
        <Bottombar />
        <Toaster theme="dark" />
      </SidebarProvider>
    </section>
  );
}
