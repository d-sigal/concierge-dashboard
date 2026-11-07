'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AddressBook, ChatCircleText, GearSix, Megaphone } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/conversations', label: 'Conversations', icon: <ChatCircleText weight="fill" size={20} /> },
  { href: '/clients', label: 'Clients', icon: <AddressBook weight="fill" size={20} /> },
  {
    href: '/marketing',
    label: 'Marketing',
    icon: <Megaphone size={20} weight="fill" className="-scale-x-100 transform" />,
  },
  { href: '/settings', label: 'Settings', icon: <GearSix size={20} weight="fill" /> },
];

interface Props {
  className?: string;
  onNavigate?: () => void;
}

const DashboardNav = ({ className, onNavigate }: Props) => {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-grow flex-col pt-4', className)}>
      <div className="flex flex-col space-y-2 lg:items-center lg:justify-center">
        {NAV_LINKS.map(({ href, label, icon }) => (
          <Tooltip delayDuration={200} key={href}>
            <TooltipTrigger asChild>
              <Link
                href={href}
                aria-label={label}
                onClick={onNavigate}
                className={cn(
                  'grid size-12 place-items-center items-center gap-x-2 rounded-lg border bg-white text-sm capitalize shadow-[0_12px_26px_-9px] shadow-[#282B390F] transition-colors hover:border-brand-400',
                  pathname.startsWith(href)
                    ? 'border-transparent bg-brand-100'
                    : 'border-brand-300 text-basic',
                )}
              >
                {icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="-ml-7 -mt-11 rounded-lg rounded-bl-none px-2 py-1"
              side="right"
              sideOffset={15}
            >
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
};

export default DashboardNav;
