"use client";

import Image from "next/image";

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  action?: string;
  color?: string; 
}

interface Props {
  imageUrl: string;
  boxes: BoundingBox[];
}

export default function DetectionImageWithBoxes({ imageUrl, boxes }: Props) {
  return (
    <div className="relative w-full h-full bg-black">
      {/* IMAGE */}
      <Image
        src={imageUrl}
        alt="Detection"
        fill
        className="object-contain"
      />

      {/* BOUNDING BOXES */}
      {boxes.map((box) => (
        <div
          key={box.id}
          className="absolute border-2 rounded-sm"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.width}%`,
            height: `${box.height}%`,
            borderColor: box.color || "#00FF00",
          }}
        >
          {/* LABEL */}
          <div
            className="absolute px-1 py-0.5 text-xs font-medium text-white"
            style={{
              top: "-18px",
              left: "0",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            {box.label}
            {box.action && <span> — {box.action}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
