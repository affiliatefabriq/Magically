import { AppSidebar } from "@/components/shared/layout/AppSidebar";
import { Bottombar } from "@/components/shared/layout/Bottombar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RootLayoutProps } from "@/types";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <section>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 mb-24 md:mb-0">{children}</div>
        <Bottombar />
      </SidebarProvider>
    </section>
  );
}
