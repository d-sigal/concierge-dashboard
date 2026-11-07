import React, { FC } from 'react';
import { cn } from '@/lib/utils';

interface Props extends React.PropsWithChildren {
  className?: string;
}

const Sidebar: FC<Props> = ({ children, className }) => {
  return (
    <aside
      className={cn(
        'w-full shrink-0 flex-col gap-2 rounded-xl border border-[#EEF0EE] bg-white pt-4 md:flex lg:w-[360px]',
        className,
      )}
    >
      {children}
    </aside>
  );
};

export default Sidebar;
