'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, readLocalStorage, writeLocalStorage } from '@/lib/utils';

export interface SettingsNavLink {
  label: string;
  href: string;
}

interface Props {
  title: string;
  links: SettingsNavLink[];
}

const STORAGE_KEY = 'settingsSidebarOpen';

const SettingsSidebar = ({ title, links }: Props) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  // Read after mount so the server render and first client render match.
  useEffect(() => {
    if (readLocalStorage(STORAGE_KEY) === 'false') setIsOpen(false);
  }, []);

  const toggle = () => {
    setIsOpen(!isOpen);
    writeLocalStorage(STORAGE_KEY, String(!isOpen));
  };

  if (!isOpen) {
    return (
      <div className="mt-6">
        <Button variant="smallIcon" size="auto" onClick={toggle} aria-label="Show sidebar">
          <PanelRightClose className="hidden size-5 cursor-pointer md:block" />
        </Button>
      </div>
    );
  }

  return (
    <section className="-mx-4 w-auto shrink-0 flex-col gap-2 gap-y-0 rounded-none border border-[#EEF0EE] bg-white px-0 pb-0 pt-4 md:-mx-0 md:flex md:w-[200px] md:rounded-xl md:p-4 lg:w-[360px]">
      <h1 className="flex w-full items-center justify-between pb-5 pl-5 text-[22px] font-bold md:px-1 md:pl-0 lg:px-0 lg:pb-4 lg:text-2xl">
        {title}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="smallIcon" size="auto" onClick={toggle} aria-label="Hide sidebar">
              <PanelLeftClose className="hidden size-5 cursor-pointer md:block" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Hide sidebar</TooltipContent>
        </Tooltip>
      </h1>
      <nav className="flex items-center overflow-x-auto md:block md:overflow-x-visible">
        {links.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'block whitespace-nowrap border-b px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-primary-200 md:-mx-2 md:whitespace-normal md:rounded-lg md:border-b-0',
              pathname === href
                ? 'border-b border-brand-500 md:border-none md:bg-primary-400'
                : 'border-transparent',
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </section>
  );
};

export default SettingsSidebar;
