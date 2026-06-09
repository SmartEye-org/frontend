'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { wsClient } from '@/lib/api/websocket-client';
import type { Detection, Violation } from '@/types';

export interface RealtimeEvent {
  id: string;
  type: 'detection' | 'violation';
  camera_id: string;
  camera_name?: string;
  timestamp: string;
  data: Detection | Violation;
}

interface UseSocketOptions {
  maxEvents?: number;
  autoConnect?: boolean;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { maxEvents = 100, autoConnect = true } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const counterRef = useRef(0);

  const addEvent = useCallback((event: RealtimeEvent) => {
    setEvents((prev) => {
      const next = [event, ...prev];
      return next.slice(0, maxEvents);
    });
  }, [maxEvents]);

  useEffect(() => {
    if (!autoConnect) return;

    wsClient.connect();

    // Poll connection status
    const pollInterval = setInterval(() => {
      setIsConnected(wsClient.isConnected());
    }, 1000);

    // Detection handler
    const onDetection = (data: Detection) => {
      setDetections((prev) => [data, ...prev].slice(0, maxEvents));
      addEvent({
        id: `det-${Date.now()}-${counterRef.current++}`,
        type: 'detection',
        camera_id: data.id || 'unknown',
        timestamp: data.timestamp,
        data,
      });
    };

    // Violation handler
    const onViolation = (data: Violation) => {
      setViolations((prev) => [data, ...prev].slice(0, 50));
      addEvent({
        id: `vio-${Date.now()}-${counterRef.current++}`,
        type: 'violation',
        camera_id: data.camera_id,
        timestamp: data.timestamp,
        data,
      });
    };

    wsClient.on('detection', onDetection);
    wsClient.on('violation', onViolation);

    return () => {
      clearInterval(pollInterval);
      wsClient.off('detection', onDetection);
      wsClient.off('violation', onViolation);
    };
  }, [autoConnect, maxEvents, addEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setViolations([]);
    setDetections([]);
  }, []);

  return {
    isConnected,
    events,
    violations,
    detections,
    clearEvents,
  };
}
