import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  icon: LucideIcon;
  value: string;
  isLoading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatsCard({ 
  title, 
  icon: Icon, 
  value, 
  isLoading = false,
  trend,
  description 
}: StatsCardProps) {
  return (
    <Card className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          
          {isLoading ? (
            <Skeleton className="h-8 w-20 mb-2" />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          )}

          {trend && !isLoading && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}

          {description && !isLoading && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>

        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          "bg-linear-to-br from-[#064E3B] to-[#10B981]"
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}
