'use client';

import { useState } from 'react';
import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PencilSimple, X } from '@phosphor-icons/react';
import SortableTable from '@/components/common/SortableTable';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter, DrawerTitle } from '@/components/ui/drawer';
import type { Campaign, CampaignLead } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import ContactAvatar from '@/features/contacts/components/ContactAvatar';
import ContactTypeBadge from '@/features/contacts/components/ContactTypeBadge';
import { useTemplates } from '@/features/templates/hooks';
import TemplatePreview from '@/features/templates/components/TemplatePreview';
import { CAMPAIGN_STATUS_COLORS, getCampaignStats } from '@/features/campaigns/lib';

const LEAD_COLUMNS: ColumnDef<CampaignLead, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Client name',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4 font-bold capitalize text-basic">
        <ContactAvatar name={row.original.name} />
        {row.original.name || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <ContactTypeBadge type={row.original.type} />,
  },
  {
    accessorKey: 'phone',
    header: 'Mobile number',
    enableSorting: false,
    cell: ({ row }) => <div className="font-medium leading-tight">{row.original.phone || '-'}</div>,
  },
];

const StatCard = ({ label, percent, value }: { label: string; percent: number; value: string }) => (
  <div className="rounded-xl border border-gray-100 px-4 py-3">
    <p className="mb-5 text-sm font-medium text-gray-600">
      {label} <span className="pl-2 font-semibold text-green-700">{percent}%</span>
    </p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

interface Props {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDuplicate: () => void;
}

const CampaignDetailsDrawer = ({ campaign, open, onOpenChange, onDuplicate }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data: templates } = useTemplates();
  const template = templates?.find(({ id }) => id === campaign.template_id);
  const stats = getCampaignStats(campaign);

  const table = useReactTable({
    data: campaign.leads,
    columns: LEAD_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="ml-auto h-full max-w-[992px] rounded-bl-xl rounded-tl-xl rounded-tr-none">
        <div className="grid h-full grid-cols-[1fr_387px]">
          <div className="relative flex h-full flex-col">
            <Button
              variant="icon"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute right-[calc(100%+16px)] top-4"
              aria-label="Close"
            >
              <X size={20} />
            </Button>
            <div className="w-full overflow-y-auto p-6">
              <h3 className="mb-1 text-[13px] text-gray-600">Campaign overview</h3>
              <DrawerTitle className="mb-12 text-lg font-semibold">{campaign.name}</DrawerTitle>

              <h3 className="mb-6 text-sm font-medium text-gray-700">Performance</h3>

              <div className="mb-6 grid grid-cols-4 gap-x-2">
                <div className="rounded-xl border border-gray-100 px-4 py-3">
                  <p className="mb-5 text-sm font-medium text-gray-600">Status</p>
                  <p className={cn('text-lg font-semibold', CAMPAIGN_STATUS_COLORS[campaign.status])}>
                    {campaign.status}
                  </p>
                </div>
                <StatCard label="Outbox" percent={stats.sentPercent} value={`${stats.sent}/${stats.total}`} />
                <StatCard label="Read" percent={stats.readPercent} value={`${stats.read}/${stats.total}`} />
                <StatCard
                  label="Replied"
                  percent={stats.repliedPercent}
                  value={`${stats.replied}/${stats.total}`}
                />
              </div>

              <div className="mb-6 w-full border-y border-gray-100 py-6">
                <h3 className="mb-1 text-sm font-medium text-gray-700">Used WhatsApp template</h3>
                <h3 className="font-medium text-basic">{template?.name ?? '-'}</h3>
              </div>

              <h3 className="mb-1 text-sm font-medium text-gray-700">Contact list</h3>
              <SortableTable table={table} columns={LEAD_COLUMNS} />
            </div>
            <DrawerFooter className="mt-auto flex flex-row items-center justify-end border-t border-t-gray-100 px-6 py-4">
              <Button variant="text" onClick={onDuplicate} className="gap-x-2">
                Duplicate to edit <PencilSimple size={20} />
              </Button>
            </DrawerFooter>
          </div>
          <TemplatePreview message={template?.message ?? ''} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CampaignDetailsDrawer;
