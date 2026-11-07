import React, { FC, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface Props extends PropsWithChildren {
  className?: string;
}

const PageTitle: FC<Props> = ({ children, className }) => (
  <h3 className={cn('mb-6 flex items-center text-lg font-semibold', className)}>{children}</h3>
);

export default PageTitle;
