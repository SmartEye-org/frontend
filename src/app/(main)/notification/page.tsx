import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationList } from "@/components/main/notifications/notification-list";

const notifications = [
  { id: 1, alertLevel: "High" as const, camera: "Camera 01 - Main Gate", type: "Motion Detected", time: "Just now", status: "New" as const },
  { id: 2, alertLevel: "Medium" as const, camera: "Camera 03 - Backyard", type: "Person Detected", time: "5 minutes ago", status: "New" as const },
  { id: 3, alertLevel: "Low" as const, camera: "Camera 05 - Warehouse", type: "Vehicle Entered", time: "1 hour ago", status: "Viewed" as const },
  { id: 4, alertLevel: "High" as const, camera: "Camera 02 - Office", type: "Intrusion Alert", time: "2 hours ago", status: "New" as const },
  { id: 5, alertLevel: "Medium" as const, camera: "Camera 07 - Hallway", type: "Loitering Detected", time: "3 hours ago", status: "New" as const },
  { id: 6, alertLevel: "Low" as const, camera: "Camera 04 - Parking", type: "Loud Sound Detected", time: "Yesterday", status: "Viewed" as const },
  { id: 7, alertLevel: "High" as const, camera: "Camera 08 - Server Room", type: "Door Opened", time: "Yesterday", status: "New" as const },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter(n => n.status === "New").length;

  return (
    <div className="flex flex-col h-full bg-background"> 
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shrink-0">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Bell className="w-7 h-7 text-primary" />
          {unreadCount > 0 && (
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              ({unreadCount} unread)
            </span>
          )}
        </h1>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </header>

      {/* Scroll area - chiếm toàn bộ phần còn lại */}
      <NotificationList notifications={notifications} />
    </div>
  );
}