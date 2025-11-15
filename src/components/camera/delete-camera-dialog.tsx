'use client';

import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from '../ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosClient from '@/lib/api/axios-client';
import { Camera } from '@/types';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

interface DeleteCameraDialogProps {
  camera: Camera;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCameraDialog({ camera, open, onOpenChange }: DeleteCameraDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.delete(`/cameras/${camera.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      toast.success('Camera deleted successfully');
      onOpenChange(false);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete camera');
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Camera</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{camera.name}</strong> ({camera.id})?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
