'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraStatus, Detection } from '@/types';
import { useCameraStream } from '@/hooks/use-camera-stream';
import { MonitorOff, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PERSON_TYPES } from '@/lib/constants';

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
  const [imageDimensions, setImageDimensions] = useState({ width: 1920, height: 1080 });
  const [fps, setFps] = useState<number>(0);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const frameTimestamps = useRef<number[]>([]);
  const lastUpdateTime = useRef<number>(0);

  const { isConnected, latestFrame } = useCameraStream({
    cameraId: camera.id,
    enabled: camera.is_streaming,
    onFrame: (data) => {
      setDetections(data.detections);
      
      // Calculate FPS
      const now = Date.now();
      
      // Initialize lastUpdateTime on first frame
      if (lastUpdateTime.current === 0) {
        lastUpdateTime.current = now;
      }
      
      frameTimestamps.current.push(now);
      
      // Keep only timestamps from the last second
      frameTimestamps.current = frameTimestamps.current.filter(
        (timestamp) => now - timestamp < 1000
      );
      
      // Update FPS every 500ms to avoid too frequent updates
      if (now - lastUpdateTime.current > 500) {
        setFps(frameTimestamps.current.length);
        lastUpdateTime.current = now;
      }
    },
  });

  // Reset FPS data when stream stops (only refs, no setState)
  useEffect(() => {
    if (!camera.is_streaming) {
      frameTimestamps.current = [];
      lastUpdateTime.current = 0;
    }
  }, [camera.is_streaming]);

  // Update image dimensions when frame loads
  useEffect(() => {
    if (imageRef.current && latestFrame?.frame_data) {
      const img = imageRef.current;
      const updateDimensions = () => {
        setImageDimensions({
          width: img.naturalWidth || 1920,
          height: img.naturalHeight || 1080,
        });
      };

      if (img.complete) {
        updateDimensions();
      } else {
        img.addEventListener('load', updateDimensions);
        return () => img.removeEventListener('load', updateDimensions);
      }
    }
  }, [latestFrame?.frame_data]);

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

  // FPS color based on performance
  const getFpsColor = (fps: number) => {
    if (fps >= 15) return 'bg-green-500';
    if (fps >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
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
            {/* ACTUAL VIDEO FRAME */}
            {latestFrame.frame_data && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imageRef}
                src={latestFrame.frame_data}
                alt={`Frame ${latestFrame.frame_number}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Bounding Boxes Overlay with dynamic viewBox */}
            {showBoundingBoxes && detections.length > 0 && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
                preserveAspectRatio="xMidYMid slice"
              >
                {detections.map((d, idx) => {
                  const [x1, y1, x2, y2] = d.bbox;
                  const width = x2 - x1;
                  const height = y2 - y1;

                  const type = PERSON_TYPES[d.person_type as keyof typeof PERSON_TYPES]
                    || PERSON_TYPES.unknown;

                  const color =
                    d.person_type === "resident" ? "#22c55e" :
                      d.person_type === "guest" ? "#eab308" : // yellow-500
                        "#ef4444"; // red-500

                  return (
                    <g key={idx}>
                      {/* Box */}
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
                        width={200}
                        height={25}
                        fill={color}
                        opacity={0.85}
                      />

                      {/* Text */}
                      <text
                        x={x1 + 6}
                        y={y1 - 7}
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="system-ui"
                      >
                        {type.label}
                        {showConfidence ? ` ${Math.round(d.confidence * 100)}%` : ""}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Top-left overlay: FPS Badge */}
            {camera.is_streaming && (
              <div className="absolute top-2 left-2">
                <Badge className={cn(getFpsColor(fps), "text-white font-mono")}>
                  {fps} FPS
                </Badge>
              </div>
            )}

            {/* Top-right overlay: Detection count badge */}
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
