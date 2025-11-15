export enum CameraStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
}

export enum StreamType {
  RTSP = 'rtsp',
  HTTP = 'http',
  FILE = 'file',
  WEBCAM = 'webcam',
}

export interface StreamConfig {
  fps?: number;
  resolution?: string;
  codec?: string;
  buffer_size?: number;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  zone_type?: string;
  stream_url?: string;
  stream_type: StreamType;
  is_streaming: boolean;
  stream_config?: StreamConfig;
  last_frame_at?: Date;
  frame_count: number;
  status: CameraStatus;
  building_id: string;
  created_at: Date;
  updated_at: Date;
}

export type CameraLayout = '1x1' | '2x2' | '3x3' | '4x4';

export interface StreamStatus {
  camera_id: string;
  camera_name: string;
  status: CameraStatus;
  is_streaming: boolean;
  stream_type: StreamType;
  last_frame_at: Date | null;
  frame_count: number;
  stream_config: StreamConfig | null;
  stream_instance?: {
    started_at: Date;
    frames_processed: number;
    is_active: boolean;
  };
}

export interface Detection {
  id: string;
  track_id: string;
  bbox: number[];
  confidence: number;
  person_type: string;
  person_name?: string;
  face_confidence?: number;
  timestamp: Date;
}

export interface Violation {
  id: string
  track_id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  camera_id: string
  location: string
  timestamp: string
  description: string
  snapshot_url?: string
  video_url?: string
  resolved: boolean
  acknowledged?: boolean
  person_type?: 'resident' | 'guest' | 'unknown'
  person_name?: string
}

export interface Statistics {
  total_detections: number
  unique_persons: number
  cameras_online: number
  cameras_total: number
  violations_today: number
  residents_count?: number
  guests_count?: number
  unknown_count?: number
  last_24h?: {
    detections: number
    violations: number
  }
}

export interface TrackingRoute {
  track_id: string
  person_type: 'resident' | 'guest' | 'unknown'
  person_name?: string
  route: Array<{
    camera_id: string
    camera_name: string
    timestamp: string
    action?: string
  }>
  start_time: string
  end_time?: string
  duration_seconds?: number
  violation_detected: boolean
}

export interface Resident {
  id: string
  name: string
  apartment: string
  phone?: string
  email?: string
  photo_url?: string
  face_encoding?: number[]
  status: 'active' | 'inactive'
  registered_at: string
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface FrameUpdate {
  camera_id: string;
  camera_name: string;
  frame_number: number;
  detections: Detection[];
  total_persons: number;
  timestamp: string;
}

