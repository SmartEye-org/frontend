'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cameraService } from '@/lib/api/camera-service';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

export function useCameras() {
  return useQuery({
    queryKey: ['cameras'],
    queryFn: () => cameraService.getCameras(),
  });
}

export function useCamera(id: string) {
  return useQuery({
    queryKey: ['cameras', id],
    queryFn: () => cameraService.getCamera(id),
    enabled: !!id,
  });
}

export function useStartStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cameraId,
      config,
    }: {
      cameraId: string;
      config?: { fps?: number; buffer_size?: number };
    }) => cameraService.startStream(cameraId, config),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      queryClient.invalidateQueries({ queryKey: ['cameras', data.camera_id] });
      toast.success('Stream started successfully');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to start stream');
    },
  });
}

export function useStopStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cameraId: string) => cameraService.stopStream(cameraId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      queryClient.invalidateQueries({ queryKey: ['cameras', data.camera_id] });
      toast.success('Stream stopped successfully');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to stop stream');
    },
  });
}

export function useActiveStreams() {
  return useQuery({
    queryKey: ['active-streams'],
    queryFn: () => cameraService.getActiveStreams(),
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}
