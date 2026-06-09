/**
 * API Services — Central export for all API services
 * Usage: import { violationsService, residentsService } from '@/lib/api'
 */

export { default as axiosClient } from './axios-client';
export { BaseApiService } from './base-service';
export { violationsService } from './violations-service';
export { residentsService } from './residents-service';
export { wsClient } from './websocket-client';

