'use client';

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Camera } from '@/types';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SimpleMapProps {
  cameras: Camera[];
}

export function SimpleMap({ cameras }: SimpleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Default center: Hanoi
  const center = { lat: 21.0285, lng: 105.8542 };

  if (!apiKey) {
    return (
      <Card className="p-8 text-center h-full flex items-center justify-center">
        <div>
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Google Maps API Key Required</h3>
          <p className="text-sm text-gray-500">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border">
      <APIProvider apiKey={apiKey}>
        <Map
          center={center}
          zoom={15}
          mapId="smarteye-map"
          className="w-full h-full"
        >
          {cameras.map((camera, index) => {
            // Simple: generate position based on index
            const lat = center.lat + (index * 0.001);
            const lng = center.lng + (index * 0.001);
            
            return (
              <AdvancedMarker
                key={camera.id}
                position={{ lat, lng }}
                title={camera.name}
              >
                <Pin
                  background={camera.is_streaming ? '#10B981' : '#9CA3AF'}
                  borderColor="#000"
                  glyphColor="#fff"
                />
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
}
