import { BaseApiService } from './base-service';
import type { Camera, StreamStatus, ApiResponse } from '@/types';

export interface StartStreamRequest {
  fps?: number;
  buffer_size?: number;
}

class CameraService extends BaseApiService {
  constructor() {
    super('/cameras');
  }

  /**
   * Get all cameras
   */
  async getCameras(): Promise<Camera[]> {
    const response = await this.get<ApiResponse<Camera[]>>('');
    console.log('CameraService.getCameras response:', response);
    return response.data || [];
  }

  /**
   * Get camera by ID
   */
  async getCamera(id: string): Promise<Camera> {
    const response = await this.get<ApiResponse<Camera>>(`/${id}`);
    if (!response.data) {
      throw new Error('Camera not found');
    }
    return response.data;
  }

  /**
   * Start camera streaming
   */
  async startStream(
    cameraId: string,
    config?: StartStreamRequest
  ): Promise<StreamStatus> {
    const response = await this.post<ApiResponse<StreamStatus>>(
      `/${cameraId}/start-stream`,
      config || {}
    );
    if (!response.data) {
      throw new Error('Failed to start stream');
    }
    return response.data;
  }

  /**
   * Stop camera streaming
   */
  async stopStream(cameraId: string): Promise<StreamStatus> {
    const response = await this.post<ApiResponse<StreamStatus>>(
      `/${cameraId}/stop-stream`
    );
    if (!response.data) {
      throw new Error('Failed to stop stream');
    }
    return response.data;
  }

  /**
   * Get camera stream status
   */
  async getStreamStatus(cameraId: string): Promise<StreamStatus> {
    const response = await this.get<ApiResponse<StreamStatus>>(
      `/${cameraId}/stream-status`
    );
    if (!response.data) {
      throw new Error('Failed to get stream status');
    }
    return response.data;
  }

  /**
   * Get all active streams
   */
  async getActiveStreams(): Promise<{
    total: number;
    streams: StreamStatus[];
  }> {
    const response = await this.get<
      ApiResponse<{ total: number; streams: StreamStatus[] }>
    >('/active-streams/list');
    
    return response.data || { total: 0, streams: [] };
  }
}

export const cameraService = new CameraService();
