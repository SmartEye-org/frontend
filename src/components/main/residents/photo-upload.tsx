'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useState } from 'react';

interface PhotoUploadProps {
  onChange: (url: string) => void;
}

export function PhotoUpload({ onChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setPreview(url);
        onChange(url);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Photo</Label>
      <div className="flex flex-col items-center">
        {preview ? (
          <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg border" />
        ) : (
          <div className="w-48 h-48 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <Input type="file" accept="image/*" onChange={handleFile} className="mt-4" />
      </div>
    </div>
  );
}