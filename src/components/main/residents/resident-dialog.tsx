'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ResidentForm } from './resident-form';
import { Resident } from '@/app/(main)/user-management/page';

interface AddResidentDialogProps {
  onResidentAdded: (resident: Resident) => void;
  residentToEdit?: Resident | null;
  onClose?: () => void;             
}

export function ResidentDialog({
  onResidentAdded,
  residentToEdit,
  onClose,
}: AddResidentDialogProps) {
  const [open, setOpen] = useState(false);

  const isEditMode = !!residentToEdit;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog open={open || isEditMode} onOpenChange={handleOpenChange}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="text-sm bg-[#064E3B] hover:bg-[#064E3B]/80">
            <Plus className="mr-2 h-4 w-4" />
            Add New Resident
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Resident' : 'Add New Resident'}
          </DialogTitle>
        </DialogHeader>

        <ResidentForm
          onSuccess={(resident) => {
            onResidentAdded(resident);
            setOpen(false);
            onClose?.();
          }}
          initialData={residentToEdit || undefined}
        />
      </DialogContent>
    </Dialog>
  );
}