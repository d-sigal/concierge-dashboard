'use client';

import { useState } from 'react';
import {
  type ColumnDef,
  type ExpandedState,
  type FilterFn,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  type Table,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Info, MagnifyingGlass, UserPlus, X } from '@phosphor-icons/react';
import SortableTable from '@/components/common/SortableTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Contact, ContactType } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import BulkDeleteContacts from '@/features/contacts/components/BulkDeleteContacts';
import ContactExpandedRow from '@/features/contacts/components/ContactExpandedRow';
import CreateContactDialog from '@/features/contacts/components/CreateContactDialog';

type TypeFilter = 'all' | ContactType;

interface ContactFilter {
  search: string;
  type: TypeFilter;
}

const TYPE_FILTERS: TypeFilter[] = ['all', 'lead', 'client'];
const SEARCHABLE_FIELDS = ['full_name', 'email', 'phone_number'] as const;

const contactFilter: FilterFn<Contact> = (row, _columnId, { search, type }: ContactFilter) => {
  if (type !== 'all' && row.original.type !== type) return false;
  if (!search) return true;

  const term = search.toLowerCase();
  return SEARCHABLE_FIELDS.some((field) => row.original[field]?.toLowerCase().includes(term));
};

/** Current search input, used by cells to highlight matches. */
export const getContactSearchTerm = (table: Table<Contact>) =>
  (table.getState().globalFilter as ContactFilter | undefined)?.search ?? '';

interface Props {
  columns: ColumnDef<Contact, unknown>[];
  data: Contact[];
  /** `picker` is the compact layout used to choose campaign recipients. */
  variant?: 'default' | 'picker';
  className?: string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

const ContactsTable = ({
  columns,
  data,
  variant = 'default',
  className,
  rowSelection: controlledSelection,
  onRowSelectionChange,
}: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [localSelection, setLocalSelection] = useState<RowSelectionState>({});
  const [filter, setFilter] = useState<ContactFilter>({ search: '', type: 'all' });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [createOpen, setCreateOpen] = useState(false);

  const isPicker = variant === 'picker';

  const table = useReactTable({
    data,
    columns,
    getRowId: (contact) => contact.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: onRowSelectionChange ?? setLocalSelection,
    onExpandedChange: setExpanded,
    globalFilterFn: contactFilter,
    state: {
      sorting,
      rowSelection: controlledSelection ?? localSelection,
      globalFilter: filter,
      expanded,
    },
    enableRowSelection: true,
  });

  const selectedIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

  const searchInput = (
    <div className={cn('relative w-full', !isPicker && 'lg:max-w-[310px]', isPicker && 'mb-4')}>
      <MagnifyingGlass className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-icon-light" />
      <Input
        placeholder="Search by name, email or phone number"
        value={filter.search}
        onChange={(event) => setFilter((prev) => ({ ...prev, search: event.target.value }))}
        className="pl-9"
      />
    </div>
  );

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-xl bg-white',
        !isPicker && 'px-5 py-5 lg:px-6 lg:py-4',
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center gap-x-3 lg:flex-nowrap">
        <h3
          className={cn(
            isPicker ? 'whitespace-nowrap text-lg font-semibold' : 'text-xl font-bold lg:text-2xl',
          )}
        >
          {isPicker ? 'Select contacts' : 'Contacts'}
        </h3>
        {selectedIds.length > 0 ? (
          <div className="flex grow items-center gap-x-3 md:grow-0">
            <div className="flex w-fit items-center gap-x-2 rounded-full bg-brand-50 px-3 py-2.5 text-[13px] font-semibold leading-none">
              <span>{selectedIds.length}</span> <span> selected</span>
              <X
                className="cursor-pointer"
                aria-label="Clear selection"
                onClick={() => table.toggleAllRowsSelected(false)}
              />
            </div>
            {!isPicker && (
              <BulkDeleteContacts ids={selectedIds} onDeleted={() => table.toggleAllRowsSelected(false)} />
            )}
          </div>
        ) : (
          <div className="grid h-8 min-w-8 shrink-0 place-items-center items-center rounded-full bg-brand-50 px-1 text-[13px] font-semibold leading-none">
            {table.getFilteredRowModel().rows.length}
          </div>
        )}

        {!isPicker && (
          <Button
            size="auto"
            className="ml-auto hidden items-center gap-x-2 px-4 py-1.5 font-semibold md:flex lg:hidden"
            onClick={() => setCreateOpen(true)}
          >
            New client <UserPlus size={20} />
          </Button>
        )}

        <div className="mt-2 flex w-full flex-wrap-reverse items-center justify-end gap-4 md:mt-4 md:flex-nowrap lg:ml-auto lg:mt-0">
          {!isPicker && searchInput}

          <Select
            value={filter.type}
            onValueChange={(type: TypeFilter) => setFilter((prev) => ({ ...prev, type }))}
          >
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

          {!isPicker && (
            <Button
              className="flex items-center gap-x-2 font-semibold md:hidden lg:flex"
              onClick={() => setCreateOpen(true)}
            >
              New client <UserPlus size={20} />
            </Button>
          )}
        </div>
      </div>
      {isPicker && (
        <div>
          {searchInput}
          <h4 className="mb-6 grid grid-cols-[18px_1fr] items-center gap-x-3 font-medium">
            <Info className="size-5 text-blue-600" />
            <span>Opted out contacts are hidden.</span>
          </h4>
        </div>
      )}
      <SortableTable
        table={table}
        columns={columns}
        renderExpandedRow={(row) => <ContactExpandedRow contact={row.original} />}
      />
      {!isPicker && <CreateContactDialog open={createOpen} onOpenChange={setCreateOpen} />}
    </div>
  );
};

export default ContactsTable;
