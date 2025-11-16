'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhotoUpload } from './photo-upload';
import { Resident } from '@/app/(main)/user-management/page';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(2, 'Name too short').max(255),
    apartment: z.string().max(50),
    phone: z.string().min(10).max(20),
    email: z.string().email().or(z.literal('')),
    photo_url: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
    building_id: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
    onSuccess: (data: Resident) => void;
    initialData?: Resident;
}

const buildingOptions = [
    { id: '1', name: 'Tòa A - Sunshine Tower' },
    { id: '2', name: 'Tòa B - Moonlight Residence' },
    { id: '3', name: 'Tòa C - Starlight Apartment' },
];

export function ResidentForm({ onSuccess, initialData }: Props) {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || { status: 'ACTIVE', email: '' },
    });

    const onSubmit = async (data: FormData) => {
        await new Promise(r => setTimeout(r, 600));

        const updatedResident: Resident = {
            id: initialData?.id || '',
            name: data.name,
            apartment: data.apartment,
            phone: data.phone,
            email: data.email,
            photo_url: data.photo_url,
            face_encoding: initialData?.face_encoding,
            status: data.status,
            building_id: data.building_id,
            building: { name: buildingOptions.find(b => b.id === data.building_id)?.name || '' },
            registered_at: initialData?.registered_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        onSuccess(updatedResident);
        toast.success(initialData ? 'Resident updated!' : 'Resident added!');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PhotoUpload onChange={(url) => setValue('photo_url', url, { shouldValidate: true })} />

                <div className="space-y-5">
                    <div>
                        <Label>Full Name *</Label>
                        <Input {...register('name')} defaultValue={initialData?.name} placeholder="Nguyễn Văn A" />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label>Apartment *</Label>
                        <Input {...register('apartment')} defaultValue={initialData?.apartment} placeholder="A1201" />
                        {errors.apartment && <p className="text-sm text-red-500 mt-1">{errors.apartment.message}</p>}
                    </div>

                    <div>
                        <Label>Building *</Label>
                        <Select
                            defaultValue={initialData?.building_id}
                            onValueChange={(v) => setValue('building_id', v, { shouldValidate: true })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select building" />
                            </SelectTrigger>
                            <SelectContent>
                                {buildingOptions.map(b => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.building_id && <p className="text-sm text-red-500 mt-1">{errors.building_id.message}</p>}
                    </div>

                    <div>
                        <Label>Phone Number *</Label>
                        <Input {...register('phone')} defaultValue={initialData?.phone} placeholder="0901234567" />
                        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input {...register('email')} defaultValue={initialData?.email} type="email" placeholder="example@domain.com" />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select
                            defaultValue={initialData?.status}
                            onValueChange={(v) => setValue('status', v as 'ACTIVE' | 'INACTIVE', { shouldValidate: true })}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Resident')}
                </Button>
            </div>
        </form>
    );
}