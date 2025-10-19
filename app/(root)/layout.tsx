import { AppSidebar } from "@/components/shared/AppSidebar";
import { Bottombar } from "@/components/shared/Bottombar";
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
