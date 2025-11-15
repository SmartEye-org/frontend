'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraStatus, Detection } from '@/types';
import { useCameraStream } from '@/hooks/use-camera-stream';
import { MonitorOff, Wifi, WifiOff, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraViewProps {
  camera: Camera;
  showBoundingBoxes?: boolean;
  showConfidence?: boolean;
}

export function CameraView({
  camera,
  showBoundingBoxes = true,
  showConfidence = true,
}: CameraViewProps) {
  const [detections, setDetections] = useState<Detection[]>([]);
  
  const { isConnected, latestFrame } = useCameraStream({
    cameraId: camera.id,
    enabled: camera.is_streaming,
    onFrame: (data) => {
      setDetections(data.detections);
    },
  });

  const statusColor = {
    [CameraStatus.ONLINE]: 'bg-green-500',
    [CameraStatus.OFFLINE]: 'bg-gray-500',
    [CameraStatus.ERROR]: 'bg-red-500',
    [CameraStatus.MAINTENANCE]: 'bg-yellow-500',
  };

  const statusText = {
    [CameraStatus.ONLINE]: 'Online',
    [CameraStatus.OFFLINE]: 'Offline',
    [CameraStatus.ERROR]: 'Error',
    [CameraStatus.MAINTENANCE]: 'Maintenance',
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              statusColor[camera.status]
            )}
          />
          <span className="font-medium text-sm">{camera.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-gray-400" />
          )}
          
          <Badge variant="outline" className="text-xs">
            {statusText[camera.status]}
          </Badge>
        </div>
      </div>

      {/* Video/Frame Display */}
      <div className="relative aspect-video bg-black">
        {camera.is_streaming && latestFrame ? (
          <>
            {/* Placeholder for actual video frame */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                <div className="text-white text-sm">
                  Frame #{latestFrame.frame_number}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {camera.location}
                </div>
              </div>
            </div>

            {/* Bounding Boxes Overlay */}
            {showBoundingBoxes && detections.length > 0 && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1920 1080"
                preserveAspectRatio="none"
              >
                {detections.map((detection, idx) => {
                  const [x1, y1, x2, y2] = detection.bbox;
                  const width = x2 - x1;
                  const height = y2 - y1;

                  // Color based on person type
                  const color = 
                    detection.person_type === 'resident' ? '#22c55e' :
                    detection.person_type === 'guest' ? '#3b82f6' :
                    '#ef4444';

                  return (
                    <g key={idx}>
                      {/* Bounding box */}
                      <rect
                        x={x1}
                        y={y1}
                        width={width}
                        height={height}
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                      />
                      
                      {/* Label background */}
                      <rect
                        x={x1}
                        y={y1 - 25}
                        width={180}
                        height={25}
                        fill={color}
                        fillOpacity="0.8"
                      />
                      
                      {/* Label text */}
                      <text
                        x={x1 + 5}
                        y={y1 - 8}
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="system-ui"
                      >
                        {detection.person_name || detection.person_type}
                        {showConfidence &&
                          ` ${Math.round(detection.confidence * 100)}%`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Detection count badge */}
            {detections.length > 0 && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-500 text-white">
                  {detections.length} {detections.length === 1 ? 'Person' : 'Persons'}
                </Badge>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <MonitorOff className="w-12 h-12 mb-2" />
            <p className="text-sm">
              {camera.is_streaming ? 'Connecting...' : 'No signal'}
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {detections.length}
            </span>{' '}
            detected
          </span>
          
          <span className="text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {camera.frame_count}
            </span>{' '}
            frames
          </span>
        </div>

        {latestFrame && (
          <span className="text-gray-500 dark:text-gray-400">
            {new Date(latestFrame.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
    </Card>
  );
}
