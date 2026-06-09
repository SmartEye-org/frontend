import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { residentsService, type CreateResidentDto } from '@/lib/api/residents-service';

export const RESIDENTS_KEY = ['residents'] as const;

export function useResidents(buildingId?: string) {
  return useQuery({
    queryKey: [...RESIDENTS_KEY, buildingId],
    queryFn: () => residentsService.getResidents(buildingId),
    staleTime: 60_000,
  });
}

export function useResident(id: string) {
  return useQuery({
    queryKey: [...RESIDENTS_KEY, id],
    queryFn: () => residentsService.getResident(id),
    enabled: Boolean(id),
  });
}

export function useCreateResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateResidentDto) => residentsService.createResident(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESIDENTS_KEY });
    },
  });
}

export function useUpdateResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateResidentDto> }) =>
      residentsService.updateResident(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESIDENTS_KEY });
    },
  });
}

export function useDeleteResident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => residentsService.deleteResident(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESIDENTS_KEY });
    },
  });
}

export function useEnrollFace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, faceEncoding }: { id: string; faceEncoding: number[] }) =>
      residentsService.enrollFace(id, faceEncoding),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESIDENTS_KEY });
    },
  });
}
