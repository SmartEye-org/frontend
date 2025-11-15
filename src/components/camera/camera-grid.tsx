'use client';

import { Camera, CameraLayout } from '@/types';
import { CameraView } from './camera-view';
import { cn } from '@/lib/utils';

interface CameraGridProps {
  cameras: Camera[];
  layout: CameraLayout;
  showBoundingBoxes?: boolean;
  showConfidence?: boolean;
}

const layoutClasses: Record<CameraLayout, string> = {
  '1x1': 'grid-cols-1',
  '2x2': 'grid-cols-2',
  '3x3': 'grid-cols-3',
  '4x4': 'grid-cols-4',
};

const maxCameras: Record<CameraLayout, number> = {
  '1x1': 1,
  '2x2': 4,
  '3x3': 9,
  '4x4': 16,
};

export function CameraGrid({
  cameras,
  layout,
  showBoundingBoxes = true,
  showConfidence = true,
}: CameraGridProps) {
  const displayCameras = cameras.slice(0, maxCameras[layout]);
  const emptySlotsCount = maxCameras[layout] - displayCameras.length;

  return (
    <div
      className={cn(
        'grid gap-4 w-full h-full',
        layoutClasses[layout]
      )}
    >
      {displayCameras.map((camera) => (
        <CameraView
          key={camera.id}
          camera={camera}
          showBoundingBoxes={showBoundingBoxes}
          showConfidence={showConfidence}
        />
      ))}
      
      {/* Empty slots */}
      {emptySlotsCount > 0 &&
        Array.from({ length: emptySlotsCount }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="aspect-video bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center"
          >
            <div className="text-center text-gray-400 dark:text-gray-600">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-2xl">+</span>
              </div>
              <span className="text-sm">Empty slot</span>
            </div>
          </div>
        ))}
    </div>
  );
}
