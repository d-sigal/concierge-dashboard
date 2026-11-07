import { Button } from '@/components/ui/button';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { Row } from '@tanstack/react-table';

const TableExpandableButton = <TData,>({ row }: { row: Row<TData> }) => {
  return (
    <Button
      variant="text"
      size="auto"
      className="lg:hidden"
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click handler
        row.toggleExpanded();
      }}
      aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
    >
      {row.getIsExpanded() ? <CaretUp size={20} /> : <CaretDown size={20} />}
    </Button>
  );
};

export default TableExpandableButton;
