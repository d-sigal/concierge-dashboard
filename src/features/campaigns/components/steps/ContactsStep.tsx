'use client';

import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ColumnDef, OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import useNotificationsToasts from '@/hooks/useNotificationsToasts';
import type { Contact } from '@/lib/api/types';
import { useContacts } from '@/features/contacts/hooks';
import ContactAvatar from '@/features/contacts/components/ContactAvatar';
import ContactsTable from '@/features/contacts/components/ContactsTable';
import ContactTypeBadge from '@/features/contacts/components/ContactTypeBadge';
import { type CampaignFormValues, MAX_CAMPAIGN_CONTACTS } from '@/features/campaigns/form';

const COLUMNS: ColumnDef<Contact, unknown>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(!!checked)}
        aria-label="Select contact"
      />
    ),
  },
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4 font-bold capitalize text-basic">
        <ContactAvatar name={row.original.full_name} />
        <div>
          <p>{row.original.full_name || '-'}</p>
          <p className="text-sm font-medium lowercase text-gray-700">{row.original.email || '-'}</p>
        </div>
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
    cell: ({ row }) => <div className="font-medium leading-tight">{row.original.phone_number || '-'}</div>,
  },
];

const ContactsStep = () => {
  const { data: contacts } = useContacts();
  const { control, setValue } = useFormContext<CampaignFormValues>();
  const leadIds = useWatch({ control, name: 'lead_ids' });
  const { errorToast } = useNotificationsToasts();

  const rowSelection = useMemo(() => Object.fromEntries(leadIds.map((id) => [id, true])), [leadIds]);

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const next = typeof updater === 'function' ? updater(rowSelection) : updater;
    const ids = Object.keys(next).filter((id) => next[id]);

    if (ids.length > MAX_CAMPAIGN_CONTACTS) {
      errorToast(
        `You can only select up to ${MAX_CAMPAIGN_CONTACTS} contacts. Currently selected: ${leadIds.length}`,
      );
      return;
    }
    setValue('lead_ids', ids, { shouldDirty: true });
  };

  if (!contacts) return null;

  return (
    <ContactsTable
      variant="picker"
      className="overflow-y-auto pt-1"
      data={contacts}
      columns={COLUMNS}
      rowSelection={rowSelection}
      onRowSelectionChange={onRowSelectionChange}
    />
  );
};

export default ContactsStep;
