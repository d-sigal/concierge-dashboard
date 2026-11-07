'use client';

import { useState } from 'react';
import {
  type ColumnDef,
  type ExpandedState,
  type SortingState,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Info, Plus } from '@phosphor-icons/react';
import SortableTable from '@/components/common/SortableTable';
import TableExpandableButton from '@/components/common/TableExpandableButton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Campaign } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { useResponsiveColumns } from '@/hooks/useResponsiveColumns';
import { CAMPAIGN_STATUS_COLORS, formatLaunchDate, getCampaignStats } from '@/features/campaigns/lib';
import CampaignActions from '@/features/campaigns/components/CampaignActions';

const HeaderWithHint = ({ label, hint }: { label: string; hint: string }) => (
  <div className="flex items-center gap-x-2">
    {label}
    <Tooltip>
      <TooltipTrigger asChild>
        <Info size={20} className="text-blue-600" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[278px] text-[13px] font-medium leading-tight">{hint}</TooltipContent>
    </Tooltip>
  </div>
);

const PercentBar = ({ value }: { value: number }) => (
  <div className="flex items-center gap-x-2 text-xs">
    <Progress className="w-[150px]" value={value} /> <span>{value}%</span>
  </div>
);

const StatusLabel = ({ campaign, className }: { campaign: Campaign; className?: string }) => (
  <div className={cn('font-medium capitalize', CAMPAIGN_STATUS_COLORS[campaign.status], className)}>
    {campaign.status}
  </div>
);

const COLUMNS: ColumnDef<Campaign, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="line-clamp-1 flex w-full max-w-[180px] items-center gap-x-4 font-bold text-basic">
            <TableExpandableButton row={row} />
            <span>{row.original.name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[278px] text-[13px] font-medium leading-tight">
          {row.original.name}
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusLabel campaign={row.original} />,
  },
  {
    id: 'sent',
    accessorFn: (campaign) => getCampaignStats(campaign).sent,
    header: () => (
      <HeaderWithHint
        label="Messages sent"
        hint="To follow Meta’s rules, messages are sent in batches of 250 instead of all at once."
      />
    ),
    cell: ({ row }) => {
      const { sent, total } = getCampaignStats(row.original);
      return (
        <div className="font-medium leading-tight">
          {sent}/{total}
        </div>
      );
    },
  },
  {
    id: 'failed',
    accessorFn: (campaign) => getCampaignStats(campaign).failed,
    header: () => (
      <HeaderWithHint
        label="Messages failed"
        hint="Sometimes messages fail to send due to various reasons, such as invalid phone numbers or Meta’s rules violation. We mark these messages as failed to ensure you can track and address them."
      />
    ),
    cell: ({ row }) => {
      const { failed, total } = getCampaignStats(row.original);
      return (
        <div className="font-medium leading-tight">
          {failed}/{total}
        </div>
      );
    },
  },
  {
    id: 'read',
    accessorFn: (campaign) => getCampaignStats(campaign).readPercent,
    header: 'Read',
    cell: ({ getValue }) => <PercentBar value={getValue<number>()} />,
  },
  {
    id: 'replied',
    accessorFn: (campaign) => getCampaignStats(campaign).repliedPercent,
    header: 'Replied',
    cell: ({ getValue }) => <PercentBar value={getValue<number>()} />,
  },
  {
    accessorKey: 'scheduled_time',
    header: 'Launch date',
    cell: ({ row }) => (
      <div className="font-medium leading-tight">{formatLaunchDate(row.original.scheduled_time)}</div>
    ),
  },
  {
    id: 'action',
    header: () => <div className="text-center">Action</div>,
    enableSorting: false,
    cell: ({ row }) => <CampaignActions campaign={row.original} />,
  },
];

const MOBILE_COLUMNS = ['name', 'action'];
const TABLET_COLUMNS = ['name', 'status', 'action'];

const CampaignExpandedRow = ({ campaign }: { campaign: Campaign }) => {
  const { sent, total } = getCampaignStats(campaign);

  return (
    <div className="p-4 text-sm">
      <div className="grid grid-cols-2 items-center gap-x-2 gap-y-6">
        <span className="text-sm font-semibold md:hidden">Status</span>
        <StatusLabel campaign={campaign} className="md:hidden" />
        <span className="text-sm font-semibold">Messages sent</span>
        <span>
          {sent}/{total}
        </span>
        <span className="text-sm font-semibold">Launch date</span>
        <span>{formatLaunchDate(campaign.scheduled_time)}</span>
      </div>
    </div>
  );
};

interface Props {
  data: Campaign[];
  onClickCreate: () => void;
}

const CampaignsTable = ({ data, onClickCreate }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const columns = useResponsiveColumns(COLUMNS, { mobile: MOBILE_COLUMNS, tablet: TABLET_COLUMNS });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    state: { sorting, expanded },
  });

  return (
    <div className="flex h-full flex-col rounded-xl">
      <div className="mb-6 flex items-center gap-x-3">
        <div className="flex flex-shrink-0 items-center gap-x-3">
          <h3 className="text-lg font-bold">WhatsApp campaigns</h3>
          <div className="grid size-6 shrink-0 place-items-center items-center rounded-full bg-white text-[13px] font-semibold leading-none">
            {data.length}
          </div>
        </div>
        <div className="ml-auto flex w-full items-center justify-end">
          <Button variant="text" className="gap-x-2" onClick={onClickCreate}>
            Create <Plus size={20} />
          </Button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-100">
        <SortableTable
          table={table}
          columns={columns}
          renderExpandedRow={(row) => <CampaignExpandedRow campaign={row.original} />}
        />
      </div>
    </div>
  );
};

export default CampaignsTable;
