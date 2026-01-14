'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import axiosClient from '@/lib/api/axios-client';
import type { AxiosError } from 'axios';

const cameraSchema = z.object({
  id: z.string().min(1, 'Camera ID is required'),
  name: z.string().min(1, 'Camera name is required'),
  location: z.string().min(1, 'Location is required'),
  zone_type: z.enum(['entrance', 'lobby', 'elevator', 'floor', 'restricted']).optional(),
  stream_url: z.string().optional(),
  stream_type: z.enum(['rtsp', 'http', 'file', 'webcam']),
  building_id: z.string().uuid('Invalid building ID'),
});

type CameraFormValues = z.infer<typeof cameraSchema>;

interface AddCameraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCameraDialog({ open, onOpenChange }: AddCameraDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CameraFormValues>({
    resolver: zodResolver(cameraSchema),
    defaultValues: {
      id: '',
      name: '',
      location: '',
      stream_type: 'file',
      stream_url: '',
      building_id: '', // You should get this from auth context
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CameraFormValues) => {
      const response = await axiosClient.post('/cameras', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      toast.success('Camera added successfully');
      form.reset();
      onOpenChange(false);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to add camera');
    },
  });

  const onSubmit = async (values: CameraFormValues) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Camera</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Camera ID */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camera ID</FormLabel>
                    <FormControl>
                      <Input placeholder="camera-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Camera Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camera Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Entrance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Building A - Floor 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Zone Type */}
              <FormField
                control={form.control}
                name="zone_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select zone type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entrance">Entrance</SelectItem>
                        <SelectItem value="lobby">Lobby</SelectItem>
                        <SelectItem value="elevator">Elevator</SelectItem>
                        <SelectItem value="floor">Floor</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stream Type */}
              <FormField
                control={form.control}
                name="stream_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="file">File</SelectItem>
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="rtsp">RTSP</SelectItem>
                        <SelectItem value="webcam">Webcam</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stream URL */}
            <FormField
              control={form.control}
              name="stream_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/path/to/video.mp4 or http://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Building ID (Hidden - should come from context) */}
            <FormField
              control={form.control}
              name="building_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Building UUID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#064E3B] hover:bg-[#064E3B]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Camera'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
