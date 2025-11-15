'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface RealtimeEvent {
  id: string;
  event_id: string;
  camera_id: string;
  camera_name: string;
  detected_time: string;
  track_id: string;
  person_type: string;
  person_name?: string;
  confidence: number;
  alert_level: 'normal' | 'warning' | 'critical';
}

// Define proper types for WebSocket data
interface DetectionData {
  id?: string;
  track_id: string;
  person_type: string;
  person_name?: string;
  confidence: number;
  timestamp?: string;
}

interface WebSocketDetectionEvent {
  camera_id: string;
  camera_name: string;
  timestamp: string;
  detections: DetectionData[];
}

export function RealtimeEvents() {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to events WebSocket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from events WebSocket');
      setIsConnected(false);
    });

    socket.on('detection', (data: WebSocketDetectionEvent) => {
      console.log('Received detection:', data);
      
      // Transform detection data to event format
      if (data.detections && data.detections.length > 0) {
        const newEvents: RealtimeEvent[] = data.detections.map((det: DetectionData) => ({
          id: det.id || `${data.camera_id}-${Date.now()}`,
          event_id: `EVT-${Date.now()}`,
          camera_id: data.camera_id,
          camera_name: data.camera_name,
          detected_time: det.timestamp || data.timestamp,
          track_id: det.track_id,
          person_type: det.person_type,
          person_name: det.person_name,
          confidence: det.confidence,
          alert_level: (det.person_type === 'unknown' ? 'warning' : 'normal') as 'normal' | 'warning' | 'critical',
        }));

        setEvents((prev) => [...newEvents, ...prev].slice(0, 50));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getPersonTypeBadge = (type: string) => {
    switch (type) {
      case 'resident':
        return <Badge className="bg-green-500">Resident</Badge>;
      case 'guest':
        return <Badge className="bg-blue-500">Guest</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {events.length} events
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Waiting for real-time events...</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Camera</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Alert</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-xs">
                    {event.event_id}
                  </TableCell>
                  <TableCell>{event.camera_name}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(event.detected_time).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    {event.person_name || event.track_id}
                  </TableCell>
                  <TableCell>
                    {getPersonTypeBadge(event.person_type)}
                  </TableCell>
                  <TableCell>{Math.round(event.confidence * 100)}%</TableCell>
                  <TableCell>
                    {getAlertBadge(event.alert_level)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
