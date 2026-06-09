import { BaseApiService } from './base-service';
import type { ApiResponse, Resident } from '@/types';

export interface CreateResidentDto {
  name: string;
  apartment: string;
  phone?: string;
  email?: string;
  building_id: string;
}

export interface FaceEnrollmentDto {
  face_encoding: number[];
}

export interface ResidentListResponse {
  data: Resident[];
  total: number;
  page: number;
  pages: number;
}

class ResidentsService extends BaseApiService {
  constructor() {
    super('/residents');
  }

  async getResidents(buildingId?: string, limit = 50, offset = 0): Promise<ResidentListResponse> {
    const res = await this.get<ApiResponse<ResidentListResponse>>('', {
      building_id: buildingId,
      limit,
      offset,
    } as Record<string, unknown>);
    return res.data;
  }

  async getResident(id: string): Promise<Resident> {
    const res = await this.get<ApiResponse<Resident>>(`/${id}`);
    return res.data;
  }

  async createResident(data: CreateResidentDto): Promise<Resident> {
    const res = await this.post<ApiResponse<Resident>>('', data);
    return res.data;
  }

  async updateResident(id: string, data: Partial<CreateResidentDto>): Promise<Resident> {
    const res = await this.put<ApiResponse<Resident>>(`/${id}`, data);
    return res.data;
  }

  async deleteResident(id: string): Promise<void> {
    await this.delete<ApiResponse<void>>(`/${id}`);
  }

  async enrollFace(id: string, faceEncoding: number[]): Promise<Resident> {
    const res = await this.post<ApiResponse<Resident>>(`/${id}/face-enrollment`, {
      face_encoding: faceEncoding,
    });
    return res.data;
  }
}

export const residentsService = new ResidentsService();
