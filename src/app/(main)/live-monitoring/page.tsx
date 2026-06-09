'use client';

import { useState } from 'react';
import { CameraGrid } from '@/components/camera/camera-grid';
import { ControlPanel } from '@/components/camera/control-panel';
import { useCameras } from '@/hooks/use-camera-queries';
import { useSocket } from '@/hooks/use-socket';
import { RealtimeEventsPanel } from '@/components/main/realtime-events-panel';
import { CameraLayout } from '@/types';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LiveMonitoringPage() {
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [layout, setLayout] = useState<CameraLayout>('2x2');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: cameras, isLoading } = useCameras();
  const { isConnected, events, clearEvents } = useSocket({ maxEvents: 200 });

  const selectedCameraObjects =
    cameras?.filter((c) => selectedCameras.includes(c.id)) || [];

  return (
    <div className="flex flex-col h-[calc(100vh-96px)]">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Camera Grid */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-3">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="aspect-video" />
                  <Skeleton className="h-12 w-full" />
                </Card>
              ))}
            </div>
          ) : selectedCameras.length > 0 ? (
            <CameraGrid
              cameras={selectedCameraObjects}
              layout={layout}
              showBoundingBoxes={showBoundingBoxes}
              showConfidence={showConfidence}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <Maximize2 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Chưa chọn camera
                </h3>
                <p className="text-sm text-gray-500">
                  Chọn camera từ bảng điều khiển bên phải để bắt đầu theo dõi
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        {!isFullscreen && (
          <div className="w-72 border-l bg-white dark:bg-gray-950 overflow-auto flex-shrink-0">
            <ControlPanel
              selectedCameras={selectedCameras}
              onCameraSelect={setSelectedCameras}
              layout={layout}
              onLayoutChange={setLayout}
              showBoundingBoxes={showBoundingBoxes}
              onShowBoundingBoxesChange={setShowBoundingBoxes}
              showConfidence={showConfidence}
              onShowConfidenceChange={setShowConfidence}
            />
          </div>
        )}
      </div>

      {/* Real-time Events Panel */}
      {!isFullscreen && (
        <RealtimeEventsPanel
          events={events}
          isConnected={isConnected}
          onClear={clearEvents}
        />
      )}

      {/* Fullscreen Toggle */}
      <div className="fixed top-20 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="shadow-lg"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4 mr-2" />
              Thu nhỏ
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 mr-2" />
              Toàn màn hình
            </>
          )}
        </Button>
      </div>

      {/* Active stats overlay */}
      {selectedCameras.length > 0 && (
        <div className="fixed bottom-72 left-4 z-10">
          <Card className="p-2.5 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3 text-sm">
              <div>
                <span className="text-gray-500">Camera: </span>
                <span className="font-semibold">
                  {selectedCameraObjects.filter((c) => c.is_streaming).length}/
                  {selectedCameras.length}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div>
                <span className="text-gray-500">Layout: </span>
                <span className="font-semibold">{layout}</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
