'use client';

import { useState } from 'react';
import { CameraGrid } from '@/components/camera/camera-grid';
import { ControlPanel } from '@/components/camera/control-panel';
import { useCameras } from '@/hooks/use-camera-queries';
import { CameraLayout } from '@/types';
import { Maximize2, Minimize2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LiveMonitoringPage() {
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [layout, setLayout] = useState<CameraLayout>('2x2');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: cameras, isLoading } = useCameras();

  // Get selected camera objects
  const selectedCameraObjects =
    cameras?.filter((c) => selectedCameras.includes(c.id)) || [];

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Camera Grid */}
        <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
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
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <Maximize2 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No cameras selected
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select cameras from the control panel to start monitoring
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        {!isFullscreen && (
          <div className="w-80 border-l bg-white dark:bg-gray-950 p-4 overflow-auto">
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

      {/* Events Table Section */}
      {showEvents && !isFullscreen && (
        <div className="h-64 border-t bg-white dark:bg-gray-950">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 border-b flex items-center justify-between">
            <h3 className="font-medium text-sm">Recent Events</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEvents(false)}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-[calc(100%-48px)] overflow-auto p-4">
            <div className="text-center text-sm text-gray-500 py-8">
              Real-time events will appear here
            </div>
          </div>
        </div>
      )}

      {/* Toggle Events Button (when hidden) */}
      {!showEvents && !isFullscreen && (
        <div className="fixed bottom-4 right-4 z-10">
          <Button onClick={() => setShowEvents(true)} size="sm">
            <ChevronUp className="w-4 h-4 mr-2" />
            Show Events
          </Button>
        </div>
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
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 mr-2" />
              Fullscreen
            </>
          )}
        </Button>
      </div>

      {/* Stats Overlay (optional) */}
      {selectedCameras.length > 0 && (
        <div className="fixed bottom-4 left-4 z-10">
          <Card className="p-3 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500">Active: </span>
                <span className="font-medium">
                  {selectedCameraObjects.filter(c => c.is_streaming).length}/
                  {selectedCameras.length}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div>
                <span className="text-gray-500">Layout: </span>
                <span className="font-medium">{layout}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
