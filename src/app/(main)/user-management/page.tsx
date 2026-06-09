'use client';

import { useState } from 'react';
import { useResidents, useCreateResident, useDeleteResident } from '@/hooks/use-residents';
import { cn } from '@/lib/utils';
import type { Resident } from '@/types';
import {
  Users, UserPlus, Trash2, Search, CheckCircle2,
  XCircle, RefreshCw, Camera, Phone, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Resident Card ──────────────────────────────────────────────────────────

function ResidentCard({
  resident,
  onDelete,
}: {
  resident: Resident;
  onDelete: (id: string) => void;
}) {
  const hasFace = resident.face_encoding && resident.face_encoding.length > 0;

  return (
    <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 select-none">
        {resident.name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate">{resident.name}</span>
          <Badge
            variant="outline"
            className={cn(
              'text-[10px]',
              resident.status === 'active'
                ? 'text-green-600 border-green-300'
                : 'text-gray-400 border-gray-300',
            )}
          >
            {resident.status === 'active' ? '● Hoạt động' : '○ Không hoạt động'}
          </Badge>
        </div>

        <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>🏠 {resident.apartment}</span>
          {resident.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> {resident.phone}
            </span>
          )}
          {resident.email && (
            <span className="flex items-center gap-1 truncate">
              <Mail className="w-3 h-3" />
              <span className="truncate max-w-[160px]">{resident.email}</span>
            </span>
          )}
        </div>

        {/* Face enrollment status */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
          {hasFace ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Khuôn mặt đã đăng ký</span>
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3 text-yellow-500" />
              <span className="text-yellow-600 dark:text-yellow-400">Chưa đăng ký khuôn mặt</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {!hasFace && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            title="Đăng ký khuôn mặt"
          >
            <Camera className="w-3 h-3" />
            <span className="hidden sm:inline">Đăng ký</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(resident.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}

// ─── Create Modal ──────────────────────────────────────────────────────────────

function CreateResidentForm({
  onClose,
  onSubmit,
  isPending,
}: {
  onClose: () => void;
  onSubmit: (data: { name: string; apartment: string; phone: string; email: string }) => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState({ name: '', apartment: '', phone: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-500" />
            Thêm cư dân mới
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Họ và tên *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Số căn hộ *
            </label>
            <input
              required
              value={form.apartment}
              onChange={(e) => setForm({ ...form, apartment: e.target.value })}
              placeholder="A101"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Điện thoại
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0901234567"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isPending}
            >
              {isPending ? 'Đang lưu...' : 'Thêm cư dân'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ResidentsPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, refetch } = useResidents();
  const { mutate: createResident, isPending: isCreating } = useCreateResident();
  const { mutate: deleteResident } = useDeleteResident();

  const residents = data?.data ?? [];
  const filtered = residents.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.apartment.toLowerCase().includes(search.toLowerCase()),
  );

  const enrolledCount = residents.filter(
    (r) => r.face_encoding && r.face_encoding.length > 0,
  ).length;

  const handleCreate = (form: { name: string; apartment: string; phone: string; email: string }) => {
    createResident(
      { ...form, building_id: 'default' },
      {
        onSuccess: () => {
          setShowCreate(false);
          void refetch();
        },
      },
    );
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Quản lý cư dân
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {residents.length} cư dân · {enrolledCount} đã đăng ký khuôn mặt
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Làm mới
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setShowCreate(true)}
          >
            <UserPlus className="w-4 h-4" />
            Thêm cư dân
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tổng cư dân', value: residents.length, color: 'text-indigo-600' },
          { label: 'Đã đăng ký khuôn mặt', value: enrolledCount, color: 'text-green-600' },
          {
            label: 'Chưa đăng ký',
            value: residents.length - enrolledCount,
            color: 'text-yellow-600',
          },
        ].map((s) => (
          <Card key={s.label} className="p-3 text-center">
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc số phòng..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Users className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-base font-medium">
            {search ? 'Không tìm thấy cư dân nào' : 'Chưa có cư dân nào'}
          </p>
          {!search && (
            <Button
              className="mt-4 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setShowCreate(true)}
            >
              <UserPlus className="w-4 h-4" />
              Thêm cư dân đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <ResidentCard
              key={r.id}
              resident={r}
              onDelete={(id) => deleteResident(id)}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateResidentForm
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          isPending={isCreating}
        />
      )}
    </div>
  );
}