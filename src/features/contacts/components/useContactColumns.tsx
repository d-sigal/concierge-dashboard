'use client';

import type { ColumnDef } from '@tanstack/react-table';
import TableExpandableButton from '@/components/common/TableExpandableButton';
import TextHighlighter from '@/components/common/TextHighlighter';
import { Checkbox } from '@/components/ui/checkbox';
import type { Contact } from '@/lib/api/types';
import ContactAvatar from '@/features/contacts/components/ContactAvatar';
import ContactRowActions from '@/features/contacts/components/ContactRowActions';
import ContactTypeBadge from '@/features/contacts/components/ContactTypeBadge';
import { getContactSearchTerm } from '@/features/contacts/components/ContactsTable';
import { useResponsiveColumns } from '@/hooks/useResponsiveColumns';

const COLUMNS: ColumnDef<Contact, unknown>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="group-hover:opacity-100 data-[state=checked]:opacity-100 lg:opacity-0"
        aria-label="Select contact"
      />
    ),
  },
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row, table }) => (
      <div className="flex items-center gap-x-4 font-bold capitalize text-basic">
        <TableExpandableButton row={row} />
        <ContactAvatar name={row.original.full_name} />
        <TextHighlighter text={row.original.full_name || '-'} highlight={getContactSearchTerm(table)} />
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <ContactTypeBadge type={row.original.type} />,
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone',
    enableSorting: false,
    cell: ({ row, table }) => (
      <div className="font-medium leading-tight">
        <TextHighlighter text={row.original.phone_number || '-'} highlight={getContactSearchTerm(table)} />
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row, table }) => (
      <div className="font-medium leading-tight">
        <TextHighlighter text={row.original.email || '-'} highlight={getContactSearchTerm(table)} />
      </div>
    ),
  },
  {
    id: 'action',
    header: () => <div className="text-center">Action</div>,
    enableSorting: false,
    cell: ({ row }) => <ContactRowActions contact={row.original} />,
  },
];

const MOBILE_COLUMNS = ['select', 'full_name', 'action'];

export const useContactColumns = () => useResponsiveColumns(COLUMNS, { mobile: MOBILE_COLUMNS });
