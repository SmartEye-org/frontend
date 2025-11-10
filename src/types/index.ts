export interface Detection {
  person_id: number
  track_id?: string
  bbox: number[] // [x1, y1, x2, y2]
  confidence: number
  face_detected: boolean
  face_bbox?: number[]
  action?: 'walking' | 'standing' | 'sitting' | 'running' | 'lying' | 'unknown'
  person_type?: 'resident' | 'guest' | 'unknown'
  person_id_ref?: string // ID in residents table
  person_name?: string
  timestamp: string
}

export interface Camera {
  id: string
  name: string
  location: string
  zone_type?: 'entrance' | 'lobby' | 'elevator' | 'floor' | 'restricted'
  coordinates?: [number, number] // [longitude, latitude]
  rtsp_url?: string
  status: 'online' | 'offline' | 'error'
  fps?: number
  resolution?: string
  lastUpdate: string
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
  success: boolean
  data?: T
  error?: string
  message?: string
}
