"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export function StatsCard({ title, value, icon: Icon}: StatsCardProps) {
  return (
    <Card className="p-4 rounded-2xl shadow-sm border border-gray-100 bg-white w-full max-w-sm sm:max-w-lg">
      <CardContent className="p-0 flex items-center justify-between">
        {/* Left side */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-gray-500">{title}</p>
          <div className="flex items-end gap-2">
            <p className="text-xl font-semibold">{value}</p>
          </div>
        </div>

        {/* Right side icon */}
        <div className="flex items-center justify-center bg-teal-300 text-white rounded-xl p-3 sm:p-4 shrink-0">
          <Icon className="w-5 h-5 sm:w-4 sm:h-4" />
        </div>
      </CardContent>
    </Card>
  );
}
