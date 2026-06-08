'use client';

import { useState } from 'react';
import { useViolations, useAcknowledgeViolation, useResolveViolation } from '@/hooks/use-violations';
import { useSocket } from '@/hooks/use-socket';
import { cn } from '@/lib/utils';
import type { Violation } from '@/types';
import {
  AlertTriangle, CheckCircle2, Clock, Filter, RefreshCw,
  Eye, Wifi, WifiOff, XCircle, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SEVERITY_CONFIG = {
  low: { label: 'Thấp', cls: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300', dot: 'bg-blue-500' },
  medium: { label: 'Trung bình', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300', dot: 'bg-yellow-500' },
  high: { label: 'Cao', cls: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300', dot: 'bg-orange-500' },
  critical: { label: 'Nguy hiểm', cls: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300', dot: 'bg-red-500' },
};

const TYPE_LABELS: Record<string, string> = {
  lying: '🛌 Nằm xuống',
  running: '🏃 Chạy',
  loitering: '⏳ Lảng vảng',
  unauthorized_access: '🚫 Truy cập trái phép',
  suspicious_behavior: '👀 Hành vi đáng ngờ',
  restricted_area: '⛔ Khu vực cấm',
};

function SeverityBadge({ severity }: { severity: string }) {
  const cfg = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.medium;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border', cfg.cls)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function ViolationCard({
  violation,
  onAcknowledge,
  onResolve,
}: {
  violation: Violation;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const timeStr = new Date(violation.timestamp).toLocaleString('vi-VN');
  const typeLabel = TYPE_LABELS[violation.type] ?? violation.type;

  return (
    <Card className={cn(
      'p-4 border-l-4 transition-all',
      violation.resolved
        ? 'opacity-60 border-l-gray-300'
        : violation.severity === 'critical'
        ? 'border-l-red-500'
        : violation.severity === 'high'
        ? 'border-l-orange-500'
        : violation.severity === 'medium'
        ? 'border-l-yellow-500'
        : 'border-l-blue-500',
    )}>
      <div className="flex items-start justify-between gap-3">
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-sm">{typeLabel}</span>
            <SeverityBadge severity={violation.severity} />
            {violation.resolved && (
              <Badge variant="outline" className="text-[10px] text-green-600 border-green-300">
                ✓ Đã giải quyết
              </Badge>
            )}
            {violation.acknowledged && !violation.resolved && (
              <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-300">
                👁 Đã xem
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span className="truncate">Camera: {violation.camera_id}</span>
            </div>
            {violation.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span className="truncate">{violation.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1 col-span-2">
              <Clock className="w-3 h-3" />
              <span>{timeStr}</span>
            </div>
            {violation.description && (
              <div className="col-span-2 mt-1 text-xs text-muted-foreground italic">
                {violation.description}
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        {!violation.resolved && (
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            {!violation.acknowledged && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => onAcknowledge(violation.id)}
              >
                <Eye className="w-3 h-3" />
                Xem
              </Button>
            )}
            <Button
              size="sm"
              className="h-7 text-xs gap-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onResolve(violation.id)}
            >
              <CheckCircle2 className="w-3 h-3" />
              Giải quyết
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Summary chips ─────────────────────────────────────────────────────────────

function SummaryChip({
  label,
  value,
  icon: Icon,
  variant = 'default',
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  variant?: 'default' | 'danger' | 'success' | 'warning';
}) {
  const variantCls = {
    default: 'bg-muted text-foreground',
    danger: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300',
  };
  return (
    <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg', variantCls[variant])}>
      <Icon className="w-4 h-4 opacity-70" />
      <div>
        <div className="text-lg font-bold leading-none">{value}</div>
        <div className="text-[11px] opacity-70 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const SEVERITY_FILTERS = ['Tất cả', 'critical', 'high', 'medium', 'low'] as const;

export default function ViolationsPage() {
  const [severityFilter, setSeverityFilter] = useState<string>('Tất cả');
  const [showResolved, setShowResolved] = useState(false);

  const filter = {
    severity: severityFilter !== 'Tất cả' ? severityFilter : undefined,
    resolved: showResolved ? undefined : false,
    limit: 100,
  };

  const { data, isLoading, refetch } = useViolations(filter);
  const { isConnected, violations: liveViolations } = useSocket({ maxEvents: 20 });
  const { mutate: acknowledge } = useAcknowledgeViolation();
  const { mutate: resolve } = useResolveViolation();

  const violations = data?.data ?? [];
  const total = data?.total ?? 0;
  const unresolved = violations.filter((v) => !v.resolved).length;
  const critical = violations.filter((v) => v.severity === 'critical' && !v.resolved).length;

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Quản lý vi phạm
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Theo dõi và xử lý các vi phạm được phát hiện tự động
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            {isConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600">Live</span>
                {liveViolations.length > 0 && (
                  <Badge variant="destructive" className="text-[10px] h-4 px-1">
                    +{liveViolations.length}
                  </Badge>
                )}
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400">Offline</span>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <SummaryChip label="Tổng vi phạm" value={total} icon={AlertTriangle} />
        <SummaryChip label="Chưa xử lý" value={unresolved} icon={XCircle} variant="warning" />
        <SummaryChip label="Nghiêm trọng" value={critical} icon={AlertTriangle} variant="danger" />
        <SummaryChip
          label="Đã xử lý"
          value={total - unresolved}
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          <Filter className="w-3.5 h-3.5 ml-1 text-muted-foreground" />
          {SEVERITY_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setSeverityFilter(f)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-md transition-all',
                severityFilter === f
                  ? 'bg-background shadow text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f === 'Tất cả'
                ? 'Tất cả'
                : SEVERITY_CONFIG[f as keyof typeof SEVERITY_CONFIG]?.label ?? f}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="rounded"
          />
          <span className="text-muted-foreground">Hiển thị đã xử lý</span>
        </label>
      </div>

      {/* Violations list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : violations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <CheckCircle2 className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-base font-medium">Không có vi phạm</p>
          <p className="text-sm mt-1 opacity-60">
            {showResolved ? 'Không tìm thấy vi phạm nào' : 'Tất cả vi phạm đã được xử lý 🎉'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {violations.map((v) => (
            <ViolationCard
              key={v.id}
              violation={v}
              onAcknowledge={(id) => acknowledge({ id })}
              onResolve={(id) => resolve({ id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}