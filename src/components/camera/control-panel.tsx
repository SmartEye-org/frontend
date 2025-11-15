'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CameraLayout } from '@/types';
import { useCameras, useStartStream, useStopStream } from '@/hooks/use-camera-queries';
import { Play, Square, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface ControlPanelProps {
  selectedCameras: string[];
  onCameraSelect: (cameraIds: string[]) => void;
  layout: CameraLayout;
  onLayoutChange: (layout: CameraLayout) => void;
  showBoundingBoxes: boolean;
  onShowBoundingBoxesChange: (show: boolean) => void;
  showConfidence: boolean;
  onShowConfidenceChange: (show: boolean) => void;
}

export function ControlPanel({
  selectedCameras,
  onCameraSelect,
  layout,
  onLayoutChange,
  showBoundingBoxes,
  onShowBoundingBoxesChange,
  showConfidence,
  onShowConfidenceChange,
}: ControlPanelProps) {
  const { data: cameras, isLoading } = useCameras();
  const startStream = useStartStream();
  const stopStream = useStopStream();

  const handleStartAll = async () => {
    for (const cameraId of selectedCameras) {
      await startStream.mutateAsync({ cameraId, config: { fps: 5 } });
    }
  };

  const handleStopAll = async () => {
    for (const cameraId of selectedCameras) {
      await stopStream.mutateAsync(cameraId);
    }
  };

  const streamingCount = cameras?.filter(c =>
    selectedCameras.includes(c.id) && c.is_streaming
  ).length || 0;

  const handleCameraToggle = (cameraId: string, checked: boolean) => {
    if (checked) {
      onCameraSelect([...selectedCameras, cameraId]);
    } else {
      onCameraSelect(selectedCameras.filter((id) => id !== cameraId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Camera Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Camera Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-2">
              {cameras?.map((camera) => (
                <div
                  key={camera.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={camera.id}
                      checked={selectedCameras.includes(camera.id)}
                      onCheckedChange={(checked) => 
                        handleCameraToggle(camera.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={camera.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {camera.name}
                    </Label>
                  </div>

                  {camera.is_streaming && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Streaming
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t">
            <div className="text-xs text-gray-500">
              {selectedCameras.length} selected • {streamingCount} streaming
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={layout} onValueChange={(v) => onLayoutChange(v as CameraLayout)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1x1">1x1 (Single)</SelectItem>
              <SelectItem value="2x2">2x2 (4 cameras)</SelectItem>
              <SelectItem value="3x3">3x3 (9 cameras)</SelectItem>
              <SelectItem value="4x4">4x4 (16 cameras)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Display Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="bbox" className="text-sm font-normal">
              Show Bounding Boxes
            </Label>
            <Switch
              id="bbox"
              checked={showBoundingBoxes}
              onCheckedChange={onShowBoundingBoxesChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="confidence" className="text-sm font-normal">
              Show Confidence
            </Label>
            <Switch
              id="confidence"
              checked={showConfidence}
              onCheckedChange={onShowConfidenceChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stream Control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Stream Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={handleStartAll}
            disabled={selectedCameras.length === 0 || startStream.isPending}
            className="w-full"
            size="sm"
          >
            {startStream.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Start All
          </Button>

          <Button
            onClick={handleStopAll}
            disabled={streamingCount === 0 || stopStream.isPending}
            variant="outline"
            className="w-full"
            size="sm"
          >
            {stopStream.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Square className="w-4 h-4 mr-2" />
            )}
            Stop All
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
