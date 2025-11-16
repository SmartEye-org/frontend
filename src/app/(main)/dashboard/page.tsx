"use client";
import { StatsCard } from "@/components/main/stat-card"
import { Users } from "lucide-react";
import EventsTable from "@/components/main/events-table";

export default function DashboardPage() {
    return (
        <div className="p-4 w-full min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                <StatsCard title="Today's Users" icon={Users} value="2,300" />
                <StatsCard title="Today's Users" icon={Users} value="2,300" />
                <StatsCard title="Today's Users" icon={Users} value="2,300" />
                <StatsCard title="Today's Users" icon={Users} value="2,300" />
            </div>
            <EventsTable />
        </div>
    );
}