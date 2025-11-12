import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/main/app-sidebar";
import PageHeader from "@/components/main/page-header";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="antialiased">
      <SidebarProvider>
        <AppSidebar />
        <div className="min-h-svh w-full bg-[#F1F5F9]">
          <div className="w-full space-y-2 p-4">
            <PageHeader />
          </div>
          <div className="w-full px-4">
              {children}
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
