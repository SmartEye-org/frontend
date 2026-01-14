"use client";

import { StatsCard } from "@/components/main/stat-card";
import { Camera, Users, AlertTriangle, Activity } from "lucide-react";
import EventsTable from "@/components/main/events-table";
import { useCameras } from "@/hooks/use-camera-queries";

export default function DashboardPage() {
  // Fetch cameras data
  const { data: cameras, isLoading } = useCameras();

  // Calculate stats from real data
  const stats = {
    totalCameras: cameras?.length || 0,
    activeCameras: cameras?.filter(c => c.is_streaming).length || 0,
    totalDetections: 0, // TODO: Replace with real API when ready
    totalViolations: 0, // TODO: Replace with real API when ready
  };

  return (
    <div className="p-4 w-full min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        <StatsCard 
          title="Total Cameras" 
          icon={Camera} 
          value={stats.totalCameras.toString()}
          isLoading={isLoading}
        />
        <StatsCard 
          title="Active Cameras" 
          icon={Activity} 
          value={stats.activeCameras.toString()}
          isLoading={isLoading}
          trend={{ value: 100, isPositive: true }}
        />
        <StatsCard 
          title="Today's Detections" 
          icon={Users} 
          value={stats.totalDetections.toString()}
          isLoading={isLoading}
        />
        <StatsCard 
          title="Today's Violations" 
          icon={AlertTriangle} 
          value={stats.totalViolations.toString()}
          isLoading={isLoading}
        />
      </div>

      {/* Events Table */}
      <EventsTable />
    </div>
  );
}
