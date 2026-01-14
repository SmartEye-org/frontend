"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, MessageSquare, Clock, Eye, Check } from "lucide-react";

interface NotificationItemProps {
  alertLevel: "High" | "Medium" | "Low";
  camera: string;
  type: string;
  time: string;
  initialStatus: "New" | "Viewed";
  onView?: () => void;
}

const getAlertColor = (level: string) => {
  switch (level) {
    case "High": return "bg-red-500";
    case "Medium": return "bg-yellow-500";
    case "Low": return "bg-blue-500";
    default: return "bg-gray-500";
  }
};

export function NotificationItem({
  alertLevel,
  camera,
  type,
  time,
  initialStatus,
  onView,
}: NotificationItemProps) {
  const [status, setStatus] = useState<"New" | "Viewed">(initialStatus);

  const handleView = () => {
    if (status === "New") {
      setStatus("Viewed");
    }
    onView?.();
  };

  return (
    <div className="border-b border-gray-200 last:border-0 pb-6 pt-4 hover:bg-gray-50 transition-colors rounded-lg -mx-2 px-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <div className="mt-1.5">
            <div className={`w-3 h-3 rounded-full ${getAlertColor(alertLevel)} shadow-sm`} />
          </div>

          <div className="space-y-2.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Alert Level</span>
              <Badge
                variant={
                  alertLevel === "High"
                    ? "destructive"
                    : alertLevel === "Medium"
                      ? "default"
                      : "secondary"
                }
              >
                {alertLevel}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Camera className="w-4 h-4" />
              <span>{camera}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span>{type}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>

            <div className="text-xs">
              <span className="text-gray-500">Status</span>{" "}
              <span className={status === "New" ? "text-blue-600 font-medium" : "text-gray-400"}>
                • {status}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
          className={`${
            status === "Viewed"
              ? "text-gray-500 hover:bg-gray-100 cursor-default"
              : "text-green-600 hover:text-green-700 hover:bg-green-50"
          }`}
          disabled={status === "Viewed"}
        >
          {status === "Viewed" ? (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              Viewed
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1.5" />
              View
            </>
          )}
        </Button>
      </div>
    </div>
  );
}