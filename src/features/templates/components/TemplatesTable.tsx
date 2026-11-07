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
import SortableTable from '@/components/common/SortableTable';
import TableExpandableButton from '@/components/common/TableExpandableButton';
import type { Template, TemplateStatus } from '@/lib/api/types';
import { LANGUAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useResponsiveColumns } from '@/hooks/useResponsiveColumns';

const STATUS_COLORS: Record<TemplateStatus, string> = {
  draft: 'text-basic',
  review: 'text-gray-700',
  rejected: 'text-red-700',
  approved: 'text-green-700',
};

const getLanguageLabel = (code: string) => LANGUAGES.find(({ value }) => value === code)?.label ?? code;

const pad = (n: number) => n.toString().padStart(2, '0');

/** e.g. `2025-05-21 12:00:00 UTC` */
const formatUtc = (iso: string) => {
  const date = new Date(iso);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
};

const StatusLabel = ({ status, className }: { status: TemplateStatus; className?: string }) => (
  <div className={cn('font-medium capitalize', STATUS_COLORS[status], className)}>{status}</div>
);

const COLUMNS: ColumnDef<Template, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4 font-bold capitalize text-basic">
        <TableExpandableButton row={row} />
        <strong>{row.original.name}</strong>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusLabel status={row.original.status} />,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <div className="font-medium capitalize">{row.original.category.toLowerCase()}</div>,
  },
  {
    accessorKey: 'language',
    header: 'Language',
    cell: ({ row }) => getLanguageLabel(row.original.language),
  },
  {
    accessorKey: 'created_at',
    header: 'Created at',
    cell: ({ row }) => <div className="font-medium">{formatUtc(row.original.created_at)}</div>,
  },
];

const MOBILE_COLUMNS = ['name'];
const TABLET_COLUMNS = ['name', 'status', 'category'];

const TemplateExpandedRow = ({ template }: { template: Template }) => (
  <div className="p-4 pl-12 text-sm">
    <div className="space-y-6">
      <div className="flex items-center gap-x-2 md:hidden">
        <span className="text-sm font-semibold">Status</span>
        <StatusLabel status={template.status} className="text-[13px] font-semibold leading-tight" />
      </div>
      <div className="flex items-center gap-x-2 md:hidden">
        <span className="text-sm font-semibold">Category</span>
        <span className="capitalize">{template.category.toLowerCase() || '-'}</span>
      </div>
      <div className="flex items-center gap-x-2">
        <span className="text-sm font-semibold">Language</span>
        <span>{getLanguageLabel(template.language) || '-'}</span>
      </div>
    </div>
  </div>
);

const TemplatesTable = ({ data }: { data: Template[] }) => {
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
    <div className="rounded-xl bg-white px-4 py-2">
      <SortableTable
        table={table}
        columns={columns}
        renderExpandedRow={(row) => <TemplateExpandedRow template={row.original} />}
      />
    </div>
  );
};

export default TemplatesTable;
