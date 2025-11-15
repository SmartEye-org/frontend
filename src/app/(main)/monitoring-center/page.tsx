'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CameraTable } from '@/components/camera/camera-table';
import { AddCameraDialog } from '@/components/camera/add-camera-dialog';
import { useCameras } from '@/hooks/use-camera-queries';
import { Skeleton } from '@/components/ui/skeleton';

export default function MonitoringCenterPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: cameras, isLoading } = useCameras();

  // Filter cameras by search query
  const filteredCameras = cameras?.filter((camera) =>
    camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camera.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camera.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col h-screen">
      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cameras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#064E3B] hover:bg-[#064E3B]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Camera
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border">
            <div className="text-sm text-gray-500">Total Cameras</div>
            <div className="text-2xl font-bold">{cameras?.length || 0}</div>
          </div>
          <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border">
            <div className="text-sm text-gray-500">Online</div>
            <div className="text-2xl font-bold text-green-600">
              {cameras?.filter(c => c.status === 'online').length || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border">
            <div className="text-sm text-gray-500">Streaming</div>
            <div className="text-2xl font-bold text-blue-600">
              {cameras?.filter(c => c.is_streaming).length || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border">
            <div className="text-sm text-gray-500">Offline</div>
            <div className="text-2xl font-bold text-gray-400">
              {cameras?.filter(c => c.status === 'offline').length || 0}
            </div>
          </div>
        </div>

        {/* Camera Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <CameraTable cameras={filteredCameras} />
        )}
      </div>

      {/* Add Camera Dialog */}
      <AddCameraDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
