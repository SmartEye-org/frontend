'use client';

import { Camera, Users, AlertTriangle, Activity, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/main/stat-card';
import EventsTable from '@/components/main/events-table';
import { useCameras } from '@/hooks/use-camera-queries';
import { useViolations, useViolationStats } from '@/hooks/use-violations';
import { useResidents } from '@/hooks/use-residents';
import { useSocket } from '@/hooks/use-socket';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
};

const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Nguy hiểm',
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const TYPE_LABELS: Record<string, string> = {
  lying: '🛌 Nằm',
  running: '🏃 Chạy',
  loitering: '⏳ Lảng vảng',
  unauthorized_access: '🚫 Trái phép',
  suspicious_behavior: '👀 Nghi ngờ',
  restricted_area: '⛔ Khu vực cấm',
};

export default function DashboardPage() {
  const { data: cameras, isLoading: camsLoading } = useCameras();
  const { data: violations, isLoading: viosLoading } = useViolations({ limit: 5, resolved: false });
  const { data: stats } = useViolationStats();
  const { data: residents } = useResidents();
  const { isConnected, events } = useSocket({ maxEvents: 10 });

  const activeCams = cameras?.filter((c) => c.is_streaming).length ?? 0;
  const totalCams = cameras?.length ?? 0;
  const totalResidents = residents?.total ?? 0;
  const unresolvedViolations = violations?.total ?? 0;
  const criticalCount = stats?.violations_by_severity?.critical ?? 0;

  return (
    <div className="space-y-5 pb-8">
      {/* Live status bar */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-full border',
            isConnected
              ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:text-green-400'
              : 'bg-gray-50 border-gray-200 text-gray-500',
          )}
        >
          {isConnected ? (
            <>
              <Wifi className="w-3 h-3" />
              <span>Kết nối thời gian thực</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-0.5" />
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Chưa kết nối</span>
            </>
          )}
        </div>
        {events.length > 0 && (
          <span className="text-muted-foreground">
            {events.length} sự kiện mới nhất
          </span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Camera hoạt động"
          icon={Camera}
          value={`${activeCams}/${totalCams}`}
          isLoading={camsLoading}
          trend={totalCams > 0 ? { value: Math.round((activeCams / totalCams) * 100), isPositive: true } : undefined}
        />
        <StatsCard
          title="Cư dân đã đăng ký"
          icon={Users}
          value={totalResidents.toString()}
          isLoading={false}
        />
        <StatsCard
          title="Vi phạm chưa xử lý"
          icon={AlertTriangle}
          value={unresolvedViolations.toString()}
          isLoading={viosLoading}
          trend={criticalCount > 0 ? { value: criticalCount, isPositive: false } : undefined}
        />
        <StatsCard
          title="Sự kiện hôm nay"
          icon={Activity}
          value={events.length.toString()}
          isLoading={false}
          trend={events.length > 0 ? { value: events.length, isPositive: true } : undefined}
        />
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Violations breakdown — 1 col */}
        <div className="space-y-3">
          {/* By severity */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Vi phạm theo mức độ
            </h3>
            {stats ? (
              <div className="space-y-2">
                {Object.entries(stats.by_severity ?? {}).map(([sev, count]) => {
                  const total = Object.values(stats.by_severity ?? {}).reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={sev}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{SEVERITY_LABELS[sev] ?? sev}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', SEVERITY_COLORS[sev] ?? 'bg-gray-400')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {!stats.by_severity && (
                  <p className="text-xs text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">Đang tải...</p>
            )}
          </Card>

          {/* By type */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Loại vi phạm</h3>
            <div className="space-y-1.5">
              {Object.entries(stats?.by_type ?? {}).slice(0, 5).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{TYPE_LABELS[type] ?? type}</span>
                  <Badge variant="secondary" className="text-[10px] h-4">
                    {count}
                  </Badge>
                </div>
              ))}
              {!stats?.by_type && (
                <p className="text-xs text-muted-foreground text-center py-3">Chưa có dữ liệu</p>
              )}
            </div>
          </Card>
        </div>

        {/* Recent unresolved violations — 2 cols */}
        <div className="lg:col-span-2">
          <Card className="p-4 h-full">
            <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Vi phạm gần đây chưa xử lý
              </span>
              {unresolvedViolations > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  {unresolvedViolations} chưa xử lý
                </Badge>
              )}
            </h3>
            {viosLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 rounded bg-muted animate-pulse" />
                ))}
              </div>
            ) : (violations?.data ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Activity className="w-10 h-10 opacity-20 mb-2" />
                <p className="text-sm">Không có vi phạm chưa xử lý 🎉</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(violations?.data ?? []).slice(0, 5).map((v) => (
                  <div
                    key={v.id}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg border text-sm',
                      v.severity === 'critical'
                        ? 'bg-red-50 border-red-200 dark:bg-red-950/20'
                        : 'bg-muted/30',
                    )}
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        SEVERITY_COLORS[v.severity] ?? 'bg-gray-400',
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate">
                        {TYPE_LABELS[v.type] ?? v.type}
                      </span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        📷 {v.camera_id}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground flex-shrink-0">
                      {new Date(v.timestamp).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Events Table */}
      <EventsTable />
    </div>
  );
}
