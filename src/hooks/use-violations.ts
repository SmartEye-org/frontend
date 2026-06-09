import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { violationsService, type ViolationsFilter } from '@/lib/api/violations-service';

export const VIOLATIONS_KEY = ['violations'] as const;
export const VIOLATIONS_STATS_KEY = ['violations', 'stats'] as const;

export function useViolations(filter?: ViolationsFilter) {
  return useQuery({
    queryKey: [...VIOLATIONS_KEY, filter],
    queryFn: () => violationsService.getViolations(filter),
    staleTime: 30_000,
    refetchInterval: 60_000, // Auto-refresh every minute
  });
}

export function useViolationStats() {
  return useQuery({
    queryKey: VIOLATIONS_STATS_KEY,
    queryFn: () => violationsService.getDashboardStats(),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

export function useAcknowledgeViolation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      violationsService.acknowledgeViolation(id, notes),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: VIOLATIONS_KEY });
    },
  });
}

export function useResolveViolation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      violationsService.resolveViolation(id, notes),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: VIOLATIONS_KEY });
      void queryClient.invalidateQueries({ queryKey: VIOLATIONS_STATS_KEY });
    },
  });
}
