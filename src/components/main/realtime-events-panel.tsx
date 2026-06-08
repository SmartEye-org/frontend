'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { RealtimeEvent } from '@/hooks/use-socket';
import type { Violation } from '@/types';
import {
  AlertTriangle,
  Activity,
  Camera,
  Clock,
  Wifi,
  WifiOff,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SEVERITY_CONFIG = {
  low: { label: 'Thấp', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  medium: { label: 'TB', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  high: { label: 'Cao', cls: 'bg-orange-100 text-orange-700 border-orange-200' },
  critical: { label: 'Nguy hiểm', cls: 'bg-red-100 text-red-700 border-red-200' },
};

const ACTION_ICONS: Record<string, string> = {
  walking: '🚶',
  running: '🏃',
  standing: '🧍',
  sitting: '🪑',
  lying: '🛌',
  unknown: '❓',
};

function EventRow({ event }: { event: RealtimeEvent }) {
  const isViolation = event.type === 'violation';
  const vio = isViolation ? (event.data as Violation) : null;
  const sev = vio ? SEVERITY_CONFIG[vio.severity as keyof typeof SEVERITY_CONFIG] : null;
  const timeStr = new Date(event.timestamp).toLocaleTimeString('vi-VN');

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-3 py-2.5 border-b border-border/50 hover:bg-muted/30 transition-colors text-sm',
        isViolation && 'bg-red-50/40 dark:bg-red-950/20',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
          isViolation
            ? 'bg-red-100 dark:bg-red-900/40'
            : 'bg-blue-100 dark:bg-blue-900/40',
        )}
      >
        {isViolation ? (
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
        ) : (
          <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {isViolation && vio ? (
            <>
              <span className="font-medium text-red-700 dark:text-red-400 truncate">
                {vio.type.replace(/_/g, ' ').toUpperCase()}
              </span>
              {sev && (
                <Badge variant="outline" className={cn('text-[10px] py-0 h-4', sev.cls)}>
                  {sev.label}
                </Badge>
              )}
            </>
          ) : (
            <span className="font-medium text-foreground">Phát hiện người</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
          <Camera className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{event.camera_id}</span>
          <Clock className="w-3 h-3 flex-shrink-0 ml-1" />
          <span>{timeStr}</span>
          {!isViolation && (event.data as { action?: string }).action && (
            <span className="ml-1">
              {ACTION_ICONS[(event.data as { action?: string }).action || 'unknown']}{' '}
              {(event.data as { action?: string }).action}
            </span>
          )}
          {isViolation && vio?.location && (
            <span className="truncate ml-1">📍 {vio.location}</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface RealtimeEventsPanelProps {
  events: RealtimeEvent[];
  isConnected: boolean;
  onClear: () => void;
  className?: string;
  defaultCollapsed?: boolean;
}

export function RealtimeEventsPanel({
  events,
  isConnected,
  onClear,
  className,
  defaultCollapsed = false,
}: RealtimeEventsPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [filter, setFilter] = useState<'all' | 'violation' | 'detection'>('all');

  const filtered = events.filter(
    (e) => filter === 'all' || e.type === filter,
  );
  const violationCount = events.filter((e) => e.type === 'violation').length;

  return (
    <div
      className={cn(
        'border-t bg-background flex flex-col',
        collapsed ? 'h-10' : 'h-64',
        'transition-all duration-200',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1.5 hover:opacity-80"
          >
            {collapsed ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">Sự kiện thời gian thực</span>
          </button>

          {/* Connection indicator */}
          <div className="flex items-center gap-1 text-xs">
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3 text-green-500" />
                <span className="text-green-600 dark:text-green-400">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-red-500" />
                <span className="text-red-500">Offline</span>
              </>
            )}
          </div>

          {/* Violation badge */}
          {violationCount > 0 && (
            <Badge variant="destructive" className="text-[10px] h-4 px-1.5">
              {violationCount} vi phạm
            </Badge>
          )}
        </div>

        {!collapsed && (
          <div className="flex items-center gap-1">
            {/* Filter tabs */}
            {(['all', 'violation', 'detection'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'text-xs px-2 py-0.5 rounded transition-colors',
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted',
                )}
              >
                {f === 'all' ? 'Tất cả' : f === 'violation' ? 'Vi phạm' : 'Phát hiện'}
              </button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 ml-1"
              onClick={onClear}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Events list */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Activity className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">
                {isConnected
                  ? 'Đang chờ sự kiện...'
                  : 'Không có kết nối. Kiểm tra backend.'}
              </p>
            </div>
          ) : (
            filtered.map((event) => <EventRow key={event.id} event={event} />)
          )}
        </div>
      )}
    </div>
  );
}
