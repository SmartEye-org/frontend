'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { FrameUpdate, StreamStatus } from '@/types';

interface UseCameraStreamOptions {
  cameraId: string;
  enabled?: boolean;
  onFrame?: (data: FrameUpdate) => void;
  onStatusChange?: (data: StreamStatus) => void;
}

export function useCameraStream({
  cameraId,
  enabled = true,
  onFrame,
  onStatusChange,
}: UseCameraStreamOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [latestFrame, setLatestFrame] = useState<FrameUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!enabled || socketRef.current) return;

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';

      const socket = io(wsUrl, {
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        setIsConnected(true);
        setError(null);

        socket.emit('subscribe_camera', { camera_id: cameraId });
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('frame_update', (data: FrameUpdate) => {
        if (data.camera_id === cameraId) {
          setLatestFrame(data);
          onFrame?.(data);
        }
      });

      socket.on('frame', () => {});

      socket.on('stream_status', (data) => {
        if (data.camera_id === cameraId) {
          onStatusChange?.(data);
        }
      });

      socket.on('connect_error', (err) => {
        setError(err.message);
        setIsConnected(false);
      });

      socket.onAny(() => {});

      socketRef.current = socket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [cameraId, enabled, onFrame, onStatusChange]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('unsubscribe_camera', { camera_id: cameraId });
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, [cameraId]);

  useEffect(() => {
    queueMicrotask(() => {
      if (enabled) connect();
      else disconnect();
    });

    return () => disconnect();
  }, [enabled, connect, disconnect]);

  return {
    isConnected,
    latestFrame,
    error,
    reconnect: connect,
  };
}
