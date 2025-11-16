// Updated component with pagination for multiple profiles
"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import DetectionImageWithBoxes from "./DetectionImageWithBoxes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ViewDetailDialog() {
  // Demo multiple profiles
  const profiles = [
    {
      id: 1,
      name: "John Doe",
      room: "101A",
      gender: "Male",
      status: "Recognized",
      confidence: "87%",
      lastSeen: "2025-05-12 14:32",
      camera: "Camera 01",
      faceId: "F001",
      avatar: "/avatar.png",
      boxes: [
        { id: "1", x: 10, y: 20, width: 20, height: 35, label: "John 0.87", action: "standing" }
      ]
    },
    {
      id: 2,
      name: "Jane Smith",
      room: "202B",
      gender: "Female",
      status: "Recognized",
      confidence: "92%",
      lastSeen: "2025-05-12 14:30",
      camera: "Camera 03",
      faceId: "F002",
      avatar: "/avatar.png",
      boxes: [
        { id: "2", x: 40, y: 25, width: 18, height: 30, label: "Jane 0.92", color: "#00ff00" }
      ]
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const current = profiles[currentIndex];

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevProfile = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"}>view</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[90vw] lg:max-w-[90vw] h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Profile Detail</DialogTitle>

        <div className="grid grid-cols-[70%_30%] w-full h-full">
          {/* LEFT IMAGE */}
          <div className="bg-black relative">
            <DetectionImageWithBoxes
              imageUrl="/human2.png"
              boxes={current.boxes}
            />
          </div>

          {/* RIGHT PROFILE PANEL */}
          <div className="p-6 border-l overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>

            {profiles.length > 1 && (
              <div className="flex gap-2 mb-4 w-full">
                <Button variant="outline" size="sm" onClick={prevProfile} disabled={currentIndex === 0}>
                  Prev
                </Button>
                <Button variant="outline" size="sm" onClick={nextProfile} disabled={currentIndex === profiles.length - 1}>
                  Next
                </Button>
              </div>
            )}

            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={current.avatar} />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              <div>
                <Label>Face ID</Label>
                <Input
                  readOnly
                  className="my-2 pointer-events-none select-none cursor-default"
                  value={current.faceId} />
              </div>

              <div>
                <Label>Full Name</Label>
                <Input
                  readOnly
                  className="my-2 pointer-events-none select-none cursor-default"
                  value={current.name} />
              </div>

              <div>
                <Label>Room</Label>
                <Input
                  readOnly
                  className="my-2 pointer-events-none select-none cursor-default"
                  value={current.room} />
              </div>


              <div>
                <Label>Gender</Label>
                <Input 
                  readOnly 
                  className="my-2 pointer-events-none select-none cursor-default" 
                  value={current.gender} />
              </div>

              <div>
                <Label>Recognition Status</Label>
                <Input
                  readOnly
                  className="my-2 pointer-events-none select-none cursor-default"
                  value={current.status} />
              </div>

              <div>
                <Label>Confidence (%)</Label>
                <Input
                  readOnly
                  className="my-2 pointer-events-none select-none cursor-default"
                  value={current.confidence} />
              </div>

              <div>
                <Label>Last Seen</Label>
                <Input
                  readOnly
                  className="my-2 pointer-events-none select-none cursor-default"
                  value={current.lastSeen} />
              </div>

              <div>
                <Label>Camera</Label>
                <Input
                  readOnly
                  className="my-2 pointer-events-none select-none cursor-default"
                  value={current.camera} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
