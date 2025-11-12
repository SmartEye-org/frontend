"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";

const routeMap: Record<
    string,
    { title: string }
> = {
    "/dashboard": { title: "Dashboard" },
    "/live": { title: "Live Monitoring" },
    "/monitoring": { title: "Monitoring Center" },
    "/notification": { title: "Notification" },
};

export default function PageHeader() {
    const pathname = usePathname();

    const matched = Object.entries(routeMap).find(([path]) =>
        pathname === path || pathname.startsWith(path + "/")
    );
    const title = matched?.[1].title ?? "Dashboard";

    return (
        <div className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3 text-sm">
            <SidebarTrigger />
            <span className="font-semibold text-[#1B3C74]">{title}</span>
        </div>
    );
}
