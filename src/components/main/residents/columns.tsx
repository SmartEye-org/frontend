import { ColumnDef } from '@tanstack/react-table';
import { Resident } from '@/app/(main)/user-management/page';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const columns = (
  onEdit: (resident: Resident) => void,
  onDelete: (id: string) => void
): ColumnDef<Resident>[] => [
  {
    accessorKey: 'photo_url',
    header: '',
    cell: ({ row }) => (
      <Avatar className="h-10 w-10">
        <AvatarImage src={row.original.photo_url} />
        <AvatarFallback>{row.original.name[0]}</AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Full Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  { accessorKey: 'apartment', header: 'Apartment' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'ACTIVE' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorFn: (row) => row.building.name,
    header: 'Building',
  },
  {
    accessorKey: 'registered_at',
    header: 'Registered At',
    cell: ({ row }) => format(new Date(row.original.registered_at), 'dd/MM/yyyy HH:mm'),
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => format(new Date(row.original.updated_at), 'dd/MM/yyyy HH:mm'),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const resident = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(resident)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => onDelete(resident.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];