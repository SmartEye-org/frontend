'use client';

import { useState } from 'react';
import { ResidentsTable } from '@/components/main/residents/residents-table';
import { ResidentDialog } from '@/components/main/residents/resident-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type ResidentStatus = 'ACTIVE' | 'INACTIVE';

export interface Resident {
    id: string;
    name: string;
    apartment: string;
    phone: string;
    email: string;
    photo_url?: string;
    face_encoding?: number[];
    status: ResidentStatus;
    building_id: string;
    building: { name: string };
    registered_at: string;
    updated_at: string;
}

export const mockResidents: Resident[] = [
    {
        id: '1',
        name: 'Nguyễn Văn An',
        apartment: 'A1201',
        phone: '0901234567',
        email: 'an.nguyen@example.com',
        photo_url: 'https://i.pravatar.cc/150?img=1',
        face_encoding: Array(512).fill(0.001),
        status: 'ACTIVE',
        building_id: '1',
        building: { name: 'Tòa A - Sunshine Tower' },
        registered_at: '2025-03-15T10:30:00Z',
        updated_at: '2025-03-20T14:20:00Z',
    },
    {
        id: '2',
        name: 'Trần Thị Bình',
        apartment: 'B0805',
        phone: '0912345678',
        email: '',
        face_encoding: Array(512).fill(0.001),
        status: 'ACTIVE',
        building_id: '2',
        building: { name: 'Tòa B - Moonlight Residence' },
        registered_at: '2025-02-20T08:15:00Z',
        updated_at: '2025-02-20T08:15:00Z',
    },
    {
        id: '3',
        name: 'Lê Văn Cường',
        apartment: 'C1503',
        phone: '0923456789',
        email: 'cuong.le@example.com',
        photo_url: 'https://i.pravatar.cc/150?img=3',
        face_encoding: Array(512).fill(0.001),
        status: 'INACTIVE',
        building_id: '3',
        building: { name: 'Tòa C - Starlight Apartment' },
        registered_at: '2024-11-10T09:00:00Z',
        updated_at: '2025-01-05T11:11:11Z',
    },
];

export default function UserManagementPage() {
    const [residents, setResidents] = useState<Resident[]>(mockResidents);
    const [editResident, setEditResident] = useState<Resident | null>(null);

    const handleAdd = (newResident: Resident) => {
        setResidents(prev => [...prev, { ...newResident, id: Date.now().toString() }]);
    };

    const handleEdit = (updated: Resident) => {
        setResidents(prev => prev.map(r => r.id === updated.id ? updated : r));
        setEditResident(null);
    };

    const handleDelete = (id: string) => {
        setResidents(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="w-full mx-auto py-8">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>All Residents ({residents.length})</CardTitle>
                    <ResidentDialog  onResidentAdded={handleAdd} />
                </CardHeader>
                <CardContent>
                    <ResidentsTable
                        data={residents}
                        onEdit={setEditResident}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            {editResident && (
                <ResidentDialog
                    onResidentAdded={handleEdit}
                    residentToEdit={editResident}
                    onClose={() => setEditResident(null)}
                />
            )}
        </div>
    );
}