'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Camera } from '@/types';
import { MoreVertical, Edit, Trash2, Play, Square, Eye } from 'lucide-react';
import { useStartStream, useStopStream } from '@/hooks/use-camera-queries';
import { useRouter } from 'next/navigation';
import { EditCameraDialog } from './edit-camera-dialog';
import { DeleteCameraDialog } from './delete-camera-dialog';

interface CameraTableProps {
  cameras: Camera[];
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function CameraTable({ cameras }: CameraTableProps) {
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [deletingCamera, setDeletingCamera] = useState<Camera | null>(null);
  const router = useRouter();
  
  const startStream = useStartStream();
  const stopStream = useStopStream();

  const handleStartStream = async (cameraId: string) => {
    await startStream.mutateAsync({ cameraId, config: { fps: 5 } });
  };

  const handleStopStream = async (cameraId: string) => {
    await stopStream.mutateAsync(cameraId);
  };

  const handleViewLive = (cameraId: string) => {
    router.push(`/live-monitoring?camera=${cameraId}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: BadgeVariant; className?: string }> = {
      online: { variant: 'default', className: 'bg-green-500' },
      offline: { variant: 'secondary' },
      error: { variant: 'destructive' },
      maintenance: { variant: 'default', className: 'bg-yellow-500' },
    };

    const config = variants[status] || variants.offline;
    return <Badge {...config}>{status}</Badge>;
  };

  const getStreamTypeBadge = (type: string) => {
    return <Badge variant="outline">{type.toUpperCase()}</Badge>;
  };

  if (cameras.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-950 rounded-lg border">
        <p className="text-gray-500">No cameras found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-950 rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Camera ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Streaming</TableHead>
              <TableHead>Frames</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cameras.map((camera) => (
              <TableRow key={camera.id}>
                <TableCell className="font-mono text-sm">
                  {camera.id}
                </TableCell>
                <TableCell className="font-medium">{camera.name}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {camera.location}
                </TableCell>
                <TableCell>{getStreamTypeBadge(camera.stream_type)}</TableCell>
                <TableCell>{getStatusBadge(camera.status)}</TableCell>
                <TableCell>
                  {camera.is_streaming ? (
                    <Badge className="bg-blue-500">Active</Badge>
                  ) : (
                    <Badge variant="outline">Idle</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {camera.frame_count.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Quick Actions */}
                    {camera.is_streaming ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStopStream(camera.id)}
                        disabled={stopStream.isPending}
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartStream(camera.id)}
                        disabled={startStream.isPending}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewLive(camera.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* More Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingCamera(camera)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingCamera(camera)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {editingCamera && (
        <EditCameraDialog
          camera={editingCamera}
          open={!!editingCamera}
          onOpenChange={(open) => !open && setEditingCamera(null)}
        />
      )}

      {/* Delete Dialog */}
      {deletingCamera && (
        <DeleteCameraDialog
          camera={deletingCamera}
          open={!!deletingCamera}
          onOpenChange={(open) => !open && setDeletingCamera(null)}
        />
      )}
    </>
  );
}
