"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Camera,
  Monitor,
  BellRing,
  Settings,
  LogOut,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

type Item = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { title: "Live Monitoring", href: "/live-monitoring", icon: Camera },
  { title: "Monitoring Center", href: "/monitoring-center", icon: Monitor },
  { title: "Notification", href: "/notification", icon: BellRing },
];

const matchPath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/");

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center p-4">
        <h1 className=" text-2xl font-extrabold text-[#064E3B] group-data-[collapsible=icon]:hidden">
          SmartEye.
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = matchPath(pathname, item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="py-6 text-sm text-[#5C6169]
                                data-[active=true]:bg-[#064E3B] data-[active=true]:text-white
                                data-[active=true]:hover:bg-[#064E3B]/80"
                    >
                      <Link href={item.href}>
                        <item.icon className="shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Settings/>
                  <span className="py-6 text-sm text-[#5C6169]">
                    Setting
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                <DropdownMenuItem className="flex items-center gap-2 text-red-500 w-full cursor-pointer">
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>



    </Sidebar>
  );
}
