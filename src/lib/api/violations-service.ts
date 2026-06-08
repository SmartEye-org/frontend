import { BaseApiService } from './base-service';
import type { ApiResponse, Violation } from '@/types';

export interface ViolationsFilter {
  camera_id?: string;
  severity?: string;
  type?: string;
  resolved?: boolean;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface ViolationsListResponse {
  data: Violation[];
  total: number;
  page: number;
  pages: number;
}

export interface DashboardStats {
  total: number;
  unresolved: number;
  unacknowledged: number;
  by_severity: Record<string, number>;
  by_type: Record<string, number>;
  // Aliases for compatibility
  violations_by_severity?: Record<string, number>;
  violations_by_type?: Record<string, number>;
  total_violations?: number;
  violations_today?: number;
}

class ViolationsService extends BaseApiService {
  constructor() {
    super('/violations');
  }

  async getViolations(filter?: ViolationsFilter): Promise<ViolationsListResponse> {
    const res = await this.get<ApiResponse<ViolationsListResponse>>('', filter as Record<string, unknown>);
    return res.data;
  }

  async getViolation(id: string): Promise<Violation> {
    const res = await this.get<ApiResponse<Violation>>(`/${id}`);
    return res.data;
  }

  async acknowledgeViolation(id: string, notes?: string): Promise<Violation> {
    const res = await this.patch<ApiResponse<Violation>>(`/${id}/acknowledge`, { notes });
    return res.data;
  }

  async resolveViolation(id: string): Promise<Violation> {
    const res = await this.patch<ApiResponse<Violation>>(`/${id}/resolve`, {});
    return res.data;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await this.get<ApiResponse<DashboardStats>>('/stats');
    return res.data;
  }
}

export const violationsService = new ViolationsService();
