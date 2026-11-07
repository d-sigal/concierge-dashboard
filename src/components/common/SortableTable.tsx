import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Table as TableProps, flexRender, ColumnDef, Row } from '@tanstack/react-table';
import { CaretDown, CaretUp, CaretUpDown } from '@phosphor-icons/react';
import { Fragment, ReactNode } from 'react';

interface Props<TData, TValue> {
  table: TableProps<TData>;
  onRowClick?: (row: Row<TData>) => void;
  columns: ColumnDef<TData, TValue>[];
  /** Rendered in a full-width row under an expanded row. */
  renderExpandedRow?: (row: Row<TData>) => ReactNode;
}

const SortableTable = <TData, TValue>({ table, onRowClick, renderExpandedRow }: Props<TData, TValue>) => {
  const columnCount = table.getVisibleLeafColumns().length;

  return (
    <Table className="overflow-hidden rounded-xl bg-white text-base">
      <TableHeader className="sticky top-0 bg-white">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            className="border-b-gray-50 hover:bg-transparent lg:hover:bg-transparent"
            key={headerGroup.id}
          >
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className={cn(header.column.id === 'select' && 'w-5')}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn(
                        header.column.getCanSort() && 'flex cursor-pointer select-none items-center',
                        header.column.id === 'select' && 'flex items-center',
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <div className="ml-2">
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === 'asc' ? (
                              <div>
                                <CaretDown className="size-2.5 opacity-20" />
                                <CaretUp className="size-2.5 text-icon" />
                              </div>
                            ) : (
                              <div>
                                <CaretDown className="size-2.5 text-icon" />
                                <CaretUp className="size-2.5 opacity-20" />
                              </div>
                            )
                          ) : (
                            <CaretUpDown className="size-2.5" />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow
                className={cn('border-b-gray-50', onRowClick && 'cursor-pointer')}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => onRowClick?.(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {/* Render expanded row content if expanded */}
              {row.getIsExpanded() && (
                <TableRow className="border-b-gray-50 lg:hidden">
                  <TableCell colSpan={columnCount} className="border-t-0 p-0">
                    {renderExpandedRow?.(row)}
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnCount} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SortableTable;
