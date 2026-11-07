import React, { FC } from 'react';
import { cn } from '@/lib/utils';

type variants = 'destructive' | 'default';

interface Props extends React.PropsWithChildren {
  variant?: variants;
}

const DialogIcon: FC<Props> = ({ children, variant = 'default' }) => {
  const variants: Record<variants, Record<'outer' | 'inner', string>> = {
    default: {
      outer: 'bg-brand-200/30',
      inner: 'bg-brand-200/80 text-basic',
    },
    destructive: {
      outer: 'bg-red-200/30',
      inner: 'bg-red-200/80 text-red-600',
    },
  } as const;

  return (
    <div className={cn('mb-5 grid size-14 place-items-center rounded-full', variants[variant]?.outer)}>
      <div className={cn('grid size-10 place-items-center rounded-full', variants[variant]?.inner)}>
        {children}
      </div>
    </div>
  );
};

export default DialogIcon;
