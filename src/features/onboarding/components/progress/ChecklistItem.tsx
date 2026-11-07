import type { ReactNode } from 'react';
import { CaretRight, CheckCircle } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface Props {
  done?: boolean;
  icon: ReactNode;
  label: string;
  doneLabel?: string;
  tag?: 'Required' | 'Optional';
  onClick: () => void;
}

const ChecklistItem = ({ done = false, icon, label, doneLabel = label, tag, onClick }: Props) => (
  <button
    type="button"
    disabled={done}
    onClick={onClick}
    className="flex w-full cursor-pointer items-center text-left disabled:cursor-default"
  >
    <span className={cn('flex items-center gap-x-2 text-sm', done && 'text-icon-success')}>
      {done ? (
        <>
          <CheckCircle weight="fill" className="text-strokes-success" size={20} />
          <span className="font-semibold">{doneLabel}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{label}</span>
          {tag && (
            <span className={cn('text-[10px] font-medium', tag === 'Required' && 'text-red')}>{tag}</span>
          )}
        </>
      )}
    </span>
    {!done && <CaretRight size={20} className="ml-auto" />}
  </button>
);

export default ChecklistItem;
