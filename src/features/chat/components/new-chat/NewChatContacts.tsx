'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type SortingState,
} from '@tanstack/react-table';
import { MagnifyingGlass } from '@phosphor-icons/react';
import SortableTable from '@/components/common/SortableTable';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Contact, ContactType } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { useContacts } from '@/features/contacts/hooks';
import { getInitials } from '@/features/chat/utils';

type TypeFilter = 'all' | ContactType;

const TYPE_FILTERS: TypeFilter[] = ['all', 'lead', 'client'];
const SEARCHABLE_FIELDS = ['full_name', 'email', 'phone_number'] as const;

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4 font-bold capitalize text-basic">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-200 text-base font-semibold transition-colors group-hover:bg-white">
          {getInitials(row.original.full_name) || '-'}
        </div>
        {row.original.full_name || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <div
        className={cn(
          'w-fit rounded-full px-3 py-2 text-[13px] font-semibold capitalize leading-tight',
          row.original.type === 'lead' ? 'bg-[#F8EFD3]' : 'bg-[#D8F3DF]',
        )}
      >
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone',
    enableSorting: false,
    cell: ({ row }) => <div className="font-medium leading-tight">{row.original.phone_number || '-'}</div>,
  },
];

interface Props {
  onSelect: () => void;
}

const NewChatContacts = ({ onSelect }: Props) => {
  const router = useRouter();
  const { data: contacts } = useContacts();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (contacts ?? []).filter(
      (contact) =>
        (typeFilter === 'all' || contact.type === typeFilter) &&
        (!term || SEARCHABLE_FIELDS.some((field) => contact[field]?.toLowerCase().includes(term))),
    );
  }, [contacts, search, typeFilter]);

  const table = useReactTable({
    data: filteredContacts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const openConversation = (row: Row<Contact>) => {
    router.push(`/conversations/${row.original.id}`);
    onSelect();
  };

  if (!contacts) return null;

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <div className="mb-4 flex w-full flex-wrap-reverse items-center justify-end gap-4 md:flex-nowrap">
        <div className="relative w-full">
          <MagnifyingGlass className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-icon-light" />
          <Input
            placeholder="Search by name, email or phone number"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TypeFilter)}>
          <SelectTrigger className="w-auto shrink-0 flex-grow justify-normal text-sm text-gray-500 lg:w-fit lg:flex-grow-0 lg:justify-between [&>svg]:ml-auto">
            Contact type{' '}
            <span className="mx-2 font-semibold capitalize text-basic">
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            {TYPE_FILTERS.map((type) => (
              <SelectItem value={type} key={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SortableTable table={table} columns={columns} onRowClick={openConversation} />
    </div>
  );
};

export default NewChatContacts;
