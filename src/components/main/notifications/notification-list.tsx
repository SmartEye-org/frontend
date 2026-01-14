"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./notification-item";

interface Notification {
  id: number;
  alertLevel: "High" | "Medium" | "Low";
  camera: string;
  type: string;
  time: string;
  status: "New" | "Viewed";
}

interface NotificationListProps {
  notifications: Notification[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
      <div className="px-6 py-4 space-y-0">
        {notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            Không có thông báo nào
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              alertLevel={notif.alertLevel}
              camera={notif.camera}
              type={notif.type}
              time={notif.time}
              initialStatus={notif.status}
              onView={() => console.log("Xem ID:", notif.id)}
            />
          ))
        )}
      </div>
  );
}